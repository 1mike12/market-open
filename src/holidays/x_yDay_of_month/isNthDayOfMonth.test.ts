import { expect } from "chai"
import { parseISO } from "date-fns"
import { isNthDayOfMonth } from "./isNthDayOfMonth"

describe("isNthDayOfMonth", () => {
  it("should return true for the correct nth weekday of the month", () => {
    const date = parseISO("2023-10-16") // 3rd Monday of October 2023
    const result = isNthDayOfMonth(date, 10, 1, 3)
    expect(result).to.be.true
  })

  it("should return false for an incorrect nth weekday of the month", () => {
    const date = parseISO("2023-10-16") // 3rd Monday of October 2023
    const result = isNthDayOfMonth(date, 10, 1, 2)
    expect(result).to.be.false
  })

  it("should return false if the month does not match", () => {
    const date = parseISO("2023-09-16") // 3rd Monday of September 2023
    const result = isNthDayOfMonth(date, 10, 1, 3)
    expect(result).to.be.false
  })

  it("should return false if the weekday does not match", () => {
    const date = parseISO("2023-10-17") // 3rd Tuesday of October 2023
    const result = isNthDayOfMonth(date, 10, 1, 3)
    expect(result).to.be.false
  })
})
