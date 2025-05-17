import { subDays, isSameDay } from 'date-fns';
import { getEasterForYear } from './getEasterForYear';
import { NYSE_HolidayStatus } from '../../../enums/NYSE_HolidayStatus';

export function getGoodFriday(date: Date) {
    const year = date.getFullYear();
    const easterSunday = getEasterForYear(year);
    const goodFriday = subDays(easterSunday, 2);

    return isSameDay(date, goodFriday) ? NYSE_HolidayStatus.CLOSED : null;
}
