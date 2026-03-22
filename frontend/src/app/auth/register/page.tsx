"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/landingPage/Footer";
import GrainOverlay from "@/components/common/GrainOverlay";
import GoogleLoginButton from "@/components/auth/GoogleButton";
import { register, verifyUsername } from "@/api/auth";
import { useAppDispatch } from "@/store/hook";
import AuthGuard from "@/components/common/AuthGaurd";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "error";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const DEBOUNCE_MS = 600;

const inputClass =
  "w-full px-4 py-3 text-[14px] bg-[rgba(255,255,255,0.02)] text-[#f0ece4] border border-[rgba(240,236,228,0.08)] rounded-xl placeholder:text-[rgba(240,236,228,0.25)] outline-none transition-all duration-200 focus:border-[rgba(240,236,228,0.2)] focus:bg-[rgba(255,255,255,0.04)]";

function getUsernameState(status: UsernameStatus, message: string) {
  switch (status) {
    case "checking":
      return {
        text: message || "Checking username...",
        color: "text-yellow-300 font-medium",
      };
    case "available":
      return {
        text: message || "Username is available",
        color: "text-green-300 font-medium",
      };
    case "taken":
      return {
        text: message || "Username is not available",
        color: "text-red-400 font-medium",
      };
    case "error":
      return {
        text: message || "Could not verify username",
        color: "text-red-400 font-medium",
      };
    default:
      return { text: "", color: "text-gray-400" };
  }
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  useEffect(() => {
    const trimmed = username.trim();

    if (!trimmed) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }

    if (!USERNAME_REGEX.test(trimmed)) {
      setUsernameStatus("error");
      setUsernameMessage("Use 3-20 chars: letters, numbers, underscore.");
      return;
    }

    setUsernameStatus("checking");
    setUsernameMessage("Checking username...");

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const available = await verifyUsername(trimmed)();

        if (cancelled) return;

        if (available) {
          setUsernameStatus("available");
          setUsernameMessage("Username is available");
        } else {
          setUsernameStatus("taken");
          setUsernameMessage("Username is not available");
        }
      } catch (error) {
        if (cancelled) return;
        console.error("verify username failed:", error);
        setUsernameStatus("error");
        setUsernameMessage("Error verifying username");
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username]);

  const isValid = useMemo(
    () =>
      name.trim() !== "" &&
      username.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      usernameStatus === "available",
    [name, username, email, password, usernameStatus]
  );

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const res = dispatch(register(name.trim(), username.trim(), email.trim(), password.trim()));
  };

  const usernameUi = getUsernameState(usernameStatus, usernameMessage);

  return (
    <AuthGuard requireAuth={false}>
    <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans'] flex flex-col">
      <Navbar showAuthButtons={false} />
      <GrainOverlay originX={0.2} originY={0.3} spread={0.5} density={0.4} />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[rgba(240,236,228,0.1)] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[rgba(240,236,228,0.35)] mb-2">
              Create account
            </p>
            <h1 className="font-['Playfair_Display'] text-[32px] leading-[1.1] tracking-[-0.02em] text-[#f0ece4]">
              Register
            </h1>
            <p className="text-[13px] text-[rgba(240,236,228,0.4)] mt-2">
              Join and start building your profile.
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.45)]">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.45)]">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
                placeholder="@username"
                className={inputClass}
              />
              {username.trim() !== "" && (
                <p className={`text-[12px] mt-1 ${usernameUi.color}`}>
                  {usernameUi.text}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.45)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
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
                className={inputClass}
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
              Register
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[rgba(240,236,228,0.08)]" />
            <span className="text-[11px] uppercase tracking-widest text-[rgba(240,236,228,0.3)]">
              OR
            </span>
            <div className="h-px flex-1 bg-[rgba(240,236,228,0.08)]" />
          </div>

          <GoogleLoginButton />
        </div>
      </main>

      <Footer />
    </div>
    </AuthGaurd>
  );
}