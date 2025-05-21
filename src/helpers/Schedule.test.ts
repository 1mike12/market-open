import { expect } from "chai"
import { Schedule } from "./Schedule"

describe("Schedules", () => {
  enum Test {
    PREMARKET = "PRE",
    PREMARKET2 = "PRE2",
    OPEN = "OPEN"
  }

  const schedules = [
    {
      day: 1,
      data: Test.OPEN,
      start: "9:00",
      end: "16:00"
    },
    {
      day: 3,
      data: Test.PREMARKET,
      start: "4:00",
      end: "09:00"
    },
    {
      day: 3,
      data: Test.PREMARKET2,
      start: "4:00",
      end: "09:00"
    }
  ]
  const s = new Schedule(schedules)

  it("should be open", () => {
    expect(s.getSessions(1, 9 * 60)).deep.equal([Test.OPEN])
    expect(s.getSessions(1, 15 * 60)).deep.equal([Test.OPEN])
  })

  it("shoud not be open when time is exactly the close time", () => {
    expect(s.getSessions(1, 16 * 60)).length(0)
  })

  it("should not be open", () => {
    expect(s.getSessions(2, 9 * 60)).deep.equal([])
  })

  it("should get two sessions when sessions overlap", () => {
    expect(s.getSessions(3, 4 * 60)).deep.equal([Test.PREMARKET, Test.PREMARKET2])
  })
})
