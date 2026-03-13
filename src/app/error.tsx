'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center max-w-md px-4">
        <div className="w-12 h-12 bg-coral/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-coral-dark text-xl font-bold">!</span>
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Something went wrong</h2>
        <p className="text-text-muted text-sm mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-sage text-white rounded-lg text-sm font-medium hover:bg-sage-dark transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
