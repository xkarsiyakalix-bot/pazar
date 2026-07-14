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
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      /Loading chunk \d+ failed/i.test(error?.message || '') ||
      /Loading CSS chunk \d+ failed/i.test(error?.message || '');

    return { hasError: true, isChunkError };
  }

  componentDidCatch(error, info) {
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
            <p className="text-gray-500 dark:text-neutral-400 text-sm mb-6">
              Sayfa yüklenirken beklenmedik bir sorun oluştu.
            </p>
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
