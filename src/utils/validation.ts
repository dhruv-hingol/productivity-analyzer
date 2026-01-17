export const MAX_SESSION_DURATION = 4 * 3600; // 4 hours in seconds
export const MIN_SESSION_DURATION = 1; // 1 second minimum
export const IDLE_RETROACTIVE_SECONDS = 20; // Seconds to subtract when going idle

/**
 * Validates a time duration for tracking
 * @param duration Duration in seconds
 * @returns Validated duration (capped at maximum)
 */
export const validateDuration = (duration: number): number => {
  if (duration < MIN_SESSION_DURATION) {
    return 0;
  }

  if (duration > MAX_SESSION_DURATION) {
    console.warn(
      `Session duration ${duration}s exceeds maximum ${MAX_SESSION_DURATION}s, capping to maximum`
    );
    return MAX_SESSION_DURATION;
  }

  return duration;
};

/**
 * Checks if a duration is anomalous and should be flagged
 * @param duration Duration in seconds
 * @param domain Domain being tracked
 * @returns True if anomalous
 */
export const isAnomalousDuration = (
  duration: number,
  domain: string
): boolean => {
  // Sessions over 3 hours are suspicious
  if (duration > 3 * 3600) {
    console.warn(
      `Potential anomaly: ${domain} tracked for ${duration}s (${Math.round(
        duration / 3600
      )}h)`
    );
    return true;
  }

  return false;
};

/**
 * Formats a duration for display
 * @param seconds Duration in seconds
 * @returns Formatted string (e.g., "2h 30m 15s")
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};
