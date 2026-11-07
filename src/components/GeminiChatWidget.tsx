import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  ArrowUpRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneCall,
  Radio,
  AudioLines,
} from 'lucide-react';
import { DISPLAY_PHONE, WHATSAPP_NUMBER, getWhatsAppUrl } from '../types.ts';
import { sendDirectGeminiChat } from '../geminiClient.ts';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  'Where is your studio located?',
  'What are your video editing rates?',
  'Where can I follow your TikTok & Instagram?',
  'Tell me about tuition/business marketing packages',
  'I want to book a shoot on WhatsApp',
];

const VOICE_TOPIC_PILLS = [
  'Explain 360° VR vs. Standard Reels',
  'Quote editing rates for Reels',
  'Event production & drone coverage',
  'Transfer to WhatsApp to book',
];

interface GeminiChatWidgetProps {
  isDark?: boolean;
}

// Convert Float32 buffer to 16-bit PCM ArrayBuffer (little-endian)
function convertFloat32ToInt16PCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

// Downsamples input buffer to 16,000 Hz for Gemini Live API
function downsampleBuffer(buffer: Float32Array, inputRate: number, outputRate: number = 16000): Float32Array {
  if (inputRate === outputRate) return buffer;
  const sampleRatio = inputRate / outputRate;
  const newLength = Math.round(buffer.length / sampleRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

// Converts ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Converts Base64 raw 24kHz PCM to Float32Array
function base64ToFloat32Array(base64: string): Float32Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16Array = new Int16Array(bytes.buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }
  return float32Array;
}

export const GeminiChatWidget: React.FC<GeminiChatWidgetProps> = ({ isDark = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm KULT AI, your 24/7 creative production consultant. Ask me about our cinema event coverage, viral short-form editing rates, 360° VR capture, or monthly brand retainers. You can also tap the microphone to start a live voice conversation!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Voice Conversation State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<{ user: string; model: string }>({ user: '', model: '' });
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // References
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Context & WebSocket refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isVoiceActive]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isVoiceActive) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isVoiceActive]);

  // Stop and clear all currently queued audio buffers
  const stopAllAudioPlayback = useCallback(() => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    activeSourcesRef.current = [];
    nextStartTimeRef.current = 0;
  }, []);

  // Play incoming 24kHz PCM chunk with gapless scheduling
  const scheduleAudioChunk = useCallback(
    (base64Chunk: string) => {
      let ctx = outputAudioCtxRef.current;
      if (!ctx || ctx.state === 'closed') {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        ctx = new AudioCtxClass({ sampleRate: 24000 });
        outputAudioCtxRef.current = ctx;
      }
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setVoiceStatus('speaking');

      const float32Data = base64ToFloat32Array(base64Chunk);
      const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const sourceNode = ctx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(ctx.destination);

      const now = ctx.currentTime;
      if (nextStartTimeRef.current < now) {
        nextStartTimeRef.current = now + 0.04; // small jitter buffer
      }
      sourceNode.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      activeSourcesRef.current.push(sourceNode);
      sourceNode.onended = () => {
        const idx = activeSourcesRef.current.indexOf(sourceNode);
        if (idx !== -1) activeSourcesRef.current.splice(idx, 1);
        if (activeSourcesRef.current.length === 0) {
          setVoiceStatus('listening');
        }
      };
    },
    []
  );

  // Terminate voice session and clean up all hardware resources
  const terminateVoiceSession = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    stopAllAudioPlayback();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsVoiceActive(false);
    setVoiceStatus('idle');
    setAudioLevel(0);
  }, [stopAllAudioPlayback]);

  // Start Gemini Multimodal Live API Voice Session over WebSockets
  const startVoiceSession = async () => {
    setVoiceError(null);
    setVoiceStatus('connecting');
    setIsVoiceActive(true);

    try {
      // 1. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // 2. Set up Web Audio Context for Input (16kHz preferred)
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtxClass();
      inputAudioCtxRef.current = inputCtx;

      const outputCtx = new AudioCtxClass({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputCtx;

      // Analyser for real-time waveform visualizer
      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = inputCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // ScriptProcessor for raw PCM capture
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      source.connect(processor);
      processor.connect(inputCtx.destination);

      // 3. Connect WebSocket to /api/live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Live Voice] Connected to WebSocket bridge');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'connected') {
            setVoiceStatus('listening');
            setLiveTranscript({
              user: '',
              model: "I'm listening. Ask about our event video production, 360° VR capture, or short-form editing rates.",
            });
          } else if (msg.type === 'audio' && msg.audio) {
            scheduleAudioChunk(msg.audio);
          } else if (msg.type === 'outputTranscript') {
            setLiveTranscript((prev) => ({
              ...prev,
              model: prev.model ? `${prev.model} ${msg.text}` : msg.text,
            }));
          } else if (msg.type === 'inputTranscript') {
            setLiveTranscript((prev) => ({
              ...prev,
              user: prev.user ? `${prev.user} ${msg.text}` : msg.text,
            }));
          } else if (msg.type === 'interrupted') {
            // User barge-in: stop model speech immediately
            stopAllAudioPlayback();
            setVoiceStatus('listening');
          } else if (msg.type === 'turnComplete') {
            // Finished current response
            if (activeSourcesRef.current.length === 0) {
              setVoiceStatus('listening');
            }
          } else if (msg.type === 'error') {
            console.error('[Live Voice Error]:', msg.message);
            setVoiceError(msg.message);
            setVoiceStatus('error');
          }
        } catch (e) {
          console.error('[Live WS Error parsing payload]:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('[Live WS Socket Error]:', e);
        setVoiceError('WebSocket connection error. Please verify GEMINI_API_KEY.');
        setVoiceStatus('error');
      };

      ws.onclose = () => {
        console.log('[Live WS] Closed');
        if (isVoiceActive) {
          setVoiceStatus('idle');
        }
      };

      // Stream microphone data to Gemini Live
      processor.onaudioprocess = (e) => {
        if (isMutedRef.current || ws.readyState !== WebSocket.OPEN) return;

        const inputChannelData = e.inputBuffer.getChannelData(0);

        // Downsample to 16,000 Hz if browser sample rate differs
        const downsampled = downsampleBuffer(inputChannelData, inputCtx.sampleRate, 16000);
        const pcmBuffer = convertFloat32ToInt16PCM(downsampled);
        const base64Audio = arrayBufferToBase64(pcmBuffer);

        ws.send(
          JSON.stringify({
            type: 'audio',
            audio: base64Audio,
          })
        );
      };

      // Start Visualizer Loop
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / (dataArray.length * 255);
        setAudioLevel(avg);

        animFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      animFrameRef.current = requestAnimationFrame(updateVisualizer);
    } catch (err: any) {
      console.error('Failed to start microphone or voice session:', err);
      setVoiceError(err?.message || 'Microphone access denied or audio unavailable.');
      setVoiceStatus('error');
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      terminateVoiceSession();
    };
  }, [terminateVoiceSession]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const aiReply = await sendDirectGeminiChat(
        newHistory.map((m) => ({ role: m.role, text: m.text })),
        text
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: `We're experiencing high demand right now! Connect directly with our lead producer on WhatsApp (+94 76 843 9916) for instant quotes: https://wa.me/${WHATSAPP_NUMBER}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: 'Chat history cleared. How can I help you plan your next production or social content campaign?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Convert markdown links or raw WhatsApp URLs into clickable badges
  const renderFormattedText = (text: string) => {
    const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const matches = Array.from(text.matchAll(markdownRegex));
    if (matches.length > 0) {
      matches.forEach((match, idx) => {
        const matchIndex = match.index ?? 0;
        if (matchIndex > lastIndex) {
          parts.push(text.slice(lastIndex, matchIndex));
        }
        parts.push(
          <a
            key={`md-link-${idx}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-500 hover:text-blue-400 underline underline-offset-2 break-all"
          >
            <span>{match[1]}</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        );
        lastIndex = matchIndex + match[0].length;
      });
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }
      return parts;
    }

    const rawMatches = Array.from(text.matchAll(urlRegex));
    if (rawMatches.length > 0) {
      rawMatches.forEach((match, idx) => {
        const matchIndex = match.index ?? 0;
        if (matchIndex > lastIndex) {
          parts.push(text.slice(lastIndex, matchIndex));
        }
        const url = match[0];
        const isWhatsApp = url.includes('wa.me');
        parts.push(
          <a
            key={`raw-link-${idx}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-500 hover:text-blue-400 underline underline-offset-2 break-all"
          >
            <span>{isWhatsApp ? 'Open WhatsApp Chat' : url}</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        );
        lastIndex = matchIndex + url.length;
      });
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }
      return parts;
    }

    return text;
  };

  return (
    <>
      {/* =========================================================================
          1. FLOATING LAUNCHER BUTTON
      ========================================================================= */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center">
        {!isOpen && (
          <div className="relative group">
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="px-3 py-1.5 rounded-xl text-xs font-medium tracking-wide bg-[#0A0A0C] text-white dark:bg-white dark:text-black shadow-xl whitespace-nowrap border border-white/10 dark:border-black/10">
                Chat or Speak with KULT AI
              </div>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open KULT Studios AI Assistant"
              className="relative flex items-center gap-2 sm:gap-2.5 px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-full backdrop-blur-xl bg-white/90 dark:bg-[#0E1015]/95 text-[#0A0A0C] dark:text-white border border-black/10 dark:border-white/15 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer min-h-[44px]"
            >
              <div className="absolute inset-0 rounded-full bg-blue-500/15 filter blur-md -z-10 animate-pulse" />

              <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white shadow-md shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-display font-bold tracking-tight">KULT AI</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-500/10 text-blue-500 font-semibold">
                    LIVE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Voice & Chat
                </span>
              </div>

              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-[#08090C]" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. CHAT & LIVE VOICE MODAL
      ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-20 sm:right-6 z-50 w-auto sm:w-[390px] h-[80vh] max-h-[600px] sm:h-[540px] flex flex-col rounded-2xl sm:rounded-3xl backdrop-blur-2xl bg-white/95 dark:bg-[#0A0B0E]/95 text-[#0A0A0C] dark:text-white border border-black/10 dark:border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="px-5 py-3.5 flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md transition-all ${
                  isVoiceActive
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 ring-2 ring-blue-500/50 animate-pulse'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
                }`}
              >
                {isVoiceActive ? <Radio className="w-4 h-4 animate-spin-slow" /> : <Bot className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-display font-bold tracking-tight">
                    {isVoiceActive ? 'Executive Producer' : 'KULT AI Assistant'}
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                    {isVoiceActive ? 'Live 3.8 Voice' : 'Gemini 3.8'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      voiceStatus === 'speaking'
                        ? 'bg-blue-500 animate-ping'
                        : voiceStatus === 'listening'
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-emerald-500'
                    }`}
                  />
                  <span>
                    {isVoiceActive
                      ? voiceStatus === 'connecting'
                        ? 'Connecting Live Session...'
                        : voiceStatus === 'speaking'
                          ? 'Producer Speaking...'
                          : voiceStatus === 'listening'
                            ? 'Listening (Speak freely)...'
                            : 'Voice Connected'
                      : 'Online · Studio Consultant'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Mode Toggle Button in Header */}
              <button
                onClick={() => {
                  if (isVoiceActive) {
                    terminateVoiceSession();
                  } else {
                    startVoiceSession();
                  }
                }}
                title={isVoiceActive ? 'Exit Voice Mode' : 'Start Real-Time Voice Conversation'}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isVoiceActive
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-500/40'
                    : 'text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                aria-label={isVoiceActive ? 'Exit Voice Mode' : 'Start Voice Conversation'}
              >
                {isVoiceActive ? <AudioLines className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {!isVoiceActive && (
                <button
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Clear chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  if (isVoiceActive) terminateVoiceSession();
                  setIsOpen(false);
                }}
                title="Close assistant"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              3. CONTENT AREA: TEXT CHAT OR AMBIENT REAL-TIME VOICE HUD
          ========================================================================= */}
          {isVoiceActive ? (
            <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-transparent to-blue-500/[0.03] overflow-y-auto">
              {/* Voice Status Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-600 dark:text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span className="uppercase tracking-wider font-semibold">
                    {voiceStatus === 'connecting'
                      ? 'Establishing Live Socket'
                      : voiceStatus === 'speaking'
                        ? 'Producer Answering'
                        : voiceStatus === 'listening'
                          ? 'Listening · 16kHz PCM'
                          : 'Live Session'}
                  </span>
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-rose-500 text-white'
                      : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isMuted ? 'Muted' : 'Live Mic'}</span>
                </button>
              </div>

              {/* Ambient Audio Waveform Visualizer */}
              <div className="flex flex-col items-center justify-center my-auto py-6">
                <div className="relative flex items-center justify-center">
                  {/* Outer Pulsing Glow Rings */}
                  <div
                    className="absolute rounded-full bg-blue-500/20 transition-all duration-150 filter blur-xl"
                    style={{
                      width: `${140 + audioLevel * 120}px`,
                      height: `${140 + audioLevel * 120}px`,
                      opacity: 0.4 + audioLevel * 0.6,
                    }}
                  />
                  <div
                    className="absolute rounded-full border border-blue-500/30 transition-all duration-100"
                    style={{
                      width: `${100 + audioLevel * 60}px`,
                      height: `${100 + audioLevel * 60}px`,
                    }}
                  />

                  {/* Central Glowing Audio Orb */}
                  <div
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 ${
                      voiceStatus === 'speaking'
                        ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/50 scale-105'
                        : isMuted
                          ? 'bg-slate-700 shadow-slate-700/50'
                          : 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/50'
                    }`}
                  >
                    {voiceStatus === 'speaking' ? (
                      <Volume2 className="w-8 h-8 text-white animate-pulse" />
                    ) : isMuted ? (
                      <MicOff className="w-8 h-8 text-white/70" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>

                {/* Dynamic Sine / Audio Frequency Bars */}
                <div className="flex items-center gap-1.5 mt-8 h-8">
                  {Array.from({ length: 14 }).map((_, i) => {
                    // Generate pseudo-harmonic waveform scaled by real mic audio level
                    const heightFactor = Math.max(
                      0.15,
                      Math.sin(i * 0.5 + Date.now() * 0.005) * 0.4 + 0.5 + audioLevel * 2
                    );
                    const clampedHeight = Math.min(32, Math.max(4, heightFactor * 24));
                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-75 ${
                          voiceStatus === 'speaking'
                            ? 'bg-cyan-400'
                            : voiceStatus === 'listening'
                              ? 'bg-blue-500'
                              : 'bg-slate-500/40'
                        }`}
                        style={{ height: `${clampedHeight}px` }}
                      />
                    );
                  })}
                </div>

                <div className="mt-4 text-xs font-mono text-center text-slate-500 dark:text-slate-400">
                  {isMuted
                    ? 'Microphone muted. Tap button above to unmute.'
                    : voiceStatus === 'speaking'
                      ? 'KULT Executive Producer is answering...'
                      : 'Speak naturally into your microphone...'}
                </div>
              </div>

              {/* Real-Time Live Transcript Box */}
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-2 mb-3">
                {liveTranscript.user && (
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                    <span className="text-blue-500 font-semibold uppercase">You:</span>
                    <span className="italic line-clamp-2">"{liveTranscript.user}"</span>
                  </div>
                )}
                {liveTranscript.model && (
                  <div className="text-xs text-[#0A0A0C] dark:text-white font-medium flex items-start gap-1.5">
                    <span className="text-emerald-500 font-mono font-semibold uppercase shrink-0">KULT:</span>
                    <span className="leading-relaxed line-clamp-3">{liveTranscript.model}</span>
                  </div>
                )}
                {!liveTranscript.user && !liveTranscript.model && (
                  <div className="text-[11px] font-mono text-slate-400 text-center py-1">
                    Ask: "What's the difference between 360° VR and regular reels?"
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {voiceError && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-mono">
                  {voiceError}
                </div>
              )}

              {/* Spoken Topics & WhatsApp Transfer */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {VOICE_TOPIC_PILLS.map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        // Quick send text cue via chat fallback or switch to text
                        terminateVoiceSession();
                        handleSendMessage(pill);
                      }}
                      className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-tight bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/10 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {pill}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={getWhatsAppUrl(`Hello KULT Studios, I'm following up from the Live Voice session.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all text-center"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp DM</span>
                  </a>

                  <button
                    onClick={terminateVoiceSession}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium border border-black/10 dark:border-white/10 transition-all cursor-pointer"
                  >
                    <span>Switch to Text</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-[13px] leading-relaxed">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-br-sm shadow-md'
                            : 'bg-black/5 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-black/5 dark:border-white/10'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{renderFormattedText(msg.text)}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {/* Pulsating Thinking Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 max-w-[80px]">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Chips */}
              <div className="px-3 py-2 border-t border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {STARTER_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      disabled={isLoading}
                      className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-tight bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/10 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Input Area with Text and Microphone Buttons */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-black/5 dark:border-white/10 flex items-center gap-2 bg-white dark:bg-[#0A0B0E]"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything or tap mic to speak..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm text-[#0A0A0C] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60"
                />

                {/* Microphone Live Voice Trigger Button */}
                <button
                  type="button"
                  onClick={startVoiceSession}
                  className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 border border-black/10 dark:border-white/10 transition-all shadow-sm shrink-0 cursor-pointer"
                  title="Switch to Real-Time Voice Conversation"
                  aria-label="Start Voice Conversation"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition-all shadow-md shrink-0 cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
