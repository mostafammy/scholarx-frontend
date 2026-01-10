/**
 * VideoPlayer Component
 * Wrapper for SecureVideoPlayer with styling
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import SecureVideoPlayer from "../../../components/SecureVideoPlayer/SecureVideoPlayer";
import styles from "./VideoPlayer.module.css";

const VideoPlayer = memo(function VideoPlayer({
  videoUrl,
  onComplete,
  onProgress,
  onSpeedChange,
  lessonTitle,
  playbackSpeed = 1,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.playerWrapper}>
        <SecureVideoPlayer
          videoUrl={videoUrl}
          onComplete={onComplete}
          onProgress={onProgress}
          onSpeedChange={onSpeedChange}
          playbackSpeed={playbackSpeed}
        />
      </div>
      {lessonTitle && (
        <div className={styles.lessonBadge}>
          <span className={styles.playIcon}>▶</span>
          <span className={styles.badgeText}>Now Playing</span>
        </div>
      )}
    </div>
  );
});

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string,
  onComplete: PropTypes.func,
  onProgress: PropTypes.func,
  onSpeedChange: PropTypes.func,
  lessonTitle: PropTypes.string,
  playbackSpeed: PropTypes.number,
};

export default VideoPlayer;
