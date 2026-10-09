/**
 * Durations: construction, field algebra, normalization, totals and
 * human-readable text.
 *
 * Policies (one for the whole module):
 * - `addDuration`/`subDuration` never carry across the three field groups:
 *   (years, months), (weeks, days) and (hours…nanoseconds). A day is not
 *   always 24 hours and a month is not 30 days, so converting between groups
 *   needs an anchor — use `normalizeDuration(d, { relativeTo })` for that.
 * - Without `relativeTo`, totals follow Temporal: a day is 24 hours, and
 *   months/years cannot be converted to days (Temporal throws `RangeError`).
 * - Text defaults to the `'en-US'` locale so server and client render the same.
 */
import type { Amount, Duration, DurationUnit, Ordering, PlainDate, RoundingMode, Unit, ZonedDateTime } from './types.js';
/** The anchor Temporal needs to measure calendar units (months have 28–31 days, days 23–25 hours). */
export type RelativeToOptions = Readonly<{
    relativeTo?: PlainDate | ZonedDateTime;
}>;
/** A `Duration` from an ISO 8601 string (`P1DT2H`), an `Amount` (quarters become 3 months) or a `Duration` (returned as-is). */
export declare function duration(input: string | Amount | Duration): Duration;
/** `n` years. `n` must be an integer. */
export declare function years(n: number): Duration;
/** `n` months. `n` must be an integer. */
export declare function months(n: number): Duration;
/** `n` weeks. `n` must be an integer. */
export declare function weeks(n: number): Duration;
/** `n` calendar days. `n` must be an integer. */
export declare function days(n: number): Duration;
/** `n` hours. `n` must be an integer. */
export declare function hours(n: number): Duration;
/** `n` minutes. `n` must be an integer. */
export declare function minutes(n: number): Duration;
/** `n` seconds. `n` must be an integer. */
export declare function seconds(n: number): Duration;
/** `n` milliseconds. `n` must be an integer. */
export declare function milliseconds(n: number): Duration;
/**
 * `a + b` by field groups: (years, months) as months, (weeks, days) as days,
 * (hours…ns) exactly. Groups never carry into each other; weeks survive only
 * when neither input has days. Throws `RangeError` when groups end with mixed signs.
 */
export declare function addDuration(a: Duration, b: Duration): Duration;
/** `a − b` with the same group policy as `addDuration` (`P1Y − P2M` = `P10M`; `P1D − PT1H` throws). */
export declare function subDuration(a: Duration, b: Duration): Duration;
/** Every field times `factor` (a safe integer). Fields are scaled as-is, never re-balanced. */
export declare function multiplyDuration(d: Duration, factor: number): Duration;
/** The same duration pointing the other way. */
export declare function negateDuration(d: Duration): Duration;
/** The duration with every field made non-negative. */
export declare function absDuration(d: Duration): Duration;
export type NormalizeOptions = Readonly<{
    largestUnit: DurationUnit;
    smallestUnit?: DurationUnit;
    relativeTo?: PlainDate | ZonedDateTime;
    /** Temporal's default (`halfExpand`) when omitted. */
    roundingMode?: RoundingMode;
}>;
/**
 * Re-balance across units with Temporal's `Duration#round`. Calendar units
 * (years, months, weeks) need `relativeTo`; without it a day counts as 24 hours.
 */
export declare function normalizeDuration(d: Duration, options: NormalizeOptions): Duration;
/** The whole duration expressed in one unit (fractional). `quarter` is months ÷ 3. */
export declare function totalDuration(d: Duration, unit: Unit, options?: RelativeToOptions): number;
/**
 * Split a duration across `units` (distinct, largest first): every unit is a
 * whole number except the last, which takes the fractional remainder.
 * Without `relativeTo`, months never convert to days (throws `RangeError`).
 */
export declare function toUnits(d: Duration, units: readonly DurationUnit[], options?: RelativeToOptions): Readonly<Partial<Record<DurationUnit, number>>>;
/** `-1`, `0` or `1` by length. Calendar units need `relativeTo` (`P1M` vs `P30D` depends on the month). */
export declare function compareDurations(a: Duration, b: Duration, options?: RelativeToOptions): Ordering;
/** True when every field is zero. */
export declare function isZeroDuration(d: Duration): boolean;
/** True when the duration points backward (any field is negative). */
export declare function isNegativeDuration(d: Duration): boolean;
/** ISO 8601 duration text, e.g. `P1DT2H`. */
export declare function formatDurationISO(d: Duration): string;
export type HumanizeOptions = Readonly<{
    locale?: string;
    units?: readonly DurationUnit[];
    style?: 'long' | 'short' | 'narrow';
    /** Keep only the N largest nonzero units; the rest is dropped, not rounded. */
    maximumUnits?: number;
    relativeTo?: PlainDate | ZonedDateTime;
}>;
/**
 * Locale text such as "1 day and 2 hours" (`Intl.NumberFormat` units joined by
 * `Intl.ListFormat`). Zero-valued units are skipped; a negative duration is the
 * absolute text prefixed with `-`; a zero duration prints 0 of the smallest unit.
 */
export declare function humanizeDuration(d: Duration, options?: HumanizeOptions): string;
//# sourceMappingURL=duration.d.ts.map