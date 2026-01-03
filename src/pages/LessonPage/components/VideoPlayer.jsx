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
  lessonTitle,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.playerWrapper}>
        <SecureVideoPlayer
          videoUrl={videoUrl}
          onComplete={onComplete}
          onProgress={onProgress}
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
  lessonTitle: PropTypes.string,
};

export default VideoPlayer;
