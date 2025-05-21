import { expect } from "chai"
import * as sinon from "sinon"
import { NYSE_SessionType } from "../enums/NYSE_SessionType"
import { Broker } from "./Broker"
import { all_open_brokerage_except_new_years } from "./test_configs/all_open_brokerage_except_new_years"
import { nyse_basic_brokerage } from "./test_configs/nyse_basic_brokerage"

const mondayAtNoon = new Date("2021-01-04T17:00:00Z")
const mondayAfterClose = new Date("2021-01-04T21:00:00Z")

describe("HolidayType", () => {
  describe("holidays", () => {
    it("should be closed on New Year's Day and open any other time", () => {
      const broker = new Broker(all_open_brokerage_except_new_years)
      // in 2024, january 1st was a monday
      const openStatus = broker.getOpenStatuses(new Date("2024-01-01T17:00:00Z"))

      expect(openStatus).equal(null)
    })
  })

  describe("simple case with no holidays", () => {
    const broker = new Broker(nyse_basic_brokerage)

    it("should return open when in standard open hours on Monday", () => {
      const openTimes = ["09:30", "10:00", "15:59"]
      for (let i = 1; i <= 5; i++) {
        openTimes.forEach(time => {
          // Construct a NYC time (Eastern Time) date
          const nycDate = new Date(`2018-01-0${i}T${time}:00-05:00`)
          expect(broker.getOpenStatuses(nycDate)).deep.equal([NYSE_SessionType.NORMAL])
        })
      }
    })

    it("should not consider end time as open", () => {
      const nycDate = new Date(`2018-01-01T16:00:00-05:00`)
      expect(broker.getOpenStatuses(nycDate)).deep.equal(null)
    })

    it("should return closed when on weekend", () => {
      // saturday
      expect(broker.getOpenStatuses(new Date("2021-01-09T17:00:00Z"))).deep.equal(null) // 12:00 PM NYC time
      // sunday
      expect(broker.getOpenStatuses(new Date("2021-01-10T17:00:00Z"))).deep.equal(null) // 12:00 PM NYC time
    })
  })

  describe("no date parameter", () => {
    let clock: sinon.SinonFakeTimers
    const broker = new Broker(nyse_basic_brokerage)

    beforeEach(() => {
      clock = sinon.useFakeTimers()
    })

    afterEach(() => {
      clock.restore()
    })

    it("should take the current time set to 9:00 as closed", () => {
      // Set to 9:00 AM NYC time (14:00 UTC)
      clock.setSystemTime(new Date("2024-01-01T14:00:00Z"))
      expect(broker.isOpen()).equal(false)
    })

    it("should take the current time set to 9:30 am as open", () => {
      // Set to 9:30 AM NYC time (14:30 UTC)
      clock.setSystemTime(new Date("2024-01-01T14:30:00Z"))
      expect(broker.isOpen()).equal(true)
    })
  })

  describe("other methods", () => {
    it("isClosed", () => {
      const broker = new Broker(nyse_basic_brokerage)
      expect(broker.isOpen(mondayAtNoon)).equal(true)
      expect(broker.isOpen(mondayAfterClose)).equal(false)
    })
  })
})
