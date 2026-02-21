import { useMemo } from "react";

/**
 * useDeviceCapabilities
 *
 * SSR-safe hook that centralises all device/browser capability detection.
 * Add new flags here rather than scattering navigator checks across components.
 *
 * @returns {{
 *   isIOS: boolean,
 *   isTouchDevice: boolean,
 *   supportsPlaybackRate: boolean
 * }}
 */
const useDeviceCapabilities = () => {
  return useMemo(() => {
    // Guard for SSR / non-browser environments
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return {
        isIOS: false,
        isTouchDevice: false,
        supportsPlaybackRate: true,
      };
    }

    const ua = navigator.userAgent;

    // Detect iOS: iPhone / iPod are always in UA.
    // iPadOS 13+ reports as "Macintosh" but sets maxTouchPoints > 1.
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    // Detect any touchscreen device (iOS, Android, Surface, etc.)
    const isTouchDevice =
      isIOS || "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // YouTube iframes on iOS WebKit do not honour playbackRate.
    // This is a long-standing WebKit limitation with no workaround.
    const supportsPlaybackRate = !isIOS;

    return { isIOS, isTouchDevice, supportsPlaybackRate };
  }, []); // stable — UA never changes during a session
};

export default useDeviceCapabilities;
