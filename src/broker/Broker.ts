import {format, toZonedTime} from "date-fns-tz";
import {timeToMinutes} from "../date_utils/stringTimeToMinutes";
import type {EnumType} from "../types/EnumType";
import type {EnumValue} from "../types/EnumValue";
import {Schedule} from "../helpers/Schedule";

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

  scheduler = new Schedule<EnumValue<S>>()

  constructor(
    config: BrokerConfig<S, H>,
    public name = config.name,
    public timezone = config.timezone,
    public holidays = config.holidays,
    public holidayToStatusMapper = config.holidayToStatus,
  ) {
    for (const s of config.weeklySchedule) {
      this.scheduler.addSchedule(s.day, s.start, s.end, s.type)
    }
  }

  isOpen(date: Date): boolean {
    return this.getOpenStatuses(date) !== null;
  }

  private getCurrentTimeInfo(localDate: Date) {
    // Format the time in the broker's timezone
    const currentTime = format(localDate, 'HH:mm', {timeZone: this.timezone});
    const currentMinutes = timeToMinutes(currentTime);
    const dayOfWeek = localDate.getDay()
    return {currentTime, currentMinutes, dayOfWeek};
  }

  private getHolidaySession(localDate: Date) {
    for (const holiday of this.holidays) {
      const holidayStatus = holiday(localDate);
      if (holidayStatus) {
        const holidaySession = this.holidayToStatusMapper(holidayStatus, localDate);
        return {holidayStatus, holidaySession};
      }
    }
    return {holidayStatus: null, sessionType: null};
  }

  getOpenStatuses(systemDate: Date) {
    const localHourAndMinutes = toZonedTime(systemDate, this.timezone)
    const {currentMinutes, dayOfWeek} = this.getCurrentTimeInfo(localHourAndMinutes);
    const {holidayStatus, holidaySession} = this.getHolidaySession(localHourAndMinutes);

    if (holidayStatus) {
      if (holidaySession === null) return null
      const session = this.holidayToStatusMapper(holidayStatus, systemDate)
      return [session]
    }

    const matches = this.scheduler.getSessions(dayOfWeek, currentMinutes)
    return matches.length > 0 ? matches : null;
  }
}
