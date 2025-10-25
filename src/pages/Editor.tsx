import { useState, useRef } from "react";
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
  const [scrollSyncEnabled, setScrollSyncEnabled] = useState<boolean>(true);

  const editorTextRef = useRef<HTMLTextAreaElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  const handleEditorScrollSplit = () => {
    if (view !== "split" || !scrollSyncEnabled) return;
    const editorEl = editorTextRef.current;
    const previewEl = previewScrollRef.current;
    if (!editorEl || !previewEl || isSyncingRef.current) return;
  
    const maxSrc = editorEl.scrollHeight - editorEl.clientHeight;
    const maxDst = previewEl.scrollHeight - previewEl.clientHeight;
    if (maxSrc <= 0 || maxDst <= 0) return;
  
    const ratio = editorEl.scrollTop / maxSrc;
    isSyncingRef.current = true;
    requestAnimationFrame(() => {
      previewEl.scrollTop = ratio * maxDst;
      isSyncingRef.current = false;
    });
  };

  const handlePreviewScrollSplit = () => {
    if (view !== "split" || !scrollSyncEnabled) return;
    const editorEl = editorTextRef.current;
    const previewEl = previewScrollRef.current;
    if (!editorEl || !previewEl || isSyncingRef.current) return;
  
    const maxSrc = previewEl.scrollHeight - previewEl.clientHeight;
    const maxDst = editorEl.scrollHeight - editorEl.clientHeight;
    if (maxSrc <= 0 || maxDst <= 0) return;
  
    const ratio = previewEl.scrollTop / maxSrc;
    isSyncingRef.current = true;
    requestAnimationFrame(() => {
      editorEl.scrollTop = ratio * maxDst;
      isSyncingRef.current = false;
    });
  };

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
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                README Editor
              </h1>
              <p className="text-slate-600 text-lg font-medium">Edit and preview your generated documentation</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-300/40 to-indigo-300/40 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Card className="relative border-2 border-blue-200/50 bg-white/70 backdrop-blur-xl hover:bg-white/90 hover:border-blue-300 transition-all shadow-lg shadow-blue-200/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-300/50">
                            <StatIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                            <div className="text-xs text-slate-600 font-semibold">{stat.label}</div>
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
              <div className="flex items-center gap-2 p-1.5 bg-white/70 backdrop-blur-xl rounded-2xl border-2 border-blue-200/50 shadow-lg shadow-blue-200/30">
                <Button
                  variant={view === "edit" ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 ${view === "edit" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-300/50" : "text-slate-600 hover:text-slate-800 hover:bg-blue-50"}`}
                  onClick={() => setView("edit")}
                >
                  <Code2 className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">Edit</span>
                </Button>
                <Button
                  variant={view === "split" ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 ${view === "split" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-300/50" : "text-slate-600 hover:text-slate-800 hover:bg-blue-50"}`}
                  onClick={() => setView("split")}
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">Split</span>
                </Button>
                <Button
                  variant={view === "preview" ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 ${view === "preview" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-300/50" : "text-slate-600 hover:text-slate-800 hover:bg-blue-50"}`}
                  onClick={() => setView("preview")}
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">Preview</span>
                </Button>
              </div>

              <div className="flex-1"></div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setScrollSyncEnabled((v) => !v)}
                  size="sm"
                  title={scrollSyncEnabled ? "Disable scroll sync" : "Enable scroll sync"}
                  className={`gap-2 ${
                    scrollSyncEnabled
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-300/50"
                      : "bg-white/70 border-2 border-blue-200 text-slate-600 hover:bg-white hover:border-blue-300 backdrop-blur-xl shadow-lg shadow-blue-200/30"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="font-bold">{scrollSyncEnabled ? "Sync On" : "Sync Off"}</span>
                </Button>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/70 border-2 border-blue-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-blue-300 backdrop-blur-xl shadow-lg shadow-blue-200/30"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">Reset</span>
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/70 border-2 border-blue-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-blue-300 backdrop-blur-xl shadow-lg shadow-blue-200/30"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">Share</span>
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/70 border-2 border-blue-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-blue-300 backdrop-blur-xl shadow-lg shadow-blue-200/30"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline font-bold">Copy</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-300/50 font-bold"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>

            {/* Editor Container */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-300/40 via-indigo-300/40 to-purple-300/40 rounded-3xl blur-3xl opacity-50"></div>
              <Card className="relative border-2 border-blue-200/50 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50 h-[calc(100vh-260px)] md:h-[calc(100vh-300px)] flex flex-col min-h-[520px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-transparent pointer-events-none"></div>
                
                {/* EDIT VIEW */}
                {view === "edit" && (
                  <div className="relative flex flex-col h-full min-h-0">
                    <div className="px-6 py-3 border-b-2 border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-slate-700">README.md</span>
                      </div>
                      <Badge className="ml-auto bg-blue-100 text-blue-700 border border-blue-300 font-bold">
                        Markdown
                      </Badge>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 min-h-0">
                      <Textarea 
                        ref={editorTextRef} 
                        onScroll={handleEditorScrollSplit} 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="custom-scrollbar w-full h-full min-h-0 font-mono text-sm resize-none bg-slate-50 border-2 border-blue-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-colors rounded-xl"
                        placeholder="Edit your README content here..."
                      />
                    </div>
                  </div>
                )}

                {/* PREVIEW VIEW */}
                {view === "preview" && (
                  <div className="relative flex flex-col h-full min-h-0">
                    <div className="px-6 py-3 border-b-2 border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-bold text-slate-700">Preview</span>
                      </div>
                      <Badge className="ml-auto bg-indigo-100 text-indigo-700 border border-indigo-300 font-bold">
                        Live
                      </Badge>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 min-h-0 custom-scrollbar">
                      <div className="custom-scrollbar prose prose-slate prose-blue max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* SPLIT VIEW */}
                {view === "split" && (
                  <div className="relative grid md:grid-cols-2 grid-cols-1 h-full min-h-0">
                    {/* Editor Panel */}
                    <div className="flex flex-col border-b-2 md:border-b-0 md:border-r-2 border-blue-200/50 min-h-0">
                      <div className="px-6 py-3 border-b-2 border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-slate-700">Editor</span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6 min-h-0">
                        <Textarea
                          ref={editorTextRef} 
                          onScroll={handleEditorScrollSplit}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="custom-scrollbar w-full h-full min-h-0 font-mono text-sm resize-none bg-slate-50 border-2 border-blue-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-colors rounded-xl"
                          placeholder="Edit your README content here..."
                        />
                      </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="flex flex-col min-h-0">
                      <div className="px-6 py-3 border-b-2 border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-bold text-slate-700">Preview</span>
                        </div>
                      </div>
                      <div
                        className="flex-1 p-8 overflow-y-auto min-h-0 custom-scrollbar"
                        ref={previewScrollRef}
                        onScroll={handlePreviewScrollSplit}
                      >
                        <div className="custom-scrollbar prose prose-slate prose-blue max-w-none">
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
              <Card className="border-2 border-blue-200/50 bg-white/60 backdrop-blur-xl hover:bg-white/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-200/50 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-blue-300/50">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-800 font-bold">Quick Tip</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Use Ctrl/Cmd + S to save your work locally
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-blue-200/50 bg-white/60 backdrop-blur-xl hover:bg-white/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-200/50 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-purple-300/50">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-800 font-bold">Markdown Support</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Full GitHub Flavored Markdown (GFM) supported
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-blue-200/50 bg-white/60 backdrop-blur-xl hover:bg-white/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-200/50 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-blue-300/50">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-800 font-bold">Auto-Save</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Your changes are preserved in the URL
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-40px, 30px) rotate(-5deg); }
          66% { transform: translate(30px, -20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px !important;
          height: 12px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(219, 234, 254, 0.5) !important;
          border-radius: 10px !important;
          border: 2px solid rgba(147, 197, 253, 0.3) !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(59, 130, 246), rgb(99, 102, 241)) !important;
          border-radius: 10px !important;
          border: 3px solid rgba(219, 234, 254, 0.5) !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(37, 99, 235), rgb(79, 70, 229)) !important;
        }
        
        .prose-blue {
          --tw-prose-body: rgb(71, 85, 105);
          --tw-prose-headings: rgb(30, 41, 59);
          --tw-prose-links: rgb(59, 130, 246);
          --tw-prose-bold: rgb(30, 41, 59);
          --tw-prose-code: rgb(37, 99, 235);
          --tw-prose-pre-bg: rgb(248, 250, 252);
          --tw-prose-quotes: rgb(100, 116, 139);
          --tw-prose-counters: rgb(100, 116, 139);
          --tw-prose-bullets: rgb(203, 213, 225);
        }
        
        .prose-blue h1, .prose-blue h2, .prose-blue h3, .prose-blue h4, .prose-blue h5, .prose-blue h6 {
          color: rgb(30, 41, 59) !important;
          font-weight: 800 !important;
        }
        
        .prose-blue p {
          color: rgb(71, 85, 105) !important;
        }
        
        .prose-blue strong {
          color: rgb(30, 41, 59) !important;
          font-weight: 700 !important;
        }
      `}</style>
    </div>
  );
};

export default Editor;