/**
 * Arithmetic, field access, boundaries, rounding and differences.
 *
 * Policies (one for the whole package):
 * - `add`/`sub`/`set` clamp out-of-range fields (`overflow: 'constrain'`):
 *   Jan 31 + 1 month = Feb 28. Pass `{ overflow: 'reject' }` to throw instead.
 * - On a `ZonedDateTime`, calendar units (years…days) move the wall clock and
 *   time units (hours…ns) move the exact instant. Adding 1 day across a DST
 *   change is 23 or 25 elapsed hours; adding 24 hours is always 24.
 * - `diff(from, to)` is `to − from`: positive when `to` is later.
 */
import { instant } from './core.js';
import { negateDurationInput, toDurationInput } from './internal/amount.js';
import { daysBetween } from './internal/days.js';
import { sameKind } from './internal/kind.js';
import { addPlainDate, endOfPlainDate, startOfPlainDate } from './internal/plain.js';
import { addPoint, comparePoints, isCalendarUnit } from './internal/point.js';
import { startOfWeekDate } from './internal/week.js';
import { startOfZoned } from './internal/zoned.js';
import { isDuration, isInstant, ISO_WEEK, isPlainDate, isPlainDateTime, isZonedDateTime } from './types.js';
export function add(value, amount, options) {
    return sameKind(value, addAny(value, toDurationInput(amount), options));
}
/** Temporal's `add`, through the integer fast path for ISO-calendar plain dates. */
function addAny(value, input, options) {
    if (isPlainDate(value) && !isDuration(input)) {
        const fast = addPlainDate(value, input, options?.overflow);
        if (fast !== undefined)
            return fast;
    }
    return addPoint(value, input, options);
}
export function sub(value, amount, options) {
    return sameKind(value, addAny(value, negateDurationInput(toDurationInput(amount)), options));
}
export function parts(value) {
    const date = { year: value.year, month: value.month, day: value.day };
    if (isPlainDate(value))
        return date;
    return {
        ...date,
        hour: value.hour,
        minute: value.minute,
        second: value.second,
        millisecond: value.millisecond,
        microsecond: value.microsecond,
        nanosecond: value.nanosecond,
    };
}
function setPoint(value, patch, options) {
    if (isZonedDateTime(value))
        return value.with(patch, { offset: 'prefer', ...options });
    return value.with(patch, { overflow: options?.overflow });
}
/** A copy with the given fields replaced. Out-of-range fields clamp unless `overflow: 'reject'`. */
export function set(value, patch, options) {
    return sameKind(value, setPoint(value, patch, options));
}
// ---------------------------------------------------------------------------
// boundaries
function startOfDate(date, unit, rules) {
    const fast = startOfPlainDate(date, unit, rules);
    if (fast !== undefined)
        return fast;
    switch (unit) {
        case 'day': {
            return date;
        }
        case 'week': {
            return startOfWeekDate(date, rules);
        }
        case 'month': {
            return date.with({ day: 1 });
        }
        case 'quarter': {
            return date.with({ month: Math.floor((date.month - 1) / 3) * 3 + 1, day: 1 });
        }
        case 'year': {
            return date.with({ month: 1, day: 1 });
        }
    }
}
function startOfPoint(value, unit, rules) {
    if (isCalendarUnit(unit)) {
        if (isInstant(value))
            throw new RangeError(`startOf(${unit}) needs a zone — project the Instant with inZone() first`);
        if (isPlainDate(value))
            return startOfDate(value, unit, rules);
        if (isZonedDateTime(value)) {
            const fast = startOfZoned(value, unit, rules);
            if (fast !== undefined)
                return fast;
        }
        const date = startOfDate(value.toPlainDate(), unit, rules);
        if (isPlainDateTime(value))
            return date.toPlainDateTime();
        return date.toZonedDateTime({ timeZone: value.timeZoneId });
    }
    if (isPlainDate(value))
        throw new RangeError(`startOf(${unit}) is not defined for a PlainDate`);
    return value.round({ smallestUnit: unit, roundingMode: 'floor' });
}
export function startOf(value, unit, options) {
    return sameKind(value, startOfPoint(value, unit, options?.week ?? ISO_WEEK));
}
function oneUnit(unit) {
    switch (unit) {
        case 'year': {
            return { years: 1 };
        }
        case 'quarter': {
            return { months: 3 };
        }
        case 'month': {
            return { months: 1 };
        }
        case 'week': {
            return { weeks: 1 };
        }
        case 'day': {
            return { days: 1 };
        }
        case 'hour': {
            return { hours: 1 };
        }
        case 'minute': {
            return { minutes: 1 };
        }
        case 'second': {
            return { seconds: 1 };
        }
        case 'millisecond': {
            return { milliseconds: 1 };
        }
        case 'microsecond': {
            return { microseconds: 1 };
        }
        case 'nanosecond': {
            return { nanoseconds: 1 };
        }
    }
}
function nextBoundaryPoint(value, unit, rules) {
    if (isCalendarUnit(unit) || isPlainDate(value)) {
        const next = addPoint(startOfPoint(value, unit, rules), oneUnit(unit));
        return isZonedDateTime(next) ? startOfPoint(next, unit, rules) : next;
    }
    // The next `:00` on the clock. Temporal resolves a DST gap forward, so this
    // is also the start of a shortened unit (Lord Howe 02:30 after a 02:00 → 02:30 jump).
    const wall = value.round({ smallestUnit: unit, roundingMode: 'ceil' });
    if (!isZonedDateTime(value))
        return comparePoints(wall, value) > 0 ? wall : addPoint(wall, oneUnit(unit));
    // A fall-back fold repeats wall-clock time: the clock never shows the repeated
    // hour as "next", and a unit may last longer than itself (Lord Howe 01:00–02:00
    // spans 90 minutes). Step in exact time until the landed unit starts after `value`.
    let exact = value;
    let exactStart;
    do {
        exact = addPoint(exact, oneUnit(unit));
        exactStart = startOfPoint(exact, unit, rules);
    } while (comparePoints(exactStart, value) <= 0);
    return comparePoints(wall, value) > 0 && comparePoints(wall, exactStart) < 0 ? wall : exactStart;
}
export function nextBoundary(value, unit, options) {
    return sameKind(value, nextBoundaryPoint(value, unit, options?.week ?? ISO_WEEK));
}
export function endOf(value, unit, options) {
    if (isPlainDate(value) && isCalendarUnit(unit)) {
        const fast = endOfPlainDate(value, unit, options?.week ?? ISO_WEEK);
        if (fast !== undefined)
            return sameKind(value, fast);
    }
    const next = nextBoundaryPoint(value, unit, options?.week ?? ISO_WEEK);
    const step = isPlainDate(next) ? { days: -1 } : { nanoseconds: -1 };
    return sameKind(value, addPoint(next, step));
}
function roundTime(value, unit, increment, mode) {
    return value.round({ smallestUnit: unit, roundingIncrement: increment, roundingMode: mode });
}
function assertCalendarIncrement(unit, increment) {
    if (increment !== 1)
        throw new RangeError(`Rounding to ${String(increment)} ${unit}s is not supported; calendar units round to 1`);
}
function roundPoint(value, unit, options, mode) {
    const increment = options?.increment ?? 1;
    const rules = options?.week ?? ISO_WEEK;
    if (!isCalendarUnit(unit)) {
        if (isPlainDate(value))
            throw new RangeError(`Cannot round a PlainDate to ${unit}`);
        const tie = options?.tie === 'earlier' ? 'halfFloor' : 'halfCeil';
        return roundTime(value, unit, increment, mode === 'round' ? tie : mode);
    }
    assertCalendarIncrement(unit, increment);
    const start = startOfPoint(value, unit, rules);
    if (mode === 'floor')
        return start;
    const next = nextBoundaryPoint(value, unit, rules);
    if (comparePoints(value, start) === 0)
        return start;
    if (mode === 'ceil')
        return next;
    const toStart = spanNanoseconds(start, value);
    const toNext = spanNanoseconds(value, next);
    if (toStart < toNext)
        return start;
    if (toStart > toNext)
        return next;
    return options?.tie === 'earlier' ? start : next;
}
/** Distance between two points of the same kind in nanoseconds (days = 24h for zone-less values). */
function spanNanoseconds(from, to) {
    if (isInstant(from) && isInstant(to))
        return to.epochNanoseconds - from.epochNanoseconds;
    if (isZonedDateTime(from) && isZonedDateTime(to))
        return to.epochNanoseconds - from.epochNanoseconds;
    if (isPlainDate(from) && isPlainDate(to))
        return BigInt(daysBetween(from, to)) * 86400000000000n;
    if (isPlainDateTime(from) && isPlainDateTime(to)) {
        const d = from.until(to, { largestUnit: 'hour' });
        return (BigInt(d.hours) * 3600000000000n +
            BigInt(d.minutes) * 60000000000n +
            BigInt(d.seconds) * 1000000000n +
            BigInt(d.milliseconds) * 1000000n +
            BigInt(d.microseconds) * 1000n +
            BigInt(d.nanoseconds));
    }
    throw new TypeError('spanNanoseconds needs two values of the same kind');
}
export function floor(value, unit, options) {
    return sameKind(value, roundPoint(value, unit, options, 'floor'));
}
export function ceil(value, unit, options) {
    return sameKind(value, roundPoint(value, unit, options, 'ceil'));
}
export function round(value, unit, options) {
    return sameKind(value, roundPoint(value, unit, options, 'round'));
}
function isDateUnit(unit) {
    return unit === 'year' || unit === 'month' || unit === 'week' || unit === 'day';
}
function untilPoint(from, to, largestUnit) {
    if (isPlainDate(from) && isPlainDate(to)) {
        if (!isDateUnit(largestUnit))
            throw new RangeError(`A PlainDate difference cannot be measured in ${largestUnit}s`);
        return from.until(to, { largestUnit });
    }
    if (isPlainDateTime(from) && isPlainDateTime(to))
        return from.until(to, { largestUnit });
    if (isZonedDateTime(from) && isZonedDateTime(to))
        return from.until(to, { largestUnit });
    if (isInstant(from) && isInstant(to)) {
        if (isDateUnit(largestUnit))
            throw new RangeError(`An Instant difference cannot be measured in ${largestUnit}s — project it with inZone() first`);
        return from.until(to, { largestUnit });
    }
    throw new TypeError('diff needs two values of the same kind');
}
/** Temporal needs a calendar anchor to total months/years; an Instant has none. */
function anchorOf(point) {
    return isInstant(point) ? undefined : point;
}
function durationField(duration, unit) {
    switch (unit) {
        case 'year': {
            return duration.years;
        }
        case 'month': {
            return duration.months;
        }
        case 'week': {
            return duration.weeks;
        }
        case 'day': {
            return duration.days;
        }
        case 'hour': {
            return duration.hours;
        }
        case 'minute': {
            return duration.minutes;
        }
        case 'second': {
            return duration.seconds;
        }
        case 'millisecond': {
            return duration.milliseconds;
        }
        case 'microsecond': {
            return duration.microseconds;
        }
        case 'nanosecond': {
            return duration.nanoseconds;
        }
    }
}
export function diff(from, to, unit, options) {
    if (isPlainDate(from) && isPlainDate(to) && (unit === 'day' || unit === 'week')) {
        // Whole days between two calendar dates is integer arithmetic; no need
        // for Temporal's general (and, on the polyfill, slow) `until`.
        const days = daysBetween(from, to);
        if (unit === 'day')
            return days;
        return options?.fractional ? days / 7 : Math.trunc(days / 7);
    }
    const largestUnit = unit === 'quarter' ? 'month' : unit;
    const duration = untilPoint(from, to, largestUnit);
    const relativeTo = anchorOf(from);
    const total = options?.fractional
        ? duration.total({ unit: largestUnit, relativeTo })
        : durationField(duration, largestUnit);
    return unit === 'quarter' ? (options?.fractional ? total / 3 : Math.trunc(total / 3)) : total;
}
export function until(from, to, options) {
    const base = untilPoint(from, to, options.largestUnit);
    if (!options.smallestUnit && !options.roundingMode)
        return base;
    const relativeTo = anchorOf(from);
    return base.round({
        largestUnit: options.largestUnit,
        smallestUnit: options.smallestUnit ?? 'nanosecond',
        roundingMode: options.roundingMode ?? 'trunc',
        relativeTo,
    });
}
const NS = {
    nanosecond: 1n,
    microsecond: 1000n,
    millisecond: 1000000n,
    second: 1000000000n,
    minute: 60000000000n,
    hour: 3600000000000n,
    day: 86400000000000n,
    week: 604800000000000n,
};
/** Exact nanoseconds from `from` to `to`, ignoring calendars and zones. */
export function elapsedNanoseconds(from, to) {
    return instant(to).epochNanoseconds - instant(from).epochNanoseconds;
}
/**
 * Elapsed time between two instants. Here a `day` is exactly 24 hours and a
 * `week` 168 hours — use `diff` on zoned values for calendar days.
 */
export function diffElapsed(from, to, unit, options) {
    const ns = elapsedNanoseconds(from, to);
    if (options?.fractional)
        return Number(ns) / Number(NS[unit]);
    return Number(ns / NS[unit]);
}
//# sourceMappingURL=math.js.map