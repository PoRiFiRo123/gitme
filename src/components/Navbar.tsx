import { Github, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="max-w-7xl mx-auto">
        {/* Glassy Container */}
        <div className="relative backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl shadow-black/20">
          {/* Glass reflection effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-2xl"></div>
          
          {/* Content */}
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                  {/* Animated Logo Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl">
                      <BookOpen className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Brand Text */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent tracking-tight">
                        GitMe
                      </h1>
                      <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
                        <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                          AI
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      README Generator
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions Section */}
              <div className="flex items-center gap-3">
                {/* Optional: Add more nav items here */}
                <div className="hidden md:flex items-center gap-2 mr-2">
                  <a 
                    href="/"
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                  >
                    Home
                  </a>
                  <a 
                    href="/docs"
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                  >
                    Docs
                  </a>
                </div>

                {/* GitHub Button */}
                <a
                  href="https://github.com/yourusername/gitme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden px-4 py-2 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center gap-2">
                    <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors hidden sm:inline">
                      Star on GitHub
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};