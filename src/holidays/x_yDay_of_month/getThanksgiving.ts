import {isNthDayOfMonth} from "./isNthDayOfMonth";
import {NYSE_HolidayStatus} from "../../enums/NYSE_HolidayStatus";
import {getMonth} from 'date-fns';

export function getThanksgiving(date: Date) {
    // Check if the month is November
    if (getMonth(date) + 1 !== 11) { // getMonth returns 0-based month
        return null;
    }
    return isNthDayOfMonth(date, 11, 4, 4) ? NYSE_HolidayStatus.CLOSED : null;
}
