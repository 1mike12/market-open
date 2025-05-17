import {Broker, type BrokerConfig} from "../broker/Broker";
import type {EnumValue} from "../types/EnumValue";
import type {EnumType} from "../types/EnumType";

/**
 * Helper type to get the enum type from enum values
 */
export type DateToHolidayFunction<H extends EnumType> = (d: Date) => EnumValue<H>| null
export type HolidayToSessionFunction<S extends EnumType,H extends EnumType> = (h: EnumValue<H>, dt: Date) => EnumValue<S> | null

/**
 * A fluent builder for BrokerConfig<S,H>, letting you define
 * - name & timezone
 * - per-weekday sessions with arbitrary types & times
 * - holiday logic and mapping to session types
 *
 *  @generic S - The type of the session enum
 *  @generic H - The type of the holiday enum
 */
export class BrokerBuilder<S extends EnumType, H extends EnumType> {
  // Use EnumObject<S> and EnumObject<H> as the actual enum types
  public cfg: BrokerConfig<S, H> = {
    sessionEnum: null,
    holidayEnum: null,
    timezone: "",
    name: "",
    weeklySchedule: [],
    holidays: [],
    holidayToStatus: (_holidayType : EnumValue<H>, _date : Date) => null,
  };


  /** Set broker name */
  name(name: string) { this.cfg.name = name; return this; }
  /** Set IANA timezone */
  timeZone(tz: string) { this.cfg.timezone = tz; return this; }

  /** Configure all schedules at once with a day-based configuration object */
  schedules(config: Record<string, Array<{type: EnumValue<S>, start: string, end: string}>>) {
    for (const daySpec in config) {
      const dayNumbers = parseDaySpec(daySpec);
      const sessions = config[daySpec];

      for (const day of dayNumbers) {
        for (const session of sessions) {
          this.cfg.weeklySchedule!.push({
            day,
            type: session.type,
            start: session.start,
            end: session.end,
          });
        }
      }
    }
    return this;
  }

  /** Register a holiday-detection fn: Date → holiday enum or null */
  withHolidayFn(fn: DateToHolidayFunction<H> | DateToHolidayFunction<H>[]) {
    if (Array.isArray(fn)){
      for (const f of fn){
        this.cfg.holidays.push(f)
      }
      return this
    }
    this.cfg.holidays.push(fn);
    return this;
  }

  /** Map detected holiday → session type (or null for closed) */
  withHolidayStatusMapper(fn: HolidayToSessionFunction<S,H>) {
    this.cfg.holidayToStatus = fn;
    return this;
  }

  /** Finalize into a Broker<S,H> */
  build() {
    if (!this.cfg.name || !this.cfg.timezone) {
      throw new Error("BrokerBuilder: name and timezone must be set");
    }
    return new Broker(this.cfg);
  }
}

/**
 * Parse numbers, arrays, or strings like "Mon–Fri" into weekday numbers (0=Sun)
 */
function parseDaySpec(spec: number | number[] | string): number[] {
  if (typeof spec === "number") return [spec];
  if (Array.isArray(spec)) return spec;
  const map: Record<string,number> = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
  const [start, end] = spec.split("-").map(s => s.trim().slice(0,3));
  const from = map[start], to = map[end];
  const out: number[] = [];
  for (let d = from; d <= to; d++) out.push(d);
  return out;
}

// Usage example:
//
// const robinhood = new BrokerBuilder<RobinhoodStatus, HolidayStatus>()
//   .name("Robinhood")
//   .timeZone("America/New_York")
//   .schedules({
//     "Mon–Fri": [
//       { type: RobinhoodStatus.PRE_MARKET, start: "07:00", end: "09:30" },
//       { type: RobinhoodStatus.OPEN, start: "09:30", end: "16:00" },
//       { type: RobinhoodStatus.AFTER_HOURS, start: "16:00", end: "20:00" }
//     ]
//   })
//   .withHolidayFn(d => getStatusForShiftingHoliday(d,12,25))
//   .withHolidayStatusMapper((h,dt) => {
//     if (h === HolidayStatus.HALF_DAY) return RobinhoodStatus.OPEN;
//     return null;
//   })
//   .build();
