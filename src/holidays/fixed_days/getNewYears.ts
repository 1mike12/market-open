import {getStatusForShiftingHoliday} from "./getStatusForShiftingHoliday";

export function getNewYears(date: Date) {
    return getStatusForShiftingHoliday(date, 1, 1);
}
