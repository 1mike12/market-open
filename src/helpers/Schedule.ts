import {timeToMinutes} from "../date_utils/stringTimeToMinutes";

export type InputScheduleType<T> = {
  day: number;
  data: T;
  start: string;
  end: string;
}

type ScheduleType<T> = {
  data: T;
  startMinutes: number;
  endMinutes: number;
}


/**
 * helper class to encapsulate schedules in the form of WeekdaySchedule
 * and add the ability to query if a given day of week and minute since mdinight
 * intersects with any schedules
 */
export class Schedule<T> {
  public day_schedules = new Map<number, ScheduleType<T>[]>()

  constructor(schedules?: InputScheduleType<T>[]) {
    if (!schedules) return
    for (const s of schedules) {
      this.addSchedule(s.day, s.start, s.end, s.data)
    }
  }

  addSchedule(day: number, start: string, end: string, s: T) {
    if (!this.day_schedules.has(day)) {
      this.day_schedules.set(day, [])
    }
    const internalSchedule: ScheduleType<T> = {
      data: s,
      startMinutes: timeToMinutes(start),
      endMinutes: timeToMinutes(end)
    }
    this.day_schedules.get(day).push(internalSchedule)
  }

  getSessions(dayOfWeek: number, currentMinutes: number) {
    const matches: T[] = [];
    const schedules = this.day_schedules.get(dayOfWeek)
    if (!schedules) return []
    for (const schedule of schedules) {
      const {startMinutes, endMinutes} = schedule
      const isInRange = currentMinutes >= startMinutes && currentMinutes < endMinutes
      if (isInRange) matches.push(schedule.data);
    }
    return matches;
  }
}
