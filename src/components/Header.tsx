import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onPreviewToggle?: () => void;
  showPreview?: boolean;
}

export const Header = ({ onPreviewToggle, showPreview }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Bug Fixer
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              How it Works
            </a>
            {onPreviewToggle && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onPreviewToggle}
                className={cn(
                  "text-sm",
                  showPreview && "bg-accent text-accent-foreground"
                )}
              >
                <Zap className="h-4 w-4 mr-1" />
                {showPreview ? "Hide" : "Preview"} Sample
              </Button>
            )}
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                How it Works
              </a>
              {onPreviewToggle && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onPreviewToggle}
                  className="justify-start"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  {showPreview ? "Hide" : "Preview"} Sample
                </Button>
              )}
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Button variant="hero" size="sm">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};