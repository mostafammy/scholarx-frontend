import React, { useEffect, useMemo, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "./SecureVideoPlayer.css";

const FORBIDDEN_SHORTCUT_KEYS = new Set(["I", "J", "C", "U"]);

const SecureVideoPlayer = ({
  videoUrl,
  onComplete,
  onProgress,
  onSpeedChange,
  analyticsEndpoint = "/api/clicks",
  playbackSpeed = 1,
}) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const playerInstance = useRef(null);
  const currentSpeedRef = useRef(playbackSpeed); // Track current speed to avoid infinite loops

  // Use refs for callbacks to avoid reinitializing player when callbacks change
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);
  const onSpeedChangeRef = useRef(onSpeedChange);

  // Keep refs in sync with props
  useEffect(() => {
    currentSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onProgressRef.current = onProgress;
    onSpeedChangeRef.current = onSpeedChange;
  }, [onComplete, onProgress, onSpeedChange]);

  const videoId = useMemo(() => extractYouTubeId(videoUrl), [videoUrl]);
  const origin = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return window.location.origin;
  }, []);

  useEffect(() => {
    if (!videoId || !playerRef.current) {
      return undefined;
    }

    if (playerInstance.current) {
      playerInstance.current.destroy();
      playerInstance.current = null;
    }

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
      settings: ["quality", "speed"],
      autoplay: true,
      speed: {
        selected: playbackSpeed,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      },
      keyboard: { focused: true, global: true },
      tooltips: { controls: true, seek: true },
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
      },
    });

    // Set initial playback speed when player is ready
    const handleReady = () => {
      try {
        // Use ref to get the latest speed value
        instance.speed = currentSpeedRef.current;
      } catch {
        // Ignore if setting speed fails
      }
    };

    const handleEnded = () => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    };

    const handleTimeUpdate = () => {
      // Guard against null media - Plyr can fire events before media is ready
      if (onProgressRef.current && instance.media) {
        try {
          onProgressRef.current({
            currentTime: instance.currentTime || 0,
            duration: instance.duration || 0,
            playing: instance.playing || false,
          });
        } catch {
          // Silently ignore errors during player initialization/destruction
        }
      }
    };

    // Sync speed changes from Plyr's built-in controls back to React
    const handleRateChange = () => {
      // Guard against null media and only trigger if speed actually changed
      if (!instance.media) return;
      try {
        const newSpeed = instance.speed;
        if (onSpeedChangeRef.current && newSpeed !== currentSpeedRef.current) {
          currentSpeedRef.current = newSpeed;
          onSpeedChangeRef.current(newSpeed);
        }
      } catch {
        // Silently ignore errors during player initialization/destruction
      }
    };

    instance.on("ready", handleReady);
    instance.on("ended", handleEnded);
    instance.on("timeupdate", handleTimeUpdate);
    instance.on("ratechange", handleRateChange);

    playerInstance.current = instance;

    return () => {
      instance.off("ready", handleReady);
      instance.off("ended", handleEnded);
      instance.off("timeupdate", handleTimeUpdate);
      instance.off("ratechange", handleRateChange);
      instance.destroy();
      playerInstance.current = null;
    };
  }, [videoId]); // Only reinitialize when videoId changes

  // Apply playback speed changes from React prop to Plyr
  useEffect(() => {
    if (
      playerInstance.current &&
      typeof playbackSpeed === "number" &&
      playerInstance.current.media
    ) {
      try {
        playerInstance.current.speed = playbackSpeed;
        currentSpeedRef.current = playbackSpeed;
      } catch {
        // Silently ignore if player not ready
      }
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

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
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || !analyticsEndpoint || !videoId) {
      return undefined;
    }

    const handleAnalyticsClick = (event) => {
      if (event.target.closest(".plyr__controls")) {
        return;
      }

      // Safely access player properties with proper null checks
      let progressSeconds = 0;
      let state = "paused";
      try {
        if (playerInstance.current?.media) {
          progressSeconds = playerInstance.current.currentTime || 0;
          state = playerInstance.current.playing ? "playing" : "paused";
        }
      } catch {
        // Ignore errors if player not ready
      }

      const payload = {
        videoId,
        timestamp: new Date().toISOString(),
        state,
        progressSeconds,
      };

      sendAnalytics(analyticsEndpoint, payload);
    };

    root.addEventListener("click", handleAnalyticsClick);
    return () => root.removeEventListener("click", handleAnalyticsClick);
  }, [analyticsEndpoint, videoId]);

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

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

  const iframeSrc = `https://www.youtube.com/embed/${videoId}?origin=${encodeURIComponent(
    origin
  )}&iv_load_policy=3&modestbranding=1&playsinline=1&showinfo=0&rel=0&enablejsapi=1`;

  return (
    <div
      ref={containerRef}
      className="secure-player-wrapper"
      onContextMenu={handleContextMenu}
    >
      <div ref={playerRef} key={videoId} className="plyr__video-embed">
        <iframe
          src={iframeSrc}
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Lesson video player"
        />
      </div>
    </div>
  );
};

const extractYouTubeId = (url) => {
  if (!url) {
    return null;
  }

  const trimmed = url.trim();
  const directPattern = /^[a-zA-Z0-9_-]{11}$/;
  if (directPattern.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(
    /(?:youtu.be\/|v=|\/embed\/|\/v\/|watch\?v=|&v=)([a-zA-Z0-9_-]{11})/
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
  } catch (error) {
    /* ignore analytics serialization errors */
  }
};

export default SecureVideoPlayer;
