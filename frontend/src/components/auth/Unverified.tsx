"use client";
import { sendVerificaitonToken } from "@/api/auth";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/landingPage/Footer";
import { useAppDispatch } from "@/store/hook";
import { useEffect, useState } from "react";

export default function Unverified() {
  const [isSend, setIsSend] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const sendVerificationEmail = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(sendVerificaitonToken());
      if (res) {
        setIsSend(true);
        setCooldown(60);
      }
    } catch (err) {
      console.error("Failed to send verification email:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = cooldown > 0 || isLoading;

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans']">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-20">
        <div className="rounded-2xl border border-amber-300/20 bg-amber-400/5 p-8 text-center">
          <p className="text-[12px] uppercase tracking-[0.1em] text-amber-200/70 mb-2">
            Account Status
          </p>
          <h1 className="text-2xl md:text-3xl text-[#f0ece4] font-semibold">
            Your account is not verified
          </h1>
          <p className="mt-3 text-[rgba(240,236,228,0.7)]">
            Please verify your email to access and edit your profile.
          </p>
          {isSend && (
            <p className="mt-4 text-sm text-amber-200/60">
              A verification email has been sent. Please check your inbox.
            </p>
          )}
          <button
            onClick={sendVerificationEmail}
            disabled={isDisabled}
            className={`mt-6 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 mx-auto
              ${
                isDisabled
                  ? "bg-amber-400/10 text-amber-200/30 cursor-not-allowed border border-amber-300/10"
                  : "bg-amber-400/20 text-amber-200 border border-amber-300/30 hover:bg-amber-400/30 cursor-pointer"
              }`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4 text-amber-200/50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {isLoading
              ? "Sending..."
              : cooldown > 0
              ? `Resend email in ${cooldown}s`
              : isSend
              ? "Resend Verification Email"
              : "Send Verification Email"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}