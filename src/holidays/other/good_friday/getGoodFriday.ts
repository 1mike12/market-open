import { isSameDay, subDays } from "date-fns"
import { NYSE_HolidayStatus } from "../../../enums/NYSE_HolidayStatus"
import { getEasterForYear } from "./getEasterForYear"

export function getGoodFriday(date: Date) {
  const year = date.getFullYear()
  const easterSunday = getEasterForYear(year)
  const goodFriday = subDays(easterSunday, 2)

  return isSameDay(date, goodFriday) ? NYSE_HolidayStatus.CLOSED : null
}
