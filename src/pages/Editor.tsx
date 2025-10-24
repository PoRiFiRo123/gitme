import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const Editor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  useEffect(() => {
    const contentParam = searchParams.get("content");
    if (!contentParam) {
      navigate("/");
      return;
    }
    setContent(decodeURIComponent(contentParam));
  }, [searchParams, navigate]);

  if (!content) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Your README</h1>
              <p className="text-muted-foreground mt-1">
                Make any final adjustments to your AI-generated documentation
              </p>
            </div>
          </div>

          <MarkdownEditor initialContent={content} />

          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            Generated with{" "}
            <a
              href="https://readme-generator-phi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitMe
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
