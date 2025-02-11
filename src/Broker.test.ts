import {expect} from 'chai';
import {Broker, type BrokerConfig} from './Broker';

describe('HolidayType', () => {

    describe("simple case with no holidays", () => {
        enum Status {
            OPEN = "OPEN",
            CLOSED = "CLOSED",
        }

        const params: BrokerConfig<typeof Status> = {
            name: "NYSE",
            timezone: "America/New_York",
            statusEnum: Status,
            defaultStatus: Status.CLOSED,
            weeklySchedule: [
                {
                    day: 1,
                    type: Status.OPEN,
                    start: "09:30",
                    end: "16:00"
                },
                {
                    day: 2,
                    type: Status.OPEN,
                    start: "09:30",
                    end: "16:00"
                },
                {
                    day: 3,
                    type: Status.OPEN,
                    start: "09:30",
                    end: "16:00"
                },
                {
                    day: 4,
                    type: Status.OPEN,
                    start: "09:30",
                    end: "16:00"
                },
                {
                    day: 5,
                    type: Status.OPEN,
                    start: "09:30",
                    end: "16:00"
                }
            ],
            holidays: []
        }
        const broker = new Broker(params);

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

