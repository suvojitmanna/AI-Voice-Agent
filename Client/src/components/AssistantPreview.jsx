import React, { useState } from "react";
import { CiMicrophoneOn } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

const themes = {
  dark: {
    bg: "bg-[#050816]",
    overlay: "bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_45%)]",
    orb: "from-cyan-400 via-purple-500 to-pink-500",
    cardBorder: "border border-white/10",
    text: "text-white",
    sub: "text-white/65",
    listening: "text-emerald-400",
    wave: "bg-emerald-400",
    button: "from-purple-500 to-violet-400",
    micGlow: "shadow-[0_0_50px_rgba(168,85,247,0.4)]",
  },
  light: {
    bg: "bg-gradient-to-br from-white via-[#f8fafc] to-[#f1f5f9]",
    overlay: "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_45%)]",
    orb: "from-blue-300 via-cyan-300 to-pink-300",
    cardBorder: "border border-[#dbeafe]",
    text: "text-[#081028]",
    sub: "text-[#475569]",
    listening: "text-blue-500",
    wave: "bg-blue-500",
    button: "from-blue-400 to-cyan-400",
    micGlow: "shadow-[0_0_50px_rgba(59,130,246,0.3)]",
  },
  glass: {
    bg: "bg-black/30 backdrop-blur-[45px]",
    overlay: "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]",
    orb: "from-cyan-200 via-violet-300 to-fuchsia-300",
    cardBorder: "border border-white/10",
    text: "text-white",
    sub: "text-white/70",
    listening: "text-cyan-200",
    wave: "bg-cyan-200",
    button: "from-cyan-400 to-violet-500",
    micGlow: "shadow-[0_0_50px_rgba(34,211,238,0.3)]",
  },
  neon: {
    bg: "bg-[#03120d]",
    overlay: "bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_45%)]",
    orb: "from-emerald-300 via-green-400 to-cyan-400",
    cardBorder: "border border-emerald-400/20",
    text: "text-emerald-50",
    sub: "text-emerald-100/70",
    listening: "text-emerald-300",
    wave: "bg-emerald-300",
    button: "from-emerald-400 to-green-500",
    micGlow: "shadow-[0_0_50px_rgba(16,185,129,0.4)]",
  },
};

const waveBars = [
  { minHeight: 12, maxHeight: 28, duration: 0.6 },
  { minHeight: 16, maxHeight: 42, duration: 0.4 },
  { minHeight: 8, maxHeight: 24, duration: 0.7 },
  { minHeight: 20, maxHeight: 48, duration: 0.5 },
  { minHeight: 14, maxHeight: 32, duration: 0.6 },
  { minHeight: 8, maxHeight: 20, duration: 0.4 },
];

const AssistantPreview = () => {
  const [theme, setTheme] = useState("dark");
  const [isListening, setIsListening] = useState(true);
  const current = themes[theme];

  return (
    <div className="flex items-center justify-center px-3 sm:px-4 py-10 sm:py-14 select-none">
      <div
        className={`relative w-[290px] h-[480px] sm:w-[330px] sm:h-[520px] md:w-[380px] md:h-[570px] rounded-[38px] sm:rounded-[42px] overflow-hidden transition-all duration-700 ease-in-out ${current.bg} ${current.cardBorder} shadow-[0_20px_80px_rgba(0,0,0,0.3)]`}
      >
        {/* Color Gradient Overlay Background */}
        <div className={`absolute inset-0 transition-all duration-700 ${current.overlay}`} />

        {/* Theme Selectors */}
        <div className="absolute top-5 right-5 z-30 flex items-center gap-2.5 bg-black/10 backdrop-blur-md p-1.5 rounded-full border border-white/5">
          {Object.keys(themes).map((t) => {
            const bgClass =
              t === "dark"
                ? "bg-[#050816]"
                : t === "light"
                ? "bg-white"
                : t === "glass"
                ? "bg-gradient-to-br from-white/20 to-white/40"
                : "bg-gradient-to-br from-emerald-400 to-green-500";
            
            const activeBorder =
              t === "dark"
                ? "border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                : t === "light"
                ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                : t === "glass"
                ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                : "border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.6)]";

            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-4 h-4 rounded-full border transition-all duration-300 hover:scale-110 cursor-pointer ${bgClass} ${
                  theme === t ? `${activeBorder} scale-110` : "border-white/20"
                }`}
              />
            );
          })}
        </div>

        {/* Main Interface Content */}
        <div className="relative z-20 flex flex-col items-center justify-between h-full px-5 py-8 sm:px-7 sm:py-10">
          
          {/* Top Interactive Fluid Floating Orb */}
          <div className="relative mt-4 flex items-center justify-center w-full">
            <motion.div
              animate={isListening ? {
                scale: [1, 1.15, 0.95, 1.05, 1],
                rotate: [0, 90, 180, 270, 360],
              } : { scale: 1, rotate: 0 }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-[40px] bg-gradient-to-r ${current.orb} opacity-40`}
            />
            <motion.div
              animate={isListening ? {
                borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "70% 30% 52% 48% / 60% 40% 60% 40%", "42% 58% 70% 30% / 45% 45% 55% 55%"],
                rotate: 360
              } : {}}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "linear"
              }}
              className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${current.orb} shadow-[0_0_50px_rgba(255,255,255,0.1)] before:absolute before:inset-0 before:rounded-full before:bg-white/10 before:blur-md mt-3 md:mt-1`}
            />
          </div>

          {/* Texts & Active Sound Wave Animations */}
          <div className="text-center w-full flex flex-col items-center flex-grow justify-center my-4">
            <h2 className={`text-[22px] sm:text-[25px] md:text-[28px] font-bold tracking-tight transition-colors duration-500 ${current.text}`}>
              Hello! I'm Shifra AI
            </h2>
            <p className={`text-sm sm:text-base mt-1.5 font-normal max-w-[240px] mx-auto opacity-90 transition-colors duration-500 ${current.sub}`}>
              Your smart voice assistant. <br /> Ask anything about your website.
            </p>

            {/* Simulated Live Audio Spectrum Dynamic Waves */}
            <div className="h-20 mt-6 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {isListening ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex flex-col items-center"
                  >
                    <p className={`text-xs sm:text-sm font-semibold uppercase tracking-widest ${current.listening}`}>
                      Listening...
                    </p>
                    <div className="flex items-end justify-center gap-1.5 h-12 mt-3.5">
                      {waveBars.map((bar, idx) => (
                        <motion.span
                          key={idx}
                          className={`w-1 rounded-full ${current.wave}`}
                          animate={{
                            height: [bar.minHeight, bar.maxHeight, bar.minHeight],
                          }}
                          transition={{
                            duration: bar.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: idx * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`text-xs sm:text-sm font-medium opacity-50 ${current.text}`}
                  >
                    Tap the mic to talk
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Interactive Microphone Action Button */}
          <div className="relative mb-2 mt-auto">
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute inset-0 rounded-full blur-xl opacity-50 ${current.wave}`}
              />
            )}
            <button
              onClick={() => setIsListening(!isListening)}
              className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${current.button} ${current.micGlow} flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce`}
            >
              <motion.div
                animate={isListening ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <CiMicrophoneOn className="text-black/80" size={28} />
              </motion.div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssistantPreview;