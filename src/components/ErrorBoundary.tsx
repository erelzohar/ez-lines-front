import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo });
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      return (
        fallback || (
          <div className="min-h-[400px] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center max-w-md"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                className="w-32 h-32 mb-6"
              >
                <img 
                  src="https://raw.githubusercontent.com/stackblitz/stackblitz-icons/main/broken-ice-cream.png" 
                  alt="Melting ice cream"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <h2 className="text-2xl font-heading font-semibold text-light-text dark:text-dark-text mb-3">
                משהו השתבש...
              </h2>
              <p className="text-light-text/80 dark:text-dark-text/80 mb-4">
                אם הבעיה נמשכת צור קשר עם מחלקת התמיכה
              </p>
              <a 
                href="mailto:contact@styletime.com" 
                className="text-primary dark:text-primary-light hover:underline"
              >
                contact@styletime.com
              </a>
              
              {process.env.NODE_ENV === "development" && (
                <div className="mt-8 w-full">
                  {error && (
                    <div className="p-4 bg-red-500/5 rounded-lg text-left mb-4">
                      <p className="text-red-500 font-mono text-sm">{error.toString()}</p>
                    </div>
                  )}
                  {errorInfo && (
                    <details className="text-left">
                      <summary className="text-light-text/60 dark:text-dark-text/60 cursor-pointer mb-2">
                        Stack trace
                      </summary>
                      <pre className="p-4 bg-light-surface dark:bg-dark-surface rounded-lg overflow-auto text-xs font-mono text-light-text/70 dark:text-dark-text/70">
                        {errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )
      );
    }

    return children;
  }
}

export default ErrorBoundary;