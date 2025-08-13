import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, Code } from 'lucide-react';

interface Analysis {
  id: string;
  title: string;
  language: string;
  status: 'completed' | 'analyzing' | 'failed';
  createdAt: string;
  issuesFound: number;
  confidence: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockAnalyses: Analysis[] = [
      {
        id: '1',
        title: 'UserProfile.tsx',
        language: 'TypeScript',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z',
        issuesFound: 4,
        confidence: 95
      },
      {
        id: '2',
        title: 'auth-service.js',
        language: 'JavaScript',
        status: 'completed',
        createdAt: '2024-01-14T15:45:00Z',
        issuesFound: 2,
        confidence: 87
      },
      {
        id: '3',
        title: 'database-utils.py',
        language: 'Python',
        status: 'analyzing',
        createdAt: '2024-01-14T09:20:00Z',
        issuesFound: 0,
        confidence: 0
      }
    ];
    setAnalyses(mockAnalyses);
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Analysis['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'analyzing':
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: Analysis['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-success/10 text-success">Completed</Badge>;
      case 'analyzing':
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Analyzing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Analyze your code for bugs, security issues, and optimization opportunities.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{analyses.length}</p>
                  <p className="text-sm text-muted-foreground">Total Analyses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">
                    {analyses.reduce((sum, a) => sum + a.issuesFound, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Issues Found</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length) || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button asChild variant="hero" size="lg" className="flex-1 sm:flex-none">
            <Link to="/analyze">
              <Plus className="h-5 w-5 mr-2" />
              New Analysis
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/history">
              <FileText className="h-5 w-5 mr-2" />
              View All History
            </Link>
          </Button>
        </div>

        {/* Recent Analyses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>
              Your latest code analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyses.length === 0 ? (
              <div className="text-center py-8">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No analyses yet</p>
                <Button asChild variant="hero">
                  <Link to="/analyze">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Analysis
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(analysis.status)}
                      <div>
                        <h3 className="font-medium">{analysis.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{analysis.language}</span>
                          <span>•</span>
                          <span>{formatDate(analysis.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {analysis.status === 'completed' && (
                        <div className="text-right text-sm">
                          <p className="font-medium">{analysis.issuesFound} issues</p>
                          <p className="text-muted-foreground">{analysis.confidence}% confidence</p>
                        </div>
                      )}
                      {getStatusBadge(analysis.status)}
                      {analysis.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;