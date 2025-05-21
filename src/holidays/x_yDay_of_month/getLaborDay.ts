import { NYSE_HolidayStatus } from "../../enums/NYSE_HolidayStatus"
import { isNthDayOfMonth } from "./isNthDayOfMonth"

export function getLaborDay(date: Date) {
  if (isNthDayOfMonth(date, 9, 1, 1)) return NYSE_HolidayStatus.CLOSED
  return null
}
