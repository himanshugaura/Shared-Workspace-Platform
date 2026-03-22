"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/landingPage/Footer";
import { useAppDispatch } from "@/store/hook";
import GoogleLoginButton from "@/components/auth/GoogleButton";
import GrainOverlay from "@/components/common/GrainOverlay";
import { login } from "@/api/auth";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/common/AuthGaurd";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isValid = username.trim() !== "" && password.trim() !== "";
  const dispatch = useAppDispatch();
    const router = useRouter();
  const handleLogin = async (e : React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(login(username, password));
    if (res) {
        router.push("/profile");
    }
  };

  return (
    <AuthGuard requireAuth={false}>
    <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans'] flex flex-col">
        <GrainOverlay originX={0.2} originY={0.3} spread={0.5} density={0.4}/>
      <Navbar showAuthButtons={false} />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[rgba(240,236,228,0.1)] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[rgba(240,236,228,0.35)] mb-2">
              Welcome back
            </p>
            <h1 className="font-['Playfair_Display'] text-[32px] leading-[1.1] tracking-[-0.02em] text-[#f0ece4]">
              Login
            </h1>
            <p className="text-[13px] text-[rgba(240,236,228,0.4)] mt-2">
              Access your account to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.45)]">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-[14px] bg-[rgba(255,255,255,0.02)] text-[#f0ece4] border border-[rgba(240,236,228,0.08)] rounded-xl placeholder:text-[rgba(240,236,228,0.25)] outline-none transition-all duration-200 focus:border-[rgba(240,236,228,0.2)] focus:bg-[rgba(255,255,255,0.04)]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.45)]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-[14px] bg-[rgba(255,255,255,0.02)] text-[#f0ece4] border border-[rgba(240,236,228,0.08)] rounded-xl placeholder:text-[rgba(240,236,228,0.25)] outline-none transition-all duration-200 focus:border-[rgba(240,236,228,0.2)] focus:bg-[rgba(255,255,255,0.04)]"
              />
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`
                mt-1 w-full text-[13px] tracking-[0.05em] uppercase px-4 py-3 rounded-xl border transition-all duration-200
                ${
                  isValid
                    ? "bg-[rgba(240,236,228,0.1)] text-[#f0ece4] border-[rgba(240,236,228,0.18)] hover:bg-[rgba(240,236,228,0.18)] hover:border-[rgba(240,236,228,0.28)]"
                    : "bg-[rgba(255,255,255,0.02)] text-[rgba(240,236,228,0.25)] border-[rgba(240,236,228,0.06)] cursor-not-allowed"
                }
              `}
            >
              Login
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[rgba(240,236,228,0.08)]" />
            <span className="text-[11px] uppercase tracking-wides text-[rgba(240,236,228,0.3)]">
              OR
            </span>
            <div className="h-px flex-1 bg-[rgba(240,236,228,0.08)]" />
          </div>
          <GoogleLoginButton />
        </div>
      </main>

      <Footer />
    </div>
    </AuthGuard>
  );
}