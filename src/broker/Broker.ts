import { toZonedTime } from "date-fns-tz"
import { Schedule } from "../helpers/Schedule"
import type { EnumType } from "../types/EnumType"
import type { EnumValue } from "../types/EnumValue"

export type WeekdaySchedule<T extends EnumType> = {
  day: number
  type: EnumValue<T>
  start: string
  end: string
}

type HolidayToSessionFunction<S extends EnumType, H extends EnumType> = (
  h: EnumValue<H>,
  dt: Date
) => EnumValue<S> | null

export type BrokerConfig<S extends EnumType, H extends EnumType> = {
  name: string
  sessionEnum: S
  holidayEnum: H
  timezone: string
  weeklySchedule: WeekdaySchedule<S>[]
  holidays: ((date: Date) => EnumValue<H> | null)[]
  holidayToStatus: HolidayToSessionFunction<S, H>
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
    public holidayToStatusMapper = config.holidayToStatus
  ) {
    for (const s of config.weeklySchedule) {
      this.scheduler.addSchedule(s.day, s.start, s.end, s.type)
    }
  }

  /**
   * Get whether the exchange is open given a unix time
   *
   * If no date is given, uses now
   * @param systemDate
   */
  isOpen(systemDate?: Date): boolean {
    if (!systemDate) systemDate = new Date()
    const statuses = this.getOpenStatuses(systemDate)
    return statuses !== null
  }

  /**
   * gives the day of week and minutes of a given date. IE it may be necessary to test whether 9:30AM NYC time is
   * open, regardless of where the server running
   *
   * Should be used on a detached "time" Date whose time components are detached from the underlying system timezone.
   *
   * For that to work, we may need to generate Date objects only for their time component, completely ignoring their
   * timezone.
   *
   * Example, we test if 9:30am is open in the NYSE while our server is running in the west coast. We create a raw date
   * with
   *
   * new Date("2025-05-12T09:30:00")
   * in order to get the time of 9:30, even though, this time _technically_ represents 12:30pm in NYC time, since it
   * will apply our west coast time zone on creation
   *
   * @param timeDate
   * @private
   */
  private getTimeInfo(timeDate: Date) {
    const currentMinutes = timeDate.getHours() * 60 + timeDate.getMinutes()
    const dayOfWeek = timeDate.getDay()
    return { currentMinutes, dayOfWeek }
  }

  private getHolidaySession(localDate: Date) {
    for (const holiday of this.holidays) {
      const holidayStatus = holiday(localDate)
      if (holidayStatus) {
        const holidaySession = this.holidayToStatusMapper(holidayStatus, localDate)
        return { holidayStatus, holidaySession }
      }
    }
    return { holidayStatus: null, sessionType: null }
  }

  /**
   * returns any matching open sessions
   *
   * interprets passed in date literally, taking account of your system's timezone.
   *
   * If you need to check if a specific time in the exchange's timezone is open, it's recommended to use a helper
   * date util to generate a Date object that represents the correct time.
   *
   * Example if you are checking NYSE statuses, you would need to subtract 3 hours from any date you pass in here to
   * make the equivalent NYC time. Or preferably use a date helper
   * @param systemDate
   */
  getOpenStatuses(systemDate: Date) {
    const localHourAndMinutes = toZonedTime(systemDate, this.timezone)
    const { currentMinutes, dayOfWeek } = this.getTimeInfo(localHourAndMinutes)
    const { holidayStatus, holidaySession } = this.getHolidaySession(localHourAndMinutes)

    if (holidayStatus) {
      if (holidaySession === null) return null
      const session = this.holidayToStatusMapper(holidayStatus, systemDate)
      return [session]
    }

    const matches = this.scheduler.getSessions(dayOfWeek, currentMinutes)
    return matches.length > 0 ? matches : null
  }
}
