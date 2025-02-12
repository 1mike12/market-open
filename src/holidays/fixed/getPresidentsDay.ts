import {isNthDayOfMonth} from "./isNthDayOfMonth";
import {HolidayStatus} from "../HolidayStatus";

export function getPresidentsDay(date: Date) {
    return isNthDayOfMonth(date, 2, 3, 1) ? HolidayStatus.CLOSED : null;
}
