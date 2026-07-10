import React, { useState, useEffect } from "react";
import {
  HiOutlineMicrophone,
  HiOutlineSparkles,
  HiOutlineCodeBracket,
  HiOutlineBolt,
  HiArrowRight,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { CgSpinner } from "react-icons/cg";
import logo from "../../public/logo2.png";
import axiosInstance from "../utils/axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsCreating(true);

        const { data } = await axiosInstance.post("/auth/google", {
          token: tokenResponse.access_token,
        });
        console.log(data);
        toast.success(data.message);
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Login Failed");
      } finally {
        setIsCreating(false);
      }
    },
    onError: () => {
      toast.error("Google Login Failed");
    },
  });

  const features = [
    {
      icon: <HiOutlineMicrophone />,
      title: "Voice AI",
      desc: "Natural, ultra-low latency real-time voice conversations.",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <HiOutlineSparkles />,
      title: "Smart Navigation",
      desc: "Instant page mapping and routing driven by user voice.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <HiOutlineCodeBracket />,
      title: "Zero-Config Embed",
      desc: "Deploy your custom assistant with a single line of script.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <HiOutlineBolt />,
      title: "Gemini Core",
      desc: "Powered by optimized models for lightning-fast precision.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex items-center justify-center overflow-hidden font-sans selection:bg-purple-500/30 transition-colors duration-500">
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-none hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {darkMode ? (
            <HiOutlineSun className="text-xl text-amber-400" />
          ) : (
            <HiOutlineMoon className="text-xl text-indigo-600" />
          )}
        </button>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-400/10 dark:bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/10 dark:bg-emerald-900/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* left */}
        <div className="lg:col-span-7 space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 backdrop-blur-md text-purple-600 dark:text-purple-300 text-xs font-semibold tracking-wide uppercase">
            <HiOutlineSparkles className="text-purple-500 dark:text-purple-400 text-sm animate-pulse" />
            Next-Gen AI Interface
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Build AI Voice
            <span className="block mt-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 dark:from-purple-400 dark:via-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">
              For Any Website.
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            Create completely custom AI voice assistants that talk naturally,
            guide users, and seamlessly embed anywhere in seconds.
          </p>

          <div className="pt-2 space-y-4">
            <button
              onClick={googleLogin}
              disabled={isCreating}
              className="group relative w-full sm:w-auto flex items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-500 px-8 py-4 text-base font-bold text-white shadow-[0_20px_50px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(139,92,246,0.4)] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
                {isCreating ? (
                  <CgSpinner className="text-xl animate-spin text-purple-600" />
                ) : (
                  <FcGoogle className="text-xl" />
                )}
              </span>

              <span className="tracking-wide">
                {isCreating
                  ? "Creating Platform Core..."
                  : "Create with Google"}
              </span>

              {!isCreating && (
                <HiArrowRight className="text-white text-lg transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 sm:pl-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Free tier includes 200 production AI responses
            </div>
          </div>
        </div>

        {/* right */}
        <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-emerald-500/5 dark:from-purple-500/10 dark:to-emerald-500/10 rounded-[32px] blur-2xl transform scale-105 -z-10" />

          <div className="border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl shadow-slate-200 dark:shadow-black/40">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Capabilities
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Production-ready platform core
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center p-0.5 shadow-lg shadow-purple-500/20 group hover:rotate-6 transition-transform duration-300">
                <img
                  src={logo}
                  alt="Platform Logo"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {features.map(({ icon, title, desc, color }, index) => (
                <div
                  key={index}
                  className="group flex gap-4 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40 p-4 transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-700/60 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                >
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${color} text-white text-xl flex items-center justify-center shadow-md shadow-black/10 dark:shadow-black/20 transform transition-transform duration-300 group-hover:scale-105`}
                  >
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
