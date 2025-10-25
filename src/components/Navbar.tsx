import { Github, BookOpen, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getRepoStars } from "@/utils/githubApiClient";

export const Navbar = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStars() {
      try {
        const starCount = await getRepoStars("PoRiFiRo123", "GitRead");
        setStars(starCount);
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      }
    }

    fetchStars();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="max-w-7xl mx-auto">
        {/* Glassy Container with Light Theme */}
        <div className="relative backdrop-blur-2xl bg-white/70 rounded-3xl border-2 border-blue-200/50 shadow-2xl shadow-blue-200/30">
          {/* Gradient overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100/30 to-transparent rounded-3xl"></div>
          
          {/* Subtle top shine */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>
          
          {/* Content */}
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                  {/* Animated Logo Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-blue-300/50">
                      <BookOpen className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Brand Text */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent tracking-tight">
                        GitRead
                      </h1>
                      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300/50 shadow-sm">
                        <Sparkles className="w-3 h-3 text-blue-600 animate-sparkle" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                          AI
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold">
                      README Generator
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions Section */}
              <div className="flex items-center gap-3">
                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-2 mr-2">
                  <a 
                    href="/"
                    className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-xl hover:bg-blue-50"
                  >
                    Home
                  </a>
                  {/* <a 
                    href="/docs"
                    className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-xl hover:bg-blue-50"
                  >
                    Docs
                  </a> */}
                </div>

                {/* GitHub Button */}
                <a
                  href="https://github.com/PoRiFiRo123/GitRead"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden px-5 py-2.5 rounded-2xl backdrop-blur-sm bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-blue-200/50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300"
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-indigo-100/0 to-purple-100/0 group-hover:from-blue-100/50 group-hover:via-indigo-100/50 group-hover:to-purple-100/50 transition-all duration-300"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center gap-2.5">
                    <Github className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors hidden sm:inline">
                      Star on GitHub
                    </span>
                    {stars !== null && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 border border-yellow-200">
                        <Star className="w-3.5 h-3.5 text-yellow-600 fill-yellow-500" />
                        <span className="text-sm font-bold text-slate-700">{stars}</span>
                      </div>
                    )}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes sparkle {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          25% { 
            transform: rotate(90deg) scale(1.2);
            opacity: 0.8;
          }
          50% { 
            transform: rotate(180deg) scale(1);
            opacity: 1;
          }
          75% { 
            transform: rotate(270deg) scale(1.2);
            opacity: 0.8;
          }
        }
        .animate-sparkle {
          animation: sparkle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};