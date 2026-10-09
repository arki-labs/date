/**
 * Calendar facts: weekdays, week numbers, quarters, leap years, age.
 * Only the ISO 8601 (proleptic Gregorian) calendar is supported.
 */
import { plainDate } from './core.js';
import { internal } from './math.js';
import { ISO_WEEK, Temporal } from './types.js';
function isWeekdayNumber(n) {
    return n === 1 || n === 2 || n === 3 || n === 4 || n === 5 || n === 6 || n === 7;
}
/** ISO weekday, Monday = 1 … Sunday = 7. */
export function dayOfWeek(value) {
    const day = value.dayOfWeek;
    if (!isWeekdayNumber(day))
        throw new RangeError('dayOfWeek is only defined for the ISO calendar');
    return day;
}
export function dayOfYear(value) {
    return value.dayOfYear;
}
export function daysInMonth(value) {
    return value.daysInMonth;
}
export function daysInYear(value) {
    return value.daysInYear;
}
/** Gregorian leap-year rule, for a value or a bare year number. */
export function isLeapYear(value) {
    if (typeof value === 'number')
        return Temporal.PlainDate.from({ year: value, month: 1, day: 1 }).inLeapYear;
    return value.inLeapYear;
}
export const DEFAULT_WEEKEND = Object.freeze([6, 7]);
export function isWeekend(value, weekend = DEFAULT_WEEKEND) {
    return weekend.includes(dayOfWeek(value));
}
export function isWeekday(value, weekend = DEFAULT_WEEKEND) {
    return !isWeekend(value, weekend);
}
function week1Start(year, rules) {
    return internal.startOfWeekDate(Temporal.PlainDate.from({ year, month: 1, day: rules.minimalDays }), rules);
}
function daysBetween(from, to) {
    return from.until(to, { largestUnit: 'day' }).days;
}
/**
 * Week number and the year that week belongs to, under the given rules
 * (ISO by default). Returned together because the week-year differs from the
 * calendar year around New Year.
 */
export function weekOf(value, rules = ISO_WEEK) {
    const date = plainDate(value);
    const weekStart = internal.startOfWeekDate(date, rules);
    let weekYear = date.year + 1;
    let first = week1Start(weekYear, rules);
    if (Temporal.PlainDate.compare(weekStart, first) < 0) {
        weekYear = date.year;
        first = week1Start(weekYear, rules);
        if (Temporal.PlainDate.compare(weekStart, first) < 0) {
            weekYear = date.year - 1;
            first = week1Start(weekYear, rules);
        }
    }
    return { week: daysBetween(first, weekStart) / 7 + 1, weekYear };
}
/** ISO 8601 week and week-year. */
export function isoWeek(value) {
    return weekOf(value, ISO_WEEK);
}
/** 52 or 53. */
export function weeksInYear(year, rules = ISO_WEEK) {
    return daysBetween(week1Start(year, rules), week1Start(year + 1, rules)) / 7;
}
export function quarter(value) {
    const q = Math.floor((value.month - 1) / 3) + 1;
    if (q === 1 || q === 2 || q === 3 || q === 4)
        return q;
    throw new RangeError(`quarter: month ${String(value.month)} is outside the ISO calendar`);
}
/** Whole calendar days from `from` to `to` (negative when reversed). Counts date boundaries, not elapsed hours. */
export function calendarDaysBetween(from, to) {
    return daysBetween(from, to);
}
/** Completed years between a birth date and `asOf`. Throws if `asOf` is before the birth date. */
export function age(birthDate, asOf, options) {
    if (Temporal.PlainDate.compare(asOf, birthDate) < 0)
        throw new RangeError('age: asOf is before the birth date');
    let years = asOf.year - birthDate.year;
    let birthday = birthDate.with({ year: asOf.year }, { overflow: 'constrain' });
    if (options?.leapDay === 'mar1' && birthDate.month === 2 && birthDate.day === 29 && !birthday.inLeapYear) {
        birthday = birthday.add({ days: 1 });
    }
    if (Temporal.PlainDate.compare(asOf, birthday) < 0)
        years -= 1;
    return years;
}
//# sourceMappingURL=calendar.js.map