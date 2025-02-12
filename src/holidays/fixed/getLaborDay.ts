import {isNthDayOfMonth} from "./isNthDayOfMonth";
import {HolidayStatus} from "../HolidayStatus";

export function getLaborDay(date : Date) {
    if (isNthDayOfMonth(date, 9, 1, 1)) return HolidayStatus.CLOSED
    return null
}
