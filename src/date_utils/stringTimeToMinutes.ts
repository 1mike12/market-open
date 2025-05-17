export function timeToMinutes(timeStr: string): number {
  const parts = timeStr.split(':').map(Number)
  if (parts.length !== 2) {
    throw new Error("time must be in the form of hh:mm . Unable to parse passed in time: " + timeStr)
  }
  const [hours, minutes] = parts
  return hours * 60 + minutes;
}
