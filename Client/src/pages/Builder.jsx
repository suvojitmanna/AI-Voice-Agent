import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiSliders,
  FiCpu,
  FiLoader,
  FiCopy,
  FiCheck,
  FiEdit2,
} from "react-icons/fi";
import { ClientUrl, ServerUrl } from "../App";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const THEMES = ["light", "dark", "glass", "neon"];
const TONES = ["friendly", "professional", "sales"];
const premiumEasing = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ease: premiumEasing, duration: 0.7 },
  },
};

const pageItemVariants = {
  hidden: { opacity: 0, x: -15, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { ease: premiumEasing, duration: 0.4 },
  },
  exit: { opacity: 0, x: 15, scale: 0.95, transition: { duration: 0.25 } },
};

const Builder = ({ user, setUser }) => {
  const [editAssistant, setEditAssistant] = useState(!user?.isSetupComplete);
  const [assistantName, setAssistantName] = useState(user?.assistantName || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [businessType, setBusinessType] = useState(user?.businessType || "");
  const [businessDescription, setBusinessDescription] = useState(
    user?.businessDescription || "",
  );
  const [theme, setTheme] = useState(user?.theme || "dark");
  const [tones, setTones] = useState(user?.tones || "friendly");
  const [geminiApiKey, setGeminiApiKey] = useState(user?.geminiApiKey || "");
  const [pages, setPages] = useState(user?.pages || []);
  const [pageName, setPageName] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [pageKeyWords, setPageKeyWords] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [assistantLoading, setAssistantLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPageFormIncomplete = !pageName.trim() || !pagePath.trim();
  const isMainFormIncomplete =
    !assistantName.trim() || !businessName.trim() || !geminiApiKey.trim();
  const isSaveDisabled = isMainFormIncomplete || loading;

  const addPage = () => {
    if (isPageFormIncomplete) {
      toast.error("Please fill out both the Page Name and Page Path");
      return;
    }

    const newPage = {
      name: pageName.trim(),
      path: pagePath.trim(),
      keyword: pageKeyWords ? pageKeyWords.split(",").map((k) => k.trim()) : [],
    };

    setPages([...pages, newPage]);
    setPageName("");
    setPagePath("");
    setPageKeyWords("");
  };

  const removePages = (index) => {
    setPages(pages.filter((_, i) => i !== index));
  };

  const saveAssistant = async () => {
    setLoading(true);

    try {
      const data = {
        assistantName,
        businessName,
        businessType,
        businessDescription,
        tone: tones,
        theme,
        geminiApiKey,
        pages,
      };

      const res = await axios.post(
        `${ServerUrl}/api/user/save-assistant`,
        data,
        { withCredentials: true },
      );
      setLoading(false);
      setEditAssistant(false);
      setAssistantLoading(true);
      setEditAssistant(false);

      setTimeout(() => {
        setUser(res.data.user);
        setAssistantLoading(false);
        toast.success("Assistant Saved Successfully");
      }, 1200);
    } catch (error) {
      setLoading(false);

      toast.error(error.response?.data?.message || "Failed to save assistant");

      console.error(error);
    }
  };

  const remainingMessages = Math.max(
    0,
    (user?.requestLimit || 0) - (user?.totalMessages || 0),
  );

  const remainingDays = user?.proExpiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(user.proExpiresAt) - new Date()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const embedCode = `<script src="${ClientUrl}/assistant.js" data-user-id="${user?._id}"></script>`;

  const AssistantSkeleton = () => {
    return (
      <div className="animate-pulse bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 mb-6">
        {/* Small top label */}
        <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded-md" />

        {/* Assistant Name Title */}
        <div className="h-8 w-48 bg-gray-300 dark:bg-slate-600 rounded-lg mt-2" />

        {/* Subtext description */}
        <div className="h-4 w-64 bg-gray-200 dark:bg-slate-700 rounded-md mt-4" />

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#f8fafc] dark:bg-[#1e293b] p-4 border border-transparent dark:border-slate-800"
            >
              <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded-md" />
              <div className="h-6 w-24 bg-gray-300 dark:bg-slate-600 rounded-md mt-2" />
            </div>
          ))}
        </div>

        {/* Script Instructions Callout */}
        <div className="mt-7">
          <div className="mt-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 p-4">
            <div className="h-4 w-40 bg-amber-200/60 dark:bg-amber-800/40 rounded-md" />
            <div className="h-3 w-full bg-amber-200/40 dark:bg-amber-900/20 rounded-md mt-3" />
            <div className="h-3 w-3/4 bg-amber-200/40 dark:bg-amber-900/20 rounded-md mt-2" />
          </div>

          {/* Mock Pre/Code Block */}
          <div className="mt-3 h-24 bg-[#0b1020]/40 rounded-xl p-4 flex flex-col gap-2 justify-center">
            <div className="h-3 w-1/4 bg-slate-700 rounded-md" />
            <div className="h-3 w-1/2 bg-slate-700 rounded-md" />
            <div className="h-3 w-2/3 bg-slate-700 rounded-md" />
          </div>
        </div>

        {/* Embed Code Section Label */}
        <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded-md mb-3 mt-5" />

        {/* Mock Textarea block */}
        <div className="w-full h-20 bg-[#0b1020]/40 rounded-2xl p-4" />

        {/* Mock Edit Button */}
        <div className="mt-6 h-12 w-36 rounded-2xl bg-gray-200 dark:bg-slate-700" />
      </div>
    );
  };

  useEffect(() => {
    setPageLoading(true);

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1200); // 1.2 second skeleton

    return () => clearTimeout(timer);
  }, [editAssistant]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssistantLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f5fa] dark:bg-gray-950 px-4 py-12 transition-colors duration-500 selection:bg-purple-500/30">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header section */}
        <motion.div variants={cardVariants} className="flex flex-col gap-1">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Assistant Builder
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Configure your fluid virtual intelligence asset.
          </p>
        </motion.div>

        {assistantLoading ? (
          <AssistantSkeleton />
        ) : (
          user?.isSetupComplete &&
          !editAssistant && (
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 mb-6 transition-colors duration-200">
              <p className="text-sm text-gray-400 dark:text-slate-500">
                Assistant
              </p>

              <h2 className="text-3xl font-bold text-[#081028] dark:text-slate-100 mt-1">
                {user.assistantName}
              </h2>
              <p className="text-gray-500 dark:text-slate-400 mt-3 leading-7">
                Your assistant is ready to use on your website.
              </p>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="rounded-2xl border-gray-100 bg-[#f8fafc] dark:bg-[#1e293b] p-4">
                  <p className="text-sm text-gray-400 dark:text-slate-400">
                    Current Plan
                  </p>
                  <h2 className="text-xl font-bold text-[#081028] dark:text-slate-100 mt-1 capitalize">
                    {user?.plan}
                  </h2>
                </div>
                <div className="rounded-2xl border-gray-100 bg-[#f8fafc] dark:bg-[#1e293b] p-4">
                  <p className="text-sm text-gray-400 dark:text-slate-400">
                    Gemini Status
                  </p>
                  <h2
                    className={`text-xl font-bold mt-1 capitalize ${
                      user?.geminiStatus === "Active"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : user?.geminiStatus === "Invalid"
                          ? "text-red-500 dark:text-red-400"
                          : "text-amber-500 dark:text-amber-400"
                    }`}
                  >
                    {user?.geminiStatus}
                  </h2>
                </div>
                <div className="rounded-2xl border-gray-100 bg-[#f8fafc] dark:bg-[#1e293b] p-4">
                  <p className="text-sm text-gray-400 dark:text-slate-400">
                    {user?.plan === "Free" ? "Messages Left" : "Plan Expiry"}
                  </p>
                  <h2 className="text-xl font-bold text-[#081028] dark:text-slate-100 mt-1 capitalize">
                    {user?.plan === "Free"
                      ? remainingMessages
                      : `${remainingDays} Days`}
                  </h2>
                </div>
              </div>

              {/* Script Instructions */}
              <div className="mt-7">
                <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-400">
                    Where to paste this script?
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-500 mt-2 leading-6">
                    Paste this script before the closing{" "}
                    <span className="font-semibold">{"</body>"}</span> tag of
                    your website HTML file. <br /> <br />
                    Example:
                  </p>
                </div>

                <pre className="mt-3 bg-[#0b1020] text-emerald-400 rounded-xl p-3 text-xs font-mono overflow-x-auto">
                  {`<body>
        
  Your Website Content

  <script src="${ClientUrl}/assistant.js" data-user-id="${user?._id}"></script>

</body>`}
                </pre>
              </div>

              {/* Embed Code Section */}
              <p className="text-sm font-media text-[#081028] dark:text-slate-200 mb-3 mt-3 font-semibold">
                Embed Code
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  value={embedCode}
                  className="w-full h-20 bg-[#0b1020] text-emerald-400 rounded-2xl p-4 text-sm font-mono resize-none outline-none border border-transparent dark:border-slate-800"
                />

                {/* Animated Copy Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode);
                    toast.success("Copied");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  disabled={copied}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center cursor-pointer border border-gray-100 dark:border-slate-700"
                >
                  {copied ? (
                    <FiCheck className="text-emerald-500 w-5 h-5" />
                  ) : (
                    <FiCopy className="text-slate-600 dark:text-slate-300 w-4 h-4" />
                  )}
                </motion.button>
              </div>

              {/* Animated Edit Assistant Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditLoading(true);

                  setTimeout(() => {
                    setEditAssistant(true);
                    setEditLoading(false);
                  }, 1200);
                }}
                className="mt-6 h-12 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-medium cursor-pointer flex items-center gap-2 shadow-md shadow-purple-500/10"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit Assistant
              </motion.button>
            </div>
          )
        )}

        {editAssistant && (
          <div className="space-y-6">
            {pageLoading ? (
              <>
                {/* Basic Info Skeleton */}
                <div className="animate-pulse bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/60 p-8">
                  <div className="h-5 w-36 bg-gray-200 dark:bg-slate-700 rounded-md mb-6" />
                  <div className="space-y-4">
                    <div className="h-[50px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl w-full" />
                    <div className="h-[50px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl w-full" />
                    <div className="h-[50px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl w-full" />
                    <div className="h-[114px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl w-full" />
                  </div>
                </div>

                {/* Appearance Skeleton */}
                <div className="animate-pulse bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/60 p-8">
                  <div className="h-5 w-44 bg-gray-200 dark:bg-slate-700 rounded-md mb-6" />
                  <div className="h-4 w-28 bg-gray-200 dark:bg-slate-800/80 rounded-md mb-3" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-[52px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl"
                      />
                    ))}
                  </div>
                  <div className="h-4 w-44 bg-gray-200 dark:bg-slate-800/80 rounded-md mb-3 mt-8" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-[52px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl"
                      />
                    ))}
                  </div>
                </div>

                {/* API Key Skeleton */}
                <div className="animate-pulse bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/60 p-8">
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <div className="space-y-2">
                      <div className="h-5 w-48 bg-gray-200 dark:bg-slate-700 rounded-md" />
                      <div className="h-4 w-64 bg-gray-200 dark:bg-slate-800/80 rounded-md" />
                    </div>
                    <div className="h-[46px] w-32 bg-gray-300 dark:bg-slate-600 rounded-2xl" />
                  </div>
                  <div className="h-[50px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl w-full" />
                  <div className="h-4 w-3/4 bg-gray-200/40 dark:bg-slate-800/30 rounded-md mt-3" />
                </div>

                {/* Dynamic Route Skeleton */}
                <div className="animate-pulse bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/60 p-8">
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <div className="space-y-2">
                      <div className="h-5 w-48 bg-gray-200 dark:bg-slate-700 rounded-md" />
                      <div className="h-4 w-64 bg-gray-200 dark:bg-slate-800/80 rounded-md" />
                    </div>
                    <div className="h-[46px] w-32 bg-gray-300 dark:bg-slate-600 rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="h-[46px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl" />
                    <div className="h-[46px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl" />
                    <div className="h-[46px] bg-gray-200/60 dark:bg-slate-800/50 rounded-2xl" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Basic Info */}
                <motion.div
                  variants={cardVariants}
                  className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/60 shadow-xl shadow-gray-100/40 dark:shadow-none p-8 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold mb-6 tracking-wide text-gray-800 dark:text-gray-200">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        val: assistantName,
                        set: setAssistantName,
                        ph: "Assistant Name",
                      },
                      {
                        val: businessName,
                        set: setBusinessName,
                        ph: "Business Name",
                      },
                      {
                        val: businessType,
                        set: setBusinessType,
                        ph: "Business Type",
                      },
                    ].map((input, idx) => (
                      <div key={idx} className="relative group">
                        <input
                          type="text"
                          onChange={(e) => input.set(e.target.value)}
                          value={input.val}
                          placeholder={input.ph}
                          className="w-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 dark:text-gray-100 rounded-2xl px-5 py-3.5 outline-none focus:border-purple-500/80 dark:focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 dark:placeholder-gray-500 font-medium transition-all duration-300"
                        />
                      </div>
                    ))}
                    <textarea
                      rows={4}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      value={businessDescription}
                      placeholder="Business Description"
                      className="w-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 dark:text-gray-100 rounded-2xl px-5 py-3.5 outline-none focus:border-purple-500/80 dark:focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 resize-none placeholder-gray-400 dark:placeholder-gray-500 font-medium transition-all duration-300"
                    />
                  </div>
                </motion.div>

                {/* Appearance */}
                <motion.div
                  variants={cardVariants}
                  className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/60 shadow-xl shadow-gray-100/40 dark:shadow-none p-8 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold mb-6 tracking-wide text-gray-800 dark:text-gray-200">
                    Appearance & Character
                  </h3>

                  <div>
                    <label className="text-sm font-semibold tracking-wider text-gray-400 dark:text-gray-500 mb-3 block uppercase">
                      Theme Profile
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {THEMES.map((item) => {
                        const isActive =
                          theme?.toLowerCase() === item?.toLowerCase();
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setTheme(item)}
                            className={`py-3.5 px-4 rounded-2xl border-2 capitalize font-semibold tracking-wide transition-all duration-300 text-center cursor-pointer relative overflow-hidden ${
                              isActive
                                ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 shadow-md shadow-purple-500/5"
                                : "border-gray-100 dark:border-gray-800/80 text-gray-500 dark:text-gray-400 hover:border-gray-300/80 dark:hover:border-gray-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                            }`}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="activeThemeGlow"
                                className="absolute inset-0 bg-purple-500/5 dark:bg-purple-500/10 mix-blend-overlay"
                              />
                            )}
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8">
                    <label className="text-sm font-semibold tracking-wider text-gray-400 dark:text-gray-500 mb-3 block uppercase">
                      Assistant Tone Archetype
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TONES.map((item) => {
                        const isActive =
                          tones?.toLowerCase() === item?.toLowerCase();
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setTones(item)}
                            className={`py-3.5 px-4 rounded-2xl border-2 capitalize font-semibold tracking-wide transition-all duration-300 text-center cursor-pointer relative overflow-hidden ${
                              isActive
                                ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 shadow-md shadow-emerald-500/5"
                                : "border-gray-100 dark:border-gray-800/80 text-gray-500 dark:text-gray-400 hover:border-gray-300/80 dark:hover:border-gray-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                            }`}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="activeToneGlow"
                                className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 mix-blend-overlay"
                              />
                            )}
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* API Key */}
                <motion.div
                  variants={cardVariants}
                  className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/60 shadow-xl shadow-gray-100/40 dark:shadow-none p-8 transition-colors duration-300"
                >
                  <div className="flex items-start mb-6 gap-4 flex-wrap justify-between">
                    <div>
                      <h3 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-200">
                        Gemini Core Configuration
                      </h3>
                      <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-0.5">
                        Supply your standard project endpoint secret.
                      </p>
                    </div>
                    <motion.a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{
                        scale: 1.04,
                        y: -3,
                        boxShadow:
                          "0 20px 45px rgba(139,92,246,.35),0 8px 20px rgba(16,185,129,.25)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500 text-white font-semibold cursor-pointer shadow-lg"
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/30 to-emerald-500/30 blur-xl"
                        animate={{
                          opacity: [0.35, 0.75, 0.35],
                          scale: [0.96, 1.05, 0.96],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      <motion.div
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ["-120%", "180%"],
                        }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1.2,
                        }}
                      />

                      <motion.div
                        className="relative z-10"
                        whileHover={{
                          rotate: 20,
                          scale: 1.15,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 12,
                        }}
                      >
                        <FiSliders size={17} />
                      </motion.div>

                      <motion.span
                        className="relative z-10"
                        whileHover={{
                          letterSpacing: "0.4px",
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        Get API Key
                      </motion.span>

                      <div className="absolute inset-0 rounded-2xl border border-white/15 group-hover:border-white/30 transition-all duration-300" />
                    </motion.a>
                  </div>
                  <input
                    type="password"
                    placeholder="Gemini API Key"
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    value={geminiApiKey}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 dark:text-gray-100 rounded-2xl px-5 py-3.5 outline-none focus:border-purple-500/80 dark:focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 dark:placeholder-gray-500 font-mono tracking-widest transition-all duration-300"
                  />
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-2.5 leading-5 opacity-80">
                    Encrypted at rest securely. Only referenced server-side
                    during generation context routines.
                  </p>
                </motion.div>

                {/* Navigation Pages */}
                <motion.div
                  variants={cardVariants}
                  className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/60 shadow-xl shadow-gray-100/40 dark:shadow-none p-8 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-200">
                        Structural Route Mapping
                      </h3>
                      <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-0.5">
                        Train your model to dynamically route clients.
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      onClick={addPage}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{
                        scale: 1.04,
                        y: -2,
                        boxShadow:
                          "0px 20px 40px rgba(139,92,246,0.35), 0px 8px 20px rgba(16,185,129,0.25)",
                        transition: {
                          type: "spring",
                          stiffness: 350,
                          damping: 18,
                        },
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                      className="group relative overflow-hidden flex items-center gap-2 px-5 py-3 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500 text-white font-medium shadow-lg cursor-pointer"
                    >
                      <motion.div
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ["-120%", "180%"],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1,
                        }}
                      />

                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/30 to-emerald-500/30 blur-xl"
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                          scale: [0.95, 1.05, 0.95],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      <motion.div
                        className="relative z-10"
                        whileHover={{
                          rotate: 90,
                          scale: 1.2,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                        }}
                      >
                        <FiPlus size={18} />
                      </motion.div>

                      <motion.span
                        className="relative z-10"
                        whileHover={{
                          letterSpacing: "0.5px",
                        }}
                      >
                        Add Route
                      </motion.span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      onChange={(e) => setPageName(e.target.value)}
                      value={pageName}
                      placeholder="Route Label (e.g. Pricing)"
                      className="border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 dark:text-gray-100 rounded-2xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none placeholder-gray-400 dark:placeholder-gray-500 font-medium transition-all duration-300"
                    />
                    <input
                      type="text"
                      onChange={(e) => setPagePath(e.target.value)}
                      value={pagePath}
                      placeholder="Path Syntax (e.g. /pricing)"
                      className="border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 dark:text-gray-100 rounded-2xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none placeholder-gray-400 dark:placeholder-gray-500 font-mono transition-all duration-300"
                    />
                    <input
                      type="text"
                      onChange={(e) => setPageKeyWords(e.target.value)}
                      value={pageKeyWords}
                      placeholder="Triggers (comma separated)"
                      className="border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 dark:text-gray-100 rounded-2xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none placeholder-gray-400 dark:placeholder-gray-500 font-medium transition-all duration-300"
                    />
                  </div>

                  <motion.div layout className="mt-6 space-y-2.5">
                    <AnimatePresence initial={false}>
                      {pages.map((page, index) => (
                        <motion.div
                          variants={pageItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="flex items-center justify-between border border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-950/20 rounded-2xl p-4 transition-all"
                          key={page.path + index}
                        >
                          <div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize tracking-wide text-sm">
                              {page.name}
                            </span>
                            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md ml-3">
                              {page.path}
                            </span>
                            {page.keyword?.length > 0 && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
                                Keywords:{" "}
                                <span className="font-mono text-gray-500 dark:text-gray-400">
                                  {page.keyword.join(", ")}
                                </span>
                              </p>
                            )}
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => removePages(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                          >
                            <FiTrash2 size={16} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </>
            )}

            {/* Save Button */}
            <motion.button
              variants={cardVariants}
              type="button"
              onClick={saveAssistant}
              disabled={isSaveDisabled}
              whileHover={!isSaveDisabled ? { scale: 1.01 } : {}}
              whileTap={!isSaveDisabled ? { scale: 0.99 } : {}}
              className={`flex items-center justify-center gap-2.5 w-full h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-semibold shadow-md ${
                isSaveDisabled
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed select-none shadow-none opacity-50"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/10 cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                    className="flex items-center"
                  >
                    <FiLoader size={18} />
                  </motion.span>
                  <span>Synchronizing Node Matrix...</span>
                </>
              ) : (
                <>
                  {!user?.isSetupComplete && (
                    <motion.span
                      animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5,
                        ease: "easeInOut",
                      }}
                      className="flex items-center"
                    >
                      <FiCpu size={18} />
                    </motion.span>
                  )}
                  <span>
                    {user?.isSetupComplete
                      ? "Update Runtime Assistant"
                      : "Initialize Agent Architecture"}
                  </span>
                </>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Builder;
