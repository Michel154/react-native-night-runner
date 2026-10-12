import haversine from "haversine-distance";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export const formatTime = (totalSecs: number): string => {
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const calculatePace = (
  distanceMeters: number,
  timeSeconds: number,
): string => {
  if (distanceMeters <= 0 || timeSeconds <= 0) return "0:00";
  const distanceKm = distanceMeters / 1000;
  const paceSecondsPerKm = timeSeconds / distanceKm;

  const mins = Math.floor(paceSecondsPerKm / 60);
  const secs = Math.floor(paceSecondsPerKm % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const calculateDistance = (
  prevPoint: Coordinate,
  newPoint: Coordinate,
): number => {
  return haversine(prevPoint, newPoint);
};
