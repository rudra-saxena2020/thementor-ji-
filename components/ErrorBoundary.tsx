import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white p-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-md text-center border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              We encountered an unexpected error. Please try reloading the page.
            </p>
            {this.state.error && (
              <pre className="text-xs text-left bg-slate-100 dark:bg-slate-950 p-4 rounded-xl mb-6 overflow-auto max-h-32 text-red-500 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20"
            >
              <RefreshCw size={18} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;