import React from 'react';

/**
 * ChunkErrorBoundary
 *
 * Catches ChunkLoadError (thrown when a lazy-loaded JS chunk 404s after a new
 * deploy) and automatically reloads the page once.  A second failure shows a
 * friendly "please refresh" message instead of an empty / broken screen.
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
      /Loading chunk \d+ failed/i.test(error?.message || '');

    if (isChunkError) {
      // Only auto-reload once to avoid infinite loops
      const reloaded = sessionStorage.getItem('chunk_reload_attempted');
      if (!reloaded) {
        sessionStorage.setItem('chunk_reload_attempted', '1');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isChunkError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
            <div className="text-center max-w-sm">
              <div className="text-5xl mb-4">🔄</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
                Sayfa güncellendi
              </h2>
              <p className="text-gray-500 dark:text-neutral-400 text-sm mb-6">
                Yeni bir sürüm yükleniyor. Lütfen sayfayı yenileyin.
              </p>
              <button
                onClick={() => {
                  sessionStorage.removeItem('chunk_reload_attempted');
                  window.location.reload();
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        );
      }

      // Re-throw non-chunk errors for outer boundaries
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
              Bir hata oluştu
            </h2>
            <p className="text-gray-500 dark:text-neutral-400 text-sm mb-2">
              Sayfa yüklenirken beklenmedik bir sorun oluştu.
            </p>
            {this.state.error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs p-3 rounded-xl mb-6 text-left max-w-sm overflow-x-auto font-mono">
                <p className="font-bold">Hata Detayı:</p>
                <p className="mt-1">{this.state.error.message || String(this.state.error)}</p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
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
