import express from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);

const SYSTEM_INSTRUCTION = `You are the official AI Assistant for Loop Studios, an elite visual content and digital marketing agency based in Sri Lanka (available worldwide). Your tone is ultra-minimalist, professional, concise, polished, and helpful. You speak naturally and never pad responses with robotic filler.

KNOWLEDGE BASE & SERVICE OFFERINGS:
1. Short-Form Video Editing (≤ 60s for TikTok, Reels, Shorts):
   - Level 01 (The Raw Cut): LKR 1,000 / video (Assembly, jump cuts, audio sync, 24h turnaround).
   - Level 02 (The Social Edit - Popular): LKR 3,000 / video (Dynamic retention pacing, kinetic captions, sound design, color correction).
   - Level 03 (The Viral Polish): LKR 5,000 / video (Retention hook engineering, custom motion graphics/VFX, studio color grading, B-roll overlays).

2. Event Production & Visuals:
   - Full-crew coverage deploying videographers, photographers, and drone pilots simultaneously for cohesive event documentation.
   - Cinematic recap films, aerial drone capture, and fine-art event photography.
   - NOTE ON SHOOT PRICING & GEAR: Never mention specific camera brand names. Never quote public shooting prices. State that all event visual productions are custom-tailored, and invite them to request a bespoke quote via WhatsApp.

3. 360° Immersive Event Capture:
   - Cutting-edge spherical video recording.
   - Clients and viewers can relive the event from any angle via smartphones (gyro/pan), desktop browsers, or VR headsets.

4. Digital Marketing & Social Retainers (for tuition classes & businesses):
   - Essential Package: LKR 25,000/month (FB, IG, TikTok, WhatsApp management, 10 AI-assisted posts, 2 edited videos with free on-location recording & presenter included).
   - Advanced Package: LKR 35,000/month (Complete management, 15 posts, 3 edited videos with free on-location recording & presenter included, audience targeting & growth strategy).
   - 3-Month Partnership Offer: 5% discount on continuous commitments.

5. Direct Booking & Contact:
   - Direct WhatsApp / Hotline: +94 76 843 9916.
   - Always provide a direct link: [Chat on WhatsApp](https://wa.me/94768439916) whenever a client expresses interest in booking, custom pricing, or immediate consultation.`;

const LIVE_VOICE_SYSTEM_INSTRUCTION = `You are speaking out loud in real time as an executive creative producer from Loop Studios (Sri Lanka, operating worldwide).
Your tone is confident, concise, articulate, and direct. Because this is a live spoken voice conversation, keep your answers short and conversational (1 to 3 sentences maximum per turn). Never read out long bullet lists or robotic filler.

Key knowledge:
1. Short-Form Video Editing rates:
   - Level 01 Raw Cut: LKR 1,000 per video.
   - Level 02 Social Edit: LKR 3,000 per video (our most popular tier).
   - Level 03 Viral Polish: LKR 5,000 per video (retention hook engineering and studio grading).
2. Explaining 360° VR vs. Standard Event Reels:
   - Standard event reels are dynamic, high-retention cinematic 4K recap films formatted for social feeds.
   - 360° VR captures record the complete venue in full spherical immersion, allowing clients and guests to look around in any direction using their phone gyro, computer screen, or VR headsets.
3. Event Production Shoots:
   - Deploys videographers, signature event photographers, and licensed drone pilots simultaneously.
   - Always state that on-location shoots are custom-tailored to the venue and date.
4. Call to Action:
   - Proactively ask if the client would like to transfer to WhatsApp (+94 76 843 9916) to lock in their date or review raw samples.`;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Google Gen AI with modern SDK
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-3.8-flash',
      liveModel: 'gemini-3.8-live',
    });
  });

  // Chat API endpoint supporting multi-turn conversation
  app.post('/api/chat', async (req, res) => {
    const messages = req.body?.messages;
    try {
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({
          reply:
            "Loop Studios AI is active! Note: GEMINI_API_KEY is not yet attached in Secrets. For bookings, pricing, and bespoke quotes, connect directly with our team on WhatsApp: https://wa.me/94768439916",
        });
      }

      // Format multi-turn conversation for @google/genai SDK
      const contents = messages.map((m: { role: 'user' | 'model'; text: string }) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const reply =
        response.text ||
        "I'm here to assist with your video production, editing, or retainer needs. You can also chat directly with our team at https://wa.me/94768439916";

      return res.json({ reply });
    } catch (err: any) {
      console.error('Error generating Gemini response:', err);

      // Extract the last user message for contextual fallback
      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user')?.text?.toLowerCase() || '';

      let reply = "I'm here to assist with your video production, editing, or retainer needs! For bespoke quotes and immediate scheduling, connect directly with our lead producer on WhatsApp: https://wa.me/94768439916";

      if (lastUserMsg.includes('rate') || lastUserMsg.includes('editing') || lastUserMsg.includes('price') || lastUserMsg.includes('cost')) {
        reply = "Here are our short-form video editing rate cards (≤ 60s for TikTok, Reels & Shorts):\n\n• **Level 01 (The Raw Cut):** LKR 1,000 / video (Assembly, jump cuts, audio sync, 24h turnaround)\n• **Level 02 (The Social Edit):** LKR 3,000 / video (Dynamic retention pacing, kinetic captions, sound design, color correction)\n• **Level 03 (The Viral Polish):** LKR 5,000 / video (Retention hook engineering, custom VFX, studio color grading)\n\nReady to book? [Chat on WhatsApp](https://wa.me/94768439916)";
      } else if (lastUserMsg.includes('360') || lastUserMsg.includes('vr') || lastUserMsg.includes('spatial') || lastUserMsg.includes('virtual')) {
        reply = "Our 360° VR Immersive Capture records the entire venue in high-resolution spherical video. Viewers can interactively pan and look around in 360° using mobile gyroscopes, desktop click-and-drag, or VR headsets. Perfect for luxury events, venues, and brand activations!\n\nWant to include 360° capture in your upcoming event? [Chat on WhatsApp](https://wa.me/94768439916)";
      } else if (lastUserMsg.includes('tuition') || lastUserMsg.includes('retainer') || lastUserMsg.includes('marketing') || lastUserMsg.includes('package') || lastUserMsg.includes('business')) {
        reply = "Here are our monthly social media retainers (ideal for tuition academies & growing brands):\n\n• **Essential Package (LKR 25,000/mo):** FB, IG, TikTok & WhatsApp group management, 10 branded posts, 2 edited videos with on-location shoot & presenter included.\n• **Advanced Package (LKR 35,000/mo):** Full management, 15 branded posts, 3 edited videos with shoot & presenter included, audience targeting & growth strategy.\n• *Special offer:* 5% discount on 3-month partnership commitments.\n\nSchedule a consultation: [Chat on WhatsApp](https://wa.me/94768439916)";
      } else if (lastUserMsg.includes('event') || lastUserMsg.includes('shoot') || lastUserMsg.includes('drone') || lastUserMsg.includes('photo') || lastUserMsg.includes('camera') || lastUserMsg.includes('video')) {
        reply = "Loop Studios deploys unified multi-crew event teams combining videographers, signature event photographers, and licensed drone pilots for seamless cinema-grade documentation. All event productions are bespoke based on venue scale and deliverables.\n\nRequest your custom quote: [Chat on WhatsApp](https://wa.me/94768439916)";
      }

      return res.status(200).json({ reply, isFallback: true });
    }
  });

  // Google Maps Location Grounding & Event Dispatch Estimator Endpoint
  app.post('/api/venue-estimate', async (req, res) => {
    const { venue } = req.body || {};
    if (!venue || typeof venue !== 'string') {
      return res.status(400).json({ error: 'Venue name is required.' });
    }

    // Curated geographical hubs for Sri Lankan event corridors
    const SRI_LANKA_HUBS: Record<string, { lat: number; lng: number; km: number; eta: string; route: string; expressway: string }> = {
      colombo: {
        lat: 6.9271,
        lng: 79.8612,
        km: 6,
        eta: '15-20 mins',
        route: 'Colombo Metro Central Hub',
        expressway: 'Direct Urban Arterial Route',
      },
      kandy: {
        lat: 7.2906,
        lng: 80.6337,
        km: 115,
        eta: '2h 45m',
        route: 'A1 Highway / Central Expressway (E04)',
        expressway: 'E04 Central Expressway Corridor',
      },
      negombo: {
        lat: 7.2008,
        lng: 79.8737,
        km: 38,
        eta: '45 mins',
        route: 'Colombo - Katunayake Expressway (E03)',
        expressway: 'E03 Airport & Coastal Expressway',
      },
      gampaha: {
        lat: 7.0917,
        lng: 79.9999,
        km: 32,
        eta: '40 mins',
        route: 'A1 High-Volume Western Corridor',
        expressway: 'A1 Radial Arterial Highway',
      },
      galle: {
        lat: 6.0535,
        lng: 80.221,
        km: 125,
        eta: '1h 50m',
        route: 'Southern Expressway (E01) via Kottawa',
        expressway: 'E01 Southern High-Speed Expressway',
      },
      bentota: {
        lat: 6.4259,
        lng: 79.9959,
        km: 78,
        eta: '1h 15m',
        route: 'Southern Expressway (E01) to Aluthgama/Bentota',
        expressway: 'E01 Southern Expressway',
      },
      kalutara: {
        lat: 6.5854,
        lng: 79.9607,
        km: 45,
        eta: '50 mins',
        route: 'A2 Galle Road Corridor / Dodangoda Interchange',
        expressway: 'E01 Dodangoda Connection',
      },
      kurunegala: {
        lat: 7.4863,
        lng: 80.3623,
        km: 95,
        eta: '1h 45m',
        route: 'Central Expressway (E04) North Link',
        expressway: 'E04 Central Expressway Link',
      },
      matara: {
        lat: 5.9549,
        lng: 80.555,
        km: 160,
        eta: '2h 15m',
        route: 'Southern Expressway (E01) Godagama Exit',
        expressway: 'E01 Southern Expressway Terminal',
      },
      'nuwara eliya': {
        lat: 6.9497,
        lng: 80.7891,
        km: 165,
        eta: '4h 15m',
        route: 'A7 Hill-Country Scenic Arterial Route',
        expressway: 'A7 High-Altitude Pass',
      },
      jaffna: {
        lat: 9.6615,
        lng: 80.0255,
        km: 395,
        eta: '6h 30m',
        route: 'A9 Northern Arterial Trunk Corridor',
        expressway: 'A9 Northern Expressway',
      },
    };

    const venueLower = venue.toLowerCase();
    let matchedHub = Object.entries(SRI_LANKA_HUBS).find(([k]) => venueLower.includes(k))?.[1];

    if (!matchedHub) {
      if (venueLower.includes('shangri') || venueLower.includes('cinnamon') || venueLower.includes('galle face') || venueLower.includes('kingsbury') || venueLower.includes('hilton') || venueLower.includes('marino')) {
        matchedHub = SRI_LANKA_HUBS['colombo'];
      } else if (venueLower.includes('beach') || venueLower.includes('jetwing') || venueLower.includes('heritance')) {
        matchedHub = SRI_LANKA_HUBS['negombo'];
      } else {
        matchedHub = {
          lat: 6.9271,
          lng: 79.8612,
          km: 25,
          eta: '35 mins',
          route: 'Western Province Regional Event Network',
          expressway: 'Western Arterial Transit Network',
        };
      }
    }

    let groundingSummary = `Event coverage is fully available in ${venue}. Loop Studios confirms full-crew dispatch (Videographers, Signature Photographers, and Licensed Drone Pilots) from our Western Province base via ${matchedHub.route}.`;
    let groundingChunks: any[] = [];

    // Maps Grounding using gemini-3.8-flash with googleMaps tool
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze event venue location and travel logistics from Loop Studios headquarters in Colombo/Western Province, Sri Lanka (latitude 6.9070, longitude 79.8665) to "${venue}".
Calculate exact driving distance in km, estimated travel time for our production crew vans (carrying videographers, photographers, and licensed drone pilots), expressway routes, and landmark venue accessibility.
Provide a concise 2-sentence executive summary confirming crew dispatch availability and venue coverage.`,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: 6.907,
                  longitude: 79.8665,
                },
              },
            },
          },
        });

        if (response.text) {
          groundingSummary = response.text.trim();
        }
        groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      } catch (err: any) {
        console.error('[Gemini Maps Grounding Error]:', err?.message || err);
      }
    }

    return res.json({
      venue,
      coordinates: { lat: matchedHub.lat, lng: matchedHub.lng },
      distanceKm: matchedHub.km,
      travelTime: matchedHub.eta,
      routeSummary: matchedHub.route,
      expressway: matchedHub.expressway,
      groundingSummary,
      groundingChunks,
      crewConfirmed: true,
      crewManifest: [
        '3x Cinema 4K Camera Operators',
        '2x Signature Event Photographers',
        '1x Licensed Aerial Drone Pilot',
        '1x 360° VR Spatial Capture Rig',
        'Dedicated On-Location Audio & Sound Deck',
      ],
    });
  });

  // Mount Vite in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Create unified HTTP server
  const server = http.createServer(app);

  // Setup WebSocket Server for Gemini Multimodal Live API Voice Streaming
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    try {
      const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname === '/api/live') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      }
    } catch (err) {
      console.error('[WS Upgrade Error]:', err);
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[Gemini Live WS] Client connected');

    if (!process.env.GEMINI_API_KEY) {
      console.warn('[Gemini Live WS] GEMINI_API_KEY is not configured in environment.');
      clientWs.send(
        JSON.stringify({
          type: 'error',
          message: 'GEMINI_API_KEY is not set. Please configure your Gemini API Key in AI Studio Secrets.',
        })
      );
      clientWs.close();
      return;
    }

    try {
      // Connect to Gemini Live API session
      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: LIVE_VOICE_SYSTEM_INSTRUCTION,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            // Model 24kHz audio chunks
            for (const part of message.serverContent?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({ type: 'audio', audio: part.inlineData.data }));
                }
              }
            }

            // Real-time spoken transcript of the model response
            if (message.serverContent?.outputTranscription?.text) {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(
                  JSON.stringify({
                    type: 'outputTranscript',
                    text: message.serverContent.outputTranscription.text,
                  })
                );
              }
            }

            // Real-time spoken transcript of user speech
            if (message.serverContent?.inputTranscription?.text) {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(
                  JSON.stringify({
                    type: 'inputTranscript',
                    text: message.serverContent.inputTranscription.text,
                  })
                );
              }
            }

            // User interruption / barge-in
            if (message.serverContent?.interrupted) {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'interrupted' }));
              }
            }

            // Turn completed
            if (message.serverContent?.turnComplete) {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'turnComplete' }));
              }
            }
          },
          onclose: () => {
            console.log('[Gemini Live WS] Gemini session closed');
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.close();
            }
          },
          onerror: (err: any) => {
            console.error('[Gemini Live Session Error]:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  type: 'error',
                  message: err?.message || 'Gemini Live Session Encountered an Error',
                })
              );
            }
          },
        },
      });

      // Notify client that connection is ready
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ type: 'connected', model: 'gemini-3.8-live' }));
      }

      // Relay client PCM audio to Gemini Live session
      clientWs.on('message', (rawData) => {
        try {
          const msg = JSON.parse(rawData.toString());
          if (msg.type === 'audio' && msg.audio) {
            session.sendRealtimeInput({
              audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          }
        } catch (e) {
          console.error('[Live WS Error parsing incoming message]:', e);
        }
      });

      clientWs.on('close', () => {
        console.log('[Gemini Live WS] Client disconnected');
        try {
          session.close();
        } catch {}
      });

      clientWs.on('error', (err) => {
        console.error('[Client WS Error]:', err);
        try {
          session.close();
        } catch {}
      });
    } catch (err: any) {
      console.error('[Failed to initiate Gemini Live session]:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: 'error',
            message: 'Unable to start Gemini Live voice session: ' + (err?.message || 'Unknown error'),
          })
        );
        clientWs.close();
      }
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Loop Studios] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

