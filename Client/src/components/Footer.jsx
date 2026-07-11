import React from "react";
import { motion } from "framer-motion";
import { GoArrowRight } from "react-icons/go";

const Footer = () => {
  const premiumEasing = [0.16, 1, 0.3, 1];

  const footerRevealVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: premiumEasing,
      },
    },
  };

  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Integrations", "Roadmap"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press Kit"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Community", "Support", "Status"],
    },
  ];

  return (
    <footer className="relative border-t border-gray-200/60 dark:border-gray-900/60 bg-[#f8fafc] dark:bg-gray-950 transition-colors duration-500 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-200/10 dark:bg-emerald-900/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-200/10 dark:bg-purple-900/5 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        variants={footerRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-12 border-b border-gray-200/60 dark:border-gray-900/40">
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-black text-2xl tracking-tight text-[#081028] dark:text-gray-100">
                <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-white text-base">
                  V
                </span>
                <span>
                  Virtual
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">
                    AI
                  </span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Empower your website with cutting-edge conversational voice
                intelligence. Build, train, and deploy in minutes.
              </p>
            </div>

            {/* Micro-Newsletter Input */}
            <div className="mt-8 max-w-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-3">
                Stay updated
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl text-sm outline-none focus:border-purple-500 transition duration-300 pr-12 text-gray-900 dark:text-gray-100"
                />
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white cursor-pointer"
                >
                  <GoArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((group) => (
            <div key={group.title} className="lg:col-span-1">
              <h4 className="text-sm font-bold tracking-wider uppercase text-[#081028] dark:text-gray-200">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href={`/${link.toLowerCase().replace(" ", "-")}`}
                      whileHover={{ x: 4 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 block transition-colors duration-200"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
          <p>
            © {new Date().getFullYear()} VirtualAI Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="/privacy"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
