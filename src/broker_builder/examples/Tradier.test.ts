import { expect } from "chai"
import { fromZonedTime } from "date-fns-tz"
import { Tradier } from "./Tradier"

describe("Tradier", () => {
  it("should be closed on morning transition period", () => {
    // monday 9:23 am open
    const open = fromZonedTime("2025-05-12T09:23:00", "America/New_York")
    expect(Tradier.isOpen(open)).to.equal(true)

    // monday 9:25 am should be closed
    const closed = fromZonedTime("2025-05-12 09:26:00", "America/New_York")
    expect(Tradier.isOpen(closed)).to.equal(false)
  })
})
