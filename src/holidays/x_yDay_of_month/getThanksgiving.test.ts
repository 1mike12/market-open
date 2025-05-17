import {expect} from "chai";
import {getThanksgiving} from "./getThanksgiving";
import {NYSE_HolidayStatus} from "../../enums/NYSE_HolidayStatus";
import {parseISO} from 'date-fns';

describe("isThanksgivingDay", () => {
    it("should return true for Thanksgiving Day in NYC timezone", () => {
        const thanksgiving2025 = parseISO('2025-11-27T12:00:00-05:00'); // Fourth Thursday of November 2025
        expect(getThanksgiving(thanksgiving2025)).equal(NYSE_HolidayStatus.CLOSED);
    });

    it("should return false for a date that is not Thanksgiving Day", () => {
        const notThanksgiving = parseISO('2025-11-26T00:00:00-05:00'); // Day before Thanksgiving
        expect(getThanksgiving(notThanksgiving)).to.be.null;
    });

    it("should return false for a date outside of November", () => {
        const octoberDate = parseISO('2025-10-27T00:00:00-05:00');
        expect(getThanksgiving(octoberDate)).to.be.null;
    });

    it("should handle leap years correctly", () => {
        const thanksgiving2024 = parseISO('2024-11-28T12:00:00-05:00'); // Fourth Thursday of November 2024
        expect(getThanksgiving(thanksgiving2024)).equal(NYSE_HolidayStatus.CLOSED);
    });

    it("should return true for historical Thanksgiving dates", () => {
        const thanksgiving2000 = parseISO('2000-11-23T12:00:00-05:00'); // Fourth Thursday of November 2000
        expect(getThanksgiving(thanksgiving2000)).equal(NYSE_HolidayStatus.CLOSED);
    });

    it("should handle times within the day and still return true", () => {
        const thanksgivingMorning = parseISO('2025-11-27T10:00:00-05:00'); // 10 AM
        const thanksgivingEvening = parseISO('2025-11-27T20:00:00-05:00'); // 8 PM
        expect(getThanksgiving(thanksgivingMorning)).equal(NYSE_HolidayStatus.CLOSED);
        expect(getThanksgiving(thanksgivingEvening)).equal(NYSE_HolidayStatus.CLOSED);
    });
});
