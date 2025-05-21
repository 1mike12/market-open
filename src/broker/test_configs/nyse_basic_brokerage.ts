import { NYSE_HolidayStatus } from "../../enums/NYSE_HolidayStatus"
import { NYSE_SessionType } from "../../enums/NYSE_SessionType"
import type { BrokerConfig } from "../Broker"

export const nyse_basic_brokerage: BrokerConfig<typeof NYSE_SessionType, typeof NYSE_HolidayStatus> = {
  name: "NYSE",
  holidayEnum: NYSE_HolidayStatus,
  sessionEnum: NYSE_SessionType,
  timezone: "America/New_York",
  holidayToStatus: () => NYSE_SessionType.NORMAL,
  weeklySchedule: [
    {
      day: 1,
      type: NYSE_SessionType.NORMAL,
      start: "09:30",
      end: "16:00"
    },
    {
      day: 2,
      type: NYSE_SessionType.NORMAL,
      start: "09:30",
      end: "16:00"
    },
    {
      day: 3,
      type: NYSE_SessionType.NORMAL,
      start: "09:30",
      end: "16:00"
    },
    {
      day: 4,
      type: NYSE_SessionType.NORMAL,
      start: "09:30",
      end: "16:00"
    },
    {
      day: 5,
      type: NYSE_SessionType.NORMAL,
      start: "09:30",
      end: "16:00"
    }
  ],
  holidays: []
}
