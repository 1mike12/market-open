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

    private convertToLocalTime(date: Date): Date {
        return toZonedTime(date, this.config.timezone);
    }

    private getCurrentTimeInfo(localDate: Date) {
        const currentTime = format(localDate, 'HH:mm', {timeZone: this.config.timezone});
        const currentMinutes = timeToMinutes(currentTime);
        const dayOfWeek = localDate.getDay();
        
        return { currentTime, currentMinutes, dayOfWeek };
    }

    private getHolidayStatus(localDate: Date): [EnumValue<H>, EnumValue<S> | null] | null {
        for (const holiday of this.config.holidays) {
            const holidayStatus = holiday(localDate);
            if (holidayStatus) {
                const sessionType = this.config.holidayToStatus(holidayStatus, localDate);
                return [holidayStatus, sessionType];
            }
        }
        return null;
    }

    private isTimeInSchedule(schedule: WeekdaySchedule<S>, currentMinutes: number): boolean {
        const startMinutes = timeToMinutes(schedule.start);
        const endMinutes = timeToMinutes(schedule.end);
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }

    private getMatchingSchedules(dayOfWeek: number, sessionType?: EnumValue<S>): WeekdaySchedule<S>[] {
        if (sessionType) {
            return this.config.weeklySchedule.filter(s => 
                s.day === dayOfWeek && s.type === sessionType
            );
        }
        
        return this.config.weeklySchedule.filter(s => s.day === dayOfWeek);
    }

    private getActiveSessionTypes(schedules: WeekdaySchedule<S>[], currentMinutes: number): EnumValue<S>[] {
        const matches: EnumValue<S>[] = [];
        for (const schedule of schedules) {
            if (this.isTimeInSchedule(schedule, currentMinutes)) {
                matches.push(schedule.type);
            }
        }
        return matches;
    }

    getOpenStatus(date: Date): EnumValue<S>[] | null {
        const localDate = this.convertToLocalTime(date);
        const { currentMinutes, dayOfWeek } = this.getCurrentTimeInfo(localDate);
        const holidayResult = this.getHolidayStatus(localDate);
        
        if (holidayResult) {
            const [, sessionType] = holidayResult;
            
            // If holiday session is null, market is closed regardless of time
            if (sessionType === null) {
                return null;
            }

            // For holiday sessions, still respect the time schedule
            const schedules = this.getMatchingSchedules(dayOfWeek, sessionType);

            if (schedules.length === 0) {
                return null;
            }

            // Check if current time is within any matching schedule
            const matches = this.getActiveSessionTypes(schedules, currentMinutes);
            return matches.length > 0 ? [sessionType] : null;
        }

        // Regular weekday logic (non-holiday)
        const schedules = this.getMatchingSchedules(dayOfWeek);

        if (schedules.length === 0) {
            return null;
        }

        const matches = this.getActiveSessionTypes(schedules, currentMinutes);
        return matches.length > 0 ? matches : null;
    }
}
