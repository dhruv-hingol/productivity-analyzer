export const MAX_SESSION_DURATION = 4 * 3600;
export const MIN_SESSION_DURATION = 1;
export const IDLE_RETROACTIVE_SECONDS = 20;

export const validateDuration = (duration: number): number => {
  if (duration < MIN_SESSION_DURATION) {
    return 0;
  }

  if (duration > MAX_SESSION_DURATION) {
    console.warn(
      `Session duration ${duration}s exceeds maximum ${MAX_SESSION_DURATION}s, capping to maximum`,
    );
    return MAX_SESSION_DURATION;
  }

  return duration;
};

export const isAnomalousDuration = (
  duration: number,
  domain: string,
): boolean => {
  if (duration > 3 * 3600) {
    console.warn(
      `Potential anomaly: ${domain} tracked for ${duration}s (${Math.round(
        duration / 3600,
      )}h)`,
    );
    return true;
  }

  return false;
};

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
