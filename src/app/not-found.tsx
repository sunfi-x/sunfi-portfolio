import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-8xl md:text-9xl font-bold text-white text-glow">404</h1>
        <div className="absolute inset-0 bg-[#D90429] mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none" />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mx-auto mb-8">
        The system architecture couldn't route your request. The page you're looking for might have been moved or deleted.
      </p>
      
      <Link 
        href="/"
        className="flex items-center gap-2 px-8 py-4 bg-[#D90429] text-white font-semibold rounded-full hover:bg-[#ff3366] hover:shadow-[0_0_20px_rgba(255,0,60,0.5)] transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Return to Base
      </Link>
    </div>
  );
}
