import {Broker, type BrokerConfig} from "../Broker";
import {HolidayStatus} from "../../holidays/HolidayStatus";
import {nyse_holidays} from "../../holidays/holiday_lists/nyse_holidays";
import {convertTimeToDecimal} from "../../date_utils/convertTimeToDecimal";

export enum RobinhoodStatus {
    PRE_MARKET = "PRE_MARKET",
    OPEN = "OPEN",
    AFTER_HOURS = "AFTER_HOURS",
}

const weeklySchedule = []
for (let i = 1; i <= 5; i++) {
    weeklySchedule.push({
        day: i,
        type: RobinhoodStatus.PRE_MARKET,
        start: "07:00",
        end: "09:30"
    })
    weeklySchedule.push({
        day: i,
        type: RobinhoodStatus.OPEN,
        start: "09:30",
        end: "16:00"
    })
    weeklySchedule.push({
        day: i,
        type: RobinhoodStatus.AFTER_HOURS,
        start: "16:00",
        end: "20:00"
    })
}

export const RobinhoodConfig: BrokerConfig<typeof RobinhoodStatus, typeof HolidayStatus> = {
    name: "Robinhood",
    timezone: "America/New_York",
    holidayToStatus: (holiday: HolidayStatus, dateTime: Date) => {
        if (holiday === HolidayStatus.HALF_DAY) {
            const decimalHour = convertTimeToDecimal(dateTime);
            if (decimalHour >= 7 && decimalHour < 9.5) {
                return RobinhoodStatus.PRE_MARKET;
            }
            if (decimalHour >= 9.5 && decimalHour < 13) {
                return RobinhoodStatus.OPEN;
            }
            if (decimalHour >= 13 && decimalHour < 16) {
                return RobinhoodStatus.AFTER_HOURS;
            }
        }
        return null;
    },
    weeklySchedule: weeklySchedule,
    holidays: nyse_holidays
}

export const Robinhood = new Broker(RobinhoodConfig)
