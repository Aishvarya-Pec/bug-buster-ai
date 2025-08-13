import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Dropzone = ({
  onDrop,
  accept = {
    'text/*': ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs'],
    'application/pdf': ['.pdf'],
  },
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  children,
  disabled = false,
}: DropzoneProps) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled,
  });

  const removeFile = (file: File) => {
    const newFiles = acceptedFiles.filter(f => f !== file);
    onDrop(newFiles);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
          isDragActive && !isDragReject && "border-primary bg-primary/5 scale-105",
          isDragReject && "border-destructive bg-destructive/5",
          !isDragActive && "border-muted hover:border-primary/50 hover:bg-accent/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{
            scale: isDragActive ? 1.05 : 1,
            opacity: isDragActive ? 0.8 : 1,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="space-y-4"
        >
          <motion.div
            animate={{
              scale: isDragActive ? 1.2 : 1,
              rotate: isDragActive ? 10 : 0,
            }}
            className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
          >
            <Upload 
              className={cn(
                "h-6 w-6 transition-colors",
                isDragActive && !isDragReject && "text-primary",
                isDragReject && "text-destructive",
                !isDragActive && "text-muted-foreground"
              )} 
            />
          </motion.div>
          
          {children || (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragActive
                  ? isDragReject
                    ? "Some files are not supported"
                    : "Drop files here"
                  : "Drag & drop files here, or click to select"
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Supports code files and PDFs up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          )}
        </motion.div>

        {/* Pulse animation on drag */}
        {isDragActive && !isDragReject && (
          <motion.div
            className="absolute inset-0 border-2 border-primary rounded-xl"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.5, 0.2, 0.5] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>

      {/* Accepted Files */}
      <AnimatePresence>
        {acceptedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium">Selected Files:</h4>
            {acceptedFiles.map((file, index) => (
              <motion.div
                key={file.name + index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejected Files */}
      <AnimatePresence>
        {fileRejections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-destructive">Rejected Files:</h4>
            {fileRejections.map((fileRejection, index) => (
              <motion.div
                key={fileRejection.file.name + index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg"
              >
                <p className="text-sm font-medium text-destructive">
                  {fileRejection.file.name}
                </p>
                <p className="text-xs text-destructive/80">
                  {fileRejection.errors[0]?.message}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};