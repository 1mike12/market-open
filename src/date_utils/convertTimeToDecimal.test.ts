import { expect } from "chai"
import { convertTimeToDecimal } from "./convertTimeToDecimal"

describe("getTimeInDecimal", () => {
  it("should return the correct decimal value for a given time", () => {
    const date = new Date("2023-10-10T09:30:00")
    const result = convertTimeToDecimal(date)
    expect(result).to.equal(9.5)
  })

  it("should handle times with seconds correctly", () => {
    const date = new Date("2023-10-10T09:30:30")
    const result = convertTimeToDecimal(date)
    expect(result).to.be.closeTo(9.5083, 0.0001)
  })

  it("should handle times with milliseconds correctly", () => {
    const date = new Date("2023-10-10T09:30:30.500")
    const result = convertTimeToDecimal(date)
    expect(result).to.be.closeTo(9.508472, 0.000001)
  })

  it("should return 0 for midnight", () => {
    const date = new Date("2023-10-10T00:00:00")
    const result = convertTimeToDecimal(date)
    expect(result).to.equal(0)
  })

  it("should handle times in the afternoon correctly", () => {
    const date = new Date("2023-10-10T15:45:00")
    const result = convertTimeToDecimal(date)
    expect(result).to.equal(15.75)
  })
})
