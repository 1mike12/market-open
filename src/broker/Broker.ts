import {format, toZonedTime,} from "date-fns-tz";
import {timeToMinutes} from "../date_utils/stringTimeToMinutes";
import type {EnumType} from "../types/EnumType";
import type {EnumValue} from "../types/EnumValue";

export type WeekdaySchedule<T extends EnumType> = {
    day: number;
    type: EnumValue<T>;
    start: string;
    end: string;
}

export type BrokerConfig<S extends EnumType, H extends EnumType> = {
    name: string;
    timezone: string;
    weeklySchedule: WeekdaySchedule<S>[];
    holidays: ((date: Date) => EnumValue<H> | null)[];
    holidayToStatus: (holiday: EnumValue<H>, dateTime: Date) => EnumValue<S> | null;
}

export class Broker<S extends EnumType, H extends EnumType> {
    private config: BrokerConfig<S, H>;

    constructor(config: BrokerConfig<S, H>) {
        this.config = config;
    }

    isOpen(date: Date): boolean {
        return this.getOpenStatus(date) !== null;
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
        const currentMinutes = timeToMinutes(currentTime);

        const matches = []
        for (const schedule of schedules) {
            const startMinutes = timeToMinutes(schedule.start);
            const endMinutes = timeToMinutes(schedule.end);

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
