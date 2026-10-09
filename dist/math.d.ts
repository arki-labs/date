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
import type { Amount, AmountFor, CalendarUnit, Civil, DateParts, Disambiguation, Duration, Overflow, PlainDate, Point, RoundingMode, Timeline, TimeUnit, Unit, UnitFor, Wall, WallParts, WeekRules } from './types.js';
export type ArithmeticOptions = Readonly<{
    overflow?: Overflow;
}>;
export type SetOptions = Readonly<{
    overflow?: Overflow;
    disambiguation?: Disambiguation;
}>;
export type WeekOptions = Readonly<{
    week?: WeekRules;
}>;
/** `value + amount`. Calendar amounts are rejected on an `Instant` (project it into a zone first). */
export declare function add<T extends Point>(value: T, amount: AmountFor<T> | Duration, options?: ArithmeticOptions): T;
/** `value − amount`. Not always the inverse of `add` (Jan 31 + 1 month − 1 month = Feb 28 − 1 month = Jan 28). */
export declare function sub<T extends Point>(value: T, amount: AmountFor<T> | Duration, options?: ArithmeticOptions): T;
export type PartsFor<T extends Civil> = T extends PlainDate ? DateParts : WallParts;
/** The calendar (and, for wall-clock values, time) fields as a plain object. */
export declare function parts(value: PlainDate): DateParts;
export declare function parts(value: Wall): WallParts;
export declare function parts(value: Civil): DateParts | WallParts;
/** A copy with the given fields replaced. Out-of-range fields clamp unless `overflow: 'reject'`. */
export declare function set<T extends Civil>(value: T, patch: Partial<PartsFor<NoInfer<T>>>, options?: SetOptions): T;
declare function startOfWeekDate(date: PlainDate, rules: WeekRules): PlainDate;
declare function isCalendarUnit(unit: Unit): unit is CalendarUnit;
/** The first moment of the unit containing `value` (week per `options.week`, ISO by default). */
export declare function startOf<T extends Point>(value: T, unit: UnitFor<NoInfer<T>>, options?: WeekOptions): T;
declare function oneUnit(unit: Unit): Amount;
/** The start of the unit after the one containing `value` — the exclusive end of `startOf(value, unit)`. */
export declare function nextBoundary<T extends Point>(value: T, unit: UnitFor<NoInfer<T>>, options?: WeekOptions): T;
/**
 * The last representable moment of the unit: the next boundary minus one day
 * for a `PlainDate`, minus one nanosecond otherwise. Prefer `[startOf, nextBoundary)`
 * for range queries; `endOf` exists for display and inclusive APIs.
 */
export declare function endOf<T extends Point>(value: T, unit: UnitFor<NoInfer<T>>, options?: WeekOptions): T;
export type RoundOptions = Readonly<{
    /** Round to a multiple of the unit (e.g. 15 minutes). Calendar units support only 1. */
    increment?: number;
    week?: WeekRules;
    /** For `round`: which side wins an exact tie. Default `later`. */
    tie?: 'earlier' | 'later';
}>;
declare function comparePoints(a: Point, b: Point): number;
/** Round down to the unit (or to a multiple of it via `increment`). Same as `startOf` for calendar units. */
export declare function floor<T extends Point>(value: T, unit: UnitFor<NoInfer<T>>, options?: RoundOptions): T;
/** Round up to the unit; a value already on the boundary is returned unchanged. */
export declare function ceil<T extends Point>(value: T, unit: UnitFor<NoInfer<T>>, options?: RoundOptions): T;
/** Round to the nearest unit boundary; ties go to the later boundary unless `tie: 'earlier'`. */
export declare function round<T extends Point>(value: T, unit: UnitFor<NoInfer<T>>, options?: RoundOptions): T;
export type DiffOptions = Readonly<{
    /** Return the exact fractional total instead of truncating toward zero. */
    fractional?: boolean;
}>;
/**
 * `to − from` in whole units (truncated toward zero), or the exact fractional
 * total with `{ fractional: true }`. Calendar units are anchored at `from`:
 * `diff(Jan 31, Feb 28, 'month')` is 1, the reverse is `-28/31`.
 * Zoned values must share a zone for calendar units.
 */
export declare function diff<T extends Point>(from: T, to: NoInfer<T>, unit: UnitFor<NoInfer<T>>, options?: DiffOptions): number;
export type UntilOptions<T extends Point> = Readonly<{
    largestUnit: Exclude<UnitFor<T>, 'quarter'>;
    smallestUnit?: Exclude<UnitFor<T>, 'quarter'>;
    roundingMode?: RoundingMode;
}>;
/** `to − from` as a balanced `Duration` (e.g. 1 month 3 days 4 hours). */
export declare function until<T extends Point>(from: T, to: NoInfer<T>, options: UntilOptions<NoInfer<T>>): Duration;
/** Exact nanoseconds from `from` to `to`, ignoring calendars and zones. */
export declare function elapsedNanoseconds(from: Timeline | Date, to: Timeline | Date): bigint;
/**
 * Elapsed time between two instants. Here a `day` is exactly 24 hours and a
 * `week` 168 hours — use `diff` on zoned values for calendar days.
 */
export declare function diffElapsed(from: Timeline | Date, to: Timeline | Date, unit: TimeUnit | 'day' | 'week', options?: DiffOptions): number;
/** @internal re-exported for sibling modules */
export declare const internal: {
    startOfWeekDate: typeof startOfWeekDate;
    comparePoints: typeof comparePoints;
    isCalendarUnit: typeof isCalendarUnit;
    oneUnit: typeof oneUnit;
};
export { type Instant, type ZonedDateTime } from './types.js';
//# sourceMappingURL=math.d.ts.map