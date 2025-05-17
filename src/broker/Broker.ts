import {format, toZonedTime} from "date-fns-tz";
import {timeToMinutes} from "../date_utils/stringTimeToMinutes";
import type {EnumType} from "../types/EnumType";
import type {EnumValue} from "../types/EnumValue";

export type WeekdaySchedule<T extends EnumType> = {
  day: number;
  type: EnumValue<T>;
  start: string;
  end: string;
}

type HolidayToSessionFunction<S extends EnumType, H extends EnumType> = (h: EnumValue<H>, dt: Date) => EnumValue<S> | null

export type BrokerConfig<S extends EnumType, H extends EnumType> = {
  name: string;
  sessionEnum: S;
  holidayEnum: H;
  timezone: string;
  weeklySchedule: WeekdaySchedule<S>[];
  holidays: ((date: Date) => EnumValue<H> | null)[];
  holidayToStatus: HolidayToSessionFunction<S, H>;
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

  /**
   * Creates a Date object in the broker's timezone
   * Accepts all the same arguments as the standard Date constructor
   * but returns a date object converted to the broker's timezone
   *
   * @param args - Same arguments as the standard Date constructor
   */
  exchangeDate(args: string | number | Date): Date {
    const date = new Date(args);
    return toZonedTime(date, this.config.timezone);
  }

  isOpen(date: Date): boolean {
    return this.getOpenStatus(date) !== null;
  }

  private convertToLocalTime(date: Date): Date {
    // This method is just for consistency in the codebase
    // We don't actually convert the date to the broker's timezone here,
    // as that would change the hour values, which breaks the downstream logic.
    return date;
  }

  private getCurrentTimeInfo(localDate: Date) {
    // Format the time in the broker's timezone
    const currentTime = format(localDate, 'HH:mm', {timeZone: this.config.timezone});
    const currentMinutes = timeToMinutes(currentTime);

    // Get day of week in the broker's timezone
    const dayOfWeek = localDate.getDay()

    return {currentTime, currentMinutes, dayOfWeek};
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

  getKeys(): Array<keyof S> {
    return Object.keys(this.config.holidayEnum)
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

  private getActiveSessionTypes(schedules: WeekdaySchedule<S>[], currentMinutes: number): (keyof S)[] {
    const matches: (keyof S)[] = [];
    for (const schedule of schedules) {
      if (this.isTimeInSchedule(schedule, currentMinutes)) {
        matches.push(schedule.type as unknown as keyof S);
      }
    }
    return matches;
  }

  getOpenStatus(systemDate: Date): (keyof S)[] | null {
    const localHourAndMinutes = toZonedTime(systemDate, this.config.timezone)
    const {currentMinutes, dayOfWeek} = this.getCurrentTimeInfo(localHourAndMinutes);
    const holidayResult = this.getHolidayStatus(localHourAndMinutes);

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
      return matches.length > 0 ? [(sessionType as unknown as keyof S)] : null;
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
