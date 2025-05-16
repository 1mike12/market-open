import {Broker, type BrokerConfig} from "../Broker";
import {HolidayStatus} from "../../holidays/HolidayStatus";
import {nyse_holidays} from "../../holidays/holiday_lists/nyse_holidays";
import {convertTimeToDecimal} from "../../date_utils/convertTimeToDecimal";

export enum NYSE_STATUS {
    OPEN = "OPEN",
}

const weeklySchedule = []
for (let i = 1; i <= 5; i++) {
    weeklySchedule.push({
        day: i,
        type: NYSE_STATUS.OPEN,
        start: "09:30",
        end: "16:00"
    })
}

export const NYSE_CONFIG: BrokerConfig<typeof NYSE_STATUS, typeof HolidayStatus> = {
    name: "NYSE",
    timezone: "America/New_York",
    holidayToStatus: (holiday: HolidayStatus, dateTime: Date) => {
        if (holiday === HolidayStatus.HALF_DAY) {
            const decimalHour = convertTimeToDecimal(dateTime);
            if (decimalHour >= 9.5 && decimalHour < 13) {
                return NYSE_STATUS.OPEN;
            }
        }
        return null;
    },
    weeklySchedule: weeklySchedule,
    holidays: nyse_holidays
}

export const NYSE = new Broker(NYSE_CONFIG)
