import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo2.png"; 
import { HiOutlineLogout } from "react-icons/hi";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import axios from "axios";
import { ServerUrl } from "../App";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.get(ServerUrl + "/api/user/logout", { withCredentials: true });
      setUser(null);
      setIsOpen(false);
      toast.success("Logged out successfully"); 
      navigate("/login"); 
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const navTo = (path) => {
    navigate(path);
    setIsOpen(false); 
  };

  const premiumEasing = [0.16, 1, 0.3, 1];

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { ease: premiumEasing, duration: 0.6 } 
    },
    scrolledHidden: { 
      opacity: 0, 
      y: -100, 
      transition: { ease: premiumEasing, duration: 0.4 } 
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.93, y: -12 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        mass: 0.8,
        stiffness: 140,
        damping: 18,
        staggerChildren: 0.06,
        delayChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -8,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { ease: premiumEasing, duration: 0.4 } 
    }
  };

  const primaryButtonHover = {
    scale: 1.03,
    y: -1,
    boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.25), 0 8px 10px -6px rgba(16, 185, 129, 0.2)",
    transition: { ease: premiumEasing, duration: 0.3 }
  };

  const secondaryButtonHover = {
    scale: 1.02,
    y: -1,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
    transition: { ease: premiumEasing, duration: 0.3 }
  };

  const tapFeedback = { scale: 0.97 };

  return (
    <motion.div
      variants={navbarVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "scrolledHidden"}
      className="relative sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-orange-200 dark:border-gray-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        <motion.div
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.99 }}
          transition={{ ease: premiumEasing, duration: 0.3 }}
          onClick={() => navTo("/")}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <img src={logo} alt="logo" className="h-9 w-auto object-contain" />
          <h1 className="font-bold text-xl text-gray-700 dark:text-gray-200 leading-none">
            Shifra{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">
              AI
            </span>
          </h1>
        </motion.div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.08, rotate: darkMode ? 15 : -15 }}
            whileTap={tapFeedback}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-orange-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>

          {user && (
            <>
              <div className="hidden md:flex items-center gap-3">
                <motion.button
                  whileHover={primaryButtonHover}
                  whileTap={tapFeedback}
                  onClick={() => navTo("/builder")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-sm font-medium shadow-md cursor-pointer"
                >
                  Builder
                </motion.button>
                
                <motion.button
                  whileHover={secondaryButtonHover}
                  whileTap={tapFeedback}
                  onClick={() => navTo("/billing")}
                  className="px-4 py-2 rounded-xl border border-orange-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-purple-300 dark:hover:border-emerald-500 transition-colors cursor-pointer"
                >
                  Billing
                </motion.button>

                <motion.div 
                  whileHover={{ y: -0.5, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}
                  transition={{ ease: premiumEasing, duration: 0.3 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {(user?.name || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="max-w-[140px]">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.12, rotate: 8, x: 1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    onClick={handleLogOut} 
                    className="ml-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Log Out"
                  >
                    <HiOutlineLogout size={18} />
                  </motion.button>
                </motion.div>
              </div>

              <div ref={menuRef} className="md:hidden relative">
                <motion.button
                  whileTap={tapFeedback}
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </motion.button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full right-0 mt-3 w-[85vw] max-w-[320px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800 px-4 py-4 space-y-4 shadow-2xl rounded-2xl z-50 origin-top-right"
                    >
                      <motion.div variants={itemVariants} className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {user?.image ? (
                            <img src={user.image} alt={user.name} referrerPolicy="no-referrer" crossOrigin="anonymous" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold">{(user?.name || "U").charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </motion.div>

                      <div className="flex flex-col gap-2.5">
                        <motion.div variants={itemVariants}>
                          <motion.button
                            whileHover={secondaryButtonHover}
                            whileTap={tapFeedback}
                            onClick={() => navTo("/builder")}
                            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-sm font-medium text-center cursor-pointer shadow-sm"
                          >
                            Builder
                          </motion.button>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                          <motion.button
                            whileHover={secondaryButtonHover}
                            whileTap={tapFeedback}
                            onClick={() => navTo("/billing")}
                            className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium text-center cursor-pointer"
                          >
                            Billing
                          </motion.button>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <motion.button
                            whileHover={{ scale: 1.015, y: -0.5 }}
                            whileTap={tapFeedback}
                            onClick={handleLogOut}
                            className="w-full px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 text-sm font-medium flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/50 cursor-pointer"
                          >
                            <HiOutlineLogout size={16} />
                            Log Out
                          </motion.button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;