/**
 * Proleptic Gregorian (ISO 8601) calendar arithmetic on plain integers.
 *
 * Temporal answers these questions through objects, and on V8 each object
 * costs hundreds of nanoseconds. The hot paths (parsing, formatting, zoned
 * boundaries) need only a few numbers, so they use these functions and create
 * at most one Temporal value at the end. Days count from 1970-01-01 = 0.
 */
export declare const MS_PER_DAY = 86400000;
/** Days since 1970-01-01 of an ISO date (Howard Hinnant's `days_from_civil`). Valid for any integer year. */
export declare function daysFromCivil(year: number, month: number, day: number): number;
export type CivilDate = {
    year: number;
    month: number;
    day: number;
};
/** The ISO date of a day count (Howard Hinnant's `civil_from_days`). */
export declare function civilFromDays(days: number): CivilDate;
export declare function isLeapYear(year: number): boolean;
export declare function daysInMonthOf(year: number, month: number): number;
/** ISO weekday of a day count: Monday = 1 … Sunday = 7 (1970-01-01 was a Thursday). */
export declare function weekdayOfDays(days: number): number;
/** Day of the year, 1-based. */
export declare function dayOfYearOf(year: number, month: number, day: number): number;
/** ISO 8601 week (weeks start Monday; week 1 holds the year's first Thursday). */
export declare function isoWeekOf(year: number, month: number, day: number): {
    week: number;
    weekYear: number;
};
//# sourceMappingURL=civil.d.ts.map