"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import GoogleIcon from "../../components/GoogleIcon";
import { GUEST_USER_TEMPLATE } from "../../data/mockData";
import { triggerGoogleSignIn } from "../../utils/googleAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    // Simulate login and store user in localStorage
    const user = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim() || "Kite User",
      username: email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, ""),
      email: email.trim(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      coverPhoto: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80",
      bio: "Connecting on Kite 🚀",
      work: "Community Member",
      livesIn: "San Francisco, CA",
      from: "California, USA",
      joined: "Today",
      followersCount: 142,
      friendsCount: 48,
      isGuest: false,
    };

    try {
      localStorage.setItem("kite_user", JSON.stringify(user));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 400);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    triggerGoogleSignIn(
      (googleUser) => {
        try {
          localStorage.setItem("kite_user", JSON.stringify(googleUser));
        } catch {
          // ignore
        }
        setIsLoading(false);
        router.push("/");
      },
      (err) => {
        setIsLoading(false);
        setError(err || "Google sign-in could not be completed.");
      }
    );
  };

  const handleGuestLogin = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const guestUser = {
      ...GUEST_USER_TEMPLATE,
      id: `user-guest-${randomNum}`,
      name: `Guest Explorer #${randomNum}`,
      username: `guest_${randomNum}`,
      email: `guest${randomNum}@kite.local`,
    };

    try {
      localStorage.setItem("kite_user", JSON.stringify(guestUser));
    } catch {
      // ignore
    }

    router.push("/");
  };

  const handleQuickDemoLogin = (type) => {
    let user;
    if (type === "ruhul") {
      user = {
        id: "user-google-ruhul",
        name: "Ruhul Amin",
        username: "ruhul941020",
        email: "ruhul941020@gmail.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        coverPhoto: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
        bio: "Signed in with Google Account (ruhul941020@gmail.com) 🌐",
        work: "Developer on Kite",
        livesIn: "Bangladesh",
        from: "Google OAuth",
        joined: "Today",
        followersCount: 320,
        friendsCount: 140,
        isGuest: false,
      };
    } else if (type === "alex") {
      user = {
        id: "user-alex",
        name: "Alex Morgan",
        username: "alexmorgan",
        email: "alex@example.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        coverPhoto: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80",
        bio: "Fullstack Creator & Tech Enthusiast 💻 Exploring the frontier of web apps and photography 📸",
        work: "Software Engineer at Horizon Labs",
        livesIn: "San Francisco, CA",
        from: "Seattle, WA",
        joined: "March 2021",
        followersCount: 1420,
        friendsCount: 584,
        isGuest: false,
      };
    } else {
      user = {
        id: "friend-sarah",
        name: "Sarah Chen",
        username: "sarahchen",
        email: "sarah@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        coverPhoto: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
        bio: "UI/UX Designer • Visual Thinker • Coffee Lover ☕",
        work: "Lead Designer at Studio Pulse",
        livesIn: "San Francisco, CA",
        from: "Vancouver, Canada",
        joined: "July 2022",
        followersCount: 980,
        friendsCount: 412,
        isGuest: false,
      };
    }

    try {
      localStorage.setItem("kite_user", JSON.stringify(user));
    } catch {
      // ignore
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a] text-zinc-900 dark:text-[#e4e6eb] flex flex-col justify-between selection:bg-[#1877f2]/20 selection:text-[#1877f2]">
      {/* Top / Main Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          {/* Left Column: Facebook-style Branding & Tagline */}
          <div className="lg:max-w-md text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1877f2] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <svg
                  className="w-7 h-7 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L20 10L12 22L4 10L12 2Z" />
                  <path d="M4 10L20 10" />
                  <path d="M12 2L12 22" />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1877f2]">
                kite
              </h1>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-800 dark:text-zinc-200 leading-snug">
              Connect with friends and the world around you on Kite.
            </h2>

            {/* Quick 1-Click Demo Profiles (Like Facebook Recent Logins) */}
            <div className="mt-8 hidden lg:block">
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                Recent Demo Logins
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("ruhul")}
                  className="bg-white dark:bg-[#242526] p-2.5 rounded-2xl shadow-sm border border-[#1877f2]/40 hover:border-[#1877f2] hover:shadow-md transition text-left group w-32"
                >
                  <div className="relative w-12 h-12 mb-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                      alt="Ruhul"
                      className="w-full h-full rounded-xl object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-white dark:bg-[#242526] p-0.5 rounded-full shadow">
                      <GoogleIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs font-bold truncate">Ruhul Amin</p>
                  <p className="text-[10px] text-zinc-400 truncate">ruhul941020</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("alex")}
                  className="bg-white dark:bg-[#242526] p-2.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/80 hover:shadow-md transition text-left group w-32"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Alex"
                    className="w-12 h-12 rounded-xl object-cover mb-1.5 group-hover:scale-105 transition"
                  />
                  <p className="text-xs font-bold truncate">Alex Morgan</p>
                  <p className="text-[10px] text-zinc-400">Tech Lead</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("sarah")}
                  className="bg-white dark:bg-[#242526] p-2.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/80 hover:shadow-md transition text-left group w-32"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Sarah"
                    className="w-12 h-12 rounded-xl object-cover mb-1.5 group-hover:scale-105 transition"
                  />
                  <p className="text-xs font-bold truncate">Sarah Chen</p>
                  <p className="text-[10px] text-zinc-400">Designer</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Facebook-style Login Card */}
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-xl border border-zinc-200/90 dark:border-zinc-700/80 p-6 sm:p-8 space-y-4">
              {error && (
                <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Email address or phone number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:bg-white dark:focus:bg-[#242526] transition"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:bg-white dark:focus:bg-[#242526] transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Log In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl shadow-md transition transform active:scale-[0.98] text-base"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
              </form>

              {/* Forgot password */}
              <div className="text-center pt-1">
                <a href="#" className="text-xs text-[#1877f2] hover:underline">
                  Forgotten password?
                </a>
              </div>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-700/80" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#242526] px-3 text-zinc-400 font-semibold text-[11px]">
                    or connect with
                  </span>
                </div>
              </div>

              {/* GOOGLE SIGN IN BUTTON */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white dark:bg-[#3a3b3c] hover:bg-zinc-50 dark:hover:bg-[#4e4f50] border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-100 font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-3 text-sm"
              >
                <GoogleIcon className="w-5 h-5 shrink-0" />
                <span>Continue with Google</span>
              </button>

              {/* CONTINUE AS GUEST BUTTON */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-md transition transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Continue as Guest</span>
              </button>

              <div className="border-t border-zinc-200 dark:border-zinc-700/80 my-2" />

              {/* Create New Account Button */}
              <div className="text-center pt-1">
                <Link
                  href="/signup"
                  className="inline-block px-6 py-3 bg-[#42b72a] hover:bg-[#36a420] text-white font-bold rounded-xl shadow-md transition transform active:scale-[0.98] text-sm"
                >
                  Create new account
                </Link>
              </div>
            </div>

            {/* Subtext */}
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-4">
              <strong>Create a Page</strong> for a celebrity, brand or business.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-[#242526] border-t border-zinc-200 dark:border-zinc-700/60 py-6 px-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="flex flex-wrap gap-3 pb-2 border-b border-zinc-100 dark:border-zinc-700/60 text-[11px]">
            <span>English (UK)</span>
            <span>Español</span>
            <span>Français (France)</span>
            <span>Deutsch</span>
            <span>Italiano</span>
            <span>Português (Brasil)</span>
            <span>বাংলা</span>
            <span>العربية</span>
            <span>हिन्दी</span>
            <span>日本語</span>
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] text-zinc-400">
            <Link href="/signup" className="hover:underline">Sign Up</Link>
            <Link href="/login" className="hover:underline">Log In</Link>
            <Link href="/" className="hover:underline">Messenger</Link>
            <Link href="/" className="hover:underline">Kite Lite</Link>
            <Link href="/" className="hover:underline">Watch</Link>
            <Link href="/" className="hover:underline">Marketplace</Link>
            <Link href="/" className="hover:underline">Privacy</Link>
            <Link href="/" className="hover:underline">Terms</Link>
          </div>
          <p className="text-[10px] text-zinc-400 pt-1">Kite © 2026</p>
        </div>
      </footer>
    </div>
  );
}
