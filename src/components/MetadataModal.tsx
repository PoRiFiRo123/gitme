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
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-2 border-blue-200/50 shadow-2xl shadow-blue-200/50 text-slate-800 custom-scrollbar">
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 rounded-lg pointer-events-none"></div>
        
        <div className="relative">
          <DialogHeader className="space-y-4 pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-blue-300/50">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Customize Your README
                  </DialogTitle>
                  <DialogDescription className="text-base text-slate-600 font-medium">
                    Add optional details to enhance your documentation for
                  </DialogDescription>
                  <Badge className="bg-blue-100 border border-blue-300 text-blue-700 font-mono text-xs font-bold">
                    {repoUrl}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/50 backdrop-blur-sm shadow-inner">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-700">Completion Progress</span>
                </div>
                <span className="font-black text-blue-600">{completionPercent}%</span>
              </div>
              <div className="relative h-2.5 rounded-full bg-white/60 overflow-hidden border border-blue-200/50 shadow-inner">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Info className="w-3 h-3" />
                <span>Optional: Fill any fields to improve your README quality</span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Project Description */}
            <div className="space-y-3 p-4 rounded-xl bg-white/60 border-2 border-blue-200/50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/30 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-blue-300/50">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <Label htmlFor="description" className="text-base font-bold text-slate-800">
                    Project Description
                  </Label>
                </div>
                {metadata.description && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-300" />
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
                className="bg-slate-50 border-2 border-blue-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-colors resize-none font-medium"
              />
              <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                <Info className="w-3 h-3" />
                Provide a clear overview of what your project does
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-3 p-4 rounded-xl bg-white/60 border-2 border-blue-200/50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/30 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-purple-300/50">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <Label htmlFor="features" className="text-base font-bold text-slate-800">
                    Key Features
                  </Label>
                </div>
                {metadata.features && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-300" />
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
                className="bg-slate-50 border-2 border-blue-200 text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-colors resize-none font-medium"
              />
              <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                <Info className="w-3 h-3" />
                List the main features separated by commas or new lines
              </p>
            </div>

            {/* License and Context Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* License */}
              <div className="space-y-3 p-4 rounded-xl bg-white/60 border-2 border-blue-200/50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/30 transition-all group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-cyan-300/50">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <Label htmlFor="license" className="text-base font-bold text-slate-800">
                    License
                  </Label>
                </div>
                <Select
                  value={metadata.license}
                  onValueChange={(value) =>
                    setMetadata({ ...metadata, license: value })
                  }
                >
                  <SelectTrigger id="license" className="h-11 bg-slate-50 border-2 border-blue-200 text-slate-800 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 font-medium">
                    <SelectValue placeholder="Select a license" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-blue-200 text-slate-800">
                    {licenses.map((license) => (
                      <SelectItem key={license} value={license} className="focus:bg-blue-50 focus:text-slate-800 font-medium">
                        {license}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Context */}
              <div className="space-y-3 p-4 rounded-xl bg-white/60 border-2 border-blue-200/50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/30 transition-all group md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-indigo-300/50">
                      <Layers className="w-4 h-4 text-white" />
                    </div>
                    <Label htmlFor="context" className="text-base font-bold text-slate-800">
                      Additional Context
                    </Label>
                  </div>
                  {metadata.additionalContext && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-300" />
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
                  className="bg-slate-50 border-2 border-blue-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-colors resize-none font-medium"
                />
                <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                  <Info className="w-3 h-3" />
                  Include any special instructions or context for the AI
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t-2 border-blue-200/50">
            <div className="flex items-start gap-2 text-xs text-slate-600 font-medium">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>All fields are optional. Skip to use AI-generated defaults.</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handleSkip}
                className="flex-1 sm:flex-none min-w-[120px] bg-white/70 border-2 border-blue-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-blue-300 font-bold"
              >
                Skip
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 sm:flex-none min-w-[160px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-xl shadow-blue-300/50 font-bold gap-2 group"
              >
                Generate README
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(219, 234, 254, 0.5);
          border-radius: 10px;
          border: 2px solid rgba(147, 197, 253, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(59, 130, 246), rgb(99, 102, 241));
          border-radius: 10px;
          border: 2px solid rgba(219, 234, 254, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(37, 99, 235), rgb(79, 70, 229));
        }
      `}</style>
    </Dialog>
  );
};