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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Your README</DialogTitle>
          <DialogDescription>
            Add optional information to enhance the AI-generated README for{" "}
            <span className="text-primary font-mono text-sm">{repoUrl}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Brief overview of what your project does..."
              value={metadata.description || ""}
              onChange={(e) =>
                setMetadata({ ...metadata, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Key Features</Label>
            <Textarea
              id="features"
              placeholder="List the main features (one per line)..."
              value={metadata.features || ""}
              onChange={(e) =>
                setMetadata({ ...metadata, features: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="license">License</Label>
            <Select
              value={metadata.license}
              onValueChange={(value) =>
                setMetadata({ ...metadata, license: value })
              }
            >
              <SelectTrigger id="license">
                <SelectValue placeholder="Select a license" />
              </SelectTrigger>
              <SelectContent>
                {licenses.map((license) => (
                  <SelectItem key={license} value={license}>
                    {license}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Additional Context</Label>
            <Textarea
              id="context"
              placeholder="Any other information the AI should know..."
              value={metadata.additionalContext || ""}
              onChange={(e) =>
                setMetadata({ ...metadata, additionalContext: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleSubmit}>
            Generate README
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
