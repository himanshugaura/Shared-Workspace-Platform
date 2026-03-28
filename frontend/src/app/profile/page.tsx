"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/landingPage/Footer";
import { Portfolio, User } from "@/types/entity.types";
import { useAppDispatch } from "@/store/hook";
import { getProfile, updateProfile, verifyUsername } from "@/api/auth";
import Unverified from "@/components/auth/Unverified";
import ImageCropUpload from "@/components/profile/CropModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "error";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const DEBOUNCE_MS = 600;

type ProfileExperience = {
  company: string;
  role: string;
  from: Date | string;
  to?: Date | string;
  isCurrent: boolean;
  description: string;
};

type ProfileEducation = {
  institution: string;
  degree: string;
  from: Date | string;
  to: Date | string;
  score: number;
  maxScore: number;
};

type ProfileCertification = Portfolio["certifications"][number];

type ProfilePortfolio = Omit<Portfolio, "experience" | "education" | "certifications"> & {
  experience: ProfileExperience[];
  education: ProfileEducation[];
  certifications: ProfileCertification[];
};

type ProfileUser = Omit<User, "portfolio"> & {
  portfolio: ProfilePortfolio;
};

function getUsernameState(status: UsernameStatus, message: string) {
  switch (status) {
    case "checking":
      return { text: message || "Checking username...", color: "text-yellow-300 font-medium" };
    case "available":
      return { text: message || "Username is available", color: "text-green-300 font-medium" };
    case "taken":
      return { text: message || "Username is not available", color: "text-red-400 font-medium" };
    case "error":
      return { text: message || "Could not verify username", color: "text-red-400 font-medium" };
    default:
      return { text: "", color: "text-gray-400" };
  }
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[rgba(240,236,228,0.1)] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[rgba(240,236,228,0.08)] flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[16px] text-[#f0ece4] tracking-[0.02em]">{title}</h3>
          {subtitle ? <p className="text-[12px] text-[rgba(240,236,228,0.35)] mt-1">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  value: string | number;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-3 text-[14px] bg-[rgba(255,255,255,0.02)] text-[#f0ece4] border border-[rgba(240,236,228,0.08)] rounded-xl placeholder:text-[rgba(240,236,228,0.25)] outline-none transition-all duration-200 focus:border-[rgba(240,236,228,0.2)] focus:bg-[rgba(255,255,255,0.04)] disabled:opacity-70 disabled:cursor-not-allowed"
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[12px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.45)]">{children}</label>;
}

function ConfirmModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Remove",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-[rgba(240,236,228,0.12)] bg-[#121212] p-6 shadow-2xl">
        <h3 className="text-[#f0ece4] text-lg">{title}</h3>
        <p className="mt-2 text-sm text-[rgba(240,236,228,0.6)]">{description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-[rgba(240,236,228,0.18)] text-[rgba(240,236,228,0.8)] hover:bg-[rgba(240,236,228,0.08)]">{cancelText}</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 rounded-lg border border-red-400/30 bg-red-500/15 text-red-300 hover:bg-red-500/25">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

const emptyUser: ProfileUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  password: "",
  isVerified: true,
  profileImage: { url: "", publicId: "" },
  portfolio: { skills: [], experience: [], education: [], certifications: [], achievements: [] },
};

function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function toDisplayDateDDMMYYYY(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const safeTrim = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const normalizeDate = (value: Date | string | null | undefined): string => {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
};

function normalizeUser(raw: User | null | undefined): ProfileUser {
  const base = raw ?? ({} as User);

  const normalizedExperience: ProfileExperience[] = (base.portfolio?.experience ?? []).map((exp) => {
    const toVal = exp.to as unknown as Date | string | undefined;
    const derivedCurrent =
      Boolean((exp as { isCurrent?: boolean }).isCurrent) ||
      (typeof toVal === "string" && toVal.toLowerCase() === "present");

    return {
      company: exp.company ?? "",
      role: exp.role ?? "",
      from: (exp.from as Date | string | undefined) ?? "",
      to: derivedCurrent ? undefined : toVal,
      isCurrent: derivedCurrent,
      description: exp.description ?? "",
    };
  });

  const normalizedEducation: ProfileEducation[] = (base.portfolio?.education ?? []).map((e) => ({
    institution: (e.institution ?? "").toString(),
    degree: (e.degree ?? "").toString(),
    from: ((e as { from?: Date | string }).from ?? "") as Date | string,
    to: ((e as { to?: Date | string }).to ?? "") as Date | string,
    score: Number(e.score ?? 0),
    maxScore: Number(e.maxScore ?? 0),
  }));

  const normalizedCertifications: ProfileCertification[] = (base.portfolio?.certifications ?? []).map((cert) => ({
    ...cert,
    date: toDateInput(cert.date),
  }));

  return {
    ...emptyUser,
    ...base,
    profileImage: { ...emptyUser.profileImage, ...(base.profileImage ?? {}) },
    portfolio: {
      ...emptyUser.portfolio,
      ...(base.portfolio ?? {}),
      skills: base.portfolio?.skills ?? [],
      experience: normalizedExperience,
      education: normalizedEducation,
      certifications: normalizedCertifications,
      achievements: base.portfolio?.achievements ?? [],
    },
  };
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const storeUser = useSelector((state: RootState) => state.auth.user);

  const [data, setData] = useState<ProfileUser>(emptyUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");
  const [formError, setFormError] = useState("");

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    onConfirm?: () => void;
  }>({ open: false });

  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [initialUsername, setInitialUsername] = useState("");

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoading(true);
        if (!storeUser) {
          await dispatch(getProfile() as never);
        }
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [dispatch, storeUser]);

  useEffect(() => {
    if (!storeUser) return;
    const normalized = normalizeUser(storeUser as User);
    setData(normalized);

    const baseUsername = normalized.username.trim();
    setInitialUsername(baseUsername);
    if (baseUsername) {
      setUsernameStatus("available");
      setUsernameMessage("Current username");
    } else {
      setUsernameStatus("idle");
      setUsernameMessage("");
    }
  }, [storeUser]);

  useEffect(() => {
    const trimmed = data.username.trim();
    const initialTrimmed = initialUsername.trim();

    if (!trimmed) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }

    if (trimmed === initialTrimmed) {
      setUsernameStatus("available");
      setUsernameMessage("Current username");
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
      } catch {
        if (cancelled) return;
        setUsernameStatus("error");
        setUsernameMessage("Error verifying username");
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [data.username, initialUsername]);

  const openConfirm = ({ title, description, onConfirm }: { title?: string; description?: string; onConfirm: () => void }) =>
    setConfirmState({ open: true, title, description, onConfirm });

  const closeConfirm = () => setConfirmState({ open: false, onConfirm: undefined });

  const handleConfirm = () => {
    confirmState.onConfirm?.();
    closeConfirm();
  };

  const validateBeforeSubmit = (): string => {
    for (let i = 0; i < data.portfolio.experience.length; i++) {
      const exp = data.portfolio.experience[i];
      if (!safeTrim(exp.company)) return `Experience #${i + 1}: company is required.`;
      if (!safeTrim(exp.role)) return `Experience #${i + 1}: role is required.`;
      if (!exp.from || !toDateInput(exp.from)) return `Experience #${i + 1}: from date is required.`;
      if (!exp.isCurrent && (!exp.to || !toDateInput(exp.to))) return `Experience #${i + 1}: to date is required when not current.`;
      if (!safeTrim(exp.description)) return `Experience #${i + 1}: description is required.`;
    }

    for (let i = 0; i < data.portfolio.education.length; i++) {
      const edu = data.portfolio.education[i];
      if (!safeTrim(edu.institution)) return `Education #${i + 1}: institution is required.`;
      if (!safeTrim(edu.degree)) return `Education #${i + 1}: degree is required.`;
      if (!edu.from || !toDateInput(edu.from)) return `Education #${i + 1}: from date is required.`;
      if (!edu.to || !toDateInput(edu.to)) return `Education #${i + 1}: to date is required.`;
      if (new Date(edu.to).getTime() < new Date(edu.from).getTime()) return `Education #${i + 1}: to date cannot be earlier than from date.`;
      if (Number.isNaN(Number(edu.score))) return `Education #${i + 1}: score must be a valid number.`;
      if (Number.isNaN(Number(edu.maxScore)) || Number(edu.maxScore) <= 0) return `Education #${i + 1}: max score must be greater than 0.`;
    }

    return "";
  };

  const canSaveProfile = useMemo(() => {
    const hasName = data.name.trim() !== "";
    const hasUsername = data.username.trim() !== "";
    return hasName && hasUsername && usernameStatus === "available";
  }, [data.name, data.username, usernameStatus]);

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    if (data.portfolio.skills.includes(val)) return setSkillInput("");
    setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, skills: [...prev.portfolio.skills, val] } }));
    setSkillInput("");
  };

  const removeSkill = (skill: string) =>
    setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, skills: prev.portfolio.skills.filter((s) => s !== skill) } }));

  const addAchievement = () => {
    const val = achievementInput.trim();
    if (!val) return;
    if (data.portfolio.achievements.includes(val)) return setAchievementInput("");
    setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, achievements: [...prev.portfolio.achievements, val] } }));
    setAchievementInput("");
  };

  const removeAchievement = (val: string) =>
    setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, achievements: prev.portfolio.achievements.filter((a) => a !== val) } }));

  const addExperience = () => {
    const newExp: ProfileExperience = {
      company: "",
      role: "",
      from: new Date(),
      to: undefined,
      isCurrent: true,
      description: "",
    };
    setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, experience: [...prev.portfolio.experience, newExp] } }));
  };

  const updateExperience = (idx: number, patch: Partial<ProfileExperience>) =>
    setData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        experience: prev.portfolio.experience.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
      },
    }));

  const removeExperience = (idx: number) =>
    setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, experience: prev.portfolio.experience.filter((_, i) => i !== idx) } }));

  const addEducation = () =>
    setData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        education: [...prev.portfolio.education, { institution: "", degree: "", from: new Date(), to: new Date(), score: 0, maxScore: 10 }],
      },
    }));

  const updateEducation = (idx: number, patch: Partial<ProfileEducation>) =>
    setData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        education: prev.portfolio.education.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
      },
    }));

  const removeEducation = (idx: number) =>
    setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, education: prev.portfolio.education.filter((_, i) => i !== idx) } }));

  const addCertification = () =>
    setData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        certifications: [...prev.portfolio.certifications, { name: "", issuer: "", date: "", image: { url: "", publicId: "" } }],
      },
    }));

  const updateCertification = (idx: number, patch: Partial<ProfileCertification>) =>
    setData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        certifications: prev.portfolio.certifications.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
      },
    }));

  const removeCertification = (idx: number) =>
    setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, certifications: prev.portfolio.certifications.filter((_, i) => i !== idx) } }));

  const buildPayloadAsFormData = (user: ProfileUser, imageFile: File | null) => {
    const formData = new FormData();

    formData.append("name", safeTrim(user.name));
    formData.append("username", safeTrim(user.username));
    if (imageFile) formData.append("profileImage", imageFile);

    const normalizedPortfolio = {
      skills: user.portfolio.skills.map((s) => s.trim()).filter(Boolean),
      experience: user.portfolio.experience.map((exp) => ({
        company: safeTrim(exp.company),
        role: safeTrim(exp.role),
        from: normalizeDate(exp.from),
        to: exp.isCurrent ? "" : normalizeDate(exp.to ?? ""),
        isCurrent: exp.isCurrent,
        description: safeTrim(exp.description),
      })),
      education: user.portfolio.education.map((edu) => ({
        institution: safeTrim(edu.institution),
        degree: safeTrim(edu.degree),
        from: normalizeDate(edu.from),
        to: normalizeDate(edu.to),
        score: Number(edu.score ?? 0),
        maxScore: Number(edu.maxScore ?? 0),
      })),
      certifications: user.portfolio.certifications.map((cert) => ({
        name: safeTrim(cert.name),
        issuer: safeTrim(cert.issuer),
        date: cert.date ? new Date(cert.date).toISOString() : "",
      })),
      achievements: user.portfolio.achievements.map((a) => a.trim()).filter(Boolean),
    };

    formData.append("portfolio", JSON.stringify(normalizedPortfolio));
    return formData;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!canSaveProfile) return;

    const validationError = validateBeforeSubmit();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);
      const formData = buildPayloadAsFormData(data, profileImageFile);
      const ok = await dispatch(updateProfile(formData) as never);

      if (!ok) {
        setFormError("Failed to save profile. Please try again.");
        return;
      }

      setProfileImageFile(null);
    } catch {
      setFormError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const usernameUi = getUsernameState(usernameStatus, usernameMessage);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] grid place-items-center">Loading profile...</div>;
  }

  if (!storeUser) {
    return <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] grid place-items-center">No profile found.</div>;
  }

  if (!data.isVerified) return <Unverified />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans']">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-20">
        <div className="mb-8">
          <p className="text-[12px] uppercase tracking-[0.12em] text-[rgba(240,236,228,0.35)] mb-2">Profile</p>
          <h1 className="font-['Playfair_Display'] text-[clamp(30px,4.2vw,46px)] text-[#f0ece4] leading-[1.1] tracking-[-0.02em]">
            Professional Portfolio
          </h1>
          <p className="text-[14px] text-[rgba(240,236,228,0.38)] mt-3 max-w-2xl leading-[1.7]">
            Build a high-signal profile that presents your experience, skills, achievements and credentials in a cleaner, more compelling format than a traditional resume.
          </p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 flex flex-col gap-6">
            <SectionCard title="Identity" subtitle="Core account details">
              <div className="mb-6 flex justify-center">
                <ImageCropUpload
                  currentImageUrl={data.profileImage.url}
                  label="Upload"
                  onCroppedFile={(file) => {
                    setProfileImageFile(file);
                    setData((prev) => ({ ...prev, profileImage: { ...prev.profileImage, url: URL.createObjectURL(file) } }));
                  }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={data.name} onChange={(v) => setData((prev) => ({ ...prev, name: v }))} placeholder="Your full name" />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input value={data.username} onChange={(v) => setData((prev) => ({ ...prev, username: v.replace(/\s+/g, "") }))} placeholder="@username" />
                  {data.username.trim() !== "" && <p className={`text-[12px] mt-1 ${usernameUi.color}`}>{usernameUi.text}</p>}
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={data.email} disabled />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Skills" subtitle="What you’re best at">
              <div className="flex flex-wrap gap-2 mb-4">
                {data.portfolio.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 text-[12px] px-3 py-1.5 rounded-lg bg-[rgba(139,92,246,0.08)] text-[rgba(196,181,253,0.8)] border border-[rgba(139,92,246,0.22)]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() =>
                        openConfirm({
                          title: "Remove skill?",
                          description: `Are you sure you want to remove "${skill}"?`,
                          onConfirm: () => removeSkill(skill),
                        })
                      }
                      className="text-[rgba(196,181,253,0.45)] hover:text-[rgba(196,181,253,0.95)]"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={skillInput} onChange={setSkillInput} placeholder="Add a skill" />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 rounded-xl border border-[rgba(240,236,228,0.18)] text-[#f0ece4] bg-[rgba(240,236,228,0.1)] hover:bg-[rgba(240,236,228,0.16)] transition"
                >
                  Add
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Achievements" subtitle="Highlights that stand out">
              <div className="space-y-2 mb-4">
                {data.portfolio.achievements.map((a) => (
                  <div
                    key={a}
                    className="flex items-start justify-between gap-3 text-[13px] text-[rgba(240,236,228,0.72)] px-3 py-2.5 rounded-lg border border-[rgba(240,236,228,0.08)] bg-[rgba(255,255,255,0.015)]"
                  >
                    <span>• {a}</span>
                    <button
                      type="button"
                      onClick={() =>
                        openConfirm({
                          title: "Remove achievement?",
                          description: "This achievement will be removed.",
                          onConfirm: () => removeAchievement(a),
                        })
                      }
                      className="text-[rgba(240,236,228,0.35)] hover:text-[rgba(240,236,228,0.8)]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={achievementInput}
                  onChange={setAchievementInput}
                  placeholder="Add achievement"
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="px-4 rounded-xl border border-[rgba(240,236,228,0.18)] text-[#f0ece4] bg-[rgba(240,236,228,0.1)] hover:bg-[rgba(240,236,228,0.16)] transition"
                >
                  Add
                </button>
              </div>
            </SectionCard>
          </div>

          <div className="xl:col-span-2 flex flex-col gap-6">
            <SectionCard
              title="Experience"
              subtitle="Professional roles and contributions"
              action={
                <button
                  type="button"
                  onClick={addExperience}
                  className="text-[12px] px-3 py-1.5 rounded-lg border border-[rgba(240,236,228,0.16)] text-[#f0ece4] bg-[rgba(240,236,228,0.08)] hover:bg-[rgba(240,236,228,0.14)]"
                >
                  + Add Experience
                </button>
              }
            >
              <div className="space-y-4">
                {data.portfolio.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[rgba(240,236,228,0.08)] bg-[rgba(255,255,255,0.01)] p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(v) => updateExperience(idx, { company: v })}
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Input
                          value={exp.role}
                          onChange={(v) => updateExperience(idx, { role: v })}
                          placeholder="Role / title"
                        />
                      </div>
                      <div>
                        <Label>From</Label>
                        <Input
                          type="date"
                          value={toDateInput(exp.from)}
                          onChange={(v) =>
                            updateExperience(idx, { from: v ? new Date(v) : new Date() })
                          }
                        />
                      </div>
                      <div>
                        <Label>To Type</Label>
                        <select
                          value={exp.isCurrent ? "present" : "date"}
                          onChange={(e) => {
                            const mode = e.target.value as "present" | "date";
                            if (mode === "present") {
                              updateExperience(idx, { isCurrent: true, to: undefined });
                            } else {
                              updateExperience(idx, { isCurrent: false, to: new Date() });
                            }
                          }}
                          className="w-full px-4 py-3 text-[14px] bg-[rgba(255,255,255,0.02)] text-[#f0ece4] border border-[rgba(240,236,228,0.08)] rounded-xl outline-none transition-all duration-200 focus:border-[rgba(240,236,228,0.2)] focus:bg-[rgba(255,255,255,0.04)]"
                        >
                          <option value="present" className="bg-[#121212]">Present</option>
                          <option value="date" className="bg-[#121212]">Date</option>
                        </select>
                      </div>

                      {!exp.isCurrent && (
                        <div>
                          <Label>To Date</Label>
                          <Input
                            type="date"
                            value={toDateInput(exp.to)}
                            onChange={(v) =>
                              updateExperience(idx, { to: v ? new Date(v) : new Date() })
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <Label>Description</Label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(idx, { description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 text-[14px] bg-[rgba(255,255,255,0.02)] text-[#f0ece4] border border-[rgba(240,236,228,0.08)] rounded-xl placeholder:text-[rgba(240,236,228,0.25)] outline-none transition-all duration-200 focus:border-[rgba(240,236,228,0.2)] focus:bg-[rgba(255,255,255,0.04)] resize-none"
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          openConfirm({
                            title: "Remove experience?",
                            description: "This experience entry will be permanently removed.",
                            onConfirm: () => removeExperience(idx),
                          })
                        }
                        className="text-[12px] text-red-400/80 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Education"
              subtitle="Academic background"
              action={
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-[12px] px-3 py-1.5 rounded-lg border border-[rgba(240,236,228,0.16)] text-[#f0ece4] bg-[rgba(240,236,228,0.08)] hover:bg-[rgba(240,236,228,0.14)]"
                >
                  + Add Education
                </button>
              }
            >
              <div className="space-y-4">
                {data.portfolio.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[rgba(240,236,228,0.08)] bg-[rgba(255,255,255,0.01)] p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(v) => updateEducation(idx, { institution: v })}
                          placeholder="Institution"
                        />
                      </div>
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(v) => updateEducation(idx, { degree: v })}
                          placeholder="Degree"
                        />
                      </div>
                      <div>
                        <Label>From</Label>
                        <Input
                          type="date"
                          value={toDateInput(edu.from)}
                          onChange={(v) => updateEducation(idx, { from: v ? new Date(v) : new Date() })}
                        />
                      </div>
                      <div>
                        <Label>To</Label>
                        <Input
                          type="date"
                          value={toDateInput(edu.to)}
                          onChange={(v) => updateEducation(idx, { to: v ? new Date(v) : new Date() })}
                        />
                      </div>
                      <div>
                        <Label>Score</Label>
                        <Input
                          type="number"
                          value={edu.score}
                          onChange={(v) => updateEducation(idx, { score: Number(v || 0) })}
                        />
                      </div>
                      <div>
                        <Label>Max Score</Label>
                        <Input
                          type="number"
                          value={edu.maxScore}
                          onChange={(v) => updateEducation(idx, { maxScore: Number(v || 0) })}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          openConfirm({
                            title: "Remove education?",
                            description: "This education entry will be permanently removed.",
                            onConfirm: () => removeEducation(idx),
                          })
                        }
                        className="text-[12px] text-red-400/80 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Certifications"
              subtitle="Proof of specialized expertise"
              action={
                <button
                  type="button"
                  onClick={addCertification}
                  className="text-[12px] px-3 py-1.5 rounded-lg border border-[rgba(240,236,228,0.16)] text-[#f0ece4] bg-[rgba(240,236,228,0.08)] hover:bg-[rgba(240,236,228,0.14)]"
                >
                  + Add Certification
                </button>
              }
            >
              <div className="space-y-4">
                {data.portfolio.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[rgba(240,236,228,0.08)] bg-[rgba(255,255,255,0.01)] p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Certification Name</Label>
                        <Input
                          value={cert.name}
                          onChange={(v) => updateCertification(idx, { name: v })}
                          placeholder="Certification name"
                        />
                      </div>
                      <div>
                        <Label>Issuer</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(v) => updateCertification(idx, { issuer: v })}
                          placeholder="Issuer"
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={toDateInput(cert.date)}
                          onChange={(v) => updateCertification(idx, { date: v })}
                        />
                        {cert.date ? (
                          <p className="text-[11px] mt-1 text-[rgba(240,236,228,0.45)]">
                            {toDisplayDateDDMMYYYY(cert.date)}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {cert.image?.url ? (
                      <div className="mt-3 rounded-xl overflow-hidden border border-[rgba(240,236,228,0.08)]">
                        <img
                          src={cert.image.url}
                          alt={cert.name || "Certificate"}
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          openConfirm({
                            title: "Remove certification?",
                            description: "This certification entry will be permanently removed.",
                            onConfirm: () => removeCertification(idx),
                          })
                        }
                        className="text-[12px] text-red-400/80 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="xl:col-span-3">
            {formError ? <p className="text-[13px] text-red-400 mb-3">{formError}</p> : null}
            <div className="flex items-center justify-between pt-2">
              <a
                href="/"
                className="text-[13px] tracking-[0.03em] text-[rgba(240,236,228,0.35)] no-underline transition-colors duration-200 hover:text-[rgba(240,236,228,0.7)]"
              >
                Cancel
              </a>
              <button
                type="submit"
                disabled={saving || !canSaveProfile}
                className="text-[13px] tracking-[0.04em] px-7 py-3 rounded-xl border border-[rgba(240,236,228,0.18)] bg-[rgba(240,236,228,0.1)] text-[#f0ece4] transition-all duration-200 hover:bg-[rgba(240,236,228,0.18)] hover:border-[rgba(240,236,228,0.28)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        onCancel={closeConfirm}
        onConfirm={handleConfirm}
      />
    </div>
  );
}