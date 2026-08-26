import type { PortableTextBlock } from "@portabletext/react";

// ─── Shared ──────────────────────────────────────────────────────────────────

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  alt?: string;
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
  icon?: string;
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface SkillCategory {
  _key: string;
  category: string;
  items: string[];
}

export interface ExperienceItem {
  _key: string;
  role: string;
  company: string;
  period?: string;
  current?: boolean;
  responsibilities?: string[];
}

export interface EducationItem {
  _key: string;
  degree: string;
  institution: string;
  period?: string;
}

export interface Profile {
  _id: string;
  name: string;
  tagline?: string;
  bio?: string;
  about?: PortableTextBlock[];
  avatar?: SanityImage;
  email?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  isAvailable?: boolean;
  skills?: SkillCategory[];
  socialLinks?: SocialLink[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  isFeatured?: boolean;
  mainImage?: SanityImage;
  shortDescription?: string;
  problem?: string;
  solution?: string;
  techStack?: string[];
  challenges?: string;
  impact?: string;
  githubUrl?: string;
  liveUrl?: string;
  order?: number;
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  mainImage?: SanityImage;
  excerpt?: string;
  body?: PortableTextBlock[];
  tags?: string[];
  readTime?: string;
}

// ─── Paper ───────────────────────────────────────────────────────────────────

export interface Paper {
  _id: string;
  title: string;
  conference?: string;
  year?: number;
  abstract?: string;
  doiLink?: string;
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export interface GalleryImage {
  _id: string;
  title: string;
  image: SanityImage & {
    caption?: string;
  };
  category?: string;
  order?: number;
  // Real pixel dimensions from Sanity asset metadata
  width: number;
  height: number;
  aspectRatio: number;
}

// ─── Contact Info ────────────────────────────────────────────────────────────

export interface ContactInfo {
  _id: string;
  email?: string;
  phone?: string;
  location?: string;
  availabilityMessage?: string;
  isAvailable?: boolean;
  socialLinks?: SocialLink[];
  calendarLink?: string;
}

// ─── Resume System ─────────────────────────────────────────────────────────────

export interface ResumeSkill {
  id: string;
  categoryName: string;
  technologies: string[];
}

export interface ResumeExperience {
  id: string;
  companyName: string;
  role: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  responsibilities?: string[];
  achievements?: string[];
  tags?: string[];
  weight?: number;
}

export interface ResumeProject {
  id: string;
  title: string;
  description?: string;
  techStack?: string[];
  projectLink?: string;
  githubLink?: string;
  tags?: string[];
  isFeatured?: boolean;
  weight?: number;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
}

export interface BaseResume {
  identity: {
    fullName: string;
    title: string;
    profileImageUrl?: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolioWebsite?: string;
    passion?: string;
  };
  professionalSummary?: string;
  skills?: ResumeSkill[];
  experience?: ResumeExperience[];
  projects?: ResumeProject[];
  education?: ResumeEducation[];
  additionalInfo?: {
    certifications?: string[];
    languages?: string[];
    interests?: string[];
  };
}

export interface ResumeVersion {
  _id: string;
  title: string;
  slug: string;
  versionType?: string;
  customSummary?: string;
  selectedSkills?: string[];
  selectedExperience?: string[];
  selectedProjects?: string[];
}

// ─── Skills (Premium Section) ────────────────────────────────────────────────

export type SkillCategoryKey =
  | "ai_ml"
  | "data_science"
  | "fullstack"
  | "backend"
  | "devops";

export interface Skill {
  _id: string;
  title: string;
  category: SkillCategoryKey;
  percentage: number;
  iconSlug?: string;
  hexColor?: string;
  order?: number;
}

export type SkillsByCategory = Record<SkillCategoryKey, Skill[]>;
