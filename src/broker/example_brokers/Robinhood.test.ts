import {Robinhood, RobinhoodStatus} from "./Robinhood";
import {expect} from "chai";

describe("Robinhood", () => {

    describe("weekday and time based rules", () => {
        it("should get premarket", () => {
            const sevenAMMonday = new Date("2024-11-18T07:00:00-05:00");
            expect(Robinhood.getOpenStatus(sevenAMMonday)).deep.equal([RobinhoodStatus.PRE_MARKET]);
        })

        it("should get open", () => {
            const tenAMMonday = new Date("2024-11-18T10:00:00-05:00");
            expect(Robinhood.getOpenStatus(tenAMMonday)).deep.equal([RobinhoodStatus.OPEN]);
        })

        it("should get after hours", () => {
            const fourPMMonday = new Date("2024-11-18T18:00:00-05:00");
            expect(Robinhood.getOpenStatus(fourPMMonday)).deep.equal([RobinhoodStatus.AFTER_HOURS]);
        })

        it("should get closed for weekends", () => {
            const sunday = new Date("2024-11-17T12:00:00-05:00");
            expect(Robinhood.getOpenStatus(sunday)).deep.equal(null);

            const saturday = new Date("2024-11-16T12:00:00-05:00");
            expect(Robinhood.getOpenStatus(saturday)).deep.equal(null);
        })
    })

    describe("holiday based rules", () => {
        describe("day of week", () => {
            it('should be closed on thanksgiving', () => {
                const thanksgiving = new Date("2024-11-28T12:00:00-05:00");
                expect(Robinhood.getOpenStatus(thanksgiving)).deep.equal(null);
            })

            it("should be open on the day before thanksgiving", () => {
                const wednesday = new Date("2024-11-27T12:00:00-05:00");
                expect(Robinhood.getOpenStatus(wednesday)).deep.equal([RobinhoodStatus.OPEN]);
            })
        })

        describe("dynamic holiday", () => {
            it("should be closed on friday before christmas when christmas is a saturday", () => {
                // christmas eve is a friday in 2021
                const christmasEve = new Date("2021-12-24T12:00:00-05:00");
                expect(Robinhood.getOpenStatus(christmasEve)).deep.equal(null);
                const thursday = new Date("2021-12-23T12:00:00-05:00");
                expect(Robinhood.getOpenStatus(thursday)).deep.equal([RobinhoodStatus.OPEN]);
            })

            it("should be closed on monday after christmas when christmas is a sunday", () => {
                // christmas is a sunday in 2022
                const mondayAfterChristmas = new Date("2016-12-26T12:00:00-05:00");
                expect(Robinhood.getOpenStatus(mondayAfterChristmas)).deep.equal(null);
                const tuesdayAfterChristmas = new Date("2016-12-27T12:00:00-05:00");
                expect(Robinhood.getOpenStatus(tuesdayAfterChristmas)).deep.equal([RobinhoodStatus.OPEN]);
            })

            it("should be a half day when christmas is on a weekday", () => {
                // christmas is a friday in 2020
                const christmasEve = new Date("2020-12-24T12:00:00-05:00");
                expect(Robinhood.getOpenStatus(christmasEve)).deep.equal([RobinhoodStatus.OPEN]);
                const thursday = new Date("2020-12-24T12:00:00-05:00");
                expect(Robinhood.getOpenStatus(thursday)).deep.equal([RobinhoodStatus.OPEN]);
            })
        })
    })

})
