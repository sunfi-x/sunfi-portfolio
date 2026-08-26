import { Camera } from "lucide-react";
import { fetchAllGallery } from "@/sanity/lib/fetchers";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Visual Diary | Khondoker Sazzad Sunfi",
  description:
    "Moments captured from speaking engagements, hackathons, and creative work — displayed in a natural masonry layout.",
};

export default async function GalleryPage() {
  const images = await fetchAllGallery();

  if (images.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-[#050505] min-h-screen">
        <Camera className="w-16 h-16 mx-auto mb-4 opacity-20 text-[#FF003C]" />
        <p className="text-lg text-gray-500 font-mono tracking-widest">NO_DATA_FOUND</p>
      </div>
    );
  }

  return <GalleryGrid images={images} />;
}
