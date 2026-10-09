/**
 * Construction and parsing. Every constructor is strict: it validates and
 * throws `RangeError` on bad input rather than returning an "invalid" value.
 * Use `tryParse` when a failure is expected (user input).
 */
import type { Civil, DateParts, Disambiguation, Duration, Instant, PlainDate, PlainDateTime, Point, Timeline, Wall, WallInput, ZonedDateTime } from './types.js';
/**
 * A calendar date. Accepts `YYYY-MM-DD` only — a timestamp string is rejected
 * so that a zone and time are never silently dropped. Pass a `ZonedDateTime`
 * when you really mean "the date this moment falls on in its zone".
 */
export declare function plainDate(input: string | DateParts | Civil): PlainDate;
/** A wall-clock date and time with no zone. Strings carrying an offset or zone are rejected. */
export declare function plainDateTime(input: string | WallInput | Wall): PlainDateTime;
/** An exact moment. Strings must carry `Z` or an offset; `Date` is copied by its epoch milliseconds. */
export declare function instant(input: string | Date | Timeline): Instant;
export type ZonedOptions = Readonly<{
    disambiguation?: Disambiguation;
}>;
/**
 * An exact moment in a named zone.
 *
 * - `zoned('2026-03-29T03:30+03:00[Europe/Bucharest]')` — string must carry a `[Zone]` annotation.
 * - `zoned({ year, month, day, hour, minute }, 'Europe/Bucharest')` — wall-clock fields in a zone.
 * - `zoned(plainDate, zone)` — first valid time of that day; `zoned(instant | Date, zone)` — projection.
 *
 * Skipped or repeated wall times resolve with Temporal's `compatible` rule by default.
 */
export declare function zoned(input: string | ZonedDateTime, options?: ZonedOptions): ZonedDateTime;
export declare function zoned(input: WallInput | PlainDateTime | PlainDate | Instant | Date, timeZone: string, options?: ZonedOptions): ZonedDateTime;
/** Unix time in seconds (fractions allowed, kept to nanosecond precision). */
export declare function fromUnix(seconds: number): Instant;
/** Unix time in whole milliseconds (the `Date.now()` convention). */
export declare function fromMillis(milliseconds: number): Instant;
/** Whole seconds since the Unix epoch, floored. */
export declare function toUnix(value: Timeline): number;
/** Milliseconds since the Unix epoch (sub-millisecond precision is truncated). */
export declare function toMillis(value: Timeline): number;
export declare function toInstant(value: Timeline | Date): Instant;
/** The calendar date of a civil value (a `ZonedDateTime` yields its date in its own zone). */
export declare function toPlainDate(value: Civil): PlainDate;
/** ISO 8601 text (`toString()` of the value). */
export declare function toISO(value: Point | Duration): string;
export type ParseKinds = {
    plainDate: PlainDate;
    plainDateTime: PlainDateTime;
    zoned: ZonedDateTime;
    instant: Instant;
    duration: Duration;
};
export type ParseResult<T> = {
    readonly ok: true;
    readonly value: T;
} | {
    readonly ok: false;
    readonly error: RangeError;
};
/** Parse without throwing. The `kind` is explicit so a string is never reinterpreted. */
export declare function tryParse<K extends keyof ParseKinds>(text: string, kind: K): ParseResult<ParseKinds[K]>;
//# sourceMappingURL=core.d.ts.map