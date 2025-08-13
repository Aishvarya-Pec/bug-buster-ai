import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { SampleAnalysisDrawer } from "@/components/SampleAnalysisDrawer";
import { Code, Zap, Shield, Clock, ArrowRight, CheckCircle, Star, Github, FileText, Bug } from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";

const Index = () => {
  const [showSampleDrawer, setShowSampleDrawer] = useState(false);

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced GPT-4 models analyze your code for bugs, vulnerabilities, and optimization opportunities."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security Focused",
      description: "Detect XSS, injection attacks, and security vulnerabilities before they reach production."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Real-time Results", 
      description: "Get instant feedback with streaming analysis and live progress updates."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Multiple Languages",
      description: "Support for JavaScript, TypeScript, Python, Java, C++, and more programming languages."
    },
    {
      icon: <Bug className="h-6 w-6" />,
      title: "Smart Fix Suggestions",
      description: "Not just detection - get specific, actionable fix recommendations with code examples."
    },
    {
      icon: <Github className="h-6 w-6" />,
      title: "Version Control Ready",
      description: "Generate patch files and commit messages ready for your Git workflow."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer",
      company: "TechCorp",
      content: "Found 12 critical bugs in our React app that we missed during code review. Saved us hours of debugging!",
      rating: 5
    },
    {
      name: "Mike Rodriguez", 
      role: "Team Lead",
      company: "StartupXYZ",
      content: "The AI suggestions are incredibly accurate. It's like having a senior developer reviewing every line of code.",
      rating: 5
    },
    {
      name: "Emily Zhang",
      role: "Full Stack Engineer", 
      company: "DevStudio",
      content: "Security vulnerability detection is outstanding. Caught several XSS issues we would have missed.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onPreviewToggle={() => setShowSampleDrawer(!showSampleDrawer)} showPreview={showSampleDrawer} />
      <SampleAnalysisDrawer isOpen={showSampleDrawer} onClose={() => setShowSampleDrawer(false)} />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-secondary opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="inline-flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>AI-Powered Code Analysis</span>
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  AI-powered code analysis that{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    actually fixes things
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Detect bugs, security vulnerabilities, and performance issues in your code. 
                  Get AI-generated fixes with confidence scores and ready-to-apply patches.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="premium" size="xl" className="group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => setShowSampleDrawer(true)}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Try Sample Analysis
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Free sample analysis</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 animate-glow-pulse" />
              <img 
                src={heroImage}
                alt="AI Code Analysis Illustration"
                className="relative z-10 w-full h-auto rounded-2xl shadow-elegant animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Powerful Features for Modern Development
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to catch bugs, fix vulnerabilities, and optimize your code
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-background hover:shadow-card transition-smooth">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-primary rounded-lg text-white">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple, fast, and accurate code analysis in three steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                1
              </div>
              <h3 className="text-xl font-semibold">Upload Your Code</h3>
              <p className="text-muted-foreground">
                Upload files or paste code directly. Support for all major programming languages.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                2
              </div>
              <h3 className="text-xl font-semibold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced AI models analyze your code for bugs, security issues, and optimizations.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-semibold">Get Fixes</h3>
              <p className="text-muted-foreground">
                Receive detailed analysis with specific fixes, patches, and confidence scores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Developers
            </h2>
            <p className="text-xl text-muted-foreground">
              See what developers are saying about AI Bug Fixer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-background">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Fix Your Code?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of developers using AI Bug Fixer to catch bugs early and ship cleaner code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
                Start Free Analysis
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => setShowSampleDrawer(true)}
              >
                Try Sample First
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Bug Fixer
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 AI Bug Fixer. Built with cutting-edge AI technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
