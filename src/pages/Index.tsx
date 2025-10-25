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
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-50 to-indigo-50",
      delay: "0"
    },
    {
      icon: Sparkles,
      title: "Multi-Model AI",
      description: "Gemini primary with Groq fallback ensures 99% success rate with intelligent failover.",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-50 to-pink-50",
      delay: "100"
    },
    {
      icon: FileText,
      title: "Live Editor",
      description: "Edit and preview your README in real-time with full markdown support and syntax highlighting.",
      gradient: "from-cyan-500 via-teal-500 to-emerald-500",
      bgGradient: "from-cyan-50 to-teal-50",
      delay: "200"
    }
  ];

  const benefits = [
    { text: "Automatic project structure detection", icon: GitBranch },
    { text: "Smart dependency analysis", icon: Package },
    // { text: "Professional templates", icon: Star },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]"></div>
        
        {/* Visible Mesh Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(148, 163, 184) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(148, 163, 184) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        ></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-gradient-to-br from-blue-200/40 via-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-cyan-200/40 via-blue-200/40 to-indigo-200/40 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-[50%] right-[25%] w-[400px] h-[400px] bg-gradient-to-br from-purple-200/30 via-pink-200/30 to-rose-200/30 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Hero Section */}
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border-2 border-blue-200/50 backdrop-blur-sm shadow-lg shadow-blue-200/50 animate-badge-float">
                <Sparkles className="w-4 h-4 text-blue-600 animate-sparkle" />
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-text-shimmer">
                  AI-Powered Documentation
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent drop-shadow-sm">
                  Generate Professional
                </span>
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient drop-shadow-lg">
                  READMEs
                </span>
                <span className="block mt-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent drop-shadow-sm">
                  Instantly
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Transform any GitHub repository into comprehensive documentation using{" "}
                <span className="text-blue-600 font-bold">advanced AI</span>.
                Multi-model reliability ensures perfect results every time.
              </p>
            </div>

            {/* Input Section */}
            <div className="max-w-3xl mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <form onSubmit={handleSubmit}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative flex flex-col sm:flex-row gap-3 p-3 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-blue-200/50 shadow-2xl shadow-blue-200/50">
                    <div className="relative flex-1">
                      <Github className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="url"
                        placeholder="https://github.com/username/repository"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="pl-14 h-16 text-base bg-slate-50/50 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 text-slate-800 placeholder:text-slate-400 rounded-2xl transition-all font-medium"
                      />
                    </div>
                    <Button
                      type="submit"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      size="lg"
                      disabled={isValidating}
                      className="h-16 px-10 text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 rounded-2xl transition-all transform hover:scale-105 hover:-translate-y-0.5"
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

              <div className="flex items-center justify-center gap-8 text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  No signup required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Public repositories
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  100% free
                </span>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              {stats.map((stat, i) => (
                <div key={i} className="text-center space-y-2 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100 shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/50 transition-all hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Powerful Features
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
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
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                    <Card className={`relative h-full border-2 border-blue-100 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl hover:border-blue-200 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-200/50 rounded-3xl overflow-hidden`}>
                      <CardHeader className="space-y-4 p-8">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-blue-300/50`}>
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-slate-800 font-bold">{feature.title}</CardTitle>
                        <CardDescription className="text-base text-slate-600 leading-relaxed font-medium">
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
                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Everything You Need
                  </span>
                  <br />
                  <span className="text-slate-500 font-bold">In One Place</span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  Our AI analyzes your repository and generates comprehensive documentation including:
                </p>
                <div className="grid gap-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100 hover:bg-white/80 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all group hover:-translate-x-1"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-emerald-200/50">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-base text-slate-700 font-semibold">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-300/40 via-indigo-300/40 to-purple-300/40 rounded-3xl blur-2xl"></div>
                <Card className="relative border-2 border-blue-100 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50">
                  <CardHeader className="p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-blue-300/50">
                        <Code2 className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-slate-800 font-bold">Live Preview & Editing</CardTitle>
                    </div>
                    <CardDescription className="text-slate-600 font-medium">
                      Review and customize your generated README with our built-in editor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-8 pt-0">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 space-y-3 border-2 border-blue-100 shadow-inner">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div>
                      </div>
                      <div className="h-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-transparent rounded-lg w-3/4 animate-pulse shadow-sm"></div>
                      <div className="h-4 bg-gradient-to-r from-purple-400 via-pink-400 to-transparent rounded-lg w-1/2 animate-pulse shadow-sm" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-transparent rounded-lg w-2/3 animate-pulse shadow-sm" style={{ animationDelay: '0.4s' }}></div>
                      <div className="h-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-transparent rounded-lg w-4/5 animate-pulse shadow-sm" style={{ animationDelay: '0.6s' }}></div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      Split-screen editor with live markdown preview, syntax highlighting, and instant download
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Section */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-300/40 via-indigo-300/40 to-purple-300/40 rounded-3xl blur-3xl"></div>
              <Card className="relative border-2 border-blue-200 bg-gradient-to-br from-white/90 via-blue-50/90 to-indigo-50/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-indigo-100/20 to-purple-100/20"></div>
                <CardContent className="relative py-16 px-8">
                  <div className="text-center space-y-8 max-w-3xl mx-auto">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center mx-auto transform hover:scale-110 hover:rotate-6 transition-all shadow-2xl shadow-blue-400/50">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Trusted by Developers Worldwide
                    </h3>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                      Join thousands of developers who have saved time and improved their project documentation
                    </p>
                    <Button
                      size="lg"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="h-16 px-12 text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 rounded-2xl transform hover:scale-105 hover:-translate-y-1 transition-all"
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
    </div>
  );
};

export default Index;
