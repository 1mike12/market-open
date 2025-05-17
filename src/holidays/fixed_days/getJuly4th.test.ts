import {expect} from "chai";
import {getJuly4th} from "./getJuly4th";
import {NYSE_HolidayStatus} from "../../enums/NYSE_HolidayStatus";
import {parseISO} from 'date-fns';

describe("isClosedForJuly4th", () => {

    it("should return true for July 4th", () => {
        const july4th = parseISO('2023-07-04T12:00:00-04:00');
        expect(getJuly4th(july4th)).equal(NYSE_HolidayStatus.CLOSED);
    });

    it("should return true for July 3rd if July 4th is on a Saturday", () => {
        const july3rd = parseISO('2020-07-03T12:00:00-04:00'); // July 4th on Saturday
        expect(getJuly4th(july3rd)).equal(NYSE_HolidayStatus.CLOSED);
    });

    it("should return false for July 3rd if July 4th is not on a Saturday", () => {
        const july3rd = parseISO('2021-07-03T12:00:00-04:00'); // July 4th on Sunday
        expect(getJuly4th(july3rd)).to.be.null;
    });

    it("should return true for July 5th if July 4th is on a Sunday", () => {
        const july5th = parseISO('2021-07-05T12:00:00-04:00'); // July 4th on Sunday
        expect(getJuly4th(july5th)).equal(NYSE_HolidayStatus.CLOSED);
    });

    it("should return false for July 5th if July 4th is not on a Sunday", () => {
        const july5th = parseISO('2022-07-05T12:00:00-04:00'); // July 4th on Monday
        expect(getJuly4th(july5th)).to.be.null;
    });

    it("should return false for a regular day in July", () => {
        const regularDay = parseISO('2023-07-02T12:00:00-04:00');
        expect(getJuly4th(regularDay)).to.be.null;
    });
});
