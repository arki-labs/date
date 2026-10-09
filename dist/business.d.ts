/**
 * Business-day arithmetic: weekends and holidays.
 *
 * Policies (one for the whole package):
 * - A business day is a date that is neither a weekend day nor a holiday of
 *   the `BusinessCalendar` (default: Saturday + Sunday off, no holidays).
 * - Zoned values are judged by their date in their own zone, and moving them
 *   is a calendar move (`{ days: 1 }`), so the wall-clock time is kept.
 * - Counting is half-open: `businessDaysBetween(from, to)` counts `[from, to)`.
 */
import type { Interval } from './interval.js';
import type { Civil, PlainDate, Weekday } from './types.js';
/**
 * Which weekdays are off and which dates are holidays. `holidays` holds ISO
 * `YYYY-MM-DD` strings. The record and its `weekend` list are frozen; build a
 * new calendar with `businessCalendar()` rather than changing one.
 */
export type BusinessCalendar = Readonly<{
    weekend: readonly Weekday[];
    holidays: ReadonlySet<string>;
}>;
export type BusinessCalendarOptions = Readonly<{
    /** ISO weekdays that are off (Monday = 1 … Sunday = 7). Default `[6, 7]`. */
    weekend?: readonly Weekday[];
    /** Days off, as `PlainDate`s or `YYYY-MM-DD` strings. */
    holidays?: Iterable<PlainDate | string>;
}>;
/**
 * A validated business calendar. Weekend days are deduplicated and sorted; a
 * weekend of all seven days is a `RangeError` (no day could ever be a business
 * day). Holiday strings must be `YYYY-MM-DD` (validated with `plainDate()`).
 */
export declare function businessCalendar(options?: BusinessCalendarOptions): BusinessCalendar;
/** Saturday and Sunday off, no holidays. */
export declare const DEFAULT_BUSINESS_CALENDAR: BusinessCalendar;
/** Is the value's date neither a weekend day nor a holiday? */
export declare function isBusinessDay(value: Civil, calendar?: BusinessCalendar): boolean;
/**
 * Move `count` business days forward (negative: backward). The start day is
 * not counted, so Friday + 1 is Monday; `count` 0 returns `value` unchanged.
 * Zoned values keep their wall-clock time. `count` must be a safe integer.
 */
export declare function addBusinessDays<T extends Civil>(value: T, count: number, calendar?: BusinessCalendar): T;
/** Move `count` business days backward: `addBusinessDays(value, -count)`. */
export declare function subBusinessDays<T extends Civil>(value: T, count: number, calendar?: BusinessCalendar): T;
/** The first business day strictly after `value` (same wall-clock time for zoned values). */
export declare function nextBusinessDay<T extends Civil>(value: T, calendar?: BusinessCalendar): T;
/** The last business day strictly before `value` (same wall-clock time for zoned values). */
export declare function previousBusinessDay<T extends Civil>(value: T, calendar?: BusinessCalendar): T;
/**
 * Business days in `[from, to)`. Reversed arguments give the negated count:
 * `businessDaysBetween(a, b) === -businessDaysBetween(b, a)`.
 */
export declare function businessDaysBetween(from: PlainDate, to: PlainDate, calendar?: BusinessCalendar): number;
/** Business days inside a `PlainDate` interval (its end is exclusive). */
export declare function businessDaysIn(i: Interval<PlainDate>, calendar?: BusinessCalendar): number;
//# sourceMappingURL=business.d.ts.map