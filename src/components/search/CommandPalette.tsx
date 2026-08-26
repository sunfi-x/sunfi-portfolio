"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, FileText, Briefcase, BookOpen, User, Mail, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]">
      <Command
        className="w-full max-w-lg border border-[rgba(255,0,60,0.2)] bg-[#0a0a0a] rounded-xl shadow-[0_0_40px_rgba(255,0,60,0.15)] overflow-hidden"
        loop
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-white/10 px-3" cmdk-input-wrapper="">
          <Search className="mr-2 h-5 w-5 shrink-0 text-white/50" />
          <Command.Input
            autoFocus
            placeholder="Search projects, blogs, pages..."
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-white/50 text-white"
          />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
          <Command.Empty className="py-6 text-center text-sm text-white/50">
            No results found.
          </Command.Empty>

          <Command.Group heading="Pages" className="px-2 py-1 text-xs font-medium text-white/50 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-white/40">
            <Command.Item
              onSelect={() => runCommand(() => router.push("/"))}
              className="flex items-center gap-2 px-2 py-2.5 rounded-md text-sm text-white/80 cursor-pointer aria-selected:bg-[rgba(255,0,60,0.2)] aria-selected:text-white transition-colors"
            >
              <User className="h-4 w-4" /> Home
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/resume"))}
              className="flex items-center gap-2 px-2 py-2.5 rounded-md text-sm text-white/80 cursor-pointer aria-selected:bg-[rgba(255,0,60,0.2)] aria-selected:text-white transition-colors"
            >
              <FileText className="h-4 w-4" /> Resume
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/projects"))}
              className="flex items-center gap-2 px-2 py-2.5 rounded-md text-sm text-white/80 cursor-pointer aria-selected:bg-[rgba(255,0,60,0.2)] aria-selected:text-white transition-colors"
            >
              <Briefcase className="h-4 w-4" /> Projects
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/blogs"))}
              className="flex items-center gap-2 px-2 py-2.5 rounded-md text-sm text-white/80 cursor-pointer aria-selected:bg-[rgba(255,0,60,0.2)] aria-selected:text-white transition-colors"
            >
              <BookOpen className="h-4 w-4" /> Blogs
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/papers"))}
              className="flex items-center gap-2 px-2 py-2.5 rounded-md text-sm text-white/80 cursor-pointer aria-selected:bg-[rgba(255,0,60,0.2)] aria-selected:text-white transition-colors"
            >
              <FileText className="h-4 w-4" /> Papers
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/gallery"))}
              className="flex items-center gap-2 px-2 py-2.5 rounded-md text-sm text-white/80 cursor-pointer aria-selected:bg-[rgba(255,0,60,0.2)] aria-selected:text-white transition-colors"
            >
              <ImageIcon className="h-4 w-4" /> Gallery
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/contact"))}
              className="flex items-center gap-2 px-2 py-2.5 rounded-md text-sm text-white/80 cursor-pointer aria-selected:bg-[rgba(255,0,60,0.2)] aria-selected:text-white transition-colors"
            >
              <Mail className="h-4 w-4" /> Contact
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
      
      {/* Background click listener to close */}
      <div 
        className="absolute inset-0 z-[-1]" 
        onClick={() => setOpen(false)}
      />
    </div>
  );
}
