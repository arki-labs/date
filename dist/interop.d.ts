/**
 * The native `Date` boundary. `Date` stays at the edges (DB drivers, pickers,
 * third-party APIs); inside, values are Temporal. Two different conversions
 * exist on purpose: `fromDate` keeps the *instant*, `fromPickerDate` keeps the
 * *calendar fields* a picker showed the user.
 */
import type { Instant, PlainDate, Timeline } from './types.js';
/** The instant a `Date` represents. */
export declare function fromDate(value: Date): Instant;
/** A fresh mutable `Date` at the same instant (sub-millisecond precision truncated). */
export declare function toDate(value: Timeline | Date): Date;
/**
 * Which clock a `Date`'s calendar fields were chosen in. Browser pickers that
 * build `new Date(y, m, d)` use `local`; APIs that build `Date.UTC(...)` use `utc`.
 */
export type DateBasis = {
    readonly basis: 'local';
} | {
    readonly basis: 'utc';
} | {
    readonly basis: 'zone';
    readonly timeZone: string;
};
/** The calendar date a picker selected, read from the `Date`'s fields in the stated basis. */
export declare function fromPickerDate(value: Date, basis?: DateBasis): PlainDate;
/**
 * A `Date` whose fields in the stated basis show the given calendar date
 * (first valid time of that day). Throws if the day does not exist in that
 * basis (a zone that skipped the date).
 */
export declare function toPickerDate(value: PlainDate, basis?: DateBasis): Date;
/** The runtime's current IANA time zone (e.g. `Europe/Bucharest`). */
export declare function systemTimeZone(): string;
//# sourceMappingURL=interop.d.ts.map