import {format, toZonedTime,} from "date-fns-tz";

type weekdaySchedule<T extends EnumType<string>> = {
    day: number;
    type: EnumValue<T>;
    start: string;
    end: string;
}

export type BrokerConfig<T extends EnumType<string>> = {
    name: string;
    timezone: string;
    statusEnum: T;
    defaultStatus: EnumValue<T>;
    weeklySchedule: weekdaySchedule<T>[];
    holidays: HolidayConfigType<T>[];
}

export type HolidayConfigType<T extends EnumType<string>> = {
    name: string
    check: (date: Date) => EnumValue<T>
}

type EnumType<T extends string | number> = {
    [key: string]: T;
};
type EnumValue<T extends EnumType<string>> = T[keyof T];

export type HolidayType<T extends EnumType<string>> = {
    name: string;
    check: (date: Date) => EnumValue<T>;
}

export class Broker<T extends EnumType<string>> {
    private config: BrokerConfig<T>;

    constructor(config: BrokerConfig<T>) {
        this.config = config;
    }

    private timeToMinutes(timeStr: string): number {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    getStatus(date: Date): EnumValue<T>[] {
        // Convert UTC input to broker's timezone
        const localDate = toZonedTime(date, this.config.timezone);

        // Check holidays
        for (const holiday of this.config.holidays) {
            const holidayStatus = holiday.check(localDate);
            if (holidayStatus) {
                return [holidayStatus];
            }
        }

        const dayOfWeek = localDate.getDay();
        const schedules = this.config.weeklySchedule.filter(s => s.day === dayOfWeek)

        if (schedules.length === 0) {
            return [this.config.defaultStatus];
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

        return [this.config.defaultStatus];
    }
}
