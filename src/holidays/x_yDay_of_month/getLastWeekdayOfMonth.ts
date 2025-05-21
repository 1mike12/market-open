import { getDay, lastDayOfMonth, subDays } from "date-fns"

/**
 * Get the last occurrence of a specific weekday in a given month and year
 */
export function getLastWeekdayOfMonth(dayOfWeek: number, month: number, year: number): number {
  const lastDay = lastDayOfMonth(new Date(year, month - 1))
  const lastWeekday = getDay(lastDay)
  const daysToSubtract = (lastWeekday >= dayOfWeek) ? lastWeekday - dayOfWeek : 7 - (dayOfWeek - lastWeekday)
  return subDays(lastDay, daysToSubtract).getDate()
}
