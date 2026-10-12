"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Zap, Leaf, Mic, Code, Radio } from "lucide-react";
import GoogleIcon from "../../components/GoogleIcon";
import { GUEST_USER_TEMPLATE } from "../../data/mockData";
import { triggerGoogleSignIn } from "../../utils/googleAuth";
import { apiLogin, apiGoogleAuth, apiGuestAuth, apiRegister } from "../../utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await apiLogin({ email: email.trim(), password });
      localStorage.setItem("kite_user", JSON.stringify(user));
      setIsLoading(false);
      router.push("/");
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Invalid credentials.");
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    triggerGoogleSignIn(
      async (googleUser) => {
        const savedUser = await apiGoogleAuth(googleUser);
        localStorage.setItem("kite_user", JSON.stringify(savedUser));
        setIsLoading(false);
        router.push("/");
      },
      (err) => {
        setIsLoading(false);
        setError(err || "Google sign-in could not be completed.");
      }
    );
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const guestUser = await apiGuestAuth();
      const fallback = {
        ...GUEST_USER_TEMPLATE,
        id: `user-guest-${Date.now()}`,
      };
      localStorage.setItem("kite_user", JSON.stringify(guestUser || fallback));
      setIsLoading(false);
      router.push("/");
    } catch {
      localStorage.setItem("kite_user", JSON.stringify(GUEST_USER_TEMPLATE));
      router.push("/");
    }
  };

  const handleQuickDemoLogin = async (type) => {
    setIsLoading(true);
    let user;
    if (type === "ruhul") {
      user = {
        name: "Ruhul Amin",
        email: "ruhul941020@gmail.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      };
      const saved = await apiGoogleAuth(user);
      localStorage.setItem("kite_user", JSON.stringify(saved));
      setIsLoading(false);
      router.push("/");
      return;
    } else if (type === "alex") {
      user = {
        name: "Alex Morgan",
        email: "alex@example.com",
        password: "alex_demo_password",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: "Fullstack Creator & Tech Enthusiast 💻 Exploring the frontier of web apps and photography 📸",
      };
      const saved = await apiRegister(user);
      localStorage.setItem("kite_user", JSON.stringify(saved));
      setIsLoading(false);
      router.push("/");
      return;
    } else if (type === "sarah") {
      user = {
        name: "Sarah Chen",
        email: "sarah@example.com",
        password: "sarah_demo_password",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        bio: "UI/UX Designer • Visual Thinker • Coffee Lover ☕",
      };
      const saved = await apiRegister(user);
      localStorage.setItem("kite_user", JSON.stringify(saved));
      setIsLoading(false);
      router.push("/");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Top / Main Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          {/* Left Column: Modern Kite Identity & Distinctive Highlights */}
          <div className="lg:max-w-lg text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/30">
                <div className="w-full h-full bg-white dark:bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-cyan-400 transform -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L21 9L12 22L3 9L12 2Z" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 2L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M3 9L21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="11" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  kite
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Digital Sanctuary for Thinkers & Creators
                </p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-snug mb-4">
              Social connection reimagined for depth, calm, and genuine human sparks.
            </h2>

            {/* Exclusive Kite Capabilities Badges */}
            <div className="grid grid-cols-2 gap-2.5 my-6 text-left">
              <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Zen Mode</h4>
                  <p className="text-[10px] text-slate-400">Zero toxic metrics & vanity counts</p>
                </div>
              </div>

              <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Voice Sparks</h4>
                  <p className="text-[10px] text-slate-400">Interactive audio waveform notes</p>
                </div>
              </div>

              <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Syntax Code</h4>
                  <p className="text-[10px] text-slate-400">Rich developer blocks & 1-click copy</p>
                </div>
              </div>

              <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Soundscapes</h4>
                  <p className="text-[10px] text-slate-400">Built-in procedural focus audio</p>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mt-6 hidden lg:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Instant 1-Click Demo Profiles
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("ruhul")}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl shadow-xs border border-indigo-500/40 hover:border-indigo-500 hover:shadow-md transition text-left group w-32 cursor-pointer"
                >
                  <div className="relative w-11 h-11 mb-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                      alt="Ruhul"
                      className="w-full h-full rounded-xl object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-0.5 rounded-full shadow">
                      <GoogleIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs font-bold truncate">Ruhul Amin</p>
                  <p className="text-[10px] text-slate-400 truncate">Google Auth</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("alex")}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition text-left group w-32 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Alex"
                    className="w-11 h-11 rounded-xl object-cover mb-1.5 group-hover:scale-105 transition"
                  />
                  <p className="text-xs font-bold truncate">Alex Morgan</p>
                  <p className="text-[10px] text-slate-400">Tech Lead</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("sarah")}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition text-left group w-32 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Sarah"
                    className="w-11 h-11 rounded-xl object-cover mb-1.5 group-hover:scale-105 transition"
                  />
                  <p className="text-xs font-bold truncate">Sarah Chen</p>
                  <p className="text-[10px] text-slate-400">Designer</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Glassmorphic Login Card */}
          <div className="w-full max-w-md">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Enter your Sanctuary
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign in to explore your circle and sparks
                </p>
              </div>

              {error && (
                <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-md shadow-indigo-500/20 transition transform active:scale-[0.98] text-sm cursor-pointer"
                >
                  {isLoading ? "Signing in..." : "Sign In to Kite"}
                </button>
              </form>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold text-[10px]">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl shadow-xs transition flex items-center justify-center gap-3 text-xs sm:text-sm cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Continue with Google</span>
              </button>

              {/* Guest Exploration Button */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-md shadow-amber-500/15 transition transform active:scale-[0.98] flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Instant Guest Explorer (1-Click)</span>
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>New to Kite? </span>
                <Link
                  href="/signup"
                  className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
                >
                  Create an account →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Minimalist Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[11px]">Kite — The Modern Creative Social Sanctuary</p>
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/signup" className="hover:text-indigo-500">Sign Up</Link>
          <Link href="/" className="hover:text-indigo-500">Explore Feed</Link>
          <span className="text-slate-500">© 2026 Kite</span>
        </div>
      </footer>
    </div>
  );
}
