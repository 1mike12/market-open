import {format, toZonedTime,} from "date-fns-tz";

type weekdaySchedule<T extends EnumType> = {
    day: number;
    type: EnumValue<T>;
    start: string;
    end: string;
}

export type BrokerConfig<S extends EnumType, H extends EnumType> = {
    name: string;
    timezone: string;
    weeklySchedule: weekdaySchedule<S>[];
    holidays: ((date: Date) => EnumValue<H> | null)[];
    holidayToStatus: (holiday: EnumValue<H>, dateTime: Date) => EnumValue<S> | null;
}

type EnumType = {
    [key: string]: string | number;
} & { [key: number]: string };

type EnumValue<T extends EnumType> = T[keyof T];

export type HolidayType<T extends EnumType> = {
    name: string;
    check: (date: Date) => EnumValue<T>;
}

export class Broker<S extends EnumType, H extends EnumType> {
    private config: BrokerConfig<S, H>;

    constructor(config: BrokerConfig<S, H>) {
        this.config = config;
    }

    private timeToMinutes(timeStr: string): number {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    getOpenStatus(date: Date): EnumValue<S>[] | null {
        // Convert UTC input to broker's timezone
        const localDate = toZonedTime(date, this.config.timezone);

        // Check holidays
        for (const holiday of this.config.holidays) {
            // if null, then this holiday does not apply
            const holidayStatus = holiday(localDate);
            if (holidayStatus) {
                const status = this.config.holidayToStatus(holidayStatus, date);
                if (status === null) {
                    return null;
                }
                return [status];
            }
        }

        const dayOfWeek = localDate.getDay();
        const schedules = this.config.weeklySchedule.filter(s => s.day === dayOfWeek)

        if (schedules.length === 0) {
            return null;
        }

        // Parse schedule times in broker's timezone
        const currentTime = format(localDate, 'HH:mm', {timeZone: this.config.timezone});
        const currentMinutes = this.timeToMinutes(currentTime);

        const matches = []
        for (const schedule of schedules) {
            const startMinutes = this.timeToMinutes(schedule.start);
            const endMinutes = this.timeToMinutes(schedule.end);

            if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                matches.push(schedule.type)
            }
        }
        if (matches.length > 0) {
            return matches;
        }

        return null;
    }
}
