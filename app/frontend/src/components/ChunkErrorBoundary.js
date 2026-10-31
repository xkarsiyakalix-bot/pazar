import React from 'react';

/**
 * ChunkErrorBoundary
 *
 * Catches ChunkLoadError (thrown when a lazy-loaded JS chunk 404s after a new deploy)
 * and silently reloads the page without showing any disruptive "Sayfa güncellendi" screen.
 */
class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isChunkError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      /Loading chunk \d+ failed/i.test(error?.message || '') ||
      /Loading CSS chunk \d+ failed/i.test(error?.message || '');

    return { hasError: true, isChunkError, error };
  }

  componentDidCatch(error, info) {
    console.error('ChunkErrorBoundary caught an error:', error, info);
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      /Loading chunk \d+ failed/i.test(error?.message || '') ||
      /Loading CSS chunk \d+ failed/i.test(error?.message || '');

    if (isChunkError) {
      // Silently reload the page without any intrusive update banner
      const now = Date.now();
      const lastReload = parseInt(sessionStorage.getItem('chunk_reload_last_ts') || '0', 10);
      
      // Allow silent reload if more than 6 seconds have passed since last attempt
      if (now - lastReload > 6000) {
        sessionStorage.setItem('chunk_reload_last_ts', String(now));
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isChunkError) {
        // Do not display "Sayfa güncellendi" banner. Show a clean minimalist spinner while reloading.
        return (
          <div className="min-h-[50vh] flex items-center justify-center bg-transparent">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        );
      }

      // Re-throw or show generic error
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
              Bir hata oluştu
            </h2>
            <p className="text-gray-500 dark:text-neutral-400 text-sm mb-4">
              Sayfa yüklenirken beklenmedik bir sorun oluştu.
            </p>
            <button
              onClick={() => {
                sessionStorage.removeItem('chunk_reload_last_ts');
                sessionStorage.removeItem('chunk_reload_attempted');
                sessionStorage.removeItem('chunk_err_reload');
                window.location.reload();
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Yeniden Dene
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
