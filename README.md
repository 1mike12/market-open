# Market-Open

A flexible TypeScript library for managing and predicting broker/exchange trading hours

Fully customizable rules for defining trading schedules, holidays, and special trading sessions

## Features

- 🌍 Timezone-aware scheduling
- 📅 Customizable weekly trading schedules
- 🎯 Multiple trading session support (pre-market, regular hours, after-hours)
- 🏖 Holiday calendar integration
- 💪 Type-safe configurations
- ⚡ Zero dependencies (except date-fns-tz)

## Installation

```bash
npm install broker-schedule
```

## Quick Start

```typescript
import { Broker } from 'broker-schedule';

// Example usage with pre-configured Robinhood broker
import { Robinhood } from 'broker-schedule/brokers';

// Check if Robinhood is open
const now = new Date();
const isOpen = Robinhood.isOpen(now);

// Get detailed status (PRE_MARKET, OPEN, AFTER_HOURS)
const status = Robinhood.getOpenStatus(now);
console.log('Current trading session:', status);
```

## Creating a Custom Broker

You can create configurations for any broker or exchange by implementing the `BrokerConfig` interface:

```typescript
import { Broker, BrokerConfig } from 'broker-schedule';

// Define your status enum
enum CustomBrokerStatus {
    REGULAR = "REGULAR",
    SPECIAL = "SPECIAL",
}

// Define your holiday status enum
enum CustomHolidayStatus {
    CLOSED = "CLOSED",
    HALF_DAY = "HALF_DAY",
}

// Create broker configuration
const customConfig: BrokerConfig<typeof CustomBrokerStatus, typeof CustomHolidayStatus> = {
    name: "Custom Broker",
    timezone: "America/New_York",
    weeklySchedule: [
        {
            day: 1, // Monday
            type: CustomBrokerStatus.REGULAR,
            start: "09:30",
            end: "16:00"
        },
        {
            day: 1, // states can overlap in time
            type: CustomBrokerStatus.SPECIAL,
            start: "7:30",
            end: "20:00"
        }
        // Add more schedule entries...
    ],
    holidays: [
        // Add holiday checking functions
        (date: Date) => {
            // Return holiday status or null
            return null;
        }
    ],
    holidayToStatus: (holiday, dateTime) => {
        // map a holiday status to a opening status
        // this is useful for half-day for example, where half days are defined by the holiday
        // functions, but the hours and status depend on the current time
        if (holiday === CustomHolidayStatus.HALF_DAY) {
            const hours = dateTime.getHours();
            if (hours > 9 && hours < 13) {
                return CustomBrokerStatus.REGULAR;
            }
        }
        return null;
    }
};

// Create broker instance
const customBroker = new Broker(customConfig);
```

## Configuration Options

### BrokerConfig

| Property | Type | Description |
|----------|------|-------------|
| name | string | Broker/exchange name |
| timezone | string | Timezone identifier (e.g., "America/New_York") |
| weeklySchedule | WeekdaySchedule[] | Array of trading sessions |
| holidays | ((date: Date) => HolidayStatus \| null)[] | Array of holiday checker functions |
| holidayToStatus | (holiday: HolidayStatus, dateTime: Date) => BrokerStatus \| null | Holiday status converter |

### WeekdaySchedule

| Property | Type | Description |
|----------|------|-------------|
| day | number | Day of week (0-6, 0 = Sunday) |
| type | EnumValue | Trading session type |
| start | string | Session start time (HH:mm) |
| end | string | Session end time (HH:mm) |

## Methods

### isOpen(date: Date): boolean

Returns whether the broker is open at the given date/time.

### getOpenStatus(date: Date): EnumValue[] | null

Returns the current trading session status(es) or null if closed.

## Examples

### Checking Multiple Trading Sessions

```typescript
const broker = new Broker(RobinhoodConfig);
const now = new Date();
const status = broker.getOpenStatus(now);

if (status) {
    status.forEach(session => {
        console.log(`Currently in ${session} trading session`);
    });
} else {
    console.log('Market is closed');
}
```

### Custom Holiday Implementation

```typescript
const holidays = [
    (date: Date) => {
        // Check for Christmas
        if (date.getMonth() === 11 && date.getDate() === 25) {
            return CustomHolidayStatus.CLOSED;
        }
        return null;
    }
];
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

This project uses [date-fns-tz](https://github.com/marnusw/date-fns-tz) for timezone handling.
