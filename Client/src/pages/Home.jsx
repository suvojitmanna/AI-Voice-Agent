import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AssistantPreview from "../components/AssistantPreview";
import { GoArrowRight } from "react-icons/go";
import Footer from "../components/Footer";

const premiumEasing = [0.16, 1, 0.3, 1];

const Skeleton = ({ className }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl ${className}`}
    style={{
      backgroundImage:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
      backgroundSize: "200% 100%",
    }}
  />
);

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

  const refreshItemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.96, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: premiumEasing },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: premiumEasing },
    },
  };

  const scrollRevealVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.96, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1, ease: premiumEasing },
    },
  };

  const primaryButtonHover = {
    scale: 1.03,
    y: -2,
    boxShadow:
      "0 20px 35px -5px rgba(168,85,247,.35),0 12px 16px -6px rgba(16,185,129,.25)",
    transition: { ease: premiumEasing, duration: 0.3 },
  };

  const STEPS = [
    {
      step: "01",
      title: "Sign up free",
      desc: "Continue with Google and create your assistant instantly.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      step: "02",
      title: "Customize assistant",
      desc: "Set your business name, tone, voice and theme.",
      color: "from-indigo-500 to-pink-500",
    },
    {
      step: "03",
      title: "Train your assistant",
      desc: "Add business details and personalized responses.",
      color: "from-pink-500 to-emerald-500",
    },
    {
      step: "04",
      title: "Embed anywhere",
      desc: "Copy one script tag and add it to your website.",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 120, scale: 0.9, filter: "blur(20px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 overflow-hidden transition-colors duration-500 relative"
    >
      <div
        className="pointer-events-none fixed inset-0 z-30 opacity-30 dark:opacity-20 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168,85,247,0.08), transparent 80%)`,
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-20 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-emerald-50 dark:from-purple-950/10 dark:via-gray-950 dark:to-emerald-950/10 transition-colors duration-300" />

        <motion.div
          animate={{
            scale: [1, 1.1, 0.95, 1],
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-[320px] h-[320px] bg-purple-200/40 dark:bg-purple-900/10 blur-3xl rounded-full pointer-events-none transition-colors duration-300"
        />
        <motion.div
          animate={{
            scale: [1, 0.9, 1.15, 1],
            x: [0, -40, 30, 0],
            y: [0, 20, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-1/4 w-[320px] h-[320px] bg-emerald-200/40 dark:bg-emerald-900/10 blur-3xl rounded-full pointer-events-none transition-colors duration-300"
        />

        <div className="relative max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-9 w-48 rounded-full" />
              <Skeleton className="h-16 sm:h-24 w-full max-w-4xl mt-10 rounded-2xl" />
              <Skeleton className="h-6 w-full max-w-2xl mt-7" />
              <Skeleton className="h-14 w-56 mt-10 rounded-2xl" />
              <Skeleton className="h-72 w-full max-w-4xl mt-14 rounded-[32px]" />
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center">
                <motion.span
                  variants={badgeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                  className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-purple-100 dark:border-gray-800 shadow-sm text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-md transition-colors duration-300"
                >
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Voice AI for modern website
                </motion.span>
              </div>

              <div className="mt-10 sm:mt-12">
                <motion.h1
                  variants={refreshItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                  className="max-w-5xl mx-auto text-[42px] leading-[52px] sm:text-6xl sm:leading-[72px] lg:text-7xl lg:leading-[88px] font-black tracking-[-0.04em] text-[#081028] dark:text-gray-100 transition-colors duration-300"
                >
                  Add a{" "}
                  <span className="inline-block px-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500 dark:from-purple-400 dark:to-emerald-400">
                      Virtual Assistant
                    </span>
                  </span>
                  <br className="hidden sm:block" />
                  to your website
                </motion.h1>

                <motion.p
                  variants={refreshItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                  className="max-w-2xl mx-auto mt-7 text-sm sm:text-lg lg:text-xl text-[#64748b] dark:text-gray-400 leading-relaxed px-2 transition-colors duration-300"
                >
                  Create a smart voice-enabled assistant that talks to visitors,
                  answers questions and helps users navigate your website
                  instantly.
                </motion.p>

                <motion.div
                  variants={refreshItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                >
                  <motion.button
                    whileHover={primaryButtonHover}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/builder")}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-semibold text-sm sm:text-base shadow-lg cursor-pointer border-none"
                  >
                    Build Your Assistant
                  </motion.button>
                </motion.div>

                <motion.p
                  variants={refreshItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                  className="mt-5 text-xs sm:text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <motion.span
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative flex h-2 w-2"
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </motion.span>

                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Free plan includes{" "}
                    <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                      200 AI responses
                    </span>
                  </motion.span>
                </motion.p>

                <motion.div
                  variants={scrollRevealVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileOutOfView="hidden"
                  viewport={{ once: false, amount: 0.5 }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.35 } }}
                  className="mt-4"
                >
                  <AssistantPreview />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative py-16 overflow-hidden z-10">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full blur-[180px] bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-emerald-400/15 pointer-events-none"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.05),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Heading Section */}
          <div className="text-center mb-12">
            <span className="inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-5 py-2 text-purple-500 font-semibold text-sm backdrop-blur-xl">
              HOW IT WORKS
            </span>

            <h2 className="mt-8 text-6xl font-black tracking-tight text-[#081028] dark:text-gray-100">
              Get started in{" "}
              <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
                minutes
              </span>
            </h2>

            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              Experience an effortless setup with beautiful onboarding,
              intelligent automation and zero configuration.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 relative">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[34px] p-8 border border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,.08)] h-[320px] flex flex-col justify-between"
                  >
                    <div>
                      <Skeleton className="w-16 h-16 rounded-2xl" />
                      <Skeleton className="h-6 w-3/4 mt-8" />
                      <Skeleton className="h-4 w-full mt-4" />
                      <Skeleton className="h-4 w-5/6 mt-2" />
                    </div>
                    <Skeleton className="h-4 w-1/3 mt-10" />
                  </div>
                ))
              : STEPS.map((item, index) => (
                  <motion.div
                    key={item.step}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={{ y: -15, scale: 1.03 }}
                    className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,.08)]"
                  >
                    <AnimatePresence>
                      {hoveredCard === index && (
                        <motion.div
                          layoutId="activeGlow"
                          className={`absolute inset-0 opacity-100 bg-gradient-to-br ${item.color}/10 z-0 pointer-events-none`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        />
                      )}
                    </AnimatePresence>

                    <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-purple-500/20 blur-3xl group-hover:scale-150 transition duration-700 pointer-events-none" />

                    <div className="relative p-8 z-10 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: false }}
                            transition={{
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 140,
                              damping: 14,
                            }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-emerald-500 text-white font-black text-2xl flex items-center justify-center shadow-lg"
                          >
                            {item.step}
                          </motion.div>
                          <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-purple-500 transition animate-pulse" />
                        </div>

                        <h3 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                          {item.title}
                        </h3>
                        <p className="mt-4 leading-7 text-gray-500 dark:text-gray-400">
                          {item.desc}
                        </p>
                      </div>

                      <div className="mt-10 flex items-center gap-2 text-purple-500 dark:text-purple-400 font-semibold cursor-pointer">
                        Learn More
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="inline-block text-purple-500"
                        >
                          <GoArrowRight className="w-5 h-5 mt-1" />
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
