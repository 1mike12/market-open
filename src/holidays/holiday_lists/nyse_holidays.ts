import {getBlackFriday} from "../x_yDay_of_month/getBlackFriday";
import {getLaborDay} from "../x_yDay_of_month/getLaborDay";
import {getMartinLutherKingDay} from "../x_yDay_of_month/getMartinLutherKingDay";
import {getMemorialDay} from "../x_yDay_of_month/getMemorialDay";
import {getPresidentsDay} from "../x_yDay_of_month/getPresidentsDay";
import {getThanksgiving} from "../x_yDay_of_month/getThanksgiving";
import {getGoodFriday} from "../other/good_friday/getGoodFriday";
import {getChristmas} from "../fixed_days/getChristmas";
import {getJuly4th} from "../fixed_days/getJuly4th";
import {getNewYears} from "../fixed_days/getNewYears";

/**
 * we check the fastest to calculate holidays first, which are the fixed date ones
 */
export const nyse_holidays = [
    getBlackFriday,
    getLaborDay,
    getMartinLutherKingDay,
    getMemorialDay,
    getPresidentsDay,
    getThanksgiving,

    getGoodFriday,
    getChristmas,
    getJuly4th,
    getNewYears
]
