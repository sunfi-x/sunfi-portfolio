"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface VersionSwitcherProps {
  versions: { title: string; slug: string }[];
  currentSlug?: string;
}

export function VersionSwitcher({ versions, currentSlug }: VersionSwitcherProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "base") {
      router.push("/resume");
    } else {
      router.push(`/resume/${value}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
      <label htmlFor="resume-version" className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
        Resume Version
      </label>
      <select
        id="resume-version"
        value={currentSlug || "base"}
        onChange={handleChange}
        style={{
          backgroundColor: '#111',
          border: '1px solid #222',
          color: '#ffffff',
          outline: 'none',
        }}
        className="text-[13px] rounded-md px-3 py-2 w-full sm:w-auto cursor-pointer focus:border-[#FF0000] transition-colors"
      >
        <option value="base">Base Resume (All)</option>
        {versions.map((v) => (
          <option key={v.slug} value={v.slug}>
            {v.title}
          </option>
        ))}
      </select>
    </div>
  );
}
