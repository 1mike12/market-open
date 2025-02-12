import {isNthDayOfMonth} from "./isNthDayOfMonth";
import {HolidayStatus} from "../HolidayStatus";
import {getMonth} from 'date-fns';

export function getMartinLutherKingDay(date: Date) {
    if (getMonth(date) + 1 !== 1) { // getMonth returns 0-based month
        return null;
    }
    if (isNthDayOfMonth(date, 1, 3, 1)) {
        return HolidayStatus.CLOSED;
    }
    return null;
}
