import { NYSE_HolidayStatus } from "../../enums/NYSE_HolidayStatus"
import { isNthDayOfMonth } from "./isNthDayOfMonth"

export function getPresidentsDay(date: Date) {
  return isNthDayOfMonth(date, 2, 3, 1) ? NYSE_HolidayStatus.CLOSED : null
}
