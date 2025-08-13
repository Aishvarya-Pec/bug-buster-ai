import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
  copyable?: boolean;
  title?: string;
}

export const CodeBlock = ({ 
  code, 
  language, 
  showLineNumbers = true, 
  className,
  copyable = true,
  title 
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("relative group", className)}
    >
      {/* Header */}
      {(title || copyable) && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border rounded-t-xl">
          {title && (
            <span className="text-xs font-medium text-muted-foreground">
              {title}
            </span>
          )}
          {copyable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className={cn(
                "h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity",
                copied && "opacity-100"
              )}
            >
              {copied ? (
                <Check className="h-3 w-3 text-success" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      )}
      
      {/* Code */}
      <div className="relative overflow-hidden rounded-b-xl">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            background: 'hsl(var(--muted))',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            borderRadius: title || copyable ? '0 0 0.75rem 0.75rem' : '0.75rem',
          }}
          lineNumberStyle={{
            color: 'hsl(var(--muted-foreground))',
            fontSize: '0.75rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
};