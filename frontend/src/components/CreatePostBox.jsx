"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Code,
  Image as ImageIcon,
  BarChart2,
  X,
  Sparkles,
  Globe,
  Users,
  Lock,
  Play,
  Square,
  Check,
  Palette,
  FileCode,
  Layers,
} from "lucide-react";
import { COLOR_BACKGROUNDS, FEELING_PRESETS } from "../data/mockData";

const SAMPLE_PHOTO_PRESETS = [
  { name: "Cyber Workspace", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80" },
  { name: "Golden Sunset", url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1000&auto=format&fit=crop&q=80" },
  { name: "Healthy Craft", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80" },
  { name: "Neural AI", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80" },
];

export default function CreatePostBox({
  currentUser,
  onCreatePost,
  isOpen,
  setIsOpen,
}) {
  const [activeTab, setActiveTab] = useState("thought"); // 'thought' | 'audio' | 'code' | 'poll'
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [selectedGradient, setSelectedGradient] = useState("none");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Voice Spark Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const [recordedAudioTitle, setRecordedAudioTitle] = useState("Voice Thought on Focus");
  const recordTimerRef = useRef(null);

  // Code Snippet State
  const [codeLanguage, setCodeLanguage] = useState("typescript");
  const [codeFilename, setCodeFilename] = useState("spark.ts");
  const [codeContent, setCodeContent] = useState("");

  // Poll State
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([
    { id: "opt-1", text: "" },
    { id: "opt-2", text: "" },
  ]);

  // Voice recording timer simulation
  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [isRecording]);

  const handleStartRecord = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setHasRecordedAudio(false);
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    setHasRecordedAudio(true);
  };

  const resetForm = () => {
    setContent("");
    setSelectedGradient("none");
    setSelectedImage(null);
    setShowImagePicker(false);
    setIsRecording(false);
    setRecordingSeconds(0);
    setHasRecordedAudio(false);
    setCodeContent("");
    setPollQuestion("");
    setPollOptions([
      { id: "opt-1", text: "" },
      { id: "opt-2", text: "" },
    ]);
    setActiveTab("thought");
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage && !hasRecordedAudio && !codeContent.trim() && !pollQuestion.trim()) {
      return;
    }

    let vibeTag = "spark";
    let audioSpark = null;
    let codeSnippet = null;
    let poll = null;
    let feeling = null;

    if (hasRecordedAudio) {
      vibeTag = "audio";
      feeling = { emoji: "🎙️", text: "recorded an Audio Spark" };
      audioSpark = {
        title: recordedAudioTitle || "Audio Reflection",
        duration: `0:${recordingSeconds < 10 ? "0" : ""}${recordingSeconds || 28}`,
        recordedAt: "Just now",
        waves: [30, 45, 60, 80, 50, 70, 90, 85, 60, 40, 75, 90, 65, 45, 55, 70, 40, 20],
      };
    } else if (codeContent.trim()) {
      vibeTag = "code";
      feeling = { emoji: "💻", text: "shared a code snippet" };
      codeSnippet = {
        language: codeLanguage,
        filename: codeFilename || `snippet.${codeLanguage === "typescript" ? "ts" : "js"}`,
        code: codeContent.trim(),
      };
    } else if (pollQuestion.trim()) {
      vibeTag = "poll";
      feeling = { emoji: "📊", text: "created a Vibe Poll" };
      const validOptions = pollOptions
        .filter((o) => o.text.trim())
        .map((o, idx) => ({
          id: `opt-${idx + 1}`,
          text: o.text.trim(),
          votes: 1,
          percentage: 0,
        }));
      poll = {
        id: `poll-${Date.now()}`,
        question: pollQuestion.trim(),
        totalVotes: validOptions.length,
        userVotedOptionId: null,
        options: validOptions,
      };
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: !currentUser.isGuest,
        role: currentUser.work || "Creator",
        vibe: "⚡ Building",
      },
      timestamp: "Just now",
      privacy,
      vibeTag,
      feeling,
      bgGradient: selectedGradient !== "none" ? COLOR_BACKGROUNDS.find((b) => b.id === selectedGradient)?.class : null,
      content: content.trim(),
      media: selectedImage ? [{ type: "image", url: selectedImage, caption: "" }] : [],
      audioSpark,
      codeSnippet,
      poll,
      reactions: { spark: 0, insight: 0, fire: 0, vibe: 0, liftoff: 0, zen: 0 },
      userReaction: null,
      sharesCount: 0,
      isSaved: false,
      comments: [],
    };

    onCreatePost(newPost);
    handleClose();
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setSelectedGradient("none");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* TRIGGER COMPOSER CARD (Feed view) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 p-4 mb-4 select-none transition">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
          />
          <button
            onClick={() => {
              setActiveTab("thought");
              setIsOpen(true);
            }}
            className="flex-1 text-left px-4 py-2.5 bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-full text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            What&apos;s on your mind, {currentUser?.name?.split(" ")[0]}?
          </button>
        </div>

        {/* Feature Composer Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2.5">
          <button
            onClick={() => {
              setActiveTab("thought");
              setShowImagePicker(true);
              setIsOpen(true);
            }}
            className="flex items-center justify-center gap-2 py-2 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-[#1877f2] font-semibold text-xs cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photo / Video</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("code");
              setIsOpen(true);
            }}
            className="flex items-center justify-center gap-2 py-2 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 font-semibold text-xs cursor-pointer"
          >
            <Code className="w-4 h-4" />
            <span>Code Block</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("audio");
              setIsOpen(true);
            }}
            className="flex items-center justify-center gap-2 py-2 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 font-semibold text-xs cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>Voice Note</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("poll");
              setIsOpen(true);
            }}
            className="flex items-center justify-center gap-2 py-2 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 font-semibold text-xs cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
            <span>Poll</span>
          </button>
        </div>
      </div>

      {/* FULL MODAL COMPOSER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="relative px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Create Post
              </h3>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Author & Privacy Bar */}
            <div className="p-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                />
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {currentUser?.name}
                  </p>
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="mt-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-0.5 text-slate-600 dark:text-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="public">🌐 Public</option>
                    <option value="friends">👥 Friends</option>
                    <option value="only_me">🔒 Only Me</option>
                  </select>
                </div>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("thought")}
                  className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                    activeTab === "thought" ? "bg-white dark:bg-slate-700 text-[#1877f2] shadow-xs font-bold" : "text-slate-500"
                  }`}
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("audio")}
                  className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                    activeTab === "audio" ? "bg-white dark:bg-slate-700 text-[#1877f2] shadow-xs font-bold" : "text-slate-500"
                  }`}
                >
                  Voice
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                    activeTab === "code" ? "bg-white dark:bg-slate-700 text-[#1877f2] shadow-xs font-bold" : "text-slate-500"
                  }`}
                >
                  Code
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("poll")}
                  className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                    activeTab === "poll" ? "bg-white dark:bg-slate-700 text-[#1877f2] shadow-xs font-bold" : "text-slate-500"
                  }`}
                >
                  Poll
                </button>
              </div>
            </div>

            {/* Modal Body / Tab Contents */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
              {/* Main Thought Input */}
              <div className="relative">
                <textarea
                  rows={activeTab === "thought" ? 4 : 2}
                  placeholder="Share a thought, insight, or story..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full p-3 rounded-2xl resize-none text-sm placeholder-slate-400 focus:outline-none transition ${
                    selectedGradient !== "none"
                      ? `${COLOR_BACKGROUNDS.find((b) => b.id === selectedGradient)?.class} rounded-2xl`
                      : "bg-slate-50/80 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 focus:border-indigo-500"
                  }`}
                />
              </div>

              {/* TAB: VOICE SPARK (Audio Note Recorder) */}
              {activeTab === "audio" && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          Voice Spark Studio
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Record an authentic voice reflection for your circle
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-500">
                      0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                    </span>
                  </div>

                  {/* Waveform Visualization Preview */}
                  <div className="h-10 bg-white/60 dark:bg-slate-900/60 rounded-xl flex items-center justify-center gap-1 px-4">
                    {[16, 28, 45, 60, 30, 80, 50, 40, 75, 90, 60, 35, 20, 50, 70, 45, 30].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isRecording ? "bg-rose-500 animate-pulse" : hasRecordedAudio ? "bg-rose-400" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                        style={{ height: isRecording ? `${Math.max(8, (h * Math.random()).toFixed(0))}px` : `${h / 3}px` }}
                      ></span>
                    ))}
                  </div>

                  {/* Voice Controls */}
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Title this voice note (e.g. Thoughts on UX)..."
                      value={recordedAudioTitle}
                      onChange={(e) => setRecordedAudioTitle(e.target.value)}
                      className="text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 flex-1 mr-2"
                    />

                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={handleStartRecord}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{hasRecordedAudio ? "Re-record" : "Record"}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopRecord}
                        className="px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Done</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: CODE BLOCK SNIPPET */}
              {activeTab === "code" && (
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <input
                        type="text"
                        placeholder="filename.ts"
                        value={codeFilename}
                        onChange={(e) => setCodeFilename(e.target.value)}
                        className="text-xs bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-slate-300 font-mono w-28"
                      />
                    </div>

                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className="text-xs bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-cyan-400 font-mono focus:outline-none"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="rust">Rust</option>
                      <option value="css">CSS</option>
                      <option value="html">HTML</option>
                    </select>
                  </div>

                  <textarea
                    rows={5}
                    placeholder={`// Paste or write your ${codeLanguage} code here...`}
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="w-full bg-slate-900/80 p-2.5 rounded-xl font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed border border-slate-800/80"
                  />
                </div>
              )}

              {/* TAB: VIBE POLL */}
              {activeTab === "poll" && (
                <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 dark:text-cyan-400">
                    <BarChart2 className="w-4 h-4" />
                    <span>Create Community Poll</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Poll Question (e.g. Favorite new design trend?)..."
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
                  />

                  <div className="space-y-1.5">
                    {pollOptions.map((opt, i) => (
                      <input
                        key={opt.id}
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...pollOptions];
                          updated[i].text = e.target.value;
                          setPollOptions(updated);
                        }}
                        className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    ))}
                  </div>

                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPollOptions([...pollOptions, { id: `opt-${pollOptions.length + 1}`, text: "" }])
                      }
                      className="text-[11px] font-bold text-indigo-500 hover:underline"
                    >
                      + Add another option
                    </button>
                  )}
                </div>
              )}

              {/* Attached Media Preview */}
              {selectedImage && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={selectedImage} alt="Attachment" className="w-full max-h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Preset Image Picker Tray */}
              {showImagePicker && !selectedImage && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Preset High-Res Visuals</p>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {SAMPLE_PHOTO_PRESETS.map((p, i) => (
                      <img
                        key={i}
                        src={p.url}
                        alt={p.name}
                        onClick={() => {
                          setSelectedImage(p.url);
                          setShowImagePicker(false);
                        }}
                        className="h-16 w-full object-cover rounded-xl cursor-pointer hover:opacity-80 transition"
                      />
                    ))}
                  </div>
                  <label className="block text-center text-xs text-indigo-500 font-bold cursor-pointer py-1 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-indigo-400">
                    Upload from your device
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>
                </div>
              )}

              {/* Color Gradient Themes for Thoughts */}
              {activeTab === "thought" && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1">Vibe Aura:</span>
                  {COLOR_BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelectedGradient(bg.id)}
                      className={`w-6 h-6 rounded-full shrink-0 border-2 transition ${
                        bg.id === "none" ? "bg-slate-200 dark:bg-slate-700" : bg.class.split(" ")[0]
                      } ${selectedGradient === bg.id ? "border-indigo-500 scale-110" : "border-transparent"}`}
                      title={bg.name}
                    />
                  ))}
                </div>
              )}

              {/* Modal Footer / Submit Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={
                    !content.trim() && !selectedImage && !hasRecordedAudio && !codeContent.trim() && !pollQuestion.trim()
                  }
                  className="px-6 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold text-xs rounded-full shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
