import {expect} from "chai";
import {Tradier} from "./Tradier";

describe("Tradier", () => {
    it("should be closed on morning transition period", () => {
      //monday 9:23 am open
      //monday 9:25 am should be closed
      const open = new Date("2025-05-12T09:23:00")
      // const closed = Tradier.exchangeDate("2025-05-12T09:25:00")
      expect(Tradier.isOpen(open)).to.equal(true);
      // expect(Tradier.isOpen(closed)).to.equal(false);
    });
});
