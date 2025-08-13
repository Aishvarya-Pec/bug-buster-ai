import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Upload, 
  Play, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  Download,
  Loader2,
  Code,
  Shield,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  summary: string;
  problems: Array<{
    type: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    line?: number;
    fix: string;
  }>;
  fixes: string;
  confidence: number;
  securityIssues: number;
  performanceIssues: number;
  bugCount: number;
}

const Analyze = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a supported code file (.js, .ts, .py, .java, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      
      // Auto-detect language from file extension
      const ext = fileExtension.substring(1);
      const langMap: Record<string, string> = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust'
      };
      if (langMap[ext]) {
        setLanguage(langMap[ext]);
      }
    };
    reader.readAsText(file);
  };

  const simulateAnalysis = async (): Promise<AnalysisResult> => {
    // Simulate streaming progress
    const progressSteps = [
      { progress: 20, message: "Parsing code structure..." },
      { progress: 40, message: "Analyzing for bugs..." },
      { progress: 60, message: "Checking security vulnerabilities..." },
      { progress: 80, message: "Generating fixes..." },
      { progress: 100, message: "Analysis complete!" }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
    }

    // Mock analysis result
    return {
      summary: "Found 3 issues: 1 critical security vulnerability, 1 performance issue, and 1 potential bug. Recommended fixes provided.",
      problems: [
        {
          type: 'critical',
          title: 'XSS Vulnerability',
          description: 'Unsafe use of dangerouslySetInnerHTML with user data',
          line: 23,
          fix: 'Use safe text rendering instead of HTML injection'
        },
        {
          type: 'warning',
          title: 'Memory Leak Risk',
          description: 'useEffect missing cleanup function',
          line: 15,
          fix: 'Add cleanup function and dependency array'
        },
        {
          type: 'info',
          title: 'Performance Optimization',
          description: 'Consider using React.memo for this component',
          line: 8,
          fix: 'Wrap component with React.memo to prevent unnecessary re-renders'
        }
      ],
      fixes: `// Fixed code with improvements:
import React, { useState, useEffect, memo } from 'react';

const UserProfile = memo(({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    fetch(\`/api/users/\${userId}\`)
      .then(response => response.json())
      .then(data => {
        if (isMounted) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Failed to fetch user:', err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return (
    <div>
      <h1>{user?.name || 'Unknown User'}</h1>
      {loading && <p>Loading...</p>}
    </div>
  );
});`,
      confidence: 94,
      securityIssues: 1,
      performanceIssues: 1,
      bugCount: 1
    };
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to analyze",
        description: "Please paste code or upload a file first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisResult(null);

    try {
      // In a real implementation, this would call your API
      // const response = await fetch('/api/analyze', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code, language })
      // });
      
      const result = await simulateAnalysis();
      setAnalysisResult(result);
      
      toast({
        title: "Analysis complete!",
        description: `Found ${result.problems.length} issues with ${result.confidence}% confidence.`
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard."
    });
  };

  const downloadPatch = () => {
    if (!analysisResult) return;
    
    const blob = new Blob([analysisResult.fixes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uploadedFile?.name || 'code'}_fixed.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Code Analysis</h1>
          <p className="text-muted-foreground">
            Upload your code or paste it below for AI-powered analysis and fixes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Code Input
              </CardTitle>
              <CardDescription>
                Upload a file or paste your code for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload File</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadedFile ? uploadedFile.name : 'Choose File'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.php,.rb,.go,.rs"
                  />
                </div>
                {uploadedFile && (
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || 'text/plain'}
                  </p>
                )}
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Code Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Textarea
                  placeholder="Paste your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                variant="analyze"
                size="lg"
                className="w-full"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Play className="h-5 w-5 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
              </Button>

              {/* Progress */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    {progress < 100 ? 'Analysis in progress...' : 'Complete!'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                {analysisResult ? 'Issues found and fixes suggested' : 'Results will appear here after analysis'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult && !isAnalyzing && (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Ready to analyze your code</p>
                </div>
              )}

              {analysisResult && (
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="problems">Issues</TabsTrigger>
                    <TabsTrigger value="fixes">Fixes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        {analysisResult.summary}
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Shield className="h-6 w-6 mx-auto mb-2 text-destructive" />
                        <p className="text-2xl font-bold">{analysisResult.securityIssues}</p>
                        <p className="text-sm text-muted-foreground">Security Issues</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Zap className="h-6 w-6 mx-auto mb-2 text-warning" />
                        <p className="text-2xl font-bold">{analysisResult.performanceIssues}</p>
                        <p className="text-sm text-muted-foreground">Performance Issues</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        Confidence: {analysisResult.confidence}%
                      </Badge>
                      <Badge variant="outline">
                        {analysisResult.problems.length} Total Issues
                      </Badge>
                    </div>
                  </TabsContent>

                  <TabsContent value="problems" className="space-y-3">
                    {analysisResult.problems.map((problem, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className={cn(
                              "h-4 w-4 mt-0.5",
                              problem.type === 'critical' ? "text-destructive" : 
                              problem.type === 'warning' ? "text-warning" : "text-primary"
                            )} />
                            <div>
                              <h4 className="font-medium">{problem.title}</h4>
                              <p className="text-sm text-muted-foreground">{problem.description}</p>
                              {problem.line && (
                                <p className="text-xs text-muted-foreground mt-1">Line {problem.line}</p>
                              )}
                            </div>
                          </div>
                          <Badge variant={
                            problem.type === 'critical' ? 'destructive' : 
                            problem.type === 'warning' ? 'secondary' : 'outline'
                          }>
                            {problem.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Fix:</strong> {problem.fix}
                        </p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="fixes" className="space-y-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-80">
                        <code>{analysisResult.fixes}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(analysisResult.fixes)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => copyToClipboard(analysisResult.fixes)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Fixed Code
                      </Button>
                      <Button 
                        onClick={downloadPatch}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Patch
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analyze;