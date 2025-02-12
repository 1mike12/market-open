import {HolidayStatus} from "../HolidayStatus";
import {isNthDayOfMonth} from "./isNthDayOfMonth";

/**
 * checks if within market hours for black friday
 * @param date
 */
export function getBlackFriday(date: Date) {
     return isNthDayOfMonth(date, 11, 5, 4) ? HolidayStatus.CLOSED : null;
}
