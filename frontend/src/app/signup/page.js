"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, CheckCircle2, UserPlus } from "lucide-react";
import GoogleIcon from "../../components/GoogleIcon";
import { GUEST_USER_TEMPLATE } from "../../data/mockData";
import { triggerGoogleSignIn } from "../../utils/googleAuth";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
];

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDay: "12",
    birthMonth: "Oct",
    birthYear: "2000",
    gender: "female",
    avatar: AVATAR_PRESETS[0],
    bio: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    const newUser = {
      id: `user-${Date.now()}`,
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      username: formData.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, ""),
      email: formData.email.trim(),
      avatar: formData.avatar,
      coverPhoto: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
      bio: formData.bio.trim() || "Just joined Kite! Connect and say hi 👋",
      work: "Community Member",
      livesIn: "San Francisco, CA",
      from: "California, USA",
      joined: "Today",
      followersCount: 1,
      friendsCount: 0,
      isGuest: false,
    };

    try {
      localStorage.setItem("kite_user", JSON.stringify(newUser));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 400);
  };

  const handleGoogleSignup = () => {
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
        setError(err || "Google sign-up could not be completed.");
      }
    );
  };

  const handleGuestSignup = () => {
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

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 80 }, (_, i) => String(2026 - i));

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a] text-zinc-900 dark:text-[#e4e6eb] flex flex-col justify-between selection:bg-[#1877f2]/20 selection:text-[#1877f2]">
      {/* Top Header */}
      <div className="pt-6 pb-2 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#1877f2] flex items-center justify-center text-white shadow-md">
            <svg
              className="w-6 h-6 text-white"
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
          <span className="text-3xl font-black tracking-tight text-[#1877f2]">
            kite
          </span>
        </Link>
      </div>

      {/* Main Signup Form Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 sm:py-8">
        <div className="w-full max-w-lg bg-white dark:bg-[#242526] rounded-2xl shadow-xl border border-zinc-200/90 dark:border-zinc-700/80 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700/60">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Create a new account
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              It&apos;s quick and easy.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3.5">
              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:bg-white dark:focus:bg-[#242526] transition"
                />
                <input
                  type="text"
                  required
                  placeholder="Surname"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:bg-white dark:focus:bg-[#242526] transition"
                />
              </div>

              {/* Email / Mobile */}
              <div>
                <input
                  type="email"
                  required
                  placeholder="Mobile number or email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:bg-white dark:focus:bg-[#242526] transition"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="New password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:bg-white dark:focus:bg-[#242526] transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Date of Birth (Facebook style) */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Date of birth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={formData.birthDay}
                    onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#3a3b3c] border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender (Facebook style) */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#3a3b3c] cursor-pointer hover:bg-zinc-100">
                    <span>Female</span>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                  </label>
                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#3a3b3c] cursor-pointer hover:bg-zinc-100">
                    <span>Male</span>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                  </label>
                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#3a3b3c] cursor-pointer hover:bg-zinc-100">
                    <span>Custom</span>
                    <input
                      type="radio"
                      name="gender"
                      value="custom"
                      checked={formData.gender === "custom"}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                  </label>
                </div>
              </div>

              {/* Avatar Preset Choice */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 transition ${
                        formData.avatar === url
                          ? "border-[#1877f2] scale-105 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt={`Option ${idx + 1}`} className="w-full h-full object-cover" />
                      {formData.avatar === url && (
                        <div className="absolute inset-0 bg-[#1877f2]/20 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms notice */}
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                People who use our service may have uploaded your contact information to Kite. By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#00a400] hover:bg-[#008f00] text-white font-bold rounded-xl shadow-md transition transform active:scale-[0.98] text-base"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-700/80" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#242526] px-3 text-zinc-400 font-semibold text-[11px]">
                  or sign up with
                </span>
              </div>
            </div>

            {/* GOOGLE SIGN UP BUTTON */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full py-2.5 px-4 bg-white dark:bg-[#3a3b3c] hover:bg-zinc-50 dark:hover:bg-[#4e4f50] border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-100 font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-3 text-sm"
            >
              <GoogleIcon className="w-5 h-5 shrink-0" />
              <span>Continue with Google</span>
            </button>

            {/* CONTINUE AS GUEST BUTTON */}
            <button
              type="button"
              onClick={handleGuestSignup}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-md transition transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Continue as Guest</span>
            </button>

            {/* Already have an account link */}
            <div className="text-center pt-2">
              <Link href="/login" className="text-sm font-semibold text-[#1877f2] hover:underline">
                Already have an account? Log In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-[#242526] border-t border-zinc-200 dark:border-zinc-700/60 py-6 px-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="flex flex-wrap gap-3 pb-2 border-b border-zinc-100 dark:border-zinc-700/60 text-[11px]">
            <span>English (UK)</span>
            <span>Español</span>
            <span>Français</span>
            <span>Deutsch</span>
            <span>বাংলা</span>
            <span>العربية</span>
            <span>हिन्दी</span>
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] text-zinc-400">
            <Link href="/signup" className="hover:underline">Sign Up</Link>
            <Link href="/login" className="hover:underline">Log In</Link>
            <Link href="/" className="hover:underline">Privacy</Link>
            <Link href="/" className="hover:underline">Terms</Link>
          </div>
          <p className="text-[10px] text-zinc-400 pt-1">Kite © 2026</p>
        </div>
      </footer>
    </div>
  );
}
