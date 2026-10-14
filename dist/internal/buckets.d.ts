/**
 * Calendar buckets (day, week, month, quarter, year) on integer day counts.
 *
 * Comparing buckets through Temporal builds a PlainDate and a boundary per
 * value; these helpers read one day count per value instead. They cover the
 * ISO calendar; `epochDaysOf` returns `undefined` for anything else, and the
 * caller then uses Temporal.
 */
import type { CalendarUnit, Point, WeekRules } from '../types.js';
/** The day count of an exact moment's date in `zone`. */
export declare function zonedDays(epochMs: number, zone: string): number;
/**
 * The day count of a point's date: an instant in `timeZone`, a zoned value in
 * `timeZone` or its own zone, a plain value as it is. `undefined` for an
 * instant without a zone or a non-ISO calendar.
 */
export declare function epochDaysOf(value: Point, timeZone?: string): number | undefined;
/** The first day of the bucket holding `days`. */
export declare function bucketStart(days: number, unit: CalendarUnit, rules: WeekRules): number;
/** The first day of the bucket `count` buckets after the one starting on `start`. */
export declare function shiftBucket(start: number, unit: CalendarUnit, count: number): number;
/** Week number and week-year of a day count under `rules` (ISO: Monday start, 4 minimal days). */
export declare function weekOfDays(days: number, rules: WeekRules): {
    week: number;
    weekYear: number;
};
//# sourceMappingURL=buckets.d.ts.map