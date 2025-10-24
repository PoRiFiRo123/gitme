import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Check, Code2, Eye, FileText, Sparkles, Zap, RefreshCw, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Editor = () => {
  const [searchParams] = useSearchParams();
  const initialContent = searchParams.get("content") || "";
  
  const [content, setContent] = useState(initialContent);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"split" | "edit" | "preview">("split");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "README content has been copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "README.md has been downloaded.",
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share link copied",
      description: "Share link has been copied to clipboard.",
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset? This will restore the original content.")) {
      setContent(initialContent);
      toast({
        title: "Content reset",
        description: "Content has been reset to original.",
      });
    }
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const lineCount = content.split('\n').length;
  const charCount = content.length;
  const headingCount = (content.match(/^#{1,6}\s/gm) || []).length;

  const stats = [
    { label: "Words", value: wordCount, icon: FileText },
    { label: "Lines", value: lineCount, icon: Code2 },
    { label: "Characters", value: charCount, icon: Eye },
    { label: "Headings", value: headingCount, icon: Sparkles }
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                README Editor
              </h1>
              <p className="text-slate-400 text-lg">Edit and preview your generated documentation</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Card className="relative border-slate-800 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-900/80 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                            <StatIcon className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-slate-400">{stat.label}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center gap-2 p-1.5 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800">
                <Button
                  variant={view === "edit" ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 ${view === "edit" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "text-slate-400 hover:text-white"}`}
                  onClick={() => setView("edit")}
                >
                  <Code2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant={view === "split" ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 ${view === "split" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "text-slate-400 hover:text-white"}`}
                  onClick={() => setView("split")}
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Split</span>
                </Button>
                <Button
                  variant={view === "preview" ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 ${view === "preview" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "text-slate-400 hover:text-white"}`}
                  onClick={() => setView("preview")}
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Preview</span>
                </Button>
              </div>

              <div className="flex-1"></div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white backdrop-blur-xl"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white backdrop-blur-xl"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white backdrop-blur-xl"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>

            {/* Editor Container */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl opacity-50"></div>
              <Card className="relative border-slate-800 bg-slate-900/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent"></div>
                
                {view === "edit" && (
                  <div className="relative">
                    <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-slate-300">README.md</span>
                      </div>
                      <Badge className="ml-auto bg-green-500/20 text-green-300 border-green-500/30">
                        Markdown
                      </Badge>
                    </div>
                    <div className="p-6">
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[600px] font-mono text-sm resize-none bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 transition-colors"
                        placeholder="Edit your README content here..."
                      />
                    </div>
                  </div>
                )}

                {view === "preview" && (
                  <div className="relative">
                    <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-slate-300">Preview</span>
                      </div>
                      <Badge className="ml-auto bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        Live
                      </Badge>
                    </div>
                    <div className="p-8 min-h-[600px] overflow-y-auto custom-scrollbar">
                      <div className="prose prose-invert prose-green max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {view === "split" && (
                  <div className="relative grid md:grid-cols-2 grid-cols-1">
                    <div className="border-r border-slate-800">
                      <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-slate-300">Editor</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <Textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="min-h-[600px] font-mono text-sm resize-none bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 transition-colors"
                          placeholder="Edit your README content here..."
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-slate-300">Preview</span>
                        </div>
                      </div>
                      <div className="flex-1 p-8 overflow-y-auto bg-slate-950/30 custom-scrollbar">
                        <div className="prose prose-invert prose-green max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Tips Section */}
            <div className="grid md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <Card className="border-slate-800 bg-slate-900/30 backdrop-blur-xl hover:bg-slate-900/50 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-lg text-white">Quick Tip</CardTitle>
                  <CardDescription className="text-slate-400">
                    Use Ctrl/Cmd + S to save your work locally
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-800 bg-slate-900/30 backdrop-blur-xl hover:bg-slate-900/50 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg text-white">Markdown Support</CardTitle>
                  <CardDescription className="text-slate-400">
                    Full GitHub Flavored Markdown (GFM) supported
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-800 bg-slate-900/30 backdrop-blur-xl hover:bg-slate-900/50 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                  <CardTitle className="text-lg text-white">Auto-Save</CardTitle>
                  <CardDescription className="text-slate-400">
                    Your changes are preserved in the URL
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.8);
        }
        
        .prose-green {
          --tw-prose-body: rgb(226, 232, 240);
          --tw-prose-headings: rgb(255, 255, 255);
          --tw-prose-links: rgb(52, 211, 153);
          --tw-prose-bold: rgb(255, 255, 255);
          --tw-prose-code: rgb(167, 243, 208);
          --tw-prose-pre-bg: rgb(15, 23, 42);
          --tw-prose-quotes: rgb(203, 213, 225);
        }
      `}</style>
    </div>
  );
};

export default Editor;