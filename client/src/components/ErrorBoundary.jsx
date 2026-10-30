import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Standard Production Error Boundary component.
 * Catches unhandled runtime JavaScript errors anywhere in the child component tree,
 * displays a graceful recovery fallback UI, and prevents application unmounting.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200/80">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h1 className="text-xl font-black text-slate-900">Something unexpected occurred</h1>

            <p className="text-sm text-slate-500 leading-relaxed">
              PlanCraft AI encountered an issue rendering this view. Your saved events remain safe
              in the cloud.
            </p>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
