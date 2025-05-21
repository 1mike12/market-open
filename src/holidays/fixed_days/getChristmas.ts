import { getStatusForShiftingHoliday } from "./getStatusForShiftingHoliday"

/**
 * Determines if the market is closed based on NYSE Christmas rules:
 * - Christmas Day (Dec 25): Always closed. If Christmas falls on weekend:
 *   - Saturday: Friday Dec 24 is closed
 *   - Sunday: Monday Dec 26 is closed
 * - Christmas Eve (Dec 24): Early close at 1:00 PM ET on weekdays
 *   - If Christmas Eve is on weekend: No early close on previous Friday
 *
 * @param date DateTime to check
 * @returns boolean True if market is closed, false if open
 */
export function getChristmas(date: Date) {
  return getStatusForShiftingHoliday(date, 12, 25)
}
