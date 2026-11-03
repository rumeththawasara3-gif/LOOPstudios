import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Play,
  Pause,
  Clock,
  Download,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Film,
  Camera,
  Compass,
  Sparkles,
  ArrowRight,
  LogOut,
  Plus,
  RefreshCw,
  Send,
  Sliders,
  ChevronRight,
  Eye,
} from 'lucide-react';
import {
  auth,
  db,
  doc,
  collection,
  query,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  signOut,
  handleFirestoreError,
  OperationType,
  User,
} from '../firebase.ts';
import { ClientProject, RevisionNote, DeliverableCut, getWhatsAppUrl } from '../types.ts';
import { ClientAuthModal } from '../components/ClientAuthModal.tsx';

interface ClientPortalViewProps {
  isDark: boolean;
  onOpenVRViewer?: () => void;
}

// Sample default project seeded when a new client signs in
const createDefaultProjectData = (uid: string, email: string, displayName: string): ClientProject => ({
  id: `proj_${uid.slice(0, 8)}`,
  clientId: uid,
  clientEmail: email,
  clientName: displayName || 'Valued Brand Partner',
  title: 'Colombo Fashion Week — Cinematic Reels & 360 Immersion',
  eventType: 'High-Energy Fashion & Brand Festival',
  currentStage: 3, // In Color Grading & Audio Engineering
  videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  photoGalleryUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop',
  spatialVrUrl: 'https://loopstudios.lk/spatial/colombo-fashion-week-360',
  shortFormEdits: [
    {
      id: 'cut-01',
      tier: 'Level 01',
      title: 'Runway Teaser Reel (9:16 Vertical)',
      duration: '00:15',
      format: '1080x1920 MP4 (H.264)',
      fileSize: '38 MB',
      downloadUrl: '#download-cut-1',
      status: 'Ready',
    },
    {
      id: 'cut-02',
      tier: 'Level 02',
      title: 'Backstage & VIP Atmosphere Cut (Dynamic Captions)',
      duration: '00:30',
      format: '1080x1920 MP4 (ProRes Proxy)',
      fileSize: '84 MB',
      downloadUrl: '#download-cut-2',
      status: 'Ready',
    },
    {
      id: 'cut-03',
      tier: 'Level 03',
      title: 'Full Brand Master Aftermovie (4K Cinematic Master)',
      duration: '01:30',
      format: '3840x2160 UHD MP4 (Master Grade)',
      fileSize: '410 MB',
      downloadUrl: '#download-cut-3',
      status: 'Processing',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({ isDark, onOpenVRViewer }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Project state
  const [project, setProject] = useState<ClientProject | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'milestones' | 'deliverables' | 'revisions'>('milestones');

  // Video Reviewer State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Revision Note Form State
  const [timestampSeconds, setTimestampSeconds] = useState(0);
  const [timestampFormatted, setTimestampFormatted] = useState('00:00');
  const [noteText, setNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState<RevisionNote[]>([]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Auth observer
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        setIsDemoMode(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch or subscribe to project
  useEffect(() => {
    if (isDemoMode) {
      // Load demo project
      const demo = createDefaultProjectData('demo-client-123', 'client@brand.com', 'Lotus Grand Ballroom & Events');
      setProject(demo);
      setRevisionNotes([
        {
          id: 'note-sample-1',
          projectId: demo.id,
          timestampSeconds: 4,
          timestampFormatted: '00:04',
          note: 'Please enhance the brightness on the entrance reveal shot.',
          status: 'completed',
          authorId: 'demo-client-123',
          authorEmail: 'client@brand.com',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: 'note-sample-2',
          projectId: demo.id,
          timestampSeconds: 12,
          timestampFormatted: '00:12',
          note: 'Sound fx on the fast transition cut is perfect, keep that tempo throughout.',
          status: 'pending',
          authorId: 'demo-client-123',
          authorEmail: 'client@brand.com',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
      setProjectLoading(false);
      return;
    }

    if (!currentUser) {
      setProject(null);
      setRevisionNotes([]);
      return;
    }

    setProjectLoading(true);
    const projectDocRef = doc(db, 'projects', `proj_${currentUser.uid.slice(0, 8)}`);

    const unsubscribeProject = onSnapshot(
      projectDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProject(docSnap.data() as ClientProject);
        } else {
          // Auto initialize project document for the client
          const initialProject = createDefaultProjectData(
            currentUser.uid,
            currentUser.email || 'client@brand.com',
            currentUser.displayName || 'Loop Studios Client'
          );
          setDoc(projectDocRef, initialProject)
            .then(() => setProject(initialProject))
            .catch((err) => handleFirestoreError(err, OperationType.WRITE, `projects/${projectDocRef.id}`));
        }
        setProjectLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `projects/${projectDocRef.id}`);
        setProjectLoading(false);
      }
    );

    // Subscribe to revision notes subcollection
    const notesColRef = collection(db, 'projects', `proj_${currentUser.uid.slice(0, 8)}`, 'revision_notes');
    const unsubscribeNotes = onSnapshot(
      notesColRef,
      (querySnap) => {
        const notes: RevisionNote[] = [];
        querySnap.forEach((doc) => {
          notes.push({ id: doc.id, ...(doc.data() as Omit<RevisionNote, 'id'>) });
        });
        // Sort by timestamp
        notes.sort((a, b) => a.timestampSeconds - b.timestampSeconds);
        setRevisionNotes(notes);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `projects/proj_${currentUser.uid.slice(0, 8)}/revision_notes`);
      }
    );

    return () => {
      unsubscribeProject();
      unsubscribeNotes();
    };
  }, [currentUser, isDemoMode]);

  // Video time update listener
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      setTimestampSeconds(Math.floor(current));
      setTimestampFormatted(formatTime(current));
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(seconds);
      setTimestampSeconds(seconds);
      setTimestampFormatted(formatTime(seconds));
    }
  };

  // Stamp current video timecode
  const stampCurrentTime = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      const time = Math.floor(videoRef.current.currentTime);
      setTimestampSeconds(time);
      setTimestampFormatted(formatTime(time));
    }
  };

  // Submit Revision Note
  const handleSubmitRevisionNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || noteText.trim().length < 2) return;
    if (!project) return;

    setIsSubmittingNote(true);

    const newNote: Omit<RevisionNote, 'id'> = {
      projectId: project.id,
      timestampSeconds,
      timestampFormatted,
      note: noteText.trim(),
      status: 'pending',
      authorId: currentUser?.uid || 'demo-user',
      authorEmail: currentUser?.email || 'demo@loopstudios.lk',
      createdAt: new Date().toISOString(),
    };

    if (isDemoMode) {
      setRevisionNotes((prev) => [
        ...prev,
        { id: `demo-note-${Date.now()}`, ...newNote } as RevisionNote,
      ]);
      setNoteText('');
      setIsSubmittingNote(false);
      return;
    }

    try {
      const notesColRef = collection(db, 'projects', project.id, 'revision_notes');
      await addDoc(notesColRef, newNote);
      setNoteText('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `projects/${project.id}/revision_notes`);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Toggle revision status (client or editor)
  const handleToggleNoteStatus = async (note: RevisionNote) => {
    const nextStatus = note.status === 'completed' ? 'pending' : 'completed';
    if (isDemoMode) {
      setRevisionNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, status: nextStatus } : n))
      );
      return;
    }
    if (!project) return;
    try {
      const noteDocRef = doc(db, 'projects', project.id, 'revision_notes', note.id);
      await updateDoc(noteDocRef, { status: nextStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${project.id}/revision_notes/${note.id}`);
    }
  };

  // Format WhatsApp string of all notes
  const getWhatsAppRevisionShareUrl = () => {
    if (!project) return getWhatsAppUrl();
    let text = `*Loop Studios Revision Feedback*\nProject: ${project.title}\nClient: ${project.clientName}\n\n`;
    revisionNotes.forEach((n, idx) => {
      text += `${idx + 1}. [${n.timestampFormatted}] ${n.note} (${n.status.toUpperCase()})\n`;
    });
    text += `\nPlease confirm receipt of these edits.`;
    return getWhatsAppUrl(text);
  };

  // Milestones definition
  const milestones = [
    {
      stage: 1,
      title: 'Stage 1: Shoot Completed',
      subtitle: 'Production & Field Ingestion',
      description: 'Cinema camera rigs, aerial drone flights, and 32-bit float audio multi-tracks successfully ingested into editing servers.',
      completed: (project?.currentStage ?? 0) >= 1,
      active: project?.currentStage === 1,
    },
    {
      stage: 2,
      title: 'Stage 2: Post-Production & Retention Cuts',
      subtitle: 'Editorial Pacing & Viral Structuring',
      description: 'Hook framing, sound effects synchronization, multi-angle editorial selection, and fast-paced cut assemblies.',
      completed: (project?.currentStage ?? 0) >= 2,
      active: project?.currentStage === 2,
    },
    {
      stage: 3,
      title: 'Stage 3: Color Grading & Audio Engineering',
      subtitle: 'DaVinci Resolve Film Emulation & Mastering',
      description: 'Tone curves, film grain application, high-end skin smoothing, dialogue isolation, and Dolby loudness normalization.',
      completed: (project?.currentStage ?? 0) >= 3,
      active: project?.currentStage === 3,
    },
    {
      stage: 4,
      title: 'Stage 4: Final Deliverables Ready',
      subtitle: 'Master 4K & Vertical Social Packages',
      description: 'Full uncompressed deliverables approved, client review sign-off completed, and private download links unlocked.',
      completed: (project?.currentStage ?? 0) >= 4,
      active: project?.currentStage === 4,
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
          Connecting to Loop Studios Client Vault...
        </p>
      </div>
    );
  }

  // Not Logged In View
  if (!currentUser && !isDemoMode) {
    return (
      <div className="pt-32 pb-24 px-5 sm:px-8 max-w-4xl mx-auto min-h-[80vh] flex items-center justify-center">
        <div className="w-full rounded-3xl p-8 sm:p-12 editorial-glass border border-black/10 dark:border-white/10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-6">
            <Lock className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase font-semibold">Dedicated Client Vault</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 cinema-gradient-text">
            Loop Studios Client Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed font-light">
            Real-time milestone tracking, interactive timestamped video review, and instant 4K master downloads for our brand partners and event clients.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In / Client Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDemoMode(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer text-[#0A0A0C] dark:text-white"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Explore Live Demo Space</span>
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 text-left pt-10 border-t border-black/5 dark:border-white/10">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-xs tracking-tight uppercase font-mono mb-1">
                4-Stage Milestones
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Track shoot ingestion, retention cut assemblies, color grading, and final delivery dates in real time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <Film className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-xs tracking-tight uppercase font-mono mb-1">
                Timestamped Revision Tool
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Pause review cuts at exact seconds and submit notes directly to the Loop Studios editing room.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
                <Download className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-xs tracking-tight uppercase font-mono mb-1">
                Direct Master Assets
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Download uncompressed Level 01/02/03 social edits, high-res photo albums, and 360 VR spatial embeds.
              </p>
            </div>
          </div>
        </div>

        <ClientAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          isDark={isDark}
        />
      </div>
    );
  }

  // Logged-in / Demo Client Portal
  return (
    <div className="pt-28 md:pt-36 pb-24 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Top Banner / Client Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-black/10 dark:border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-semibold">
              {isDemoMode ? 'Interactive Demo Workspace' : 'Authenticated Client Workspace'}
            </span>
            <span className="font-mono text-xs text-slate-400">
              ID: {project?.id || 'PROJ-LIVE'}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
            {project?.title || 'Client Project Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Partner: <span className="font-semibold text-[#0A0A0C] dark:text-white">{project?.clientName}</span> · {project?.eventType}
          </p>
        </div>

        {/* User profile controls & Sign Out */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold leading-tight">{currentUser.displayName || 'Client'}</p>
              <p className="text-[10px] font-mono text-slate-400">{currentUser.email}</p>
            </div>
          )}

          {isDemoMode ? (
            <button
              onClick={() => setIsDemoMode(false)}
              className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors"
            >
              Exit Demo
            </button>
          ) : (
            <button
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider bg-black/5 dark:bg-white/10 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs (Milestones, Deliverables, Video Revisions) */}
      <div className="flex items-center gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 border-b border-black/5 dark:border-white/5">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'milestones'
              ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black shadow-md'
              : 'text-slate-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Project Milestones (Stage {project?.currentStage || 1}/4)</span>
        </button>

        <button
          onClick={() => setActiveTab('deliverables')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'deliverables'
              ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black shadow-md'
              : 'text-slate-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Deliverables Viewer</span>
        </button>

        <button
          onClick={() => setActiveTab('revisions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'revisions'
              ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black shadow-md'
              : 'text-slate-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Video Review & Timecoded Notes ({revisionNotes.length})</span>
        </button>
      </div>

      {/* TAB 1: MILESTONES TRACKER */}
      {activeTab === 'milestones' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Progress Bar Header */}
          <div className="p-6 rounded-3xl editorial-glass border border-black/5 dark:border-white/10 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-blue-500 font-semibold">
                  Overall Completion Status
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold">
                  Stage {project?.currentStage || 1} of 4: {milestones[(project?.currentStage || 1) - 1]?.title}
                </h3>
              </div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-blue-500">
                {((project?.currentStage || 1) / 4) * 100}% Complete
              </span>
            </div>

            {/* Dynamic Progress Indicator */}
            <div className="w-full h-3 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${((project?.currentStage || 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* 4-Stage Step-by-Step Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.map((m) => (
              <div
                key={m.stage}
                className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
                  m.completed
                    ? 'bg-black/[0.02] dark:bg-white/[0.03] border-emerald-500/30'
                    : 'bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        m.completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-black/10 dark:bg-white/10 text-slate-400'
                      }`}
                    >
                      {m.completed ? <CheckCircle2 className="w-4 h-4" /> : m.stage}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm sm:text-base">
                        {m.title}
                      </h4>
                      <p className="font-mono text-[11px] text-blue-500 dark:text-blue-400">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      m.completed
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-black/5 dark:bg-white/5 text-slate-400'
                    }`}
                  >
                    {m.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {m.description}
                </p>

                {m.active && (
                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-xs font-mono text-amber-500 dark:text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Active Production Phase in Progress</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERABLES VIEWER */}
      {activeTab === 'deliverables' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-1">
              Final Deliverables & Media Vault
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Download finalized short-form edits, browse uncompressed photo galleries, and access private 360° VR interactive tours.
            </p>
          </div>

          {/* Short-form Edits Grid */}
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-4">
              Short-Form Video Edits (Tiered Master Exports)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {project?.shortFormEdits?.map((cut) => (
                <div
                  key={cut.id}
                  className="p-6 rounded-3xl editorial-glass border border-black/10 dark:border-white/10 flex flex-col justify-between transition-all hover:border-black/20 dark:hover:border-white/20 shadow-md group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold">
                        {cut.tier}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {cut.duration}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base mb-2 group-hover:text-blue-500 transition-colors">
                      {cut.title}
                    </h3>
                    <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                      {cut.format} · {cut.fileSize}
                    </p>
                  </div>

                  <a
                    href={project.videoPreviewUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-[#0A0A0C] text-white dark:bg-white dark:text-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm active:scale-98"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Master Cut</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* High-Resolution Photo Gallery & 360 VR Embeds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            {/* Photo Gallery Card */}
            <div className="p-6 rounded-3xl editorial-glass border border-black/10 dark:border-white/10 flex flex-col justify-between shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">
                    High-Resolution Photo Gallery
                  </h3>
                  <p className="font-mono text-[11px] text-slate-400">
                    RAW + Full-Resolution Color Graded JPEGs
                  </p>
                </div>
              </div>

              <div className="h-40 rounded-2xl overflow-hidden mb-4 relative group">
                <img
                  src={project?.photoGalleryUrl}
                  alt="High Res Gallery Preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-mono text-xs text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                    250+ Master Photos Ready
                  </span>
                </div>
              </div>

              <a
                href={project?.photoGalleryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 transition-all"
              >
                <span>Open Full Master Album</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 360 Spatial VR Card */}
            <div className="p-6 rounded-3xl editorial-glass border border-black/10 dark:border-white/10 flex flex-col justify-between shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">
                    Private 360° VR Spatial Tour
                  </h3>
                  <p className="font-mono text-[11px] text-slate-400">
                    Interactive Spherical Panorama & Headset Embed
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 mb-4 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs text-purple-500">
                  <Sparkles className="w-4 h-4" />
                  <span>Stereoscopic Sphere Verified</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Complete spatial venue walk-through ready for direct web sharing or Apple Vision Pro / Meta Quest VR playback.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (onOpenVRViewer) {
                      onOpenVRViewer();
                    } else {
                      window.location.hash = '#360-vr';
                    }
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl font-medium text-xs bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Launch Spatial 360 Viewer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIDEO REVIEW & TIMECODED NOTES */}
      {activeTab === 'revisions' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-1">
              Interactive Video Revision Tool
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Pause the video cut at any frame to pin a timestamped revision note. Edits synchronize live with our editing room.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Video Player & Scrubber (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-black/10 dark:border-white/10 shadow-2xl group">
                <video
                  ref={videoRef}
                  src={project?.videoPreviewUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                  playsInline
                />

                {/* Overlaid Play/Pause Click Surface */}
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {!isPlaying && (
                    <div className="w-16 h-16 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 ml-1" />
                    </div>
                  )}
                </button>

                {/* Bottom Video Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between gap-4 text-white">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>

                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={(e) => handleSeekTo(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="font-mono text-xs whitespace-nowrap">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    onClick={stampCurrentTime}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 whitespace-nowrap"
                    title="Pause and set current timestamp"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pin Time</span>
                  </button>
                </div>
              </div>

              {/* Revision Submission Form */}
              <form
                onSubmit={handleSubmitRevisionNote}
                className="p-6 rounded-3xl editorial-glass border border-black/10 dark:border-white/10 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 font-mono text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Timestamp: {timestampFormatted}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      (Paused at {timestampSeconds}s)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={stampCurrentTime}
                    className="text-xs text-blue-500 hover:underline font-mono"
                  >
                    Update to Current Time
                  </button>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="E.g., Please tighten the speaker cut at this point and boost the crowd cheer volume..."
                    maxLength={1000}
                    className="w-full p-3.5 rounded-2xl text-xs sm:text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1">
                    <span>Press submit to sync with senior editors</span>
                    <span>{noteText.length}/1000</span>
                  </div>
                </div>

                {/* Preset Editorial Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider py-1">Quick presets:</span>
                  {[
                    'Tighten cut by 0.5s',
                    'Boost ambient sound',
                    'Apply warmer color grade',
                    'Swap title text overlay',
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setNoteText(preset)}
                      className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[11px] font-mono text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <a
                    href={getWhatsAppRevisionShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                  >
                    <span>Send Notes to WhatsApp Hotline</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="submit"
                    disabled={isSubmittingNote || noteText.trim().length < 2}
                    className="px-6 py-2.5 rounded-xl font-medium text-xs bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmittingNote ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Submit Change Note</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Revision Notes Feed (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <h3 className="font-display font-bold text-base">
                    Active Revision Notes
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {revisionNotes.length} pinned
                </span>
              </div>

              {revisionNotes.length === 0 ? (
                <div className="p-8 rounded-3xl border border-dashed border-black/10 dark:border-white/10 text-center">
                  <Film className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="font-mono text-xs text-slate-400">
                    No revision notes submitted yet. Pause the video and pin your first change request!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {revisionNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        note.status === 'completed'
                          ? 'bg-emerald-500/[0.04] border-emerald-500/20 opacity-80'
                          : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/10 dark:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {/* Clickable Timecode Seek */}
                        <button
                          onClick={() => handleSeekTo(note.timestampSeconds)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold hover:bg-blue-500/20 transition-colors"
                          title="Click to jump video to this timecode"
                        >
                          <Play className="w-3 h-3" />
                          <span>{note.timestampFormatted}</span>
                        </button>

                        {/* Status Toggle Badge */}
                        <button
                          onClick={() => handleToggleNoteStatus(note)}
                          className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                            note.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                          }`}
                        >
                          {note.status === 'completed' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Resolved</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>Pending Edit</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                        {note.note}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-black/5 dark:border-white/5 pt-2">
                        <span>{note.authorEmail?.split('@')[0] || 'Client'}</span>
                        <span>{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
