import { expect } from "chai"
import { parseISO } from "date-fns"
import { NYSE_HolidayStatus } from "../../../enums/NYSE_HolidayStatus"
import { getGoodFriday } from "./getGoodFriday"

describe("isClosedForGoodFriday", () => {
  it("should return true for Good Friday in 2023", () => {
    const goodFriday2023 = parseISO("2023-04-07")
    expect(getGoodFriday(goodFriday2023)).equal(NYSE_HolidayStatus.CLOSED)
  })

  it("should return true for Good Friday in 2022", () => {
    const goodFriday2022 = parseISO("2022-04-15")
    expect(getGoodFriday(goodFriday2022)).equal(NYSE_HolidayStatus.CLOSED)
  })

  it("should return true for Good Friday in 2021", () => {
    const goodFriday2021 = parseISO("2021-04-02")
    expect(getGoodFriday(goodFriday2021)).equal(NYSE_HolidayStatus.CLOSED)
  })

  it("should return true for Good Friday in 2020", () => {
    const goodFriday2020 = parseISO("2020-04-10")
    expect(getGoodFriday(goodFriday2020)).equal(NYSE_HolidayStatus.CLOSED)
  })

  it("should return true for Good Friday in 2019", () => {
    const goodFriday2019 = parseISO("2019-04-19")
    expect(getGoodFriday(goodFriday2019)).equal(NYSE_HolidayStatus.CLOSED)
  })

  it("should return false for a regular day in April", () => {
    const regularDay = parseISO("2023-04-10")
    expect(getGoodFriday(regularDay)).to.be.null
  })
})
