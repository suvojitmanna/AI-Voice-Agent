import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const Billing = ({ user }) => {
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user && !user.isSetupComplete) {
      toast.error("Setup your assistant first");
      navigate("/builder");
    }
  }, [user, navigate]);

  const handlePay = async () => {
    try {
      const { data } = await axios.post(
        `${ServerUrl}/api/billing/order`,
        { plan: "Pro" },
        { withCredentials: true },
      );

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ShifraAI",
        description: "Pro Plan Upgrade",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verify = await axios.post(
              `${ServerUrl}/api/billing/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true },
            );

            if (verify.data.success) {
              toast.success("Payment Successful! Welcome to Pro.");
              window.location.reload();
            }
          } catch (error) {
            console.error(error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#8B5CF6",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(response.error);
        toast.error(response.error.description || "Payment failed");
      });

      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Unable to create order. Please try again.");
    }
  };

  const currentPlan = user?.plan || "Free";
  const isFree = currentPlan === "Free" || currentPlan === "free";
  const isPro = currentPlan === "Pro" || currentPlan === "pro";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1121] px-4 py-12 transition-colors duration-300 font-sans selection:bg-purple-500/30">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400">
            Billing & Subscription
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Manage your AI assistant capabilities, track your usage, and upgrade
            your workflow.
          </p>
        </div>

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Plan Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Current Plan
              </p>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
              {currentPlan}
            </h2>
          </div>

          {/* Gemini Status Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Gemini Status
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  user?.geminiStatus === "Active"
                    ? "bg-emerald-500"
                    : user?.geminiStatus === "Invalid"
                      ? "bg-red-500"
                      : "bg-amber-500"
                } animate-pulse`}
              />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                {user?.geminiStatus || "Unknown"}
              </h2>
            </div>
          </div>

          {/* Usage/Expiry Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isFree ? "Messages Left" : "Plan Expiry"}
              </p>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
              {isFree
                ? remainingMessages.toLocaleString()
                : `${remainingDays} Days`}
            </h2>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-10 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[2rem] p-8 lg:p-10 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 relative group">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Free Plan
              </h2>
              <div className="mt-4 flex items-baseline text-slate-900 dark:text-white">
                <span className="text-5xl font-extrabold tracking-tight">
                  ₹0
                </span>
                <span className="ml-1 text-xl font-medium text-slate-500 dark:text-slate-400">
                  /forever
                </span>
              </div>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Perfect for trying out basic AI capabilities.
              </p>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {[
                "200 AI messages per month",
                "Standard Voice Assistant",
                "Basic Navigation Support",
                "Standard Customization",
              ].map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-slate-700 dark:text-slate-300"
                >
                  <CheckIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={isFree}
              className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-200 text-center flex items-center justify-center ${
                isFree
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700/50 dark:text-slate-500"
                  : "bg-white border-2 border-slate-200 text-slate-900 hover:border-slate-900 dark:bg-transparent dark:border-slate-600 dark:text-white dark:hover:border-white hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              }`}
            >
              {isFree ? "Active Plan" : "Downgrade to Free"}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col rounded-[2rem] p-8 lg:p-10 relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 bg-gradient-to-br from-emerald-500 via-purple-600 via-indigo-600 to-yellow-400 to-fuchsia-600 border border-purple-500/30">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500" />

            <div className="absolute top-5 right-5 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Most Popular
              </span>
            </div>

            <div className="mb-8 relative z-10">
              <h2 className="text-2xl font-bold text-white">Pro Plan</h2>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">
                  ₹699
                </span>
                <span className="ml-2 text-lg font-medium opacity-80">
                  / 3 Months
                </span>
              </div>
              <p className="mt-4 text-purple-100 opacity-90">
                Unleash the full power of ShifraAI without limits.
              </p>
            </div>

            <ul className="space-y-4 mb-10 flex-1 relative z-10">
              {[
                "Unlimited AI messages",
                "Advanced contextual AI",
                "Priority lightning-fast API",
                "Unlimited navigation routing",
                "Premium 24/7 Support",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start text-white">
                  <CheckIcon className="w-5 h-5 text-fuchsia-300 mr-3 shrink-0 mt-0.5" />
                  <span className="opacity-95">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={isPro}
              onClick={isPro ? undefined : handlePay}
              className={`relative z-10 w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 text-center shadow-lg flex items-center justify-center ${
                isPro
                  ? "bg-white/10 text-white cursor-not-allowed backdrop-blur-sm border border-white/20"
                  : "bg-white text-purple-600 hover:bg-slate-50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              }`}
            >
              {isPro ? "Active Plan" : "Upgrade to Pro"}

              {/* Optional animated arrow for Pro button */}
              {!isPro && (
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
