import {expect} from "chai";
import {getNewYears} from "./getNewYears";
import {HolidayStatus} from "../HolidayStatus";
import {parseISO} from 'date-fns';

describe("isClosedForNewYears", () => {

    it("should return true for New Year's Day", () => {
        const newYearsDay = parseISO('2025-01-01T12:00:00-05:00');
        expect(getNewYears(newYearsDay)).equal(HolidayStatus.CLOSED);
    });

    it("should return false for the Friday before if New Year's Day is on a Saturday", () => {
        const newYearsEveFriday = parseISO('2021-12-31T12:00:00-05:00'); // New Year's Day on Saturday
        expect(getNewYears(newYearsEveFriday)).to.be.null;
    });

    it("should return true for January 2 if New Year's Day is on a Sunday", () => {
        const dayAfterNewYears = parseISO('2023-01-02T12:00:00-05:00'); // New Year's Day on Sunday
        expect(getNewYears(dayAfterNewYears)).equal(HolidayStatus.CLOSED);
    });

    it("should return false for January 2 if New Year's Day is not on a Sunday", () => {
        const dayAfterNewYears = parseISO('2025-01-02T12:00:00-05:00'); // New Year's Day on Wednesday
        expect(getNewYears(dayAfterNewYears)).to.be.null;
    });

    it("should return false for a regular day in January", () => {
        const regularDay = parseISO('2025-01-03T12:00:00-05:00');
        expect(getNewYears(regularDay)).to.be.null;
    });
});
