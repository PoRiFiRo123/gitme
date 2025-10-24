import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GitMe
          </div>
          <div className="text-xs text-muted-foreground hidden sm:block">
            AI README Generator
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hover:bg-accent/10"
        >
          <a
            href="https://github.com/yourusername/gitme"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </nav>
  );
};
