import { set } from "date-fns"

const cache = new Map<number, Date>()

/**
 * Calculate the date of Easter for a given year. results are cached for performance.
 * @param year
 */
export function getEasterForYear(year: number) {
  if (cache.has(year)) {
    return cache.get(year)
  }
  const floor = Math.floor
  const goldenNumber = year % 19
  const century = floor(year / 100)
  const skippedLeapYears = floor(century / 4)
  const correctionFactor = floor((8 * century + 13) / 25)
  const epact = (19 * goldenNumber + century - skippedLeapYears - correctionFactor + 15) % 30
  const adjustedEpact = epact
    - floor(epact / 28) * (1 - floor(epact / 28) * floor(29 / (epact + 1)) * floor((21 - goldenNumber) / 11))
  const fullMoonOffset = (year + floor(year / 4) + adjustedEpact + 2 - century + skippedLeapYears) % 7
  const daysFromMarch21 = adjustedEpact - fullMoonOffset
  const month = 3 + floor((daysFromMarch21 + 40) / 44)
  const day = daysFromMarch21 + 28 - 31 * floor(month / 4)
  const result = set(new Date(year, 0, 1), { month: month - 1, date: day })
  cache.set(year, result)
  return result
}
