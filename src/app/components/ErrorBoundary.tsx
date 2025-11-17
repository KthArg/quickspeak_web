'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error: Error | null }) {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-[#232323] to-[#2c006e] text-white'
        : 'bg-gradient-to-b from-white to-purple-200 text-black'
    }`}>
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">💥</div>
        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
        <p className="text-lg mb-6 opacity-80">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className={`px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105 ${
            theme === 'dark'
              ? 'bg-cyan-500 text-black'
              : 'bg-teal-400 text-black'
          }`}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
