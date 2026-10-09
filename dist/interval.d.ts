/**
 * Interval algebra over half-open ranges `[start, end)`.
 *
 * Policies (one for the whole package):
 * - Every `Interval` is half-open: `start` is included, `end` is excluded.
 *   Other bound notations are normalized on construction by `interval()`.
 * - `[a, a)` is a valid, empty interval. It contains no point and overlaps nothing.
 * - Touching intervals (`[a, b)` and `[b, c)`) do not overlap, but `union` and
 *   `mergeIntervals` join them, because together they cover `[a, c)` with no gap.
 * - Both ends must be the same kind of value; mixing kinds is a `TypeError`.
 *   Zoned values are ordered by their exact instant.
 * - Iterators (`each`, `range`, `splitByUnit`) stop with a `RangeError` once
 *   they would produce more than `maxItems` values (default 10 000). They never
 *   truncate silently.
 */
import type { DiffOptions } from './math.js';
import type { AmountFor, Bounds, Point, UnitFor, WeekRules } from './types.js';
/**
 * A half-open range `[start, end)`: `start` is included, `end` is **excluded**.
 * `start` is never after `end`; `start == end` is the empty interval.
 */
export type Interval<T extends Point = Point> = Readonly<{
    start: T;
    end: T;
}>;
export type IntervalOptions = Readonly<{
    /** Bound notation of the inputs: `[` / `]` inclusive, `(` / `)` exclusive. Default `[)`. */
    bounds?: Bounds;
}>;
export type IterateOptions = Readonly<{
    /** Throw a `RangeError` rather than produce more than this many values. Default 10 000. */
    maxItems?: number;
}>;
export type SplitOptions = Readonly<{
    week?: WeekRules;
    maxItems?: number;
}>;
/**
 * A half-open interval `[start, end)`. With `bounds`, the inputs are read in
 * that notation and normalized: an inclusive end (`]`) or an exclusive start
 * (`(`) moves forward by one day on a `PlainDate` and one nanosecond otherwise.
 * `interval(d, d, { bounds: '[]' })` is the one-day interval `[d, d + 1 day)`.
 * Throws `RangeError` when `start` is after `end` once normalized; mixed kinds throw `TypeError`.
 */
export declare function interval<T extends Point>(start: T, end: NoInfer<T>, options?: IntervalOptions): Interval<T>;
/** Does the interval cover nothing (`start == end`)? */
export declare function isEmptyInterval(i: Interval): boolean;
/** Same start and same end (zoned values compare by instant, so the zones may differ). */
export declare function intervalEquals<T extends Point>(a: Interval<T>, b: Interval<NoInfer<T>>): boolean;
/**
 * For a point: `start ≤ value < end`. For an interval: `b` lies entirely
 * inside `i` (`i.start ≤ b.start` and `b.end ≤ i.end`); an empty `b` inside `i` counts.
 */
export declare function contains<T extends Point>(i: Interval<T>, value: NoInfer<T> | Interval<NoInfer<T>>): boolean;
/** Do the intervals share at least one point? Touching intervals and empty intervals never overlap. */
export declare function overlaps<T extends Point>(a: Interval<T>, b: Interval<NoInfer<T>>): boolean;
/** Does one interval end exactly where the other starts (`a.end == b.start` or `b.end == a.start`)? */
export declare function abuts<T extends Point>(a: Interval<T>, b: Interval<NoInfer<T>>): boolean;
/** The points in both intervals, or `null` when they share none. */
export declare function intersection<T extends Point>(a: Interval<T>, b: Interval<NoInfer<T>>): Interval<T> | null;
/**
 * Sort and merge: overlapping and touching intervals join; empty intervals are
 * dropped (they cover nothing). The result is sorted, disjoint and never touching.
 */
export declare function mergeIntervals<T extends Point>(list: readonly Interval<T>[]): readonly Interval<T>[];
/**
 * Everything covered by any of the intervals, as sorted disjoint pieces.
 * Overlapping and touching intervals merge; a gap is never filled in.
 */
export declare function union<T extends Point>(a: Interval<T>, ...rest: readonly Interval<NoInfer<T>>[]): readonly Interval<T>[];
/** The interval strictly between two separated intervals, or `null` when they overlap or touch. */
export declare function gap<T extends Point>(a: Interval<T>, b: Interval<NoInfer<T>>): Interval<T> | null;
/** The parts of `a` not covered by `b`: zero, one or two pieces, in order. */
export declare function subtract<T extends Point>(a: Interval<T>, b: Interval<NoInfer<T>>): readonly Interval<T>[];
/** The points in exactly one of the two intervals, as sorted disjoint pieces. */
export declare function symmetricDifference<T extends Point>(a: Interval<T>, b: Interval<NoInfer<T>>): readonly Interval<T>[];
/** The holes between the merged intervals, in order (empty when they form one block). */
export declare function gapsBetween<T extends Point>(list: readonly Interval<T>[]): readonly Interval<T>[];
/**
 * The length of the interval in `unit`: `diff(start, end, unit, options)`.
 * Whole units truncated toward zero unless `fractional: true`.
 */
export declare function intervalLength<T extends Point>(i: Interval<T>, unit: UnitFor<NoInfer<T>>, options?: DiffOptions): number;
/**
 * The interval cut at every `unit` boundary (`startOf` / `nextBoundary`; weeks
 * per `options.week`, ISO by default). The first and last pieces may be
 * partial; together the pieces rebuild the input exactly. An empty interval yields nothing.
 */
export declare function splitByUnit<T extends Point>(i: Interval<T>, unit: UnitFor<NoInfer<T>>, options?: SplitOptions): IterableIterator<Interval<T>>;
/**
 * `start`, `start + step`, `start + 2 × step` … while before `end`. Each value
 * is anchored at `start` (`add(start, step × n)`), never accumulated, so a
 * monthly walk from Jan 31 gives Jan 31, Feb 28, Mar 31, Apr 30.
 * The step needs a nonzero field and no negative ones (`RangeError` otherwise).
 */
export declare function each<T extends Point>(i: Interval<T>, step: AmountFor<NoInfer<T>>, options?: IterateOptions): IterableIterator<T>;
/** `each(interval(start, end), step, options)`: values in `[start, end)` anchored at `start`. */
export declare function range<T extends Point>(start: T, end: NoInfer<T>, step: AmountFor<NoInfer<T>>, options?: IterateOptions): IterableIterator<T>;
/** ISO 8601 interval text: `start/end` (the end is exclusive). */
export declare function toISOInterval(i: Interval): string;
//# sourceMappingURL=interval.d.ts.map