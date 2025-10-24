import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MetadataModal, RepoMetadata } from "@/components/MetadataModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Sparkles, Code2, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Documentation
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Generate Professional{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                READMEs
              </span>{" "}
              Instantly
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any GitHub repository into comprehensive documentation using advanced AI.
              Multi-model reliability ensures perfect results every time.
            </p>
          </div>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="pl-12 h-14 text-lg bg-card border-2 focus-visible:border-primary"
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg"
                disabled={isValidating}
              >
                {isValidating ? (
                  "Validating..."
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate README
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
              <p className="text-sm text-muted-foreground">
                AI analyzes your codebase structure, dependencies, and patterns to understand your project.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Model AI</h3>
              <p className="text-sm text-muted-foreground">
                Gemini primary with Groq fallback ensures 99% success rate with intelligent failover.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Editor</h3>
              <p className="text-sm text-muted-foreground">
                Edit and preview your README in real-time with full markdown support.
              </p>
            </div>
          </div>
        </div>
      </main>

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
