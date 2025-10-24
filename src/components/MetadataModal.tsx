import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Shield, Layers, Info, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

interface MetadataModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (metadata: RepoMetadata) => void;
  repoUrl: string;
}

export interface RepoMetadata {
  description?: string;
  features?: string;
  license?: string;
  additionalContext?: string;
}

const licenses = [
  "MIT",
  "Apache-2.0",
  "GPL-3.0",
  "BSD-3-Clause",
  "ISC",
  "None",
];

export const MetadataModal = ({ open, onClose, onSubmit, repoUrl }: MetadataModalProps) => {
  const [metadata, setMetadata] = useState<RepoMetadata>({});

  const handleSubmit = () => {
    onSubmit(metadata);
    onClose();
  };

  const handleSkip = () => {
    onSubmit({});
    onClose();
  };

  const fields = [
    { filled: !!metadata.description, label: "Description" },
    { filled: !!metadata.features, label: "Features" },
    { filled: !!metadata.additionalContext, label: "Context" },
  ];

  const filledCount = fields.filter(f => f.filled).length;
  const totalFields = fields.length;
  const completionPercent = Math.round((filledCount / totalFields) * 100);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 text-white custom-scrollbar">
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-lg pointer-events-none"></div>
        
        <div className="relative">
          <DialogHeader className="space-y-4 pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-xl">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Customize Your README
                  </DialogTitle>
                  <DialogDescription className="text-base text-slate-400">
                    Add optional details to enhance your documentation for
                  </DialogDescription>
                  <Badge className="bg-slate-800/50 border-slate-700 text-blue-400 font-mono text-xs">
                    {repoUrl}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-slate-300">Completion Progress</span>
                </div>
                <span className="font-bold text-blue-400">{completionPercent}%</span>
              </div>
              <div className="relative h-2 rounded-full bg-slate-950/50 overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-3 h-3" />
                <span>Optional: Fill any fields to improve your README quality</span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Project Description */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <Label htmlFor="description" className="text-base font-semibold text-white">
                    Project Description
                  </Label>
                </div>
                {metadata.description && (
                  <CheckCircle2 className="w-5 h-5 text-green-400 animate-in zoom-in duration-300" />
                )}
              </div>
              <Textarea
                id="description"
                placeholder="A comprehensive tool that transforms GitHub repositories into professional documentation..."
                value={metadata.description || ""}
                onChange={(e) =>
                  setMetadata({ ...metadata, description: e.target.value })
                }
                rows={3}
                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 transition-colors resize-none"
              />
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Provide a clear overview of what your project does
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4 text-green-400" />
                  </div>
                  <Label htmlFor="features" className="text-base font-semibold text-white">
                    Key Features
                  </Label>
                </div>
                {metadata.features && (
                  <CheckCircle2 className="w-5 h-5 text-green-400 animate-in zoom-in duration-300" />
                )}
              </div>
              <Textarea
                id="features"
                placeholder="AI-powered analysis, Real-time preview, One-click download..."
                value={metadata.features || ""}
                onChange={(e) =>
                  setMetadata({ ...metadata, features: e.target.value })
                }
                rows={4}
                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 transition-colors resize-none"
              />
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                List the main features separated by commas or new lines
              </p>
            </div>

            {/* License and Context Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* License */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-4 h-4 text-orange-400" />
                  </div>
                  <Label htmlFor="license" className="text-base font-semibold text-white">
                    License
                  </Label>
                </div>
                <Select
                  value={metadata.license}
                  onValueChange={(value) =>
                    setMetadata({ ...metadata, license: value })
                  }
                >
                  <SelectTrigger id="license" className="h-11 bg-slate-950/50 border-slate-700 text-white focus:border-orange-500">
                    <SelectValue placeholder="Select a license" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {licenses.map((license) => (
                      <SelectItem key={license} value={license} className="focus:bg-slate-800 focus:text-white">
                        {license}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Context */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all group md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layers className="w-4 h-4 text-purple-400" />
                    </div>
                    <Label htmlFor="context" className="text-base font-semibold text-white">
                      Additional Context
                    </Label>
                  </div>
                  {metadata.additionalContext && (
                    <CheckCircle2 className="w-5 h-5 text-green-400 animate-in zoom-in duration-300" />
                  )}
                </div>
                <Textarea
                  id="context"
                  placeholder="Any other information the AI should know about your project..."
                  value={metadata.additionalContext || ""}
                  onChange={(e) =>
                    setMetadata({ ...metadata, additionalContext: e.target.value })
                  }
                  rows={3}
                  className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 transition-colors resize-none"
                />
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Include any special instructions or context for the AI
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-slate-800">
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>All fields are optional. Skip to use AI-generated defaults.</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handleSkip}
                className="flex-1 sm:flex-none min-w-[120px] bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Skip
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 sm:flex-none min-w-[160px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 font-semibold gap-2 group"
              >
                Generate README
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <style jsx>{`
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
    </Dialog>
  );
};