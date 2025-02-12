import {getBlackFriday} from "../fixed/getBlackFriday";
import {getLaborDay} from "../fixed/getLaborDay";
import {getMartinLutherKingDay} from "../fixed/getMartinLutherKingDay";
import {getMemorialDay} from "../fixed/getMemorialDay";
import {getPresidentsDay} from "../fixed/getPresidentsDay";
import {getThanksgiving} from "../fixed/getThanksgiving";
import {getGoodFriday} from "../dynamic_holidays/good_friday/getGoodFriday";
import {getChristmas} from "../dynamic_holidays/getChristmas";
import {getJuly4th} from "../dynamic_holidays/getJuly4th";
import {getNewYears} from "../dynamic_holidays/getNewYears";

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
