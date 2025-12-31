import React, { useEffect, useMemo, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "./SecureVideoPlayer.css";

const FORBIDDEN_SHORTCUT_KEYS = new Set(["I", "J", "C", "U"]);

const SecureVideoPlayer = ({
  videoUrl,
  onComplete,
  onProgress,
  analyticsEndpoint = "/api/clicks",
}) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const playerInstance = useRef(null);

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

    const handleEnded = () => {
      if (onComplete) {
        onComplete();
      }
    };

    const handleTimeUpdate = () => {
      if (onProgress) {
        onProgress({
          currentTime: instance.currentTime,
          duration: instance.duration,
          playing: instance.playing,
        });
      }
    };

    instance.on("ended", handleEnded);
    instance.on("timeupdate", handleTimeUpdate);

    playerInstance.current = instance;

    return () => {
      instance.off("ended", handleEnded);
      instance.off("timeupdate", handleTimeUpdate);
      instance.destroy();
      playerInstance.current = null;
    };
  }, [videoId, onComplete, onProgress]);

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

      const payload = {
        videoId,
        timestamp: new Date().toISOString(),
        state: playerInstance.current?.playing ? "playing" : "paused",
        progressSeconds: playerInstance.current?.currentTime || 0,
      };

      sendAnalytics(analyticsEndpoint, payload);
    };

    root.addEventListener("click", handleAnalyticsClick);
    return () => root.removeEventListener("click", handleAnalyticsClick);
  }, [analyticsEndpoint, videoId]);

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

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
