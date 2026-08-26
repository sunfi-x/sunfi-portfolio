import { HeroSection } from "@/components/home/HeroSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { AboutSectionWrapper } from "@/components/home/AboutSectionWrapper";
import { FeaturedProjectsWrapper } from "@/components/home/FeaturedProjectsWrapper";
import { BlogsPreview } from "@/components/home/BlogsPreview";
import { GitHubActivity } from "@/components/home/GitHubActivity";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { ContactCTA } from "@/components/home/ContactCTA";
import {
  fetchProfile,
  fetchFeaturedProjects,
  fetchRecentBlogs,
  fetchAllGallery,
  fetchContactInfo,
  fetchAllSkills,
} from "@/sanity/lib/fetchers";

export const revalidate = 60;

import { PageWrapper } from "@/components/home/PageWrapper";

export default async function Home() {
  const [profile, featuredProjects, recentBlogs, galleryImages, contactInfo, skills] =
    await Promise.all([
      fetchProfile(),
      fetchFeaturedProjects(),
      fetchRecentBlogs(),
      fetchAllGallery(),
      fetchContactInfo(),
      fetchAllSkills(),
    ]);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-16">
        {/* 1. Self Intro — Hero */}
        <HeroSection profile={profile} />

        {/* 2. Skills + 3. About Me sequence + 4. Featured Work */}
        <div className="flex flex-col">
          {/* 2. Skills & Expertise */}
          <SkillsSection skills={skills} />

          {/* 3. About Me (Page 01, Page 02, Page 03 sequence) */}
          <AboutSectionWrapper profile={profile} />

          {/* 4. Featured Work */}
          <div className="pt-20 lg:pt-32">
            <FeaturedProjectsWrapper projects={featuredProjects} />
          </div>
        </div>

        {/* 5. Recent Articles */}
        <BlogsPreview blogs={recentBlogs} />

        {/* 6. GitHub Contributions */}
        <GitHubActivity />

        {/* 7. Me — Moments, Portraits & Memories */}
        <GalleryPreview images={galleryImages} />

        {/* 8. Get In Touch */}
        <ContactCTA contactInfo={contactInfo} profile={profile} />
      </div>
    </PageWrapper>
  );
}

