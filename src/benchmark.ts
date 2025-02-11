import moment from 'moment-timezone';
import { DateTime, Settings } from 'luxon';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { isWithinInterval, parseISO } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';

// Configure dayjs plugins
dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(utc);

// Optimize Luxon settings
Settings.defaultZoneName = "utc";
Settings.throwOnInvalid = false;
Settings.defaultLocale = "en-US";

// Test configuration
const ITERATIONS = 10000;
const TEST_CASES = [
  {
    start: '2024-02-11T10:00:00',
    end: '2024-02-11T14:00:00',
    test: '2024-02-11T12:00:00',
    startEndTz: 'America/New_York',
    testTz: 'Asia/Tokyo'
  },
  {
    start: '2024-02-11T00:00:00',
    end: '2024-02-12T00:00:00',
    test: '2024-02-11T15:00:00',
    startEndTz: 'Europe/London',
    testTz: 'America/Los_Angeles'
  }
];

// Pre-compute timezone offsets for Moment optimization
const tzOffsets = {};
TEST_CASES.forEach(testCase => {
  if (!tzOffsets[testCase.startEndTz]) {
    tzOffsets[testCase.startEndTz] = moment.tz(testCase.start, testCase.startEndTz).utcOffset();
  }
  if (!tzOffsets[testCase.testTz]) {
    tzOffsets[testCase.testTz] = moment.tz(testCase.test, testCase.testTz).utcOffset();
  }
});

// Benchmark functions with different optimization strategies
const benchmarks = {
  // Standard Moment implementation
  'moment-standard': (testCase) => {
    const start = moment.tz(testCase.start, testCase.startEndTz);
    const end = moment.tz(testCase.end, testCase.startEndTz);
    const test = moment.tz(testCase.test, testCase.testTz);
    return test.isBetween(start, end, 'minute', '[]');
  },

  // Optimized Moment implementation using UTC
  'moment-optimized': (testCase) => {
    const start = moment.utc(testCase.start).add(tzOffsets[testCase.startEndTz], 'minutes');
    const end = moment.utc(testCase.end).add(tzOffsets[testCase.startEndTz], 'minutes');
    const test = moment.utc(testCase.test).add(tzOffsets[testCase.testTz], 'minutes');
    return test.isBetween(start, end, null, '[]');
  },

  // Standard Luxon implementation
  'luxon-standard': (testCase) => {
    const start = DateTime.fromISO(testCase.start, { zone: testCase.startEndTz });
    const end = DateTime.fromISO(testCase.end, { zone: testCase.startEndTz });
    const test = DateTime.fromISO(testCase.test, { zone: testCase.testTz });
    return test >= start && test <= end;
  },

  // Optimized Luxon implementation using UTC
  'luxon-optimized': (testCase) => {
    const start = DateTime.fromISO(testCase.start, { zone: testCase.startEndTz }).toUTC().toMillis();
    const end = DateTime.fromISO(testCase.end, { zone: testCase.startEndTz }).toUTC().toMillis();
    const test = DateTime.fromISO(testCase.test, { zone: testCase.testTz }).toUTC().toMillis();
    return test >= start && test <= end;
  },

  // Standard Day.js implementation
  'dayjs-standard': (testCase) => {
    const start = dayjs.tz(testCase.start, testCase.startEndTz);
    const end = dayjs.tz(testCase.end, testCase.startEndTz);
    const test = dayjs.tz(testCase.test, testCase.testTz);
    return test.isBetween(start, end, 'minute', '[]');
  },

  // Optimized Day.js implementation using UTC
  'dayjs-optimized': (testCase) => {
    const start = dayjs.tz(testCase.start, testCase.startEndTz).valueOf();
    const end = dayjs.tz(testCase.end, testCase.startEndTz).valueOf();
    const test = dayjs.tz(testCase.test, testCase.testTz).valueOf();
    return test >= start && test <= end;
  },

  // Standard date-fns implementation
  'date-fns-standard': (testCase) => {
    const start = toZonedTime(parseISO(testCase.start), testCase.startEndTz);
    const end = toZonedTime(parseISO(testCase.end), testCase.startEndTz);
    const test = toZonedTime(parseISO(testCase.test), testCase.testTz);
    return isWithinInterval(test, { start, end });
  },

  // Optimized date-fns implementation
  'date-fns-optimized': (testCase) => {
    // Convert to UTC dates first, then to timestamps
    const startUtc = toZonedTime(parseISO(testCase.start), testCase.startEndTz);
    const endUtc = toZonedTime(parseISO(testCase.end), testCase.startEndTz);
    const testUtc = toZonedTime(parseISO(testCase.test), testCase.testTz);

    // Convert to timestamps for comparison
    const startTs = startUtc.getTime();
    const endTs = endUtc.getTime();
    const testTs = testUtc.getTime();

    return testTs >= startTs && testTs <= endTs;
  }
};

// Run benchmark
function runBenchmark(implementation, testCase) {
  const start = performance.now();
  const fn = benchmarks[implementation];

  for (let i = 0; i < ITERATIONS; i++) {
    fn(testCase);
  }

  const end = performance.now();
  return end - start;
}

// Run all benchmarks
function runAllBenchmarks() {
  const implementations = Object.keys(benchmarks);
  const results = {};

  implementations.forEach(impl => {
    results[impl] = [];

    TEST_CASES.forEach((testCase, index) => {
      // Warm up run
      runBenchmark(impl, testCase);

      // Actual benchmark run
      const time = runBenchmark(impl, testCase);
      results[impl].push({
        testCase: index + 1,
        time: time.toFixed(2),
        msPerOperation: (time / ITERATIONS).toFixed(4)
      });
    });
  });

  // Print results
  console.log(`Benchmark Results (${ITERATIONS} iterations per test case):\n`);

  implementations.forEach(impl => {
    console.log(`${impl}:`);
    results[impl].forEach(result => {
      console.log(`  Test Case ${result.testCase}:`);
      console.log(`    Total time: ${result.time}ms`);
      console.log(`    Time per operation: ${result.msPerOperation}ms`);
    });
    console.log();
  });
}

// Run benchmarks
runAllBenchmarks();
