"use client";

import { useState } from "react";
import {
  Video,
  Image as ImageIcon,
  Smile,
  X,
  Globe,
  Users,
  Lock,
  Sparkles,
  Check,
  Palette,
} from "lucide-react";
import { COLOR_BACKGROUNDS, FEELING_PRESETS } from "../data/mockData";

const SAMPLE_PHOTO_PRESETS = [
  { name: "Workspace", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80" },
  { name: "Sunset Beach", url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1000&auto=format&fit=crop&q=80" },
  { name: "Healthy Food", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80" },
  { name: "AI & Tech", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80" },
];

export default function CreatePostBox({
  currentUser,
  onCreatePost,
  isOpen,
  setIsOpen,
}) {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [selectedGradient, setSelectedGradient] = useState("none");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const resetForm = () => {
    setContent("");
    setSelectedFeeling(null);
    setSelectedGradient("none");
    setSelectedImage(null);
    setShowFeelingPicker(false);
    setShowColorPicker(false);
    setShowImagePicker(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) return;

    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: !currentUser.isGuest,
      },
      timestamp: "Just now",
      privacy,
      feeling: selectedFeeling,
      bgGradient: selectedGradient !== "none" ? COLOR_BACKGROUNDS.find((b) => b.id === selectedGradient)?.class : null,
      content: content.trim(),
      media: selectedImage ? [{ type: "image", url: selectedImage, caption: "" }] : [],
      reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
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
      {/* TRIGGER CARD */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/60 p-3.5 mb-4 select-none">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-700/60">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="flex-1 text-left px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] rounded-full text-zinc-500 dark:text-zinc-400 text-sm font-medium transition cursor-pointer"
          >
            What&apos;s on your mind, {currentUser?.name?.split(" ")[0]}?
          </button>
        </div>

        {/* 3 Facebook Action Buttons */}
        <div className="grid grid-cols-3 gap-1 pt-2">
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-zinc-600 dark:text-zinc-300 font-semibold text-xs"
          >
            <Video className="w-5 h-5 text-rose-500" />
            <span>Live video</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(true);
              setShowImagePicker(true);
            }}
            className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-zinc-600 dark:text-zinc-300 font-semibold text-xs"
          >
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <span>Photo/video</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(true);
              setShowFeelingPicker(true);
            }}
            className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] transition text-zinc-600 dark:text-zinc-300 font-semibold text-xs"
          >
            <Smile className="w-5 h-5 text-amber-500" />
            <span>Feeling/activity</span>
          </button>
        </div>
      </div>

      {/* CREATE POST MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700/60 overflow-hidden flex flex-col text-zinc-900 dark:text-[#e4e6eb] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative flex items-center justify-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-700/60">
              <h3 className="font-bold text-base">Create post</h3>
              <button
                onClick={handleClose}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#3a3b3c] hover:bg-zinc-200 dark:hover:bg-[#4e4f50] flex items-center justify-center text-zinc-600 dark:text-zinc-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Author info & Privacy selector */}
            <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm">{currentUser?.name}</p>
                    {selectedFeeling && (
                      <span className="text-xs text-zinc-500 font-normal">
                        is {selectedFeeling.emoji} {selectedFeeling.text}
                      </span>
                    )}
                  </div>

                  {/* Privacy dropdown */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        setPrivacy(privacy === "public" ? "friends" : privacy === "friends" ? "only_me" : "public")
                      }
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 dark:bg-[#3a3b3c] hover:bg-zinc-200 dark:hover:bg-[#4e4f50] rounded-md text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 transition"
                    >
                      {privacy === "public" && <Globe className="w-3 h-3" />}
                      {privacy === "friends" && <Users className="w-3 h-3" />}
                      {privacy === "only_me" && <Lock className="w-3 h-3" />}
                      <span className="capitalize">{privacy === "only_me" ? "Only me" : privacy}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Textarea or Colored Background Box */}
              {selectedGradient === "none" ? (
                <textarea
                  rows={4}
                  placeholder={`What's on your mind, ${currentUser?.name?.split(" ")[0]}?`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-base sm:text-lg bg-transparent placeholder-zinc-400 focus:outline-none resize-none"
                />
              ) : (
                <div
                  className={`rounded-2xl p-6 transition flex items-center justify-center min-h-[180px] ${
                    COLOR_BACKGROUNDS.find((b) => b.id === selectedGradient)?.class
                  }`}
                >
                  <textarea
                    rows={3}
                    placeholder={`What's on your mind?`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent text-center text-white placeholder-white/80 focus:outline-none resize-none font-bold text-xl sm:text-2xl"
                  />
                </div>
              )}

              {/* Photo Attachment Preview */}
              {selectedImage && (
                <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                  <img src={selectedImage} alt="Attachment" className="w-full max-h-72 object-cover" />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Color Gradient Themes Picker */}
              {showColorPicker && (
                <div className="p-3 bg-zinc-50 dark:bg-[#18191a] rounded-xl border border-zinc-200 dark:border-zinc-700/60 animate-in fade-in">
                  <p className="text-xs font-bold text-zinc-500 mb-2">Post Backgrounds</p>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {COLOR_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => {
                          setSelectedGradient(bg.id);
                          if (bg.id !== "none") setSelectedImage(null);
                        }}
                        className={`w-9 h-9 rounded-xl shrink-0 border-2 transition ${
                          bg.id === "none"
                            ? "bg-white dark:bg-zinc-800 border-zinc-300"
                            : bg.id === "bg-sunset"
                            ? "bg-gradient-to-tr from-amber-500 to-rose-500"
                            : bg.id === "bg-ocean"
                            ? "bg-gradient-to-tr from-cyan-500 to-blue-600"
                            : bg.id === "bg-emerald"
                            ? "bg-gradient-to-tr from-emerald-500 to-teal-700"
                            : bg.id === "bg-violet"
                            ? "bg-gradient-to-tr from-purple-600 to-pink-500"
                            : "bg-zinc-900"
                        } ${selectedGradient === bg.id ? "ring-2 ring-[#1877f2] scale-110" : "opacity-80"}`}
                        title={bg.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Image Picker Panel */}
              {showImagePicker && !selectedImage && (
                <div className="p-3 bg-zinc-50 dark:bg-[#18191a] rounded-xl border border-zinc-200 dark:border-zinc-700/60 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-zinc-500">Attach a Photo</p>
                    <label className="cursor-pointer text-xs font-bold text-[#1877f2] hover:underline">
                      Upload from file
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {SAMPLE_PHOTO_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedImage(p.url);
                          setSelectedGradient("none");
                          setShowImagePicker(false);
                        }}
                        className="relative rounded-lg overflow-hidden h-14 group border border-zinc-200 dark:border-zinc-700"
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-bold text-center px-1">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feelings Picker Panel */}
              {showFeelingPicker && (
                <div className="p-3 bg-zinc-50 dark:bg-[#18191a] rounded-xl border border-zinc-200 dark:border-zinc-700/60 animate-in fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-zinc-500">How are you feeling?</p>
                    {selectedFeeling && (
                      <button
                        type="button"
                        onClick={() => setSelectedFeeling(null)}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                    {FEELING_PRESETS.map((f, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedFeeling(f);
                          setShowFeelingPicker(false);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-left transition ${
                          selectedFeeling?.text === f.text
                            ? "bg-[#1877f2]/10 text-[#1877f2] font-bold"
                            : "hover:bg-zinc-200/60 dark:hover:bg-[#3a3b3c]"
                        }`}
                      >
                        <span className="text-base">{f.emoji}</span>
                        <span>{f.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to your post bar */}
              <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                  Add to your post
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(!showImagePicker)}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] rounded-full transition"
                    title="Photo"
                  >
                    <ImageIcon className="w-5 h-5 text-emerald-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] rounded-full transition"
                    title="Post Background"
                  >
                    <Palette className="w-5 h-5 text-purple-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFeelingPicker(!showFeelingPicker)}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-[#3a3b3c] rounded-full transition"
                    title="Feeling/activity"
                  >
                    <Smile className="w-5 h-5 text-amber-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-700/60">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() && !selectedImage}
                className="w-full py-2.5 bg-[#1877f2] hover:bg-[#166fe5] disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition transform active:scale-[0.98] text-sm"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
