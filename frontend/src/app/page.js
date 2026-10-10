"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Layers,
  RefreshCw,
  Server,
  Zap,
  ShieldCheck,
  Cpu,
  Terminal,
  Activity,
  Code2,
  Sparkles
} from "lucide-react";

function GithubIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    state: "checking", // 'connected' | 'offline' | 'checking'
    data: null,
    latency: null,
    error: null,
  });
  const [activeTab, setActiveTab] = useState("health");
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  const checkBackendHealth = async () => {
    setBackendStatus((prev) => ({ ...prev, state: "checking", error: null }));
    const startTime = performance.now();
    try {
      const res = await fetch("http://localhost:5000/api/health", {
        headers: { Accept: "application/json" },
      });
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (res.ok) {
        const data = await res.json();
        setBackendStatus({
          state: "connected",
          data,
          latency,
          error: null,
        });
        setApiResponse(data);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      setBackendStatus({
        state: "offline",
        data: {
          status: "standby",
          message: "Backend server is offline. Run 'cd backend && npm run dev' to start.",
          timestamp: new Date().toISOString(),
        },
        latency: null,
        error: err.message,
      });
      setApiResponse({
        status: "standby",
        message: "Start backend server on port 5000: 'cd backend && npm run dev'",
        tip: "Backend is decoupled for independent scalability."
      });
    }
  };

  // Check backend health on mount
  useEffect(() => {
    let ignore = false;
    async function initCheck() {
      const startTime = performance.now();
      try {
        const res = await fetch("http://localhost:5000/api/health", {
          headers: { Accept: "application/json" },
        });
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setBackendStatus({
              state: "connected",
              data,
              latency,
              error: null,
            });
            setApiResponse(data);
          }
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err) {
        if (!ignore) {
          setBackendStatus({
            state: "offline",
            data: {
              status: "standby",
              message: "Backend server is offline. Run 'cd backend && npm run dev' to start.",
              timestamp: new Date().toISOString(),
            },
            latency: null,
            error: err.message,
          });
          setApiResponse({
            status: "standby",
            message: "Start backend server on port 5000: 'cd backend && npm run dev'",
            tip: "Backend is decoupled for independent scalability."
          });
        }
      }
    }

    initCheck();
    return () => {
      ignore = true;
    };
  }, []);

  const handleTestApi = async (endpoint, method = "GET", payload = null) => {
    setApiLoading(true);
    const startTime = performance.now();
    try {
      const options = {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      };
      if (payload) {
        options.body = JSON.stringify(payload);
      }

      const res = await fetch(`http://localhost:5000${endpoint}`, options);
      const data = await res.json();
      setApiResponse(data);
    } catch {
      // Mock fallback if backend is offline so the UI remains interactive and informative
      if (endpoint === "/api/info") {
        setApiResponse({
          name: "Kite Backend Service",
          version: "1.0.0",
          framework: "Express 4.21",
          mode: "development",
          note: "Simulated response (start backend on :5000 for live data)"
        });
      } else if (endpoint === "/api/echo") {
        setApiResponse({
          status: "received",
          data: payload || { sample: "Hello from Kite Minimal UI" },
          receivedAt: new Date().toISOString(),
          note: "Echo simulation (start backend on :5000 for live response)"
        });
      } else {
        setApiResponse({
          status: "ok",
          service: "Kite API",
          message: "Backend is ready to launch via 'cd backend && npm run dev'",
          uptime: "0s (standby)"
        });
      }
    } finally {
      setApiLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-100 selection:text-black">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle mask-radial pointer-events-none -z-10" />

      {/* Minimal Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2.5 group">
              {/* Kite geometric logo */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L20 10L12 22L4 10L12 2Z" />
                  <path d="M4 10L20 10" />
                  <path d="M12 2L12 22" />
                </svg>
              </div>
              <span className="font-semibold text-lg tracking-tight text-zinc-900">
                Kite
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-5 text-sm text-zinc-500 font-medium">
              <a href="#overview" className="transition-colors hover:text-zinc-950">
                Overview
              </a>
              <a href="#architecture" className="transition-colors hover:text-zinc-950">
                Architecture
              </a>
              <a href="#api" className="transition-colors hover:text-zinc-950">
                API Status
              </a>
              <a href="#features" className="transition-colors hover:text-zinc-950">
                Features
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Status Indicator */}
            <div
              onClick={() => checkBackendHealth(true)}
              className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-3 py-1 text-xs font-medium cursor-pointer transition hover:bg-zinc-100"
              title="Click to ping backend"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  backendStatus.state === "connected"
                    ? "bg-emerald-500 animate-pulse"
                    : backendStatus.state === "checking"
                    ? "bg-amber-400 animate-spin"
                    : "bg-zinc-400"
                }`}
              />
              <span className="text-zinc-600">
                {backendStatus.state === "connected"
                  ? `API Live (${backendStatus.latency}ms)`
                  : backendStatus.state === "checking"
                  ? "Checking..."
                  : "API Standby"}
              </span>
            </div>

            <a
              href="https://github.com/ruhul2003/Kite"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            <a
              href="#api"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-zinc-950 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        {/* Hero Section */}
        <section id="overview" className="flex flex-col items-center text-center">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-zinc-50/80 px-3.5 py-1 text-xs font-medium text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-8 transition hover:border-zinc-300">
            <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
            <span>Kite Monorepo</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500 font-mono text-[11px]">Next.js 16 + Express</span>
          </div>

          {/* Headline */}
          <h1 className="max-w-3xl text-4xl sm:text-6xl font-semibold tracking-tight text-zinc-950 leading-[1.12]">
            Minimal architecture.
            <br />
            <span className="text-zinc-400">Maximum engineering velocity.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            A clean, decoupled fullstack foundation. Built with Next.js 16 and
            Tailwind CSS v4 on the frontend, paired with an independent Express API backend.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#api"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              Test API Health
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="https://github.com/ruhul2003/Kite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:bg-zinc-50 hover:text-zinc-950"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </div>

          {/* Quick Copy Command Snippet */}
          <div className="mt-10 flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-2.5 text-xs font-mono text-zinc-700 shadow-sm max-w-md w-full">
            <div className="flex items-center gap-2 truncate">
              <Terminal className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="text-zinc-400 select-none">$</span>
              <span className="truncate">npm run dev</span>
              <span className="text-zinc-400 select-none">(frontend & backend)</span>
            </div>
            <button
              onClick={() => copyToClipboard("npm run dev")}
              className="rounded-md p-1 text-zinc-400 hover:text-zinc-900 transition hover:bg-zinc-200/60"
              title="Copy command"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </section>

        {/* Live Connectivity & API Explorer Section */}
        <section id="api" className="mt-20 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <Activity className="h-3.5 w-3.5" />
                Live Telemetry
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mt-1">
                API Status & Explorer
              </h2>
            </div>
            <button
              onClick={() => checkBackendHealth(true)}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
            >
              <RefreshCw
                className={`h-3 w-3 ${
                  backendStatus.state === "checking" ? "animate-spin" : ""
                }`}
              />
              Ping Server (:5000)
            </button>
          </div>

          {/* White Card Container */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-zinc-100">
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
                <span className="text-xs font-medium text-zinc-500">
                  Backend Status
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      backendStatus.state === "connected"
                        ? "bg-emerald-500"
                        : backendStatus.state === "checking"
                        ? "bg-amber-400 animate-spin"
                        : "bg-zinc-400"
                    }`}
                  />
                  <span className="font-semibold text-sm text-zinc-900">
                    {backendStatus.state === "connected"
                      ? "Online & Operational"
                      : backendStatus.state === "checking"
                      ? "Pinging Backend..."
                      : "Standby (Offline)"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
                <span className="text-xs font-medium text-zinc-500">
                  Response Latency
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-zinc-700" />
                  <span className="font-semibold text-sm text-zinc-900">
                    {backendStatus.latency !== null
                      ? `${backendStatus.latency} ms`
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
                <span className="text-xs font-medium text-zinc-500">
                  Local Endpoint
                </span>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-zinc-700 truncate">
                  <Server className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">http://localhost:5000</span>
                </div>
              </div>
            </div>

            {/* Interactive Endpoints Tabs */}
            <div className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200/80 p-1 bg-zinc-50">
                  <button
                    onClick={() => {
                      setActiveTab("health");
                      handleTestApi("/api/health");
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                      activeTab === "health"
                        ? "bg-white text-zinc-950 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    GET /api/health
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("info");
                      handleTestApi("/api/info");
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                      activeTab === "info"
                        ? "bg-white text-zinc-950 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    GET /api/info
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("echo");
                      handleTestApi("/api/echo", "POST", {
                        client: "Kite Web UI",
                        ping: "ok",
                      });
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                      activeTab === "echo"
                        ? "bg-white text-zinc-950 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    POST /api/echo
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (activeTab === "health") handleTestApi("/api/health");
                    if (activeTab === "info") handleTestApi("/api/info");
                    if (activeTab === "echo")
                      handleTestApi("/api/echo", "POST", { client: "Kite UI" });
                  }}
                  disabled={apiLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  {apiLoading ? "Sending..." : "Execute Request"}
                </button>
              </div>

              {/* Response Code Box */}
              <div className="relative rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/60 text-zinc-400 text-[11px]">
                  <span>Response Payload (JSON)</span>
                  <button
                    onClick={() =>
                      copyToClipboard(JSON.stringify(apiResponse, null, 2))
                    }
                    className="flex items-center gap-1 hover:text-zinc-900 transition"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
                <pre className="text-zinc-800 overflow-x-auto leading-relaxed">
                  {apiResponse
                    ? JSON.stringify(apiResponse, null, 2)
                    : "// Press 'Execute Request' to test the endpoint"}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="mt-24 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Layers className="h-3.5 w-3.5" />
              Decoupled Architecture
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 mt-1">
              Engineered for modularity.
            </h2>
            <p className="text-zinc-500 text-sm mt-2">
              Separation of concerns gives your frontend and backend independent CI/CD, dependencies, and scaling profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frontend Architecture Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                  <Code2 className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs font-semibold text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-200">
                  frontend/
                </span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Next.js 16 + Tailwind CSS v4
              </h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                App Router with zero-config Tailwind CSS v4 engine, optimized font rendering via Geist, and instant Turbopack builds.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-zinc-600 font-mono">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  Port: 3000 (dev)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  Router: App Router (`src/app`)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  Styling: `@import &quot;tailwindcss&quot;`
                </li>
              </ul>
            </div>

            {/* Backend Architecture Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                  <Server className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs font-semibold text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-200">
                  backend/
                </span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Express API Server
              </h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Modular Node.js service using native ES modules, configured with CORS middleware, environment orchestration, and hot reload via `node --watch`.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-zinc-600 font-mono">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  Port: 5000 (configurable via .env)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  Module System: Native ES Modules (`type: module`)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  Features: CORS, dotenv, health telemetry
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Highlights Bento Grid */}
        <section id="features" className="mt-24 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Zap className="h-3.5 w-3.5" />
              Core Capabilities
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 mt-1">
              Built for speed and clarity.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900">Turbopack Powered</h3>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                Sub-millisecond hot module replacement with Next.js Turbopack engine for frictionless prototyping.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900">Security & CORS</h3>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                Configured with Cross-Origin Resource Sharing and environment encapsulation right out of the box.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900">Zero Boilerplate</h3>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                Clean codebase without bloated dependencies. Customize database adapters or ORMs seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack Banner */}
        <section className="mt-20 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Stack Specification
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-700">
                Next.js 16.4
              </span>
              <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-700">
                React 19.3
              </span>
              <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-700">
                Tailwind v4
              </span>
              <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-700">
                Express 4.21
              </span>
              <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-700">
                ES Modules
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="mt-24 border-t border-zinc-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-6 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-zinc-950 text-white flex items-center justify-center">
              <svg
                className="h-2.5 w-2.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2L20 10L12 22L4 10L12 2Z" />
              </svg>
            </div>
            <span className="font-semibold text-zinc-900">Kite</span>
            <span>— Minimal White Architecture</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/ruhul2003/Kite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 transition flex items-center gap-1"
            >
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-zinc-300">•</span>
            <span>All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
