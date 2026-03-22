"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/store/hook";
import { verifyEmail } from "@/api/auth";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VerifyEmail() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await dispatch(verifyEmail(token));
        
        if (res === true) {
          setVerificationStatus('success');
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setVerificationStatus('error');
          setErrorMessage('Verification failed. The link may be invalid or expired.');
        }
      } catch (error) {
        setVerificationStatus('error');
        setErrorMessage('An error occurred during verification. Please try again.');
      }
    };

    if (token) {
      verify();
    }
  }, [token, dispatch, router]);

  const handleRedirect = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Subtle background glow */}

      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="relative">
          {/* Card Container with glass effect */}
          <div className={cn(
            "bg-[rgba(240,236,228,0.03)]",
            "border border-[rgba(240,236,228,0.08)]",
            "backdrop-blur-md",
            "rounded-2xl",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
            "p-8"
          )}>
            {/* Header with animated dot */}
            <div className="flex items-center gap-2 mb-6">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                verificationStatus === 'loading' && "bg-blue-400 animate-pulse",
                verificationStatus === 'success' && "bg-emerald-400",
                verificationStatus === 'error' && "bg-red-400"
              )} />
              <span className="text-[11px] text-[rgba(240,236,228,0.35)] tracking-[0.08em] uppercase">
                {verificationStatus === 'loading' && 'Verifying Email'}
                {verificationStatus === 'success' && 'Verification Complete'}
                {verificationStatus === 'error' && 'Verification Failed'}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="mb-6 relative">
                <div className={cn(
                  "relative flex items-center justify-center w-20 h-20 rounded-xl",
                  "bg-[rgba(240,236,228,0.03)] border border-[rgba(240,236,228,0.08)]",
                  "backdrop-blur-md transition-all duration-300"
                )}>
                  {verificationStatus === 'loading' && (
                    <>
                      <div className="absolute inset-0 rounded-xl bg-blue-500/5 animate-pulse" />
                      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </>
                  )}
                  {verificationStatus === 'success' && (
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  )}
                  {verificationStatus === 'error' && (
                    <XCircle className="w-8 h-8 text-red-400" />
                  )}
                </div>

                {/* Decorative rings */}
                <div className={cn(
                  "absolute -inset-0.5 rounded-xl opacity-0 transition-opacity duration-500",
                  verificationStatus === 'success' && "opacity-100",
                  "bg-linear-to-r from-emerald-500/20 to-transparent blur-sm"
                )} />
              </div>

              {/* Title */}
              <h2 className="text-xl font-medium text-[#f0ece4] mb-2">
                {verificationStatus === 'loading' && 'Checking your email'}
                {verificationStatus === 'success' && 'Email verified successfully'}
                {verificationStatus === 'error' && 'Something went wrong'}
              </h2>

              {/* Description */}
              <p className="text-sm text-[rgba(240,236,228,0.4)] leading-relaxed mb-8 max-w-sm">
                {verificationStatus === 'loading' && 'Please wait while we verify your email address...'}
                {verificationStatus === 'success' && 'Your email has been verified. You\'ll be redirected to the home page momentarily.'}
                {verificationStatus === 'error' && errorMessage}
              </p>

              {/* Progress bar for success state */}
              {verificationStatus === 'success' && (
                <div className="w-full mb-8">
                  <div className="h-0.5 w-full bg-[rgba(240,236,228,0.08)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ 
                        width: '100%',
                        animation: 'shrinkWidth 3s linear forwards'
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-[rgba(240,236,228,0.25)] mt-2 tracking-[0.04em]">
                    Redirecting in 3 seconds...
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full space-y-2.5">
                {verificationStatus === 'success' && (
                  <button
                    onClick={handleRedirect}
                    className={cn(
                      "w-full group",
                      "text-sm tracking-[0.04em] px-7 py-3.5",
                      "bg-[rgba(240,236,228,0.1)] text-[#f0ece4]",
                      "border border-[rgba(240,236,228,0.15)] rounded-xl",
                      "backdrop-blur-lg",
                      "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)]",
                      "transition-all duration-200 cursor-pointer",
                      "hover:bg-[rgba(240,236,228,0.18)]",
                      "hover:border-[rgba(240,236,228,0.25)]",
                      "hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.4)]",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    Go to Home
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}

                {verificationStatus === 'error' && (
                  <button
                    onClick={handleRedirect}
                    className={cn(
                      "w-full",
                      "text-sm tracking-[0.04em] px-7 py-3.5",
                      "bg-[rgba(240,236,228,0.1)] text-[#f0ece4]",
                      "border border-[rgba(240,236,228,0.15)] rounded-xl",
                      "backdrop-blur-lg",
                      "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)]",
                      "transition-all duration-200 cursor-pointer",
                      "hover:bg-[rgba(240,236,228,0.18)]",
                      "hover:border-[rgba(240,236,228,0.25)]",
                      "hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.4)]",
                      "flex items-center justify-center gap-2"
                    )}
                  > 
                    Back to Home
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes shrinkWidth {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  );
}