import type {BrokerConfig} from "../Broker";
import {HolidayStatus} from "../../holidays/HolidayStatus";

enum Status {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}

export const nyse_basic_brokerage: BrokerConfig<typeof Status, typeof HolidayStatus> = {
    name: "NYSE",
    timezone: "America/New_York",
    holidayToStatus: () => Status.OPEN,
    weeklySchedule: [
         {
            day: 1,
            type: Status.OPEN,
            start: "09:30",
            end: "16:00"
        },
         {
            day: 2,
            type: Status.OPEN,
            start: "09:30",
            end: "16:00"
        },
        {
            day: 3,
            type: Status.OPEN,
            start: "09:30",
            end: "16:00"
        },
         {
            day: 4,
            type: Status.OPEN,
            start: "09:30",
            end: "16:00"
        },
         {
            day: 5,
            type: Status.OPEN,
            start: "09:30",
            end: "16:00"
        }
    ],
    holidays: []
}
