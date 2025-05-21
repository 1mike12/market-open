import { expect } from "chai"
import { isSameDay, parseISO } from "date-fns"
import { getEasterForYear } from "./getEasterForYear"

describe("getEasterForYear", () => {
  it("should return the correct date for Easter in 2023", () => {
    const easter2023 = getEasterForYear(2023)
    const expectedDate = parseISO("2023-04-09")
    expect(isSameDay(easter2023, expectedDate)).to.be.true
  })

  it("should return the correct date for Easter in 2022", () => {
    const easter2022 = getEasterForYear(2022)
    const expectedDate = parseISO("2022-04-17")
    expect(isSameDay(easter2022, expectedDate)).to.be.true
  })

  it("should return the correct date for Easter in 2021", () => {
    const easter2021 = getEasterForYear(2021)
    const expectedDate = parseISO("2021-04-04")
    expect(isSameDay(easter2021, expectedDate)).to.be.true
  })

  it("should return the correct date for Easter in 2020", () => {
    const easter2020 = getEasterForYear(2020)
    const expectedDate = parseISO("2020-04-12")
    expect(isSameDay(easter2020, expectedDate)).to.be.true
  })

  it("should return the correct date for Easter in 2019", () => {
    const easter2019 = getEasterForYear(2019)
    const expectedDate = parseISO("2019-04-21")
    expect(isSameDay(easter2019, expectedDate)).to.be.true
  })
})
