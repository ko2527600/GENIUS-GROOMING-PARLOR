import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md rounded-2xl border border-red/20 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red/10">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">Something went wrong</h1>
            <p className="mb-6 text-gray-600">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="mb-6 rounded-lg bg-gray-50 p-4 text-left text-xs">
                <summary className="cursor-pointer font-semibold text-gray-700">
                  Error details
                </summary>
                <pre className="mt-2 overflow-auto text-red">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 rounded-full bg-ink py-3 font-semibold text-white hover:bg-ink-soft"
              >
                Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 rounded-full border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
