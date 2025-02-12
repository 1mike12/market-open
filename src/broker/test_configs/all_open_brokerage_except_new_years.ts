import {HolidayStatus} from "../../holidays/HolidayStatus";
import type {BrokerConfig} from "../Broker";

enum Status {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}

export const all_open_brokerage_except_new_years: BrokerConfig<typeof Status, typeof HolidayStatus> = {
    name: "NYSE",
    timezone: "America/New_York",
    holidayToStatus: (holiday: HolidayStatus, dateTime: Date) => {
        if (holiday === HolidayStatus.HALF_DAY) {
            const hour = dateTime.getHours();
            if (hour >= 9 && hour < 13) {
                return Status.OPEN;
            }
        }
        return null;
    },
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
        // Note: Weekend days (0 and 6) are not defined, defaulting to CLOSED
    ],
    holidays: [
        (date: Date) => {
            const month = date.getMonth();
            const dayOfMonth = date.getDate();
            const dayOfWeek = date.getDay();

            // Handle New Year's Day (January 1st)
            if (month === 0 && dayOfMonth === 1) {
                // If it's a weekend, the holiday is observed on a different day
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    return HolidayStatus.CLOSED; // Still closed on actual New Year's Day
                }
                return HolidayStatus.CLOSED;
            }

            // Handle December 31st (New Year's Eve)
            if (month === 11 && dayOfMonth === 31) {
                // Get next day (January 1st)
                const nextDay = new Date(date);
                nextDay.setDate(date.getDate() + 1);
                const newYearsDayOfWeek = nextDay.getDay();

                // If New Year's Day is on Saturday, Friday Dec 31st is closed
                if (newYearsDayOfWeek === 6) {
                    return HolidayStatus.CLOSED;
                }

                // If New Year's Day is on a weekday (not weekend), Dec 31st is half day
                if (newYearsDayOfWeek !== 0) { // not Sunday
                    return HolidayStatus.HALF_DAY;
                }

                // Otherwise (New Year's Day is Sunday), Dec 31st is normal day
                return null
            }

            // Handle January 2nd
            if (month === 0 && dayOfMonth === 2) {
                // If January 1st was a Sunday, Monday January 2nd is closed
                const newYearsDay = new Date(date);
                newYearsDay.setDate(date.getDate() - 1);
                if (newYearsDay.getDay() === 0) {
                    return HolidayStatus.CLOSED;
                }
            }

            return null
        }
    ]
}
