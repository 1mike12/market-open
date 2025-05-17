import {Broker, type BrokerConfig} from "../Broker";
import {NYSE_HolidayStatus} from "../../enums/NYSE_HolidayStatus";
import {nyse_holidays} from "../../holidays/holiday_lists/nyse_holidays";
import {convertTimeToDecimal} from "../../date_utils/convertTimeToDecimal";
import {NYSE_SessionType} from "../../enums/NYSE_SessionType";

const weeklySchedule = []
for (let i = 1; i <= 5; i++) {
    weeklySchedule.push({
        day: i,
        type: NYSE_SessionType.PREMARKET,
        start: "07:00",
        end: "09:30"
    })
    weeklySchedule.push({
        day: i,
        type: NYSE_SessionType.NORMAL,
        start: "09:30",
        end: "16:00"
    })
    weeklySchedule.push({
        day: i,
        type: NYSE_SessionType.POSTMARKET,
        start: "16:00",
        end: "20:00"
    })
}

const RobinhoodConfig: BrokerConfig<typeof NYSE_SessionType, typeof NYSE_HolidayStatus> = {
    sessionEnum: NYSE_SessionType,
    holidayEnum: NYSE_HolidayStatus,
    name: "Robinhood",
    timezone: "America/New_York",
    holidayToStatus: (holiday: NYSE_HolidayStatus, dateTime: Date) => {
        if (holiday === NYSE_HolidayStatus.HALF_DAY) {
            const decimalHour = convertTimeToDecimal(dateTime);
            if (decimalHour >= 7 && decimalHour < 9.5) {
                return NYSE_SessionType.PREMARKET;
            }
            if (decimalHour >= 9.5 && decimalHour < 13) {
                return NYSE_SessionType.NORMAL;
            }
            if (decimalHour >= 13 && decimalHour < 16) {
                return NYSE_SessionType.POSTMARKET;
            }
        }
        return null;
    },
    weeklySchedule: weeklySchedule,
    holidays: nyse_holidays
}

export const Robinhood = new Broker(RobinhoodConfig)
