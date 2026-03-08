import type { AuthProvider, Category, Languages, PostStatus } from "./constants.types.js";

export interface Portfolio  {
    skills: string[];
    experience: {
        company: string;
        role: string;
        from: Date;
        to: Date | "Present";
        description: string;
    }
    education: {
        institution: string;
        degree: string;
        duration: string;
        score: Number;
        maxScore: Number;
    }
    certifications: {
        name: string;
        issuer: string;
        date: string;
        image: {
            url: string;
            publicId: string;
        }
    }
    achievements: string[];
}

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    portfolio : Portfolio;   
    isVerified: boolean;
    profileImage: {
        url: string;
        publicId: string;
    }
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    googleId?: string;
    provider: AuthProvider;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateToken(): string;
}

export interface Post {
    id: string;
    title: string;
    description: string;
    owner: User;
    interestedUsers: User[];
    maxUsers: number;
    category: Category;
    languages: string[];
    eligibility: string[];
    skillsRequired: string[];
    keywords: string[];
    startAt: string;
    endAt: string;
    status: PostStatus;
}
