import {BrokerBuilder} from "../BrokerBuilder";
import {NYSE_SessionType} from "../../enums/NYSE_SessionType";
import {nyse_holidays} from "../../holidays/holiday_lists/nyse_holidays";
import {NYSE_HolidayStatus} from "../../enums/NYSE_HolidayStatus";
import {convertTimeToDecimal} from "../../date_utils/convertTimeToDecimal";

export const Alpaca = new BrokerBuilder()
.name('Alpaca')
.timeZone("America/New_York",)
.schedules({
  'Mon-Fri': [
    {type: NYSE_SessionType.PREMARKET, start: '04:00', end: '09:30'},
    {type: NYSE_SessionType.NORMAL, start: '09:30', end: '16:00'},
    {type: NYSE_SessionType.POSTMARKET, start: '16:00', end: '20:00'}
  ]
})
.withHolidayFn(nyse_holidays)
.withHolidayStatusMapper((holiday: NYSE_HolidayStatus, date: Date) => {
  if (holiday === NYSE_HolidayStatus.HALF_DAY) {
    const decimalHour = convertTimeToDecimal(date);
    if (decimalHour >= 4 && decimalHour < 9.5) {
      return NYSE_SessionType.PREMARKET;
    }
    if (decimalHour >= 9.5 && decimalHour < 13) {
      return NYSE_SessionType.NORMAL;
    }
    if (decimalHour >= 13 && decimalHour < 17) {
      return NYSE_SessionType.POSTMARKET;
    }
  }
  return null
})
.build();
