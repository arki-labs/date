/**
 * The fluent face of the package: `date(x, { timeZone })` wraps a
 * `ZonedDateTime` plus the display/clock settings it should use, and exposes
 * every receiver-first function as a method. Each method returns a new
 * `DateValue` or a plain result; nothing mutates.
 *
 * `date()` is for moments. A calendar date (`'2026-01-31'`) is rejected with
 * a hint to use `plainDate()` — the two are different things on purpose.
 */
var _a;
import { SystemClock } from '@arki/clock';
import { addBusinessDays, isBusinessDay, nextBusinessDay, previousBusinessDay, subBusinessDays } from './business.js';
import { dayOfWeek, dayOfYear, daysInMonth, isLeapYear, isoWeek, isWeekday, isWeekend, quarter, weekOf, } from './calendar.js';
import { isFuture as isFutureAt, isPast as isPastAt, now as nowAt, nowIn, today as todayAt } from './clock.js';
import { clamp, compareAsc, equals, isAfter, isBefore, isBetween, isSame, isSameOrAfter, isSameOrBefore, sameInstant, } from './compare.js';
import { instant, plainDate, zoned } from './core.js';
import { format, formatIntl } from './format.js';
import { systemTimeZone, toDate } from './interop.js';
import { add, ceil, diff, diffElapsed, endOf, floor, nextBoundary, parts, round, set, startOf, sub, until, } from './math.js';
import { relative } from './relative.js';
import { isInstant, ISO_WEEK, isZonedDateTime, Temporal } from './types.js';
import { inZone, offset, reinterpretZone } from './zone.js';
const DATE_ONLY = /^[+-]?\d{4,6}-\d{2}-\d{2}$/;
const ZONE_ANNOTATION = /\[[^\]]+\]/;
function resolve(input, timeZone) {
    if (input instanceof DateValue)
        return input.value();
    if (isZonedDateTime(input))
        return input;
    if (isInstant(input) || input instanceof Date)
        return zoned(input, timeZone);
    if (DATE_ONLY.test(input)) {
        throw new RangeError(`date() is for moments; "${input}" is a calendar date — use plainDate() instead`);
    }
    return ZONE_ANNOTATION.test(input) ? zoned(input) : zoned(instant(input), timeZone);
}
/** An immutable moment in a zone with chainable operations. Create one with `date()`. */
export class DateValue {
    #value;
    #settings;
    constructor(value, settings) {
        this.#value = value;
        this.#settings = settings;
    }
    #wrap(value) {
        return new _a(value, this.#settings);
    }
    /** The other moment, projected into this value's zone (so calendar comparisons never cross zones). */
    #other(other) {
        const resolved = resolve(other, this.#settings.timeZone);
        return resolved.timeZoneId === this.#value.timeZoneId ? resolved : resolved.withTimeZone(this.#value.timeZoneId);
    }
    // --- extraction -----------------------------------------------------------
    /** The underlying immutable `ZonedDateTime`. */
    value() {
        return this.#value;
    }
    toInstant() {
        return this.#value.toInstant();
    }
    toPlainDate() {
        return this.#value.toPlainDate();
    }
    toPlainDateTime() {
        return this.#value.toPlainDateTime();
    }
    /** A fresh mutable `Date` at this instant. */
    toDate() {
        return toDate(this.#value);
    }
    toISO() {
        return this.#value.toString();
    }
    toString() {
        return this.#value.toString();
    }
    toJSON() {
        return this.#value.toJSON();
    }
    /** Numeric coercion is a bug waiting to happen; use `toInstant().epochMilliseconds`. */
    [Symbol.toPrimitive](hint) {
        if (hint === 'number')
            throw new TypeError('DateValue cannot be coerced to a number; use toInstant().epochMilliseconds');
        return this.toString();
    }
    get timeZoneId() {
        return this.#value.timeZoneId;
    }
    get locale() {
        return this.#settings.locale;
    }
    get year() {
        return this.#value.year;
    }
    get month() {
        return this.#value.month;
    }
    get day() {
        return this.#value.day;
    }
    get hour() {
        return this.#value.hour;
    }
    get minute() {
        return this.#value.minute;
    }
    get second() {
        return this.#value.second;
    }
    get epochMilliseconds() {
        return this.#value.epochMilliseconds;
    }
    parts() {
        return parts(this.#value);
    }
    // --- arithmetic -----------------------------------------------------------
    add(amount, options) {
        return this.#wrap(add(this.#value, amount, options));
    }
    sub(amount, options) {
        return this.#wrap(sub(this.#value, amount, options));
    }
    set(patch, options) {
        return this.#wrap(set(this.#value, patch, options));
    }
    startOf(unit) {
        return this.#wrap(startOf(this.#value, unit, this.#settings));
    }
    endOf(unit) {
        return this.#wrap(endOf(this.#value, unit, this.#settings));
    }
    nextBoundary(unit) {
        return this.#wrap(nextBoundary(this.#value, unit, this.#settings));
    }
    floor(unit, options) {
        return this.#wrap(floor(this.#value, unit, { week: this.#settings.week, ...options }));
    }
    ceil(unit, options) {
        return this.#wrap(ceil(this.#value, unit, { week: this.#settings.week, ...options }));
    }
    round(unit, options) {
        return this.#wrap(round(this.#value, unit, { week: this.#settings.week, ...options }));
    }
    // --- differences ----------------------------------------------------------
    /** `other − this` in whole units (see `diff`). */
    diff(other, unit, options) {
        return diff(this.#value, this.#other(other), unit, options);
    }
    until(other, options) {
        return until(this.#value, this.#other(other), options);
    }
    /** Exact elapsed time to `other` (a day is 24 h here). */
    diffElapsed(other, unit, options) {
        return diffElapsed(this.#value, resolve(other, this.#settings.timeZone), unit, options);
    }
    // --- comparison -----------------------------------------------------------
    equals(other) {
        return equals(this.#value, resolve(other, this.#settings.timeZone));
    }
    sameInstant(other) {
        return sameInstant(this.#value, resolve(other, this.#settings.timeZone));
    }
    compare(other) {
        return compareAsc(this.#value, this.#other(other));
    }
    isBefore(other) {
        return isBefore(this.#value, this.#other(other));
    }
    isAfter(other) {
        return isAfter(this.#value, this.#other(other));
    }
    isSameOrBefore(other) {
        return isSameOrBefore(this.#value, this.#other(other));
    }
    isSameOrAfter(other) {
        return isSameOrAfter(this.#value, this.#other(other));
    }
    isSame(other, unit, options) {
        return isSame(this.#value, this.#other(other), unit, { week: this.#settings.week, ...options });
    }
    isSameDay(other) {
        return this.isSame(other, 'day');
    }
    isSameWeek(other) {
        return this.isSame(other, 'week');
    }
    isSameMonth(other) {
        return this.isSame(other, 'month');
    }
    isSameYear(other) {
        return this.isSame(other, 'year');
    }
    isBetween(start, end, options) {
        return isBetween(this.#value, this.#other(start), this.#other(end), options);
    }
    clamp(minimum, maximum) {
        return this.#wrap(clamp(this.#value, this.#other(minimum), this.#other(maximum)));
    }
    // --- relative to the context clock ---------------------------------------
    isToday() {
        return this.isSameDay(nowIn(this.#value.timeZoneId, this.#settings.clock));
    }
    isTomorrow() {
        return this.isSameDay(nowIn(this.#value.timeZoneId, this.#settings.clock).add({ days: 1 }));
    }
    isYesterday() {
        return this.isSameDay(nowIn(this.#value.timeZoneId, this.#settings.clock).subtract({ days: 1 }));
    }
    isThisWeek() {
        return this.isSameWeek(nowIn(this.#value.timeZoneId, this.#settings.clock));
    }
    isThisMonth() {
        return this.isSameMonth(nowIn(this.#value.timeZoneId, this.#settings.clock));
    }
    isThisYear() {
        return this.isSameYear(nowIn(this.#value.timeZoneId, this.#settings.clock));
    }
    isPast() {
        return isPastAt(this.#value, this.#settings.clock);
    }
    isFuture() {
        return isFutureAt(this.#value, this.#settings.clock);
    }
    /** "3 days ago" / "in 2 hours" relative to the context clock. */
    fromNow(options) {
        return this.relativeTo(nowAt(this.#settings.clock), options);
    }
    // --- calendar -------------------------------------------------------------
    dayOfWeek() {
        return dayOfWeek(this.#value);
    }
    dayOfYear() {
        return dayOfYear(this.#value);
    }
    daysInMonth() {
        return daysInMonth(this.#value);
    }
    isLeapYear() {
        return isLeapYear(this.#value);
    }
    isWeekend(weekend) {
        return isWeekend(this.#value, weekend);
    }
    isWeekday(weekend) {
        return isWeekday(this.#value, weekend);
    }
    isoWeek() {
        return isoWeek(this.#value);
    }
    weekOf(rules = this.#settings.week) {
        return weekOf(this.#value, rules);
    }
    quarter() {
        return quarter(this.#value);
    }
    // --- zones ----------------------------------------------------------------
    /** Same instant, another zone. */
    inZone(timeZone) {
        return this.#wrap(inZone(this.#value, timeZone));
    }
    /** Same wall clock, another zone (the instant changes). */
    reinterpretZone(timeZone, options) {
        return this.#wrap(reinterpretZone(this.#value, timeZone, options));
    }
    toUTC() {
        return this.inZone('UTC');
    }
    offset() {
        return offset(this.#value);
    }
    // --- business days --------------------------------------------------------
    isBusinessDay(calendar) {
        return isBusinessDay(this.#value, calendar);
    }
    addBusinessDays(count, calendar) {
        return this.#wrap(addBusinessDays(this.#value, count, calendar));
    }
    subBusinessDays(count, calendar) {
        return this.#wrap(subBusinessDays(this.#value, count, calendar));
    }
    nextBusinessDay(calendar) {
        return this.#wrap(nextBusinessDay(this.#value, calendar));
    }
    previousBusinessDay(calendar) {
        return this.#wrap(previousBusinessDay(this.#value, calendar));
    }
    // --- display --------------------------------------------------------------
    /** Token formatting (`'yyyy-MM-dd HH:mm'`) in the context locale. */
    format(pattern, options) {
        return format(this.#value, pattern, { locale: this.#settings.locale, ...options });
    }
    /** `Intl.DateTimeFormat` formatting in the context locale. */
    formatIntl(options) {
        return formatIntl(this.#value, { locale: this.#settings.locale, ...options });
    }
    /** "3 days ago" / "in 2 hours" relative to `reference`. */
    relativeTo(reference, options) {
        return relative(this.#value, resolve(reference, this.#settings.timeZone), {
            locale: this.#settings.locale,
            ...options,
        });
    }
    pipe(fn) {
        const result = fn(this.#value);
        return isZonedDateTime(result) ? this.#wrap(result) : result;
    }
}
_a = DateValue;
function settingsFor(options, fallbackZone) {
    return {
        timeZone: options?.timeZone ?? fallbackZone ?? systemTimeZone(),
        locale: options?.locale ?? 'en-US',
        week: options?.week ?? ISO_WEEK,
        clock: options?.clock ?? new SystemClock(),
    };
}
/**
 * Wrap a moment for fluent use. A `Date`, `Instant` or offset string is
 * projected into `options.timeZone` (runtime zone by default); a
 * `ZonedDateTime` or `[Zone]`-annotated string keeps its own zone.
 */
export function date(input, options) {
    const settings = settingsFor(options, input instanceof DateValue ? input.timeZoneId : undefined);
    const value = resolve(input, settings.timeZone);
    return new DateValue(value, { ...settings, timeZone: value.timeZoneId });
}
export function createDateContext(options) {
    const settings = settingsFor(options);
    const wrap = (input) => date(input, settings);
    return Object.freeze({
        ...settings,
        now: () => wrap(nowIn(settings.timeZone, settings.clock)),
        today: () => todayAt(settings),
        date: wrap,
        isToday: (value) => {
            const target = isInstant(value) ? value.toZonedDateTimeISO(settings.timeZone) : value;
            return Temporal.PlainDate.compare(plainDate(target), todayAt(settings)) === 0;
        },
        isPast: value => isPastAt(value, settings.clock),
        isFuture: value => isFutureAt(value, settings.clock),
    });
}
//# sourceMappingURL=fluent.js.map