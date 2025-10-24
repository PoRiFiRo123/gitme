import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MetadataModal, RepoMetadata } from "@/components/MetadataModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Sparkles, Code2, FileText, Zap, ArrowRight, CheckCircle2, Star, GitBranch, Package, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const validateGitHubUrl = (url: string): boolean => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubRegex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    if (!validateGitHubUrl(repoUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid public GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setIsModalOpen(true);
    }, 500);
  };

  const handleMetadataSubmit = (metadata: RepoMetadata) => {
    const params = new URLSearchParams({
      repo: repoUrl,
      metadata: JSON.stringify(metadata),
    });
    navigate(`/processing?${params.toString()}`);
  };

  const features = [
    {
      icon: Code2,
      title: "Smart Analysis",
      description: "AI analyzes your codebase structure, dependencies, and patterns to understand your project deeply.",
      gradient: "from-blue-500 to-cyan-500",
      delay: "0"
    },
    {
      icon: Sparkles,
      title: "Multi-Model AI",
      description: "Gemini primary with Groq fallback ensures 99% success rate with intelligent failover.",
      gradient: "from-purple-500 to-pink-500",
      delay: "100"
    },
    {
      icon: FileText,
      title: "Live Editor",
      description: "Edit and preview your README in real-time with full markdown support and syntax highlighting.",
      gradient: "from-amber-500 to-orange-500",
      delay: "200"
    }
  ];

  const benefits = [
    { text: "Automatic project structure detection", icon: GitBranch },
    { text: "Smart dependency analysis", icon: Package },
    { text: "Professional templates", icon: Star },
    { text: "Installation & usage guides", icon: FileText },
    { text: "Contribution guidelines", icon: Users },
    { text: "Badge generation", icon: CheckCircle2 }
  ];

  const stats = [
    { value: "10K+", label: "READMEs Generated" },
    { value: "99%", label: "Success Rate" },
    { value: "5s", label: "Average Time" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(148, 163, 184) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(148, 163, 184) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)'
          }}
        ></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-6xl mx-auto space-y-20">
            
            {/* Hero Section */}
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AI-Powered Documentation
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Generate Professional
                </span>
                <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  READMEs
                </span>
                <span className="block mt-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                Transform any GitHub repository into comprehensive documentation using{" "}
                <span className="text-cyan-400 font-semibold">advanced AI</span>.
                Multi-model reliability ensures perfect results every time.
              </p>
            </div>

            {/* Input Section */}
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <form onSubmit={handleSubmit}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative flex flex-col sm:flex-row gap-3 p-3 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800/50">
                    <div className="relative flex-1">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <Input
                        type="url"
                        placeholder="https://github.com/username/repository"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="pl-12 h-14 text-base bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500 rounded-xl transition-all"
                      />
                    </div>
                    <Button
                      type="submit"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      size="lg"
                      disabled={isValidating}
                      className="h-14 px-8 text-base font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 rounded-xl transition-all transform hover:scale-105"
                    >
                      {isValidating ? (
                        "Validating..."
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate
                          <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  No signup required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Public repositories
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  100% free
                </span>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              {stats.map((stat, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Powerful Features
                </h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                  Everything you need to create professional documentation
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group relative animate-in fade-in slide-in-from-bottom-4 duration-1000"
                    style={{ animationDelay: `${feature.delay}ms` }}
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                    <Card className="relative h-full border-slate-800 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-900/80 transition-all duration-300 transform group-hover:-translate-y-2 rounded-2xl overflow-hidden">
                      <CardHeader className="space-y-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl`}>
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                        <CardDescription className="text-base text-slate-400 leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Everything You Need
                  </span>
                  <br />
                  <span className="text-slate-500">In One Place</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Our AI analyzes your repository and generates comprehensive documentation including:
                </p>
                <div className="grid gap-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm hover:bg-slate-900/50 hover:border-slate-700 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <benefit.icon className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="text-base text-slate-300">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
                <Card className="relative border-slate-800 bg-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Code2 className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-white">Live Preview & Editing</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400">
                      Review and customize your generated README with our built-in editor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-slate-950/50 rounded-xl p-6 space-y-3 border border-slate-800/50">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="h-4 bg-gradient-to-r from-blue-500/40 to-transparent rounded-lg w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gradient-to-r from-purple-500/40 to-transparent rounded-lg w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-4 bg-gradient-to-r from-cyan-500/40 to-transparent rounded-lg w-2/3 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <div className="h-4 bg-gradient-to-r from-blue-500/40 to-transparent rounded-lg w-4/5 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Split-screen editor with live markdown preview, syntax highlighting, and instant download
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Section */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
              <Card className="relative border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
                <CardContent className="relative py-16">
                  <div className="text-center space-y-8 max-w-3xl mx-auto">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto transform hover:scale-110 hover:rotate-6 transition-all shadow-2xl shadow-blue-500/50">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                      Trusted by Developers Worldwide
                    </h3>
                    <p className="text-xl text-slate-400 leading-relaxed">
                      Join thousands of developers who have saved time and improved their project documentation
                    </p>
                    <Button
                      size="lg"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 rounded-xl transform hover:scale-105 transition-all"
                    >
                      Get Started Now
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <MetadataModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleMetadataSubmit}
        repoUrl={repoUrl}
      />

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;