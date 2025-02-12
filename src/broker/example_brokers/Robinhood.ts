import {Broker, type BrokerConfig} from "../Broker";
import {HolidayStatus} from "../../holidays/HolidayStatus";
import {nyse_holidays} from "../../holidays/holiday_lists/nyse_holidays";

enum RobinhoodStatus {
    PRE_MARKET = "PRE_MARKET",
    OPEN = "OPEN",
    AFTER_HOURS = "AFTER_HOURS",
}

const RobinhoodConfig: BrokerConfig<typeof RobinhoodStatus, typeof HolidayStatus> = {
    name: "Robinhood",
    timezone: "America/New_York",
    holidayToStatus: (holiday: HolidayStatus, dateTime: Date) => {
        if (holiday === HolidayStatus.HALF_DAY) {
            const hour = dateTime.getHours();
            const minutes = dateTime.getMinutes();
            if (hour >= 7 && hour < 9) {
                return RobinhoodStatus.PRE_MARKET;
            }
            if (hour >= 9 && hour < 13) {
                return RobinhoodStatus.OPEN;
            }
            if (hour >= 13 && hour < 16) {
                return RobinhoodStatus.AFTER_HOURS;
            }
        }
        return null;
    },
    weeklySchedule: [
        {
            day: 1,
            type: RobinhoodStatus.OPEN,
            start: "09:30",
            end: "16:00"
        },
        {
            day: 2,
            type: RobinhoodStatus.OPEN,
            start: "09:30",
            end: "16:00"
        },
        {
            day: 3,
            type: RobinhoodStatus.OPEN,
            start: "09:30",
            end: "16:00"
        },
        {
            day: 4,
            type: RobinhoodStatus.OPEN,
            start: "09:30",
            end: "16:00"
        },
        {
            day: 5,
            type: RobinhoodStatus.OPEN,
            start: "09:30",
            end: "16:00"
        }
        // Note: Weekend days (0 and 6) are not defined, defaulting to CLOSED
    ],
    holidays: nyse_holidays
}

export const Robinhood = new Broker(RobinhoodConfig)
