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

type HolidayToSessionFunction<S extends EnumType,H extends EnumType> = (h:EnumValue<H>, dt: Date) => EnumValue<S> | null

export type BrokerConfig<S extends EnumType, H extends EnumType> = {
    name: string;
    timezone: string;
    weeklySchedule: WeekdaySchedule<S>[];
    holidays: ((date: Date) => EnumValue<H> | null)[];
    holidayToStatus: HolidayToSessionFunction<S,H>;
}

/**
 * @param S - The type of the status enum
 * @param H - The type of the holiday enum
 */
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

        // Parse schedule times in broker's timezone
        const currentTime = format(localDate, 'HH:mm', {timeZone: this.config.timezone});
        const currentMinutes = timeToMinutes(currentTime);
        const dayOfWeek = localDate.getDay();

        // Check holidays
        for (const holiday of this.config.holidays) {
            const holidayStatus = holiday(localDate);
            if (holidayStatus) {
                const sessionType = this.config.holidayToStatus(holidayStatus, date);

                // If session is null, market is closed regardless of time
                if (sessionType === null) {
                    return null;
                }

                // For holiday sessions, still respect the time schedule
                const schedules = this.config.weeklySchedule.filter(s =>
                    s.day === dayOfWeek && s.type === sessionType
                );

                if (schedules.length === 0) {
                    return null;
                }

                // Check if current time is within any matching schedule
                for (const schedule of schedules) {
                    const startMinutes = timeToMinutes(schedule.start);
                    const endMinutes = timeToMinutes(schedule.end);

                    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                        return [sessionType];
                    }
                }

                return null;
            }
        }

        // Regular weekday logic (non-holiday)
        const schedules = this.config.weeklySchedule.filter(s => s.day === dayOfWeek);

        if (schedules.length === 0) {
            return null;
        }

        const matches = [];
        for (const schedule of schedules) {
            const startMinutes = timeToMinutes(schedule.start);
            const endMinutes = timeToMinutes(schedule.end);

            if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                matches.push(schedule.type);
            }
        }

        if (matches.length > 0) {
            return matches;
        }

        return null;
    }
}
