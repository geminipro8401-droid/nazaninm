import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#040106] text-pink-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md p-8 rounded-3xl bg-black/60 border border-rose-500/40 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-rose-950">
              <span className="text-2xl">💖</span>
            </div>
            <h2 className="text-xl font-bold text-rose-200 mb-2">
              دنیای عاشقانه نازنین در حال بارگذاری مجدد...
            </h2>
            <p className="text-xs text-pink-300/70 mb-6 leading-relaxed">
              مرورگر شما در حال تنظیم مجدد صفحه است. لطفاً روی دکمه زیر کلیک کنید.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              تازه‌سازی صفحه ✨
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
