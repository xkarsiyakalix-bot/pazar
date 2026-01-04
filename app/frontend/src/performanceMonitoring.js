import { useEffect } from 'react';

// Performance Monitoring
export const usePerformanceMonitoring = () => {
    useEffect(() => {
        // Measure page load performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;

                console.log('📊 Performance Metrics:');
                console.log(`⏱️  Page Load Time: ${pageLoadTime}ms`);
                console.log(`🔌 Connect Time: ${connectTime}ms`);
                console.log(`🎨 Render Time: ${renderTime}ms`);

                // Send to analytics (if needed)
                if (pageLoadTime > 3000) {
                    console.warn('⚠️  Slow page load detected!');
                }
            });
        }

        // Measure Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log(`🎯 LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    console.log(`⚡ FID: ${entry.processingStart - entry.startTime}ms`);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsScore = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                }
                console.log(`📐 CLS: ${clsScore.toFixed(4)}`);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }, []);
};

// Image Optimization Checker
export const checkImageOptimization = () => {
    const images = document.querySelectorAll('img');
    const unoptimizedImages = [];

    images.forEach((img) => {
        const naturalWidth = img.naturalWidth;
        const displayWidth = img.width;

        // Check if image is larger than displayed size
        if (naturalWidth > displayWidth * 2) {
            unoptimizedImages.push({
                src: img.src,
                natural: naturalWidth,
                display: displayWidth,
                waste: Math.round((naturalWidth - displayWidth) / naturalWidth * 100)
            });
        }

        // Check if lazy loading is enabled
        if (!img.loading) {
            console.warn(`⚠️  Image missing lazy loading: ${img.src}`);
        }
    });

    if (unoptimizedImages.length > 0) {
        console.warn('⚠️  Unoptimized images detected:');
        console.table(unoptimizedImages);
    } else {
        console.log('✅ All images are optimized!');
    }

    return unoptimizedImages;
};

// Bundle Size Analyzer
export const analyzeBundleSize = () => {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
        const resources = window.performance.getEntriesByType('resource');
        const scripts = resources.filter(r => r.initiatorType === 'script');
        const styles = resources.filter(r => r.initiatorType === 'link' || r.initiatorType === 'css');
        const images = resources.filter(r => r.initiatorType === 'img');

        const totalScriptSize = scripts.reduce((acc, s) => acc + (s.transferSize || 0), 0);
        const totalStyleSize = styles.reduce((acc, s) => acc + (s.transferSize || 0), 0);
        const totalImageSize = images.reduce((acc, i) => acc + (i.transferSize || 0), 0);

        console.log('📦 Bundle Size Analysis:');
        console.log(`📜 Scripts: ${(totalScriptSize / 1024).toFixed(2)} KB`);
        console.log(`🎨 Styles: ${(totalStyleSize / 1024).toFixed(2)} KB`);
        console.log(`🖼️  Images: ${(totalImageSize / 1024).toFixed(2)} KB`);
        console.log(`📊 Total: ${((totalScriptSize + totalStyleSize + totalImageSize) / 1024).toFixed(2)} KB`);

        return {
            scripts: totalScriptSize,
            styles: totalStyleSize,
            images: totalImageSize,
            total: totalScriptSize + totalStyleSize + totalImageSize
        };
    }
};

// Cache Strategy
export const setupCacheStrategy = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch((error) => {
                console.error('❌ Service Worker registration failed:', error);
            });
    }
};

// Preload Critical Resources
export const preloadCriticalResources = (resources = []) => {
    resources.forEach((resource) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.url;
        link.as = resource.type; // 'script', 'style', 'font', 'image'
        if (resource.type === 'font') {
            link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
    });
};

// Prefetch Next Page
export const prefetchPage = (url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
};

export default usePerformanceMonitoring;
