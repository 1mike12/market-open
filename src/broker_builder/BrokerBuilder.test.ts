import {expect} from 'chai';
import 'mocha';
import {BrokerBuilder} from './BrokerBuilder';

// Define test enums for sessions and holidays
enum TestSession {
  NORMAL = 'NORMAL',
  EXTRA = 'EXTRA'
}

enum TestHoliday {
  HALF_DAY = 'HALF_DAY',
  CLOSED = 'CLOSED'
}

describe('BrokerBuilder', () => {
  it('builds a broker that is open during defined hours', () => {
    const broker = new BrokerBuilder()
    .name('TestBroker')
    .timeZone('UTC')
    .schedules({
      'Mon-Fri': [
        {type: TestSession.NORMAL, start: '09:00', end: '17:00'}
      ]
    })
    // No holidays apply
    .withHolidayStatusMapper((_h, _dt) => null)
    .build();

    // 2025-01-06T10:00:00Z is a Monday at 10:00 UTC
    const mondayMorning = new Date(Date.UTC(2025, 0, 6, 10, 0, 0));
    expect(broker.isOpen(mondayMorning)).to.be.true;
    expect(broker.getOpenStatus(mondayMorning)).to.deep.equal([TestSession.NORMAL]);
  });

  it('is closed outside of defined hours', () => {
    const broker = new BrokerBuilder()
    .name('TestBroker')
    .timeZone('UTC')
    .schedules({
      'Mon-Fri': [
        {type: TestSession.NORMAL, start: '09:00', end: '17:00'}
      ]
    })
    .withHolidayStatusMapper(() => null)
    .build();

    // 2025-01-06T08:00:00Z is before normal hours
    const beforeOpen = new Date(Date.UTC(2025, 0, 6, 8, 0, 0));
    expect(broker.isOpen(beforeOpen)).to.be.false;
    expect(broker.getOpenStatus(beforeOpen)).to.be.null;

    // 2025-01-04T12:00:00Z is a Saturday
    const saturdayNoon = new Date(Date.UTC(2025, 0, 4, 12, 0, 0));
    expect(broker.isOpen(saturdayNoon)).to.be.false;
    expect(broker.getOpenStatus(saturdayNoon)).to.be.null;
  });

  it('can have different holiday behavior for regular and CLOSED holiday types', () => {
    const broker = new BrokerBuilder()
    .name('HolidayBroker')
    .timeZone('UTC')
    .schedules({
      'Mon-Fri': [
        {type: TestSession.NORMAL, start: '09:00', end: '17:00'}
      ]
    })
    // Test with 2 holidays:
    // Jan 10, 2025 as a half-day holiday (still respects schedule)
    // Jan 11, 2025 as a closed holiday (regardless of time)
    .withHolidayFn(d => {
      if (d.getUTCFullYear() === 2025 && d.getUTCMonth() === 0) {
        if (d.getUTCDate() === 10) return TestHoliday.HALF_DAY;
        if (d.getUTCDate() === 11) return TestHoliday.CLOSED;
      }
      return null;
    })
    .withHolidayStatusMapper((status: TestHoliday, _dt: Date) => {
      if (status === TestHoliday.HALF_DAY) {
        return TestSession.NORMAL;
      }
      if (status === TestHoliday.CLOSED) {
        return null; // Market is completely closed
      }
      return null;
    })
    .build();

    // Test half-day during normal hours - should be open with NORMAL session
    const halfDayDuringHours = new Date(Date.UTC(2025, 0, 10, 10, 0, 0));
    expect(broker.isOpen(halfDayDuringHours)).to.be.true;
    expect(broker.getOpenStatus(halfDayDuringHours)).to.deep.equal([TestSession.NORMAL]);

    // Test half-day outside normal hours - should be closed
    const halfDayBeforeHours = new Date(Date.UTC(2025, 0, 10, 8, 0, 0));
    expect(broker.isOpen(halfDayBeforeHours)).to.be.false;
    expect(broker.getOpenStatus(halfDayBeforeHours)).to.be.null;

    // Test closed holiday - should be closed regardless of time
    const closedHoliday = new Date(Date.UTC(2025, 0, 11, 12, 0, 0));
    expect(broker.isOpen(closedHoliday)).to.be.false;
    expect(broker.getOpenStatus(closedHoliday)).to.be.null;
  });
});
