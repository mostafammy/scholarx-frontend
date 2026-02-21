/**
 * useDeviceCapabilities — Unit Tests
 *
 * Jest + React Testing Library (renderHook)
 * Tests run in jsdom which exposes navigator/window for mocking.
 */

import { renderHook } from "@testing-library/react";
import useDeviceCapabilities from "./useDeviceCapabilities";

// ─── Helper to override navigator.userAgent ───────────────────────────────────
const setUA = (ua) => {
  Object.defineProperty(navigator, "userAgent", {
    configurable: true,
    get: () => ua,
  });
};

const setPlatform = (platform) => {
  Object.defineProperty(navigator, "platform", {
    configurable: true,
    get: () => platform,
  });
};

const setMaxTouchPoints = (n) => {
  Object.defineProperty(navigator, "maxTouchPoints", {
    configurable: true,
    get: () => n,
  });
};

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const IPAD_OS_13_UA =
  // iPadOS 13+ reports as Macintosh in UA — detection relies on maxTouchPoints
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/604.1";

const CHROME_DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile Safari/537.36";

// ─────────────────────────────────────────────────────────────────────────────

describe("useDeviceCapabilities", () => {
  beforeEach(() => {
    // Reset to desktop defaults before each test
    setUA(CHROME_DESKTOP_UA);
    setPlatform("Win32");
    setMaxTouchPoints(0);
    delete window.ontouchstart;
  });

  // ── iOS Detection ──────────────────────────────────────────────────────────

  it("detects iPhone as iOS", () => {
    setUA(IPHONE_UA);
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.isIOS).toBe(true);
  });

  it("detects iPadOS 13+ via maxTouchPoints heuristic", () => {
    setUA(IPAD_OS_13_UA);
    setPlatform("MacIntel");
    setMaxTouchPoints(5);
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.isIOS).toBe(true);
  });

  it("does NOT flag desktop Mac as iOS", () => {
    setUA(CHROME_DESKTOP_UA);
    setPlatform("MacIntel");
    setMaxTouchPoints(0); // no touch
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.isIOS).toBe(false);
  });

  it("does NOT flag Chrome desktop as iOS", () => {
    setUA(CHROME_DESKTOP_UA);
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.isIOS).toBe(false);
  });

  // ── Touch Detection ────────────────────────────────────────────────────────

  it("detects touch device via ontouchstart property", () => {
    setUA(ANDROID_UA);
    window.ontouchstart = () => {};
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.isTouchDevice).toBe(true);
  });

  it("detects touch device via maxTouchPoints", () => {
    setMaxTouchPoints(2);
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.isTouchDevice).toBe(true);
  });

  it("does NOT flag desktop (no touch) as a touch device", () => {
    setMaxTouchPoints(0);
    delete window.ontouchstart;
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.isTouchDevice).toBe(false);
  });

  // ── Playback Rate Support ──────────────────────────────────────────────────

  it("returns supportsPlaybackRate: false on iOS", () => {
    setUA(IPHONE_UA);
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.supportsPlaybackRate).toBe(false);
  });

  it("returns supportsPlaybackRate: true on desktop Chrome", () => {
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.supportsPlaybackRate).toBe(true);
  });

  it("returns supportsPlaybackRate: true on Android", () => {
    setUA(ANDROID_UA);
    window.ontouchstart = () => {};
    const { result } = renderHook(() => useDeviceCapabilities());
    expect(result.current.supportsPlaybackRate).toBe(true);
  });

  // ── SSR Safety ────────────────────────────────────────────────────────────

  it("returns safe defaults when window is undefined (SSR)", () => {
    // Simulate SSR by temporarily removing window
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    const { result } = renderHook(() => useDeviceCapabilities());

    expect(result.current.isIOS).toBe(false);
    expect(result.current.isTouchDevice).toBe(false);
    expect(result.current.supportsPlaybackRate).toBe(true);

    global.window = originalWindow;
  });
});
