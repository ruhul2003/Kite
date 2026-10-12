"use client";

import { useState } from "react";
import Link from "next/link";
import { X, UserPlus, LogIn, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import GoogleIcon from "./GoogleIcon";
import { triggerGoogleSignIn } from "../utils/googleAuth";
import { apiRegister, apiLogin, apiGoogleAuth, apiGuestAuth } from "../utils/api";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
];

export default function AuthModal({ isOpen, onClose, initialMode = "signup", onLogin, onSignup, onGuestLogin }) {
  const [mode, setMode] = useState(initialMode); // 'signup' | 'login' | 'guest'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    bio: "",
    avatar: AVATAR_PRESETS[0],
    gender: "female",
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please provide your first and last name.");
      return;
    }
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    try {
      const savedUser = await apiRegister({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        password: formData.password,
        avatar: formData.avatar,
        bio: formData.bio.trim(),
      });
      onSignup(savedUser);
      onClose();
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const user = await apiLogin({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      onLogin(user);
      onClose();
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    }
  };

  const handleGoogleAuth = () => {
    triggerGoogleSignIn(
      async (googleUser) => {
        const saved = await apiGoogleAuth(googleUser);
        onLogin(saved);
        onClose();
      },
      (err) => {
        setError(err || "Google authentication failed.");
      }
    );
  };

  const handleQuickDemoLogin = async (type) => {
    if (type === "alex") {
      const saved = await apiRegister({
        name: "Alex Morgan",
        email: "alex@example.com",
        password: "alex_password_123",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: "Fullstack Creator & Tech Enthusiast 💻 Exploring the frontier of web apps and photography 📸",
      });
      onLogin(saved);
    } else {
      const saved = await apiRegister({
        name: "Sarah Chen",
        email: "sarah@example.com",
        password: "sarah_password_123",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        bio: "UI/UX Designer • Visual Thinker • Coffee Lover ☕",
      });
      onLogin(saved);
    }
    onClose();
  };

  const handleGuestClick = async () => {
    const guest = await apiGuestAuth();
    if (guest) {
      onLogin(guest);
    } else {
      onGuestLogin();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700/60 overflow-hidden text-zinc-900 dark:text-[#e4e6eb] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1877f2] flex items-center justify-center text-white font-bold text-xl shadow-md">
              K
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {mode === "signup" ? "Create a Kite Account" : mode === "login" ? "Log Into Kite" : "Guest Access"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {mode === "signup" ? "It's quick and easy." : mode === "login" ? "Welcome back! Good to see you." : "Explore without signing up"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-[#18191a]/40 p-1">
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === "signup"
                ? "bg-white dark:bg-[#242526] text-[#1877f2] shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === "login"
                ? "bg-white dark:bg-[#242526] text-[#1877f2] shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode("guest"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === "guest"
                ? "bg-white dark:bg-[#242526] text-amber-500 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Guest Mode
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* GOOGLE SIGN IN OPTION IN MODAL */}
          {mode !== "guest" && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2.5 px-4 bg-white dark:bg-[#3a3b3c] hover:bg-zinc-50 dark:hover:bg-[#4e4f50] border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-100 font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-3 text-xs"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Continue with Google</span>
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-700/60"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white dark:bg-[#242526] px-2 text-zinc-400 font-medium">
                    Or with email
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SIGN UP FORM */}
          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                  Email or Username
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
                  Choose Profile Avatar
                </label>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      className={`relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 transition ${
                        formData.avatar === url
                          ? "border-[#1877f2] scale-105 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover" />
                      {formData.avatar === url && (
                        <div className="absolute inset-0 bg-[#1877f2]/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                  Bio / Headline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Creative spirit • Web explorer"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>

              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#42b72a] hover:bg-[#36a420] text-white font-bold rounded-xl shadow-md transition transform active:scale-[0.98] text-base"
              >
                Sign Up
              </button>
            </form>
          )}

          {/* LOG IN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-zinc-100 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-zinc-100 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl shadow-md transition transform active:scale-[0.98] text-base"
              >
                Log In
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#242526] px-3 text-zinc-400 font-medium">
                    Or 1-Click Demo Profiles
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("alex")}
                  className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-[#3a3b3c] transition text-left"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Alex"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">Alex Morgan</p>
                    <p className="text-[10px] text-zinc-500">Tech Lead</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("sarah")}
                  className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-[#3a3b3c] transition text-left"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Sarah"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">Sarah Chen</p>
                    <p className="text-[10px] text-zinc-500">Designer</p>
                  </div>
                </button>
              </div>
            </form>
          )}

          {/* GUEST ACCESS MODE */}
          {mode === "guest" && (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Use Kite as Guest</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  No sign up required! Explore the feed, react with Facebook emojis, write comments, create posts, and chat with contacts immediately.
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-[#18191a] p-3.5 rounded-xl text-left border border-zinc-200/80 dark:border-zinc-700/60 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full access to News Feed, Stories, and Reels</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Post status updates, photos, and reactions</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Interactive Messenger chat with online friends</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Can convert to permanent account anytime with 1 click</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGuestClick}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
              >
                <span>Continue as Guest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-[#18191a] border-t border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link href="/login" onClick={onClose} className="text-zinc-500 hover:underline">
              Full Login Page
            </Link>
            <span>•</span>
            <Link href="/signup" onClick={onClose} className="text-zinc-500 hover:underline">
              Full Signup Page
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {mode !== "guest" && (
              <button
                type="button"
                onClick={() => setMode("guest")}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                Guest Mode
              </button>
            )}
            {mode === "signup" && (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-[#1877f2] font-semibold hover:underline"
              >
                Have an account? Log In
              </button>
            )}
            {mode === "login" && (
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-[#1877f2] font-semibold hover:underline"
              >
                Create new account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
