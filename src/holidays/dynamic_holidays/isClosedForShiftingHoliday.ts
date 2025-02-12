import {isSameDay, subDays, addDays, getDay, getMonth, getDate, getYear, isWeekend} from 'date-fns';
import {HolidayStatus} from "../HolidayStatus";

/**
 * Generic function for holidays that:
 * - Are closed on a specific calendar date
 * - Have early close on the previous business day
 * - Shift to Friday if they fall on Saturday
 * - Shift to Monday if they fall on Sunday
 *
 * Works for holidays like Christmas (Dec 25) and Independence Day (July 4) and New Years (Jan 1)
 */
export function isClosedForShiftingHoliday(
    date: Date,
    month: number,
    day: number,
) {
    const holidayDate = new Date(getYear(date), month - 1, day);

    if (getMonth(date) + 1 === month && getDate(date) === day) {
        return HolidayStatus.CLOSED;
    }

    // Day before the holiday
    const dayBeforeHoliday = subDays(holidayDate, 1);
    if (isSameDay(date, dayBeforeHoliday)) {
        if (isWeekend(date)) {
            return null;
        }
        if (getDay(holidayDate) === 6) { // Saturday
            return HolidayStatus.CLOSED;
        }
        return HolidayStatus.HALF_DAY;
    }

    // Day after the holiday
    const dayAfterHoliday = addDays(holidayDate, 1);
    if (isSameDay(date, dayAfterHoliday)) {
        // Closed if holiday was on Sunday
        if (getDay(holidayDate) === 0) { // Sunday
            return HolidayStatus.CLOSED;
        }
    }
    return null;
}
