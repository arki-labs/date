import type { PlainDate, Weekday } from '../types.js';
/**
 * Days since 1970-01-01 for an ISO calendar date — pure integer arithmetic,
 * far cheaper than `PlainDate#until` on the polyfill. Valid for any year.
 */
export declare function epochDay(date: PlainDate): number;
/** The `YYYY-MM-DD` key of an epoch day — identical to `PlainDate#toString()`, including extended years. */
export declare function epochDayKey(days: number): string;
/** Whole days from `from` to `to`, negative when reversed. */
export declare function daysBetween(from: PlainDate, to: PlainDate): number;
/** ISO weekday (Monday = 1 … Sunday = 7) of an epoch day; 1970-01-01 was a Thursday. */
export declare function weekdayOfEpochDay(days: number): Weekday;
//# sourceMappingURL=days.d.ts.map