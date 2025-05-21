import {expect} from "chai";
import {fromZonedTime} from "date-fns-tz";
import {Alpaca} from "./Alpaca";

describe("Alpaca", () => {
  it("should be open during premarket hours", () => {
    // Monday 4:00 AM - start of premarket
    const premarketStart = fromZonedTime("2025-05-12T04:00:00", 'America/New_York');
    expect(Alpaca.isOpen(premarketStart)).to.equal(true);

    // Monday 9:29 AM - end of premarket
    const premarketEnd = fromZonedTime("2025-05-12T09:29:00", 'America/New_York');
    expect(Alpaca.isOpen(premarketEnd)).to.equal(true);
  });

  it("should be open during normal market hours", () => {
    // Monday 9:30 AM - start of normal session
    const normalStart = fromZonedTime("2025-05-12T09:30:00", 'America/New_York');
    expect(Alpaca.isOpen(normalStart)).to.equal(true);

    // Monday 15:59 PM - end of normal session
    const normalEnd = fromZonedTime("2025-05-12T15:59:00", 'America/New_York');
    expect(Alpaca.isOpen(normalEnd)).to.equal(true);
  });

  it("should be open during postmarket hours", () => {
    // Monday 16:00 PM - start of postmarket
    const postmarketStart = fromZonedTime("2025-05-12T16:00:00", 'America/New_York');
    expect(Alpaca.isOpen(postmarketStart)).to.equal(true);

    // Monday 19:59 PM - end of postmarket
    const postmarketEnd = fromZonedTime("2025-05-12T19:59:00", 'America/New_York');
    expect(Alpaca.isOpen(postmarketEnd)).to.equal(true);
  });

  it("should be closed outside market hours", () => {
    // Monday 3:59 AM - before premarket
    const beforePremarket = fromZonedTime("2025-05-12T03:59:00", 'America/New_York');
    expect(Alpaca.isOpen(beforePremarket)).to.equal(false);

    // Monday 20:00 PM - after postmarket
    const afterPostmarket = fromZonedTime("2025-05-12T20:00:00", 'America/New_York');
    expect(Alpaca.isOpen(afterPostmarket)).to.equal(false);
  });

  it("should be closed on holidays", () => {
    // Christmas Day 2025 (Thursday December 25, 2025) - a known NYSE holiday
    const christmasDay = fromZonedTime("2025-12-25T10:00:00", 'America/New_York');
    expect(Alpaca.isOpen(christmasDay)).to.equal(false);

    // New Year's Day 2025 (Thursday January 1, 2025) - another known NYSE holiday
    const newYearsDay = fromZonedTime("2025-01-01T10:00:00", 'America/New_York');
    expect(Alpaca.isOpen(newYearsDay)).to.equal(false);
  });
});
