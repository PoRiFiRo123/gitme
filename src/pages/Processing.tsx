import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProcessingLogs, LogEntry } from "@/components/ProcessingLogs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, CheckCircle2, FileText, Code2, Sparkles, Zap, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Processing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing...");

  const repoUrl = searchParams.get("repo");
  const metadata = searchParams.get("metadata");

  useEffect(() => {
    if (!repoUrl) {
      navigate("/");
      return;
    }

    const processRepo = async () => {
      try {
        // Dynamically import utilities
        const { getFullRepoFiles } = await import("@/utils/githubApiClient");
        const { generateReadmeWithAI } = await import("@/models/aiClient");

        let logCount = 0;
        
        // Step 1: Fetch repository files from GitHub
        const repoData = await getFullRepoFiles(repoUrl, (message) => {
          logCount++;
          setProgress(Math.min(40, logCount * 8));
          setCurrentStep(message);
          setLogs((prev) => [...prev, { message, type: "info", timestamp: new Date() }]);
        });

        setProgress(50);
        setCurrentStep("Repository data fetched successfully");

        // Step 2: Generate README using AI
        const readme = await generateReadmeWithAI({
          files: repoData.files,
          repoInfo: repoData.repoInfo,
          metadata: metadata ? JSON.parse(metadata) : {},
          onLog: (message, type = "info") => {
            logCount++;
            setProgress(Math.min(90, 50 + logCount * 10));
            setCurrentStep(message);
            setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
          },
        });

        // Step 3: Navigate to editor with generated README
        setProgress(100);
        setCurrentStep("Complete!");
        setIsProcessing(false);
        setTimeout(() => {
          navigate(`/editor?content=${encodeURIComponent(readme)}`);
        }, 500);
      } catch (error) {
        console.error("Processing error:", error);
        setIsProcessing(false);
        setLogs((prev) => [
          ...prev,
          {
            message: error instanceof Error ? error.message : "Unknown error occurred",
            type: "error",
            timestamp: new Date(),
          },
        ]);
        toast({
          title: "Processing Failed",
          description: "An error occurred while processing the repository.",
          variant: "destructive",
        });
      }
    };

    processRepo();
  }, [repoUrl, metadata, navigate]);

  const steps = [
    { icon: FileText, label: "Analyzing repository", threshold: 0 },
    { icon: Code2, label: "Reading codebase", threshold: 30 },
    { icon: Sparkles, label: "Generating content", threshold: 60 },
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
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="h-12 w-12 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-blue-200/50 hover:bg-white/80 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/50 transition-all"
              >
                <ArrowLeft className="h-5 w-5 text-slate-700" />
              </Button>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Processing Repository
                </h1>
                <p className="text-slate-600 mt-2 flex items-center gap-2 font-medium">
                  <span>Analyzing:</span>
                  <span className="font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                    {repoUrl}
                  </span>
                </p>
              </div>
            </div>

            {/* Main Processing Card */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-300/40 via-indigo-300/40 to-purple-300/40 rounded-3xl blur-3xl opacity-75"></div>
              <Card className="relative border-2 border-blue-200/50 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
                
                <CardHeader className="space-y-6 relative p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-blue-400/50">
                          {isProcessing ? (
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-8 h-8 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                          {isProcessing ? "Generating README" : "Complete!"}
                        </CardTitle>
                        <p className="text-base text-slate-600 font-medium">
                          {currentStep}
                        </p>
                      </div>
                    </div>
                    <Badge className="text-lg px-5 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300/50 text-blue-700 font-black shadow-lg shadow-blue-200/50">
                      {Math.round(progress)}%
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="relative h-4 rounded-full bg-gradient-to-r from-slate-100 to-blue-100 overflow-hidden border-2 border-blue-200/50 shadow-inner">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 ease-out shadow-lg"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/40 to-transparent transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 relative p-8 pt-0">
                  {/* Steps Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {steps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isActive = progress > step.threshold;
                      const isComplete = progress > (index + 1) * 30;

                      return (
                        <div
                          key={index}
                          className={`relative group transition-all duration-500 ${
                            isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'
                          }`}
                        >
                          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity ${isActive ? 'opacity-30' : ''}`}></div>
                          <div className={`relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                            isActive
                              ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-200/50"
                              : "border-slate-200 bg-white/60"
                          }`}>
                            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                              isComplete
                                ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-300/50"
                                : isActive
                                ? "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-blue-300/50"
                                : "bg-slate-100"
                            }`}>
                              {isComplete ? (
                                <CheckCircle2 className="w-8 h-8 text-white animate-in zoom-in duration-500" />
                              ) : (
                                <StepIcon className={`w-8 h-8 transition-all ${
                                  isActive ? "text-white" : "text-slate-400"
                                } ${isActive && !isComplete ? 'animate-pulse' : ''}`} />
                              )}
                            </div>
                            <div className="text-center space-y-1">
                              <span className={`text-sm font-bold transition-colors ${
                                isActive ? "text-slate-800" : "text-slate-500"
                              }`}>
                                {step.label}
                              </span>
                              {isComplete && (
                                <div className="text-xs text-emerald-600 font-bold">
                                  ✓ Complete
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Activity Log */}
                  {logs.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-black text-slate-800">Activity Log</h3>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 border-blue-300 text-blue-700 font-bold">
                          {logs.length} events
                        </Badge>
                      </div>
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 rounded-2xl blur"></div>
                        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 backdrop-blur-sm rounded-2xl p-6 font-mono text-sm max-h-72 overflow-y-auto space-y-2 border-2 border-blue-200/50 custom-scrollbar shadow-inner">
                          {logs.map((log, index) => (
                            <div
                              key={index}
                              className="text-slate-600 animate-in fade-in slide-in-from-left-2 duration-300 flex items-start gap-2"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              {log.type === 'error' ? (
                                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              ) : log.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <span className="text-blue-600 mt-0.5 flex-shrink-0 font-bold">›</span>
                              )}
                              <span className={`flex-1 font-medium ${
                                log.type === 'error' ? 'text-red-600' : 
                                log.type === 'success' ? 'text-emerald-600' : 
                                'text-slate-600'
                              }`}>
                                {log.message}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Info Card */}
            <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-400/50"></div>
                <p className="text-sm font-semibold">
                  This usually takes 10-30 seconds depending on repository size
                </p>
              </div>
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                <span>Powered by AI</span>
                <span>•</span>
                <span>Secure Processing</span>
                <span>•</span>
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Processing;
