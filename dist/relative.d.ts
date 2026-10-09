/**
 * "In 3 days" / "3 days ago" — relative time text via `Intl.RelativeTimeFormat`.
 *
 * Policies:
 * - Under 24 elapsed hours the unit comes from exact elapsed time (second,
 *   minute, hour), truncated toward zero.
 * - From 24 hours on, both moments are projected into one zone and compared
 *   by calendar day, so "tomorrow" means the next calendar day even across DST.
 * - Positive values mean `target` is later than `reference`.
 * - Text defaults to the `'en-US'` locale so server and client render the same.
 */
import type { Clock } from '@arki/clock';
import type { Timeline } from './types.js';
export type RelativeUnit = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';
export type RelativeOptions = Readonly<{
    locale?: string;
    /** Force one unit, or `'auto'` (default) to pick by distance. */
    unit?: RelativeUnit | 'auto';
    /** `'auto'` allows words like "yesterday" and "tomorrow". Default `'always'`. */
    numeric?: 'always' | 'auto';
    style?: 'long' | 'short' | 'narrow';
    /** Zone for calendar-day comparison. Default: the target's zone if zoned, else the runtime zone. */
    timeZone?: string;
}>;
export type RelativeValue = Readonly<{
    unit: RelativeUnit;
    value: number;
}>;
/**
 * The unit and signed whole value `relative` would print. Auto selection:
 * < 60 s → second, < 60 min → minute, < 24 h → hour (exact time), then by
 * calendar days in the zone: < 7 days → day, < 1 month → week, < 12 months → month, else year.
 */
export declare function relativeUnit(target: Timeline | Date, reference: Timeline | Date, options?: RelativeOptions): RelativeValue;
/** Locale text for `target` seen from `reference`: "in 3 days", "3 days ago", or "tomorrow" with `numeric: 'auto'`. */
export declare function relative(target: Timeline | Date, reference: Timeline | Date, options?: RelativeOptions): string;
/** `relative(target, now(clock))`. Pass a `MockClock` for deterministic output. */
export declare function relativeToNow(target: Timeline | Date, options?: RelativeOptions & Readonly<{
    clock?: Clock;
}>): string;
//# sourceMappingURL=relative.d.ts.map