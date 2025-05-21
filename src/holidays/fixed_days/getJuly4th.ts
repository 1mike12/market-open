import { getStatusForShiftingHoliday } from "./getStatusForShiftingHoliday"

/**
 *  there are complex rules for July 4th
 *  - if July 4th is on a weekday, the market is closed
 *  - if July 4th is on a Saturday, the market is closed on the previous Friday
 *  - if July 4th is on a Sunday, the market is closed on the next Monday
 * @param date
 */
export function getJuly4th(date: Date) {
  return getStatusForShiftingHoliday(date, 7, 4)
}
