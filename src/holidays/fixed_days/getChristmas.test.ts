import { expect } from "chai"
import { parseISO } from "date-fns"
import { NYSE_HolidayStatus } from "../../enums/NYSE_HolidayStatus"
import { getChristmas } from "./getChristmas"

describe("isClosedForChristmas", () => {
  it("should return true for Christmas Day", () => {
    const christmasDay = parseISO("2025-12-25T12:00:00-05:00")
    expect(getChristmas(christmasDay)).equal(NYSE_HolidayStatus.CLOSED)
  })

  it("should return false for Christmas Eve if Christmas is not on a Saturday", () => {
    const christmasEve = parseISO("2025-12-24T12:00:00-05:00")
    expect(getChristmas(christmasEve)).equal(NYSE_HolidayStatus.HALF_DAY)
  })

  it("should return true for Christmas Eve before 3 PM if Christmas is on a weekday", () => {
    const christmasEveMorning = parseISO("2025-12-24T14:59:00-05:00")
    expect(getChristmas(christmasEveMorning)).equal(NYSE_HolidayStatus.HALF_DAY)
  })

  it("should return true for December 24 if Christmas is on a Saturday", () => {
    const christmasEveFriday = parseISO("2021-12-24T12:00:00-05:00")
    expect(getChristmas(christmasEveFriday)).equal(NYSE_HolidayStatus.CLOSED)
  })

  it("should return true for December 26 if Christmas was on a Sunday", () => {
    const dayAfterChristmas = parseISO("2022-12-26T12:00:00-05:00")
    expect(getChristmas(dayAfterChristmas)).equal(NYSE_HolidayStatus.CLOSED)
  })

  it("should return false for December 26 if Christmas was not on a Sunday", () => {
    const dayAfterChristmas = parseISO("2025-12-26T12:00:00-05:00")
    expect(getChristmas(dayAfterChristmas)).to.be.null
  })

  it("should return false for a regular day in December", () => {
    const regularDay = parseISO("2025-12-20T12:00:00-05:00")
    expect(getChristmas(regularDay)).to.be.null
  })
})
