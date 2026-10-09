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
import { toDuration } from './internal/amount.js';
import { sameKind } from './internal/kind.js';
import { isInstant, ISO_WEEK, isPlainDate, isPlainDateTime, isZonedDateTime, Temporal } from './types.js';
// ---------------------------------------------------------------------------
// add / sub
function addPoint(value, duration, options) {
    if (isInstant(value))
        return value.add(duration);
    return value.add(duration, options);
}
/** `value + amount`. Calendar amounts are rejected on an `Instant` (project it into a zone first). */
export function add(value, amount, options) {
    return sameKind(value, addPoint(value, toDuration(amount), options));
}
/** `value − amount`. Not always the inverse of `add` (Jan 31 + 1 month − 1 month = Feb 28 − 1 month = Jan 28). */
export function sub(value, amount, options) {
    return sameKind(value, addPoint(value, toDuration(amount).negated(), options));
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
function startOfWeekDate(date, rules) {
    const back = (date.dayOfWeek - rules.startsOn + 7) % 7;
    return back === 0 ? date : date.subtract({ days: back });
}
function startOfDate(date, unit, rules) {
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
function isCalendarUnit(unit) {
    return unit === 'year' || unit === 'quarter' || unit === 'month' || unit === 'week' || unit === 'day';
}
function startOfPoint(value, unit, rules) {
    if (isCalendarUnit(unit)) {
        if (isInstant(value))
            throw new RangeError(`startOf(${unit}) needs a zone — project the Instant with inZone() first`);
        if (isPlainDate(value))
            return startOfDate(value, unit, rules);
        const date = startOfDate(value.toPlainDate(), unit, rules);
        if (isPlainDateTime(value))
            return date.toPlainDateTime();
        return date.toZonedDateTime({ timeZone: value.timeZoneId });
    }
    if (isPlainDate(value))
        throw new RangeError(`startOf(${unit}) is not defined for a PlainDate`);
    return value.round({ smallestUnit: unit, roundingMode: 'floor' });
}
/** The first moment of the unit containing `value` (week per `options.week`, ISO by default). */
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
/** The start of the unit after the one containing `value` — the exclusive end of `startOf(value, unit)`. */
export function nextBoundary(value, unit, options) {
    const rules = options?.week ?? ISO_WEEK;
    const start = startOfPoint(value, unit, rules);
    const next = addPoint(start, toDuration(oneUnit(unit)));
    return sameKind(value, startOfPoint(next, unit, rules));
}
/**
 * The last representable moment of the unit: the next boundary minus one day
 * for a `PlainDate`, minus one nanosecond otherwise. Prefer `[startOf, nextBoundary)`
 * for range queries; `endOf` exists for display and inclusive APIs.
 */
export function endOf(value, unit, options) {
    const next = nextBoundary(value, unit, options);
    const step = isPlainDate(next) ? { days: 1 } : { nanoseconds: 1 };
    return sameKind(value, addPoint(next, toDuration(step).negated()));
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
    const next = startOfPoint(addPoint(start, toDuration(oneUnit(unit))), unit, rules);
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
    if (isPlainDate(from) && isPlainDate(to)) {
        return BigInt(from.until(to, { largestUnit: 'day' }).days) * 86400000000000n;
    }
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
function comparePoints(a, b) {
    if (isPlainDate(a) && isPlainDate(b))
        return Temporal.PlainDate.compare(a, b);
    if (isPlainDateTime(a) && isPlainDateTime(b))
        return Temporal.PlainDateTime.compare(a, b);
    if (isZonedDateTime(a) && isZonedDateTime(b))
        return Temporal.ZonedDateTime.compare(a, b);
    if (isInstant(a) && isInstant(b))
        return Temporal.Instant.compare(a, b);
    throw new TypeError('compare needs two values of the same kind');
}
/** Round down to the unit (or to a multiple of it via `increment`). Same as `startOf` for calendar units. */
export function floor(value, unit, options) {
    return sameKind(value, roundPoint(value, unit, options, 'floor'));
}
/** Round up to the unit; a value already on the boundary is returned unchanged. */
export function ceil(value, unit, options) {
    return sameKind(value, roundPoint(value, unit, options, 'ceil'));
}
/** Round to the nearest unit boundary; ties go to the later boundary unless `tie: 'earlier'`. */
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
/**
 * `to − from` in whole units (truncated toward zero), or the exact fractional
 * total with `{ fractional: true }`. Calendar units are anchored at `from`:
 * `diff(Jan 31, Feb 28, 'month')` is 1, the reverse is `-28/31`.
 * Zoned values must share a zone for calendar units.
 */
export function diff(from, to, unit, options) {
    const largestUnit = unit === 'quarter' ? 'month' : unit;
    const duration = untilPoint(from, to, largestUnit);
    const relativeTo = anchorOf(from);
    const total = options?.fractional
        ? duration.total({ unit: largestUnit, relativeTo })
        : durationField(duration, largestUnit);
    return unit === 'quarter' ? (options?.fractional ? total / 3 : Math.trunc(total / 3)) : total;
}
/** `to − from` as a balanced `Duration` (e.g. 1 month 3 days 4 hours). */
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
/** @internal re-exported for sibling modules */
export const internal = { startOfWeekDate, comparePoints, isCalendarUnit, oneUnit };
//# sourceMappingURL=math.js.map