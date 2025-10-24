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
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-readme`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              repoUrl,
              metadata: metadata ? JSON.parse(metadata) : {},
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to process repository");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let buffer = "";
        let logCount = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === "log") {
                logCount++;
                setProgress(Math.min(90, logCount * 15));
                setCurrentStep(data.message);
                setLogs((prev) => [
                  ...prev,
                  {
                    message: data.message,
                    type: data.logType || "info",
                    timestamp: new Date(),
                  },
                ]);
              } else if (data.type === "complete") {
                setProgress(100);
                setCurrentStep("Complete!");
                setIsProcessing(false);
                setTimeout(() => {
                  navigate(`/editor?content=${encodeURIComponent(data.readme)}`);
                }, 500);
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            }
          }
        }
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
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="h-12 w-12 rounded-xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Processing Repository
                </h1>
                <p className="text-slate-400 mt-2 flex items-center gap-2">
                  <span>Analyzing:</span>
                  <span className="font-mono text-blue-400 bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-800">
                    {repoUrl}
                  </span>
                </p>
              </div>
            </div>

            {/* Main Processing Card */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-3xl opacity-75"></div>
              <Card className="relative border-slate-800 bg-slate-900/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
                
                <CardHeader className="space-y-6 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl">
                          {isProcessing ? (
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-8 h-8 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                          {isProcessing ? "Generating README" : "Complete!"}
                        </CardTitle>
                        <p className="text-base text-slate-400">
                          {currentStep}
                        </p>
                      </div>
                    </div>
                    <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300 font-bold">
                      {Math.round(progress)}%
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="relative h-3 rounded-full bg-slate-800/50 overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/50"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/20 to-transparent rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 relative">
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
                          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity ${isActive ? 'opacity-30' : ''}`}></div>
                          <div className={`relative flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all ${
                            isActive
                              ? "border-slate-700 bg-slate-800/50"
                              : "border-slate-800 bg-slate-900/30"
                          }`}>
                            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                              isComplete
                                ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20"
                                : isActive
                                ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
                                : "bg-slate-800/50"
                            }`}>
                              {isComplete ? (
                                <CheckCircle2 className="w-8 h-8 text-green-400 animate-in zoom-in duration-500" />
                              ) : (
                                <StepIcon className={`w-8 h-8 transition-all ${
                                  isActive ? "text-white" : "text-slate-600"
                                } ${isActive && !isComplete ? 'animate-pulse' : ''}`} />
                              )}
                            </div>
                            <div className="text-center space-y-1">
                              <span className={`text-sm font-semibold transition-colors ${
                                isActive ? "text-white" : "text-slate-500"
                              }`}>
                                {step.label}
                              </span>
                              {isComplete && (
                                <div className="text-xs text-green-400 font-medium">
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
                          <Zap className="w-5 h-5 text-blue-400" />
                          <h3 className="text-lg font-bold text-white">Activity Log</h3>
                        </div>
                        <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-300">
                          {logs.length} events
                        </Badge>
                      </div>
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur"></div>
                        <div className="relative bg-slate-950/50 backdrop-blur-sm rounded-2xl p-6 font-mono text-sm max-h-72 overflow-y-auto space-y-2 border border-slate-800/50 custom-scrollbar">
                          {logs.map((log, index) => (
                            <div
                              key={index}
                              className="text-slate-400 animate-in fade-in slide-in-from-left-2 duration-300 flex items-start gap-2"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              {log.type === 'error' ? (
                                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              ) : log.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              ) : (
                                <span className="text-blue-400 mt-0.5 flex-shrink-0">›</span>
                              )}
                              <span className={`flex-1 ${
                                log.type === 'error' ? 'text-red-400' : 
                                log.type === 'success' ? 'text-green-400' : 
                                'text-slate-400'
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
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <p className="text-sm font-medium">
                  This usually takes 10-30 seconds depending on repository size
                </p>
              </div>
              <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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
      `}</style>
    </div>
  );
};

export default Processing;