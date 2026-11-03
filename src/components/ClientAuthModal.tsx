import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '../firebase.ts';
import { LOGO_PATH } from '../types.ts';

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onSuccess?: () => void;
}

export const ClientAuthModal: React.FC<ClientAuthModalProps> = ({
  isOpen,
  onClose,
  isDark,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      const message = err instanceof Error ? err.message : 'Google authentication failed';
      if (!message.includes('popup-closed-by-user')) {
        setErrorMsg('Authentication error. If popups are blocked, please check browser settings.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      console.error('Email Auth Error:', err);
      const message = err instanceof Error ? err.message : 'Authentication failed';
      if (message.includes('user-not-found') || message.includes('wrong-password') || message.includes('invalid-credential')) {
        setErrorMsg('Invalid email or password. Please verify your credentials or sign in with Google.');
      } else if (message.includes('email-already-in-use')) {
        setErrorMsg('An account with this email already exists. Please sign in instead.');
      } else if (message.includes('weak-password')) {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(message.replace('Firebase: ', ''));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 transition-all border shadow-2xl ${
          isDark
            ? 'bg-[#0E1015]/95 border-white/10 text-white'
            : 'bg-white/95 border-black/10 text-[#0A0A0C]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-10 w-10 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-blue-500" />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-blue-500 dark:text-blue-400 font-semibold mb-1">
            Loop Studios Portal
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
            Client Asset & Review Access
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Log in to monitor project stages, review cuts with timecoded notes, and download master assets.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Action: Google Single Sign-On */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-800 dark:text-white transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-slate-200 dark:border-white/10" />
          <span className="absolute px-3 text-[10px] uppercase font-mono tracking-wider bg-[#F8F9FA] dark:bg-[#0E1015] text-slate-400">
            Or with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Client Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@brand.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-[#0A0A0C] text-white dark:bg-blue-600 dark:hover:bg-blue-500 hover:bg-slate-800 transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <span>{mode === 'signin' ? 'Sign In to Portal' : 'Create Client Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Sign In / Sign Up */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setErrorMsg(null);
            }}
            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
          >
            {mode === 'signin'
              ? "New client? Create an account"
              : 'Already have an account? Sign In'}
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Client Vault · Loop Studios Sri Lanka</span>
        </div>
      </div>
    </div>
  );
};
