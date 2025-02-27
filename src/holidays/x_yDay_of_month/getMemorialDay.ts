import {getLastWeekdayOfMonth} from "./getLastWeekdayOfMonth";
import {HolidayStatus} from "../HolidayStatus";
import {getMonth, getYear, getDate} from 'date-fns';

export function getMemorialDay(nycDate: Date) {
    if (getMonth(nycDate) + 1 !== 5) { // getMonth returns 0-based month
        return null;
    }
    const lastDay = getLastWeekdayOfMonth(1, 5, getYear(nycDate));
    const dayOfMonth = getDate(nycDate);
    return dayOfMonth === lastDay ? HolidayStatus.CLOSED : null;
}
