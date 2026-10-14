/**
 * Equality, ordering and predicates. Two values must be of the same kind;
 * mixing a `PlainDate` with a `ZonedDateTime` is a type error and a runtime
 * `TypeError`. Ordering of zoned values compares instants; equality also
 * compares the zone.
 */
import type { Bounds, CalendarUnit, Civil, Instant, Ordering, PlainDate, Point, Timeline, Unit, WeekRules } from './types.js';
/** Field-for-field equality (for zoned values: same instant *and* same zone). */
export declare function equals<T extends Point>(a: T, b: NoInfer<T>): boolean;
/** Do two timeline values point at the same instant, whatever their zones? */
export declare function sameInstant(a: Timeline | Date, b: Timeline | Date): boolean;
/** `-1` when `a` is earlier, `1` when later, `0` when equal. Usable directly as an `Array#sort` comparator. */
export declare function compareAsc<T extends Point>(a: T, b: NoInfer<T>): Ordering;
export declare function compareDesc<T extends Point>(a: T, b: NoInfer<T>): Ordering;
export declare function isBefore<T extends Point>(a: T, b: NoInfer<T>): boolean;
export declare function isAfter<T extends Point>(a: T, b: NoInfer<T>): boolean;
export declare function isSameOrBefore<T extends Point>(a: T, b: NoInfer<T>): boolean;
export declare function isSameOrAfter<T extends Point>(a: T, b: NoInfer<T>): boolean;
export type SameOptions = Readonly<{
    week?: WeekRules;
    /** Zone in which to bucket. Required for instants; required for zoned values in different zones. */
    timeZone?: string;
}>;
/** Units a value can be bucketed by: instants may use calendar units once projected into `timeZone`. */
export type BucketUnitFor<T extends Point> = PlainDate extends T ? CalendarUnit : Unit;
/** Do both values fall in the same calendar unit (day, ISO week, month, quarter, year, hour…)? */
export declare function isSame<T extends Civil>(a: T, b: NoInfer<T>, unit: BucketUnitFor<NoInfer<T>>, options?: SameOptions): boolean;
export declare function isSame(a: Instant, b: Instant, unit: Unit, options: SameOptions & {
    timeZone: string;
}): boolean;
export declare function isSame<T extends Point>(a: T, b: NoInfer<T>, unit: BucketUnitFor<NoInfer<T>>, options?: SameOptions): boolean;
export declare function isSameDay<T extends Civil>(a: T, b: NoInfer<T>, options?: SameOptions): boolean;
export declare function isSameWeek<T extends Civil>(a: T, b: NoInfer<T>, options?: SameOptions): boolean;
export declare function isSameMonth<T extends Civil>(a: T, b: NoInfer<T>, options?: SameOptions): boolean;
export declare function isSameQuarter<T extends Civil>(a: T, b: NoInfer<T>, options?: SameOptions): boolean;
export declare function isSameYear<T extends Civil>(a: T, b: NoInfer<T>, options?: SameOptions): boolean;
/** Is `value` inside `[start, end)` (or the given `bounds`)? Reversed bounds throw. */
export declare function isBetween<T extends Point>(value: T, start: NoInfer<T>, end: NoInfer<T>, options?: Readonly<{
    bounds?: Bounds;
}>): boolean;
/** The earliest of the given values (one of the inputs, not a copy). */
export declare function min<T extends Point>(values: readonly [T, ...T[]]): T;
/** The latest of the given values. */
export declare function max<T extends Point>(values: readonly [T, ...T[]]): T;
/** `value` limited to `[minimum, maximum]`. */
export declare function clamp<T extends Point>(value: T, minimum: NoInfer<T>, maximum: NoInfer<T>): T;
//# sourceMappingURL=compare.d.ts.map