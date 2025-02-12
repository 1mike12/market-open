import {expect} from "chai";
import {getMemorialDay} from "./getMemorialDay";
import {HolidayStatus} from "../HolidayStatus";
import {parseISO} from 'date-fns';

describe("isMemorialDay", () => {
    it("should return true for Memorial Day in NYC timezone", () => {
        const memorialDay2025 = parseISO('2025-05-27T00:00:00-04:00'); // Last Monday of May 2025
        const status = getMemorialDay(memorialDay2025);
        expect(status).equal(HolidayStatus.CLOSED);
    });

    it("should return false for a date that is not Memorial Day", () => {
        const notMemorialDay = parseISO('2025-05-25T00:00:00-04:00'); // Day before Memorial Day
        expect(getMemorialDay(notMemorialDay)).to.be.null;
    });

    it("should return false for a date outside of May", () => {
        const aprilDate = parseISO('2025-04-26T00:00:00-04:00');
        expect(getMemorialDay(aprilDate)).to.be.null;
    });

    it("should handle leap years correctly", () => {
        const memorialDay2024 = parseISO('2024-05-27T12:00:00-04:00'); // Last Monday of May 2024
        const status = getMemorialDay(memorialDay2024);
        expect(status).equal(HolidayStatus.CLOSED);
    });

    it("should return true for historical Memorial Day dates", () => {
        const memorialDay2000 = parseISO('2000-05-29T12:00:00-04:00'); // Last Monday of May 2000
        expect(getMemorialDay(memorialDay2000)).equal(HolidayStatus.CLOSED);
    });

    it("should handle times within the day and still return true", () => {
        const memorialDayMorning = parseISO('2025-05-26T10:00:00-04:00'); // 10 AM
        const memorialDayEvening = parseISO('2025-05-26T20:00:00-04:00'); // 8 PM
        expect(getMemorialDay(memorialDayMorning)).equal(HolidayStatus.CLOSED);
        expect(getMemorialDay(memorialDayEvening)).equal(HolidayStatus.CLOSED);
    });
});
