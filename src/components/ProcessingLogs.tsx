import { useEffect, useRef } from "react";
import { Terminal, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProcessingLogsProps {
  logs: LogEntry[];
  isProcessing: boolean;
}

export interface LogEntry {
  message: string;
  type: "info" | "success" | "error" | "warning";
  timestamp: Date;
}

export const ProcessingLogs = ({ logs, isProcessing }: ProcessingLogsProps) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-terminal-success";
      case "error":
        return "text-terminal-error";
      case "warning":
        return "text-terminal-warning";
      default:
        return "text-terminal-text";
    }
  };

  const getLogPrefix = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "warning":
        return "⚠";
      default:
        return "→";
    }
  };

  return (
    <Card className="bg-terminal-bg border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center gap-2 bg-card/50">
        <Terminal className="h-4 w-4 text-primary" />
        <span className="text-sm font-mono font-semibold">Processing Terminal</span>
        {isProcessing && <Loader2 className="h-4 w-4 animate-spin text-primary ml-auto" />}
      </div>
      
      <div className="p-4 font-mono text-sm h-[400px] overflow-y-auto">
        {logs.length === 0 && (
          <div className="text-muted-foreground">
            Waiting for processing to start...
          </div>
        )}
        
        {logs.map((log, index) => (
          <div key={index} className={`mb-2 ${getLogColor(log.type)}`}>
            <span className="text-muted-foreground text-xs mr-2">
              {log.timestamp.toLocaleTimeString()}
            </span>
            <span className="mr-2">{getLogPrefix(log.type)}</span>
            <span>{log.message}</span>
          </div>
        ))}
        
        <div ref={logsEndRef} />
      </div>
    </Card>
  );
};
