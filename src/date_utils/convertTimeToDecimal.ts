/**
 * Converts a given Date object to its decimal representation of the time.
 * The decimal representation is calculated by adding the hours, minutes, seconds, and milliseconds
 * as fractions of an hour.
 *
 * @param {Date} date - The Date object to convert.
 * @returns {number} - The decimal representation of the time.
 */
export function convertTimeToDecimal(date: Date): number {
  const hours = date.getHours()
  const minutes = date.getMinutes() / 60
  const seconds = date.getSeconds() / 3600
  const milliseconds = date.getMilliseconds() / 3600000
  return hours + minutes + seconds + milliseconds
}
