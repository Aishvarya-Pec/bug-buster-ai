import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Play, FileText, AlertTriangle, CheckCircle, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface SampleAnalysisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const sampleCode = `// Buggy React component with multiple issues
import React, { useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Memory leak: missing cleanup
  useEffect(() => {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  // XSS vulnerability
  return (
    <div>
      <h1 dangerouslySetInnerHTML={{__html: user?.name}} />
      {loading && <p>Loading...</p>}
      <button onClick={() => user.delete()}>Delete User</button>
    </div>
  );
}`;

const sampleAnalysis = {
  summary: "Found 4 critical issues: memory leak, XSS vulnerability, missing error handling, and unsafe method call.",
  problems: [
    {
      type: "critical",
      title: "Memory Leak in useEffect",
      description: "Missing cleanup function and dependency array issues",
      line: 8,
      fix: "Add cleanup function and proper error handling"
    },
    {
      type: "critical", 
      title: "XSS Vulnerability",
      description: "Unsafe use of dangerouslySetInnerHTML with user data",
      line: 19,
      fix: "Use safe text rendering instead of HTML injection"
    },
    {
      type: "warning",
      title: "Missing Error Handling",
      description: "Network request lacks error handling",
      line: 10,
      fix: "Add .catch() block for error scenarios"
    },
    {
      type: "warning",
      title: "Unsafe Method Call",
      description: "Calling method on potentially null object",
      line: 21,
      fix: "Add null check before method call"
    }
  ],
  fixes: `// Fixed React component
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    fetch(\`/api/users/\${userId}\`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
      })
      .then(data => {
        if (isMounted) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h1>{user?.name || 'Unknown User'}</h1>
      {loading && <p>Loading...</p>}
      <button 
        onClick={() => user?.delete?.()}
        disabled={!user}
      >
        Delete User
      </button>
    </div>
  );
}`,
  confidence: 95
};

export const SampleAnalysisDrawer = ({ isOpen, onClose }: SampleAnalysisDrawerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setShowResults(false);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={cn(
      "fixed inset-x-0 top-16 z-40 transform transition-transform duration-300 ease-out",
      isOpen ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="bg-background border-b border-border shadow-card">
        <div className="container mx-auto px-4">
          <div className="py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Sample Analysis</h2>
                <p className="text-muted-foreground">See AI Bug Fixer in action with a real code example</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="analyze"
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="relative"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-gradient-primary opacity-20 animate-pulse rounded-md" />
                  )}
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Code Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Sample Code (React Component)
                  </CardTitle>
                  <CardDescription>
                    This component has several bugs we'll detect and fix
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{sampleCode}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(sampleCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    {showResults ? "Issues found and fixes suggested" : "Click 'Run Analysis' to see results"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAnalyzing && (
                    <div className="space-y-4">
                      <div className="animate-pulse">
                        <div className="h-2 bg-gradient-primary rounded mb-2"></div>
                        <p className="text-sm text-muted-foreground">Analyzing code patterns...</p>
                      </div>
                      <div className="animate-pulse delay-75">
                        <div className="h-2 bg-gradient-primary rounded mb-2"></div>
                        <p className="text-sm text-muted-foreground">Checking for vulnerabilities...</p>
                      </div>
                      <div className="animate-pulse delay-150">
                        <div className="h-2 bg-gradient-primary rounded mb-2"></div>
                        <p className="text-sm text-muted-foreground">Generating fixes...</p>
                      </div>
                    </div>
                  )}

                  {showResults && (
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="problems">Problems</TabsTrigger>
                        <TabsTrigger value="fixes">Fixes</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="summary" className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm">{sampleAnalysis.summary}</p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="secondary">
                              Confidence: {sampleAnalysis.confidence}%
                            </Badge>
                            <Badge variant="destructive">
                              4 Issues Found
                            </Badge>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="problems" className="space-y-3">
                        {sampleAnalysis.problems.map((problem, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-2">
                                <AlertTriangle className={cn(
                                  "h-4 w-4 mt-0.5",
                                  problem.type === "critical" ? "text-destructive" : "text-warning"
                                )} />
                                <div>
                                  <h4 className="font-medium text-sm">{problem.title}</h4>
                                  <p className="text-xs text-muted-foreground">{problem.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Line {problem.line}</p>
                                </div>
                              </div>
                              <Badge variant={problem.type === "critical" ? "destructive" : "secondary"}>
                                {problem.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="fixes" className="space-y-4">
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-80">
                            <code>{sampleAnalysis.fixes}</code>
                          </pre>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(sampleAnalysis.fixes)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm text-muted-foreground">All issues fixed and code optimized</span>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  {!isAnalyzing && !showResults && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Ready to analyze sample code</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};