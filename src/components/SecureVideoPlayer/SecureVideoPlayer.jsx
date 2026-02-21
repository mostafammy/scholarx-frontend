import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "./SecureVideoPlayer.css";
import useDeviceCapabilities from "../../hooks/useDeviceCapabilities";

// ─── Constants ────────────────────────────────────────────────────────────────

const FORBIDDEN_SHORTCUT_KEYS = new Set(["I", "J", "C", "U"]);

/**
 * How long (ms) to wait for Plyr's "ready" event before showing the iOS
 * fallback card. On a slow network the IFrame API script may never load.
 */
const PLAYER_READY_TIMEOUT_MS = 8_000;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SecureVideoPlayer
 *
 * Architecture: two-phase initialisation
 *  Phase 1 — Render: output a bare <iframe>. Safari starts the network
 *            request cleanly with no DOM manipulation.
 *  Phase 2 — Init:  the iframe's onLoad fires (network request complete).
 *            Only then do we call new Plyr(), which re-wraps the iframe.
 *            This prevents the "stream reset by client (CANCEL)" error on iOS.
 */
const SecureVideoPlayer = ({
  videoUrl,
  onComplete,
  onProgress,
  onSpeedChange,
  analyticsEndpoint = "/api/clicks",
  playbackSpeed = 1,
}) => {
  const { isIOS, isTouchDevice, supportsPlaybackRate } =
    useDeviceCapabilities();

  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef = useRef(null);
  const playerRef = useRef(null); // <div class="plyr__video-embed">
  const iframeRef = useRef(null); // <iframe> element
  const playerInstance = useRef(null);
  const currentSpeedRef = useRef(playbackSpeed);

  // Stable callback refs — avoids re-initialising Plyr when callbacks change
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);
  const onSpeedChangeRef = useRef(onSpeedChange);

  // ── State ─────────────────────────────────────────────────────────────────
  /**
   * iframeLoaded: true once the iframe's load event fires.
   * This is the gate that prevents Plyr from touching the DOM too early.
   */
  const [iframeLoaded, setIframeLoaded] = useState(false);

  /**
   * playerTimedOut: true if Plyr initialised but "ready" never fired within
   * PLAYER_READY_TIMEOUT_MS. Shows the iOS fallback card.
   */
  const [playerTimedOut, setPlayerTimedOut] = useState(false);

  // ── Derived values ────────────────────────────────────────────────────────
  const videoId = useMemo(() => extractYouTubeId(videoUrl), [videoUrl]);

  const origin = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  // ── Keep callback refs in sync (no Plyr reinit needed) ───────────────────
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onProgressRef.current = onProgress;
    onSpeedChangeRef.current = onSpeedChange;
  }, [onComplete, onProgress, onSpeedChange]);

  useEffect(() => {
    currentSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  // ── Phase 2: init Plyr ONLY after the iframe has fully loaded ─────────────
  useEffect(() => {
    // Gate: do nothing until the iframe's load event has fired
    if (!iframeLoaded || !playerRef.current) return undefined;

    // Clean up any previous instance (e.g. when videoId changes)
    if (playerInstance.current) {
      playerInstance.current.destroy();
      playerInstance.current = null;
    }

    // Reset the timeout flag for this video
    setPlayerTimedOut(false);

    const instance = new Plyr(playerRef.current, {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "fullscreen",
      ],
      // Only include "speed" when the browser supports playbackRate
      settings: supportsPlaybackRate ? ["quality", "speed"] : ["quality"],
      // Do NOT autoplay on iOS — WebKit silently blocks it
      autoplay: !isIOS,
      ...(supportsPlaybackRate && {
        speed: {
          selected: playbackSpeed,
          options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        },
      }),
      keyboard: { focused: true, global: !isTouchDevice },
      tooltips: { controls: true, seek: true },
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
      },
    });

    // ── Timeout guard: if "ready" never fires, show the iOS fallback ─────
    const readyTimeoutId = setTimeout(() => {
      setPlayerTimedOut(true);
    }, PLAYER_READY_TIMEOUT_MS);

    // ── Event handlers ────────────────────────────────────────────────────
    const handleReady = () => {
      clearTimeout(readyTimeoutId);
      try {
        instance.speed = currentSpeedRef.current;
      } catch {
        // iOS doesn't support playbackRate — silently ignored
      }
    };

    const handleEnded = () => {
      onCompleteRef.current?.();
    };

    const handleTimeUpdate = () => {
      if (onProgressRef.current && instance.media) {
        try {
          onProgressRef.current({
            currentTime: instance.currentTime || 0,
            duration: instance.duration || 0,
            playing: instance.playing || false,
          });
        } catch {
          // Ignore errors during player initialisation/destruction
        }
      }
    };

    const handleRateChange = () => {
      if (!instance.media) return;
      try {
        const newSpeed = instance.speed;
        if (onSpeedChangeRef.current && newSpeed !== currentSpeedRef.current) {
          currentSpeedRef.current = newSpeed;
          onSpeedChangeRef.current(newSpeed);
        }
      } catch {
        // Ignore errors during player initialisation/destruction
      }
    };

    instance.on("ready", handleReady);
    instance.on("ended", handleEnded);
    instance.on("timeupdate", handleTimeUpdate);
    instance.on("ratechange", handleRateChange);

    playerInstance.current = instance;

    return () => {
      clearTimeout(readyTimeoutId);
      instance.off("ready", handleReady);
      instance.off("ended", handleEnded);
      instance.off("timeupdate", handleTimeUpdate);
      instance.off("ratechange", handleRateChange);
      instance.destroy();
      playerInstance.current = null;
    };
  }, [iframeLoaded, videoId, isIOS, isTouchDevice, supportsPlaybackRate]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: playbackSpeed intentionally omitted here — handled by the effect below

  // ── Sync playback speed from React prop → Plyr (without reinit) ──────────
  useEffect(() => {
    if (
      playerInstance.current &&
      typeof playbackSpeed === "number" &&
      playerInstance.current.media &&
      supportsPlaybackRate
    ) {
      try {
        playerInstance.current.speed = playbackSpeed;
        currentSpeedRef.current = playbackSpeed;
      } catch {
        // Silently ignore on unsupported platforms
      }
    }
  }, [playbackSpeed, supportsPlaybackRate]);

  // ── Keyboard shortcut blocker (desktop only) ──────────────────────────────
  useEffect(() => {
    // Fix 6: skip this entire listener on touch devices — dead code on iOS
    if (isTouchDevice || typeof window === "undefined") return undefined;

    const handleKeyDown = (event) => {
      if (
        event.key === "F12" ||
        (event.ctrlKey &&
          event.shiftKey &&
          FORBIDDEN_SHORTCUT_KEYS.has(event.key.toUpperCase()))
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTouchDevice]);

  // ── Analytics click tracking ──────────────────────────────────────────────
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !analyticsEndpoint || !videoId) return undefined;

    const handleAnalyticsClick = (event) => {
      if (event.target.closest(".plyr__controls")) return;

      let progressSeconds = 0;
      let state = "paused";
      try {
        if (playerInstance.current?.media) {
          progressSeconds = playerInstance.current.currentTime || 0;
          state = playerInstance.current.playing ? "playing" : "paused";
        }
      } catch {
        // Ignore if player not ready
      }

      sendAnalytics(analyticsEndpoint, {
        videoId,
        timestamp: new Date().toISOString(),
        state,
        progressSeconds,
      });
    };

    root.addEventListener("click", handleAnalyticsClick);
    return () => root.removeEventListener("click", handleAnalyticsClick);
  }, [analyticsEndpoint, videoId]);

  // ── Phase 1: iframe onLoad handler ───────────────────────────────────────
  /**
   * This is the critical gate. When the iframe's load event fires, Safari has
   * completed its network request. We can now safely let Plyr manipulate the DOM.
   */
  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
  }, []);

  // ── Context menu: block on desktop, allow on touch (fixes long-press) ────
  const handleContextMenu = useCallback(
    (event) => {
      // Fix 5: only block right-click on desktop — iOS long-press must not be eaten
      if (!isTouchDevice) {
        event.preventDefault();
      }
    },
    [isTouchDevice],
  );

  // ── Render: loading / error states ───────────────────────────────────────
  if (!videoUrl) {
    return (
      <div className="secure-player-wrapper" onContextMenu={handleContextMenu}>
        <div className="secure-player-loading">
          <span className="secure-player-loading-spinner" aria-hidden="true" />
          <p>Loading lesson video…</p>
        </div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="secure-player-wrapper" onContextMenu={handleContextMenu}>
        <div className="secure-player-error">
          <h3>Video unavailable</h3>
          <p>Please select a lesson with a valid YouTube source.</p>
        </div>
      </div>
    );
  }

  // ── iOS fallback card (shown if Plyr's "ready" never fires) ──────────────
  if (playerTimedOut) {
    return (
      <div className="secure-player-wrapper secure-player-wrapper--fallback">
        <div className="secure-player-ios-fallback">
          <div className="secure-player-ios-fallback__icon" aria-hidden="true">
            ▶
          </div>
          <h3 className="secure-player-ios-fallback__title">
            Unable to load inline video
          </h3>
          <p className="secure-player-ios-fallback__body">
            Your browser restricted inline playback. Watch the video directly on
            YouTube.
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="secure-player-ios-fallback__btn"
          >
            Open on YouTube ↗
          </a>
        </div>
      </div>
    );
  }

  // ── Iframe src: includes playsinline=1 in the query string ───────────────
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?origin=${encodeURIComponent(
    origin,
  )}&iv_load_policy=3&modestbranding=1&playsinline=1&showinfo=0&rel=0&enablejsapi=1`;

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="secure-player-wrapper"
      onContextMenu={handleContextMenu}
    >
      {/* Speed unavailable badge — shown on iOS instead of broken speed menu */}
      {!supportsPlaybackRate && (
        <div
          className="secure-player-speed-badge"
          role="status"
          aria-live="polite"
        >
          ⚡ Speed control unavailable on this device
        </div>
      )}

      {/*
        Phase 1: Render the <div> + <iframe> as-is. Plyr will initialise only
        after the iframe's onLoad fires, preventing the Safari CANCEL error.
      */}
      <div ref={playerRef} key={videoId} className="plyr__video-embed">
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          onLoad={handleIframeLoad}
          // Fix 2a: playsInline HTML attribute — prevents iOS forced fullscreen
          playsInline
          allowFullScreen
          // Fix 2b: web-share added for iOS 16+ compatibility
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Lesson video player"
        />
      </div>
    </div>
  );
};

// ─── Utilities ────────────────────────────────────────────────────────────────

const extractYouTubeId = (url) => {
  if (!url) return null;
  const trimmed = url.trim();
  // Accept bare 11-char IDs
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|v=|\/embed\/|\/v\/|watch\?v=|&v=)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
};

const sendAnalytics = (endpoint, payload) => {
  try {
    const serialized = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, serialized);
      return;
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: serialized,
      keepalive: true,
    }).catch(() => {
      /* ignore analytics network errors */
    });
  } catch {
    /* ignore analytics serialization errors */
  }
};

export default SecureVideoPlayer;
