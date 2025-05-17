import type {EnumType} from "../types/EnumType";
import type {WeekdaySchedule} from "../broker/Broker";
import type {EnumValue} from "../types/EnumValue";
import {timeToMinutes} from "../date_utils/stringTimeToMinutes";

type ScheduleType<T extends EnumType> = {
  type: EnumValue<T>;
  startMinutes: number;
  endMinutes: number;
}

/**
 * helper class to encapsulate schedules in the form of WeekdaySchedule
 * and add the ability to query if a given day of week and minute since mdinight
 * intersects with any schedules
 */
export class Schedule<S extends EnumType> {
  public day_schedules = new Map<number, ScheduleType<S>[]>()

  constructor(schedules: WeekdaySchedule<S>[]) {
    for (const s of schedules) {
      const {day} = s
      if (!this.day_schedules.has(day)) {
        this.day_schedules.set(day, [])
      }
      const internalSchedule: ScheduleType<S> = {
        type: s.type,
        startMinutes: timeToMinutes(s.start),
        endMinutes: timeToMinutes(s.end)
      }
      this.day_schedules.get(day).push(internalSchedule)
    }
  }

  getSessions(dayOfWeek: number, currentMinutes: number) {
    const matches: (keyof S)[] = [];
    const schedules = this.day_schedules.get(dayOfWeek)
    if (!schedules) return []
    for (const schedule of schedules) {
      const {startMinutes, endMinutes} = schedule
      const isInRange = currentMinutes >= startMinutes && currentMinutes < endMinutes
      if (isInRange) matches.push(schedule.type as unknown as keyof S);
    }
    return matches;
  }
}
