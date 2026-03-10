import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance = null;

/**
 * Initialises a single shared Lenis instance for the whole app.
 * Call this once at the root level (e.g. inside App or main).
 */
export function useLenis() {
    useEffect(() => {
        if (lenisInstance) return; // already running

        lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.9,
        });

        function raf(time) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenisInstance.destroy();
            lenisInstance = null;
        };
    }, []);
}
