import { Github, Heart, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative mt-16 border-t-2 border-blue-200/50 bg-white/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shadow-md">
                <img src="/logo.svg" alt="GitRead Logo" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                GitRead
              </span>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              AI-powered README generator for your GitHub repositories. Create professional documentation in seconds.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="https://git-read.vercel.app" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@git-read.vercel.app" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Support
                </a>
              </li>
              <li>
                <a href="https://git-read.vercel.app" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">
                  Visit Website
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-blue-200/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 font-medium">
              © {new Date().getFullYear()} GitRead. All rights reserved.
            </p>
            <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for developers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
