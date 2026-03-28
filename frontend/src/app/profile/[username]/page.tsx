"use client";

import { fetchProfileByUsername } from "@/api/auth";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/landingPage/Footer";
import { clearViewProfile } from "@/store/features/viewProfile.slice";
import { useAppDispatch } from "@/store/hook";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[rgba(240,236,228,0.1)] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[rgba(240,236,228,0.08)]">
        <h3 className="text-[16px] text-[#f0ece4] tracking-[0.02em]">{title}</h3>
        {subtitle ? (
          <p className="text-[12px] text-[rgba(240,236,228,0.35)] mt-1">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function formatMonthYear(date: Date | string) {
  if (date === "Present") return "Present";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatDDMMYYYY(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function ProfileViewPage() {
  const params = useParams();
  const rawUsername = Array.isArray(params?.username)
    ? params.username[0]
    : params?.username;

  const username = useMemo(() => rawUsername?.trim() ?? "", [rawUsername]);

  const user = useSelector((state: RootState) => state.viewProfile.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [isValidUser, setIsValidUser] = useState(false);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setIsValidUser(false);

      dispatch(clearViewProfile());

      if (!username) {
        if (!active) return;
        setLoading(false);
        return;
      }

      const ok = await dispatch(fetchProfileByUsername(username)); 

      if (!active) return;
      setIsValidUser(ok);
      setLoading(false);
    };

    run();

    return () => {
      active = false;
    };
  }, [username, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans']">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-20">
          <div className="rounded-2xl border border-[rgba(240,236,228,0.12)] bg-[rgba(255,255,255,0.02)] p-8 text-center text-[rgba(240,236,228,0.75)]">
            Loading profile...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isValidUser || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans']">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-20">
          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-8 text-center">
            <h2 className="text-xl text-red-200 font-semibold">Invalid username</h2>
            <p className="mt-2 text-red-100/80">
              Unable to fetch user details. Please check the username and try again.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans']">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-20">
        <div className="mb-8 rounded-3xl border border-[rgba(240,236,228,0.12)] bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_40%),rgba(255,255,255,0.02)] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border border-[rgba(240,236,228,0.15)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
              <img
                src={user.profileImage?.url || "/default-avatar.png"}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="font-['Playfair_Display'] text-[clamp(30px,4.2vw,48px)] text-[#f0ece4] leading-[1.05] tracking-[-0.02em]">
                {user.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
                <span className="px-3 py-1.5 rounded-full border border-[rgba(240,236,228,0.14)] bg-[rgba(255,255,255,0.02)] text-[rgba(240,236,228,0.78)]">
                  @{user.username}
                </span>
                <a
                  href={`mailto:${user.email}`}
                  className="px-3 py-1.5 rounded-full border border-[rgba(240,236,228,0.14)] bg-[rgba(255,255,255,0.02)] text-[rgba(240,236,228,0.62)] hover:text-[rgba(240,236,228,0.9)] transition-colors"
                >
                  {user.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 flex flex-col gap-6">
            <Section title="Skills" subtitle="Core strengths">
              <div className="flex flex-wrap gap-2">
                {(user.portfolio?.skills ?? []).map((skill) => (
                  <span
                    key={skill}
                    className="text-[12px] px-3 py-1.5 rounded-lg border border-[rgba(139,92,246,0.25)] bg-[rgba(139,92,246,0.08)] text-[rgba(216,180,254,0.85)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Achievements" subtitle="Milestones and impact">
              <div className="space-y-3">
                {(user.portfolio?.achievements ?? []).map((a) => (
                  <div
                    key={a}
                    className="text-[13px] text-[rgba(240,236,228,0.75)] leading-[1.7] px-3 py-2.5 rounded-lg border border-[rgba(240,236,228,0.08)] bg-[rgba(255,255,255,0.015)]"
                  >
                    • {a}
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <div className="xl:col-span-2 flex flex-col gap-6">
            <Section title="Experience" subtitle="Professional journey">
              <div className="space-y-4">
                {(user.portfolio?.experience ?? []).map((exp, i) => (
                  <article
                    key={`${exp.company}-${i}`}
                    className="rounded-xl border border-[rgba(240,236,228,0.08)] bg-[rgba(255,255,255,0.01)] p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h4 className="text-[15px] text-[#f0ece4]">{exp.role}</h4>
                        <p className="text-[13px] text-[rgba(240,236,228,0.55)] mt-0.5">{exp.company}</p>
                      </div>
                      <span className="text-[12px] text-[rgba(240,236,228,0.45)]">
                        {formatMonthYear(exp.from as Date | string)} —{" "}
                        {formatMonthYear(exp.to as Date | string)}
                      </span>
                    </div>
                    <p className="mt-3 text-[13px] text-[rgba(240,236,228,0.72)] leading-[1.75]">
                      {exp.description}
                    </p>
                  </article>
                ))}
              </div>
            </Section>

            <Section title="Education" subtitle="Academic background">
              <div className="space-y-4">
                {(user.portfolio?.education ?? []).map((edu, i) => (
                  <article
                    key={`${edu.institution}-${i}`}
                    className="rounded-xl border border-[rgba(240,236,228,0.08)] bg-[rgba(255,255,255,0.01)] p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h4 className="text-[15px] text-[#f0ece4]">{edu.degree}</h4>
                        <p className="text-[13px] text-[rgba(240,236,228,0.55)] mt-0.5">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="text-[12px] text-[rgba(240,236,228,0.45)]">
                        {edu.duration}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[12px] text-[rgba(240,236,228,0.55)] mb-1.5">
                        <span>Score</span>
                        <span className="text-[#f0ece4]">
                          {edu.score.toString()} / {edu.maxScore.toString()}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[rgba(240,236,228,0.08)] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400/70 to-sky-400/70"
                          style={{
                            width: `${Math.min(
                              (Number(edu.score) / Number(edu.maxScore)) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Section>

            <Section title="Certifications" subtitle="Verified credentials">
              <div className="space-y-4">
                {(user.portfolio?.certifications ?? []).map((cert, i) => (
                  <article
                    key={`${cert.name}-${i}`}
                    className="rounded-xl border border-[rgba(240,236,228,0.08)] bg-[rgba(255,255,255,0.01)] p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h4 className="text-[14px] text-[#f0ece4]">{cert.name}</h4>
                        <p className="text-[12px] text-[rgba(240,236,228,0.55)] mt-1">
                          {cert.issuer}
                        </p>
                      </div>
                      <p className="text-[12px] text-[rgba(240,236,228,0.4)]">
                        Issued on: {formatDDMMYYYY(cert.date)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}