import {expect} from 'chai';
import {Broker, type BrokerConfig} from './Broker';
import {nyse_basic_brokerage} from "./test_helpers/nyse_basic_brokerage";
import {all_open_brokerage_except_new_years} from "./test_helpers/all_open_brokerage_except_new_years";

enum Status {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}

describe('HolidayType', () => {

    describe('holidays', () => {
        it("should be closed on New Year's Day and open any other time", () => {
            const broker = new Broker(all_open_brokerage_except_new_years);
            expect(broker.getStatus(new Date('2021-01-01T17:00:00Z'))).deep.equal([Status.CLOSED]);
            expect(broker.getStatus(new Date('2021-01-02T17:00:00Z'))).deep.equal([Status.OPEN]);
            expect(broker.getStatus(new Date('2021-01-03T23:00:00Z'))).deep.equal([Status.OPEN]);
        })
    })

    describe("simple case with no holidays", () => {
        const broker = new Broker(nyse_basic_brokerage);

        it("should return open when in standard open hours on Monday", () => {
            const openTimes = ["09:30", "10:00", "15:59"];
            for (let i = 1; i <= 5; i++) {
                openTimes.forEach(time => {
                    // Construct a NYC time (Eastern Time) date
                    const nycDate = new Date(`2018-01-0${i}T${time}:00-05:00`);
                    expect(broker.getStatus(nycDate)).deep.equal([Status.OPEN]);
                });
            }
        });

        it("should not consider end time as open", () => {
            const nycDate = new Date(`2018-01-01T16:00:00-05:00`);
            expect(broker.getStatus(nycDate)).deep.equal([Status.CLOSED]);
        })

        it("should return closed when on weekend", () => {
            // saturday
            expect(broker.getStatus(new Date('2021-01-09T17:00:00Z'))).deep.equal([Status.CLOSED]); // 12:00 PM NYC time
            // sunday
            expect(broker.getStatus(new Date('2021-01-10T17:00:00Z'))).deep.equal([Status.CLOSED]); // 12:00 PM NYC time
        })
    })
})

