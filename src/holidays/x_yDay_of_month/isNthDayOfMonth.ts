import { getDate, getDay, getMonth } from "date-fns"

/**
 * Helper function to check if a given date is the nth monday/tuesday/etc of the month
 * @param date
 * @param month
 * @param weekday
 * @param n
 */
export function isNthDayOfMonth(date: Date, month: number, weekday: number, n: number) {
  if (n < 1 || n > 4) {
    throw new Error("Invalid value for n. Must be between 1 and 4.")
  }
  if (month < 1 || month > 12) {
    throw new Error("Invalid value for month. Must be between 1 and 12.")
  }
  if (weekday < 0 || weekday > 6) {
    throw new Error("Invalid value for weekday. Must be between 0 and 6.")
  }

  return getMonth(date) + 1 === month
    && getDay(date) === weekday
    && Math.ceil(getDate(date) / 7) === n
}
