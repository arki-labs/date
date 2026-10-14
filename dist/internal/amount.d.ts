import type { Amount, Duration } from '../types.js';
/**
 * What Temporal's `add`/`subtract` accept. A plain field object is passed
 * straight through — building a `Temporal.Duration` first costs more than the
 * arithmetic itself on the polyfill — so this only expands `quarters` (which
 * Temporal has no field for) into months.
 */
declare const DURATION_FIELDS: readonly ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
export type DurationFields = Partial<Record<(typeof DURATION_FIELDS)[number], number>>;
export type DurationInput = Duration | DurationFields;
export declare function toDurationInput(amount: Amount | Duration): DurationInput;
/** The same amount with every field negated (`-0` normalized to `0`). */
export declare function negateDurationInput(input: DurationInput): DurationInput;
/** Expand an `Amount` (which may carry `quarters`) into a real `Temporal.Duration`. */
export declare function toDuration(amount: Amount | Duration): Duration;
export {};
//# sourceMappingURL=amount.d.ts.map