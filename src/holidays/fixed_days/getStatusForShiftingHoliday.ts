import {isSameDay, subDays, addDays, getDay, getMonth, getDate, getYear} from 'date-fns';
import {NYSE_HolidayStatus} from "../../enums/NYSE_HolidayStatus";

/**
 * Determines holiday status for calendar holidays (like New Year's, Christmas, July 4th).
 * Checks for half-day status first, then handles closures.
 * Only returns a status for:
 * 1. The business day before the holiday (HALF_DAY) - checked first
 * 2. The actual holiday (CLOSED)
 * 3. Alternative dates when holiday falls on weekend:
 *    - Friday before if holiday is Saturday (CLOSED)
 *    - Monday after if holiday is Sunday (CLOSED)
 *
 * @example
 * For New Year's (month=1, day=1):
 * - Dec 31: HALF_DAY (if it's a business day and Jan 1 is not Saturday)
 * - Dec 31: CLOSED (if Jan 1 is Saturday)
 * - Jan 1: CLOSED (unless weekend)
 * - Jan 2: CLOSED (if Jan 1 is Sunday)
 * All other dates: null
 */
export function getStatusForShiftingHoliday(
    date: Date,
    month: number,
    holidayDayOfMonth: number,
): NYSE_HolidayStatus | null {
    const holidayDate = new Date(getYear(date), month - 1, holidayDayOfMonth);
    const holidayDayOfWeek = getDay(holidayDate);

    // Check half-day first to return faster
    // Half day happens if holiday occurs on Tuesday through Friday
    // and will occur the day before
    if (isTuesdayThroughFriday(holidayDayOfWeek)) {
        if(isSameDay(date, subDays(holidayDate, 1))) {
              return NYSE_HolidayStatus.HALF_DAY;
        }
    }

    // Is it the actual holiday date?
    if (getMonth(date) + 1 === month && getDate(date) === holidayDayOfMonth) {
        return NYSE_HolidayStatus.CLOSED;
    }

    // Is it the Monday after a Sunday holiday?
    if (holidayDayOfWeek === 0 && isSameDay(date, addDays(holidayDate, 1))) {
        return NYSE_HolidayStatus.CLOSED;
    }
    // Is it the Friday before a Saturday holiday?
    if (holidayDayOfWeek === 6 && isSameDay(date, subDays(holidayDate, 1))) {
        return NYSE_HolidayStatus.CLOSED;
    }

    // Any other date is not affected by this holiday
    return null;
}

function isTuesdayThroughFriday (dayOfWeek: number) {
    return dayOfWeek >= 2 && dayOfWeek <= 5;
}
