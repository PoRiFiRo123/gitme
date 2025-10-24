import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProcessingLogs, LogEntry } from "@/components/ProcessingLogs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Processing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

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
                setLogs((prev) => [
                  ...prev,
                  {
                    message: data.message,
                    type: data.logType || "info",
                    timestamp: new Date(),
                  },
                ]);
              } else if (data.type === "complete") {
                setIsProcessing(false);
                navigate(`/editor?content=${encodeURIComponent(data.readme)}`);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Processing Repository</h1>
              <p className="text-muted-foreground mt-1">
                Analyzing: <span className="font-mono text-primary">{repoUrl}</span>
              </p>
            </div>
          </div>

          <ProcessingLogs logs={logs} isProcessing={isProcessing} />
        </div>
      </main>
    </div>
  );
};

export default Processing;
