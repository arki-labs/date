/**
 * Calendar facts: weekdays, week numbers, quarters, leap years, age.
 * Only the ISO 8601 (proleptic Gregorian) calendar is supported.
 */
import type { Civil, PlainDate, Weekday, WeekRules } from './types.js';
/** ISO weekday, Monday = 1 … Sunday = 7. */
export declare function dayOfWeek(value: Civil): Weekday;
export declare function dayOfYear(value: Civil): number;
export declare function daysInMonth(value: Civil): number;
export declare function daysInYear(value: Civil): number;
/** Gregorian leap-year rule, for a value or a bare year number. */
export declare function isLeapYear(value: Civil | number): boolean;
export declare const DEFAULT_WEEKEND: readonly Weekday[];
export declare function isWeekend(value: Civil, weekend?: readonly Weekday[]): boolean;
export declare function isWeekday(value: Civil, weekend?: readonly Weekday[]): boolean;
export type WeekInfo = Readonly<{
    week: number;
    weekYear: number;
}>;
/**
 * Week number and the year that week belongs to, under the given rules
 * (ISO by default). Returned together because the week-year differs from the
 * calendar year around New Year.
 */
export declare function weekOf(value: Civil, rules?: WeekRules): WeekInfo;
/** ISO 8601 week and week-year. */
export declare function isoWeek(value: Civil): WeekInfo;
/** 52 or 53. */
export declare function weeksInYear(year: number, rules?: WeekRules): number;
export declare function quarter(value: Civil): 1 | 2 | 3 | 4;
/** Whole calendar days from `from` to `to` (negative when reversed). Counts date boundaries, not elapsed hours. */
export declare function calendarDaysBetween(from: PlainDate, to: PlainDate): number;
export type AgeOptions = Readonly<{
    /** When a Feb 29 birthday is celebrated in common years. Default `feb28`. */
    leapDay?: 'feb28' | 'mar1';
}>;
/** Completed years between a birth date and `asOf`. Throws if `asOf` is before the birth date. */
export declare function age(birthDate: PlainDate, asOf: PlainDate, options?: AgeOptions): number;
/**
 * The n-th `weekday` of a month: `nthWeekdayOfMonth(2026, 5, 2, 5)` is the
 * second Friday of May 2026. Negative `n` counts from the end (`-1` = last).
 * A `RangeError` when the month has no such day (a fifth Monday, say).
 */
export declare function nthWeekdayOfMonth(year: number, month: number, n: number, weekday: Weekday): PlainDate;
/** The last `weekday` of a month: `nthWeekdayOfMonth(year, month, -1, weekday)`. */
export declare function lastWeekdayOfMonth(year: number, month: number, weekday: Weekday): PlainDate;
/** `'western'` (Gregorian computus) or `'orthodox'` (Julian computus, shown on the ISO calendar). */
export type EasterRite = 'western' | 'orthodox';
/**
 * Easter Sunday of a year. `'western'` is the Gregorian computus (Meeus/
 * Jones/Butcher); `'orthodox'` is the Julian computus (Meeus) converted to the
 * ISO calendar, so both results are dates you can compare and add to directly.
 * Movable feasts are offsets: Good Friday is `-2` days, Pentecost `+49`.
 */
export declare function easter(year: number, rite?: EasterRite): PlainDate;
/**
 * The week rules a locale uses, from `Intl.Locale` week info (`en-US` →
 * Sunday start, week 1 holds January 1; `de-DE` → ISO). Runtimes without week
 * info (Node ≤ 22, Hermes) get `fallback`, ISO weeks by default.
 */
export declare function weekRulesFor(locale: string, fallback?: WeekRules): WeekRules;
//# sourceMappingURL=calendar.d.ts.map