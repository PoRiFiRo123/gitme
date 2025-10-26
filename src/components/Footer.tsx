import { Github, ArrowRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative mt-24 py-12 border-t border-slate-200 bg-gradient-to-br from-white to-blue-50/50 shadow-t-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* Brand Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-300/50">
                <img src="/logo.svg" alt="GitRead Logo" className="w-6 h-6 invert" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent drop-shadow-sm">
                GitRead
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium max-w-sm">
              AI-powered README generator for your GitHub repositories. Create professional, comprehensive documentation in seconds, effortlessly.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-base text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2 group">
                  Home
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-base text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2 group">
                  How It Works
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#features" className="text-base text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2 group">
                  Features
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/PoRiFiRo123/gitread" target="_blank" rel="noopener noreferrer" className="text-base text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2 group">
                  <Github className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */} 
        <div className="pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} GitRead. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
