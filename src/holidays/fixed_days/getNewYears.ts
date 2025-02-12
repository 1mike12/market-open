import {isClosedForShiftingHoliday} from "./isClosedForShiftingHoliday";

export function getNewYears(date: Date) {
    return isClosedForShiftingHoliday(date, 1, 1);
}
