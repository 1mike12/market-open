import { getMonth } from "date-fns"
import { NYSE_HolidayStatus } from "../../enums/NYSE_HolidayStatus"
import { isNthDayOfMonth } from "./isNthDayOfMonth"

export function getMartinLutherKingDay(date: Date) {
  if (getMonth(date) + 1 !== 1) { // getMonth returns 0-based month
    return null
  }
  if (isNthDayOfMonth(date, 1, 3, 1)) {
    return NYSE_HolidayStatus.CLOSED
  }
  return null
}
