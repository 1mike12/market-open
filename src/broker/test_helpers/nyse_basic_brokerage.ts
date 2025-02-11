import type {BrokerConfig} from "../Broker";

enum Status {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}

export const nyse_basic_brokerage: BrokerConfig<typeof Status> = {
    name: "NYSE",
    timezone: "America/New_York",
    statusEnum: Status,
    defaultStatus: Status.CLOSED,
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
