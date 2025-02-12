import {getLastWeekdayOfMonth} from "./getLastWeekdayOfMonth";
import {expect} from "chai";

describe("getLastWeekdayOfMonth", () => {
    it("Last Monday of January 2025 (should be 27)", () => {
        const result = getLastWeekdayOfMonth(1, 1, 2025);
        expect(result).equal(27);
    });

    it("last Thursday of a leap year 2024 (February, should be 29)", () => {
        const result = getLastWeekdayOfMonth(4, 2, 2024);
        expect(result).equal(29);
    });

    it("Last Friday of February 2024 (leap year, should be 23)", () => {
        const result = getLastWeekdayOfMonth(5, 2, 2024);
        expect(result).equal(23);
    });

    it("Last Saturday of February 2023 (non-leap year, should be 25)", () => {
        const result = getLastWeekdayOfMonth(6, 2, 2023);
        expect(result).equal(25);
    });

    it("Last Wednesday of May 2023 (should be 31)", () => {
        const result = getLastWeekdayOfMonth(3, 5, 2023);
        expect(result).equal(31);
    });

    it("Last Sunday of February 2021 (non-leap year, should be 28)", () => {
        const result = getLastWeekdayOfMonth(7, 2, 2021);
        expect(result).equal(28);
    });

    it("Last Thursday of August 2025 (should be 28)", () => {
        const result = getLastWeekdayOfMonth(4, 8, 2025);
        expect(result).equal(28);
    });

    it("Handles 5 occurrences of a weekday in a month (July 2023, 5 Saturdays, last should be 29)", () => {
        const result = getLastWeekdayOfMonth(6, 7, 2023);
        expect(result).equal(29);
    });

    it("Handles 3 occurrences of a weekday in February (February 2021, 3 Sundays, last should be 28)", () => {
        const result = getLastWeekdayOfMonth(7, 2, 2021);
        expect(result).equal(28);
    });

    it("Edge case: January 2025 with 5 Mondays, last should be 27", () => {
        const result = getLastWeekdayOfMonth(1, 1, 2025);
        expect(result).equal(27);
    });

    it("Edge case: December 2023 with 5 Sundays, last should be 31", () => {
        const result = getLastWeekdayOfMonth(7, 12, 2023);
        expect(result).equal(31);
    });
});
