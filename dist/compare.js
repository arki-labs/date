/**
 * Equality, ordering and predicates. Two values must be of the same kind;
 * mixing a `PlainDate` with a `ZonedDateTime` is a type error and a runtime
 * `TypeError`. Ordering of zoned values compares instants; equality also
 * compares the zone.
 */
import { instant, plainDate } from './core.js';
import { bucketStart, epochDaysOf } from './internal/buckets.js';
import { assertSameKind } from './internal/kind.js';
import { comparePoints, isCalendarUnit } from './internal/point.js';
import { startOf } from './math.js';
import { isInstant, ISO_WEEK, isPlainDate, isPlainDateTime, isZonedDateTime } from './types.js';
function equalsPoint(a, b) {
    assertSameKind(a, b, 'equals');
    if (isPlainDate(a) && isPlainDate(b))
        return a.equals(b);
    if (isPlainDateTime(a) && isPlainDateTime(b))
        return a.equals(b);
    if (isZonedDateTime(a) && isZonedDateTime(b))
        return a.equals(b);
    if (isInstant(a) && isInstant(b))
        return a.equals(b);
    return false;
}
/** Field-for-field equality (for zoned values: same instant *and* same zone). */
export function equals(a, b) {
    return equalsPoint(a, b);
}
/** Do two timeline values point at the same instant, whatever their zones? */
export function sameInstant(a, b) {
    return instant(a).equals(instant(b));
}
function sign(n) {
    return n < 0 ? -1 : n > 0 ? 1 : 0;
}
/** `-1` when `a` is earlier, `1` when later, `0` when equal. Usable directly as an `Array#sort` comparator. */
export function compareAsc(a, b) {
    return sign(comparePoints(a, b));
}
export function compareDesc(a, b) {
    return sign(comparePoints(b, a));
}
export function isBefore(a, b) {
    return comparePoints(a, b) < 0;
}
export function isAfter(a, b) {
    return comparePoints(a, b) > 0;
}
export function isSameOrBefore(a, b) {
    return comparePoints(a, b) <= 0;
}
export function isSameOrAfter(a, b) {
    return comparePoints(a, b) >= 0;
}
function toBucketable(value, timeZone, unit) {
    if (isInstant(value)) {
        if (!timeZone)
            throw new TypeError(`isSame(${unit}) on Instants needs a timeZone option`);
        return value.toZonedDateTimeISO(timeZone);
    }
    if (isZonedDateTime(value) && timeZone)
        return value.withTimeZone(timeZone);
    return value;
}
/**
 * Calendar buckets compared as integer day counts. `undefined` (Temporal then
 * decides, and raises its errors) for instants without a zone, zoned values in
 * different zones without a `timeZone` option, and non-ISO calendars.
 */
function sameBucket(a, b, unit, options) {
    const zone = options?.timeZone;
    if (zone === undefined && isZonedDateTime(a) && isZonedDateTime(b) && a.timeZoneId !== b.timeZoneId)
        return undefined;
    const left = epochDaysOf(a, zone);
    const right = epochDaysOf(b, zone);
    if (left === undefined || right === undefined)
        return undefined;
    const rules = options?.week ?? ISO_WEEK;
    return bucketStart(left, unit, rules) === bucketStart(right, unit, rules);
}
export function isSame(a, b, unit, options) {
    assertSameKind(a, b, 'isSame');
    if (isCalendarUnit(unit)) {
        const fast = sameBucket(a, b, unit, options);
        if (fast !== undefined)
            return fast;
    }
    const left = toBucketable(a, options?.timeZone, unit);
    const right = toBucketable(b, options?.timeZone, unit);
    if (isZonedDateTime(left) && isZonedDateTime(right) && left.timeZoneId !== right.timeZoneId) {
        throw new TypeError(`isSame(${unit}) across zones ${left.timeZoneId} and ${right.timeZoneId} needs an explicit timeZone option`);
    }
    if (isCalendarUnit(unit)) {
        // Calendar buckets depend only on the date, and PlainDate boundaries are
        // far cheaper than rebuilding zoned midnights.
        return startOf(plainDate(left), unit, options).equals(startOf(plainDate(right), unit, options));
    }
    if (isPlainDate(left) || isPlainDate(right))
        throw new RangeError(`isSame(${unit}) is not defined for a PlainDate`);
    return equalsPoint(startOf(left, unit, options), startOf(right, unit, options));
}
export function isSameDay(a, b, options) {
    return isSame(a, b, 'day', options);
}
export function isSameWeek(a, b, options) {
    return isSame(a, b, 'week', options);
}
export function isSameMonth(a, b, options) {
    return isSame(a, b, 'month', options);
}
export function isSameQuarter(a, b, options) {
    return isSame(a, b, 'quarter', options);
}
export function isSameYear(a, b, options) {
    return isSame(a, b, 'year', options);
}
/** Is `value` inside `[start, end)` (or the given `bounds`)? Reversed bounds throw. */
export function isBetween(value, start, end, options) {
    if (comparePoints(start, end) > 0)
        throw new RangeError('isBetween: start is after end');
    const bounds = options?.bounds ?? '[)';
    const lower = comparePoints(value, start);
    const upper = comparePoints(value, end);
    const lowerOk = bounds.startsWith('[') ? lower >= 0 : lower > 0;
    const upperOk = bounds.endsWith(']') ? upper <= 0 : upper < 0;
    return lowerOk && upperOk;
}
/** The earliest of the given values (one of the inputs, not a copy). */
export function min(values) {
    return values.reduce((best, candidate) => (comparePoints(candidate, best) < 0 ? candidate : best));
}
/** The latest of the given values. */
export function max(values) {
    return values.reduce((best, candidate) => (comparePoints(candidate, best) > 0 ? candidate : best));
}
/** `value` limited to `[minimum, maximum]`. */
export function clamp(value, minimum, maximum) {
    if (comparePoints(minimum, maximum) > 0)
        throw new RangeError('clamp: minimum is after maximum');
    if (comparePoints(value, minimum) < 0)
        return minimum;
    if (comparePoints(value, maximum) > 0)
        return maximum;
    return value;
}
//# sourceMappingURL=compare.js.map