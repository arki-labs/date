/**
 * Construction and parsing. Parsers return, builders throw:
 * - Builders (`plainDate`, `plainDateTime`, `instant`, `zoned`, `fromUnix`,
 *   `fromMillis`) take the caller's own values. They validate and throw
 *   `RangeError` on a bad value, because a bad value there is a bug. A
 *   `timeZone` argument is the caller's value too: an unknown name throws.
 * - Outside text (forms, query strings, files, APIs) goes through a parser:
 *   `parseISO` here, `parseDate` / `parseDateTime` / `parseZoned` in `parse`.
 *   They return the value or a typed failure (`InvalidDateText`,
 *   `UnknownTimeZone`) and never throw on bad text.
 */
import type { UnknownTimeZone } from './failures.js';
import type { Civil, DateParts, Disambiguation, Duration, Instant, PlainDate, PlainDateTime, Point, Timeline, Wall, WallInput, ZonedDateTime } from './types.js';
import { InvalidDateText } from './failures.js';
/**
 * A calendar date from the caller's own value; throws `RangeError` on a bad one.
 * Read outside text with `parseDate` or `parseISO` instead. Accepts `YYYY-MM-DD` only — a timestamp string is rejected
 * so that a zone and time are never silently dropped. Pass a `ZonedDateTime`
 * when you really mean "the date this moment falls on in its zone".
 */
export declare function plainDate(input: string | DateParts | Civil): PlainDate;
/**
 * A wall-clock date and time with no zone, from the caller's own value. Strings carrying an
 * offset or zone throw `RangeError`. Read outside text with `parseDateTime` instead.
 */
export declare function plainDateTime(input: string | WallInput | Wall): PlainDateTime;
/**
 * An exact moment from the caller's own value. Strings must carry `Z` or an offset; `Date` is
 * copied by its epoch milliseconds. A bad value throws `RangeError`. Read outside text with `parseISO` instead.
 */
export declare function instant(input: string | Date | Timeline): Instant;
export type ZonedOptions = Readonly<{
    disambiguation?: Disambiguation;
}>;
/**
 * An exact moment in a named zone, from the caller's own values. A bad string or an unknown
 * zone name throws `RangeError`. Read outside text with `parseZoned` or `parseISO`, and check
 * outside zone names with `isValidTimeZone`.
 *
 * - `zoned('2026-03-29T03:30+03:00[Europe/Bucharest]')` — a string with a `[Zone]` annotation.
 * - `zoned('2026-03-29T00:30:00Z', 'Europe/Bucharest')` — an exact timestamp shown in a zone;
 *   `zoned('2026-03-29T03:30', 'Europe/Bucharest')` — a wall-clock time in that zone.
 * - `zoned({ year, month, day, hour, minute }, 'Europe/Bucharest')` — wall-clock fields in a zone.
 * - `zoned(plainDate, zone)` — first valid time of that day; `zoned(instant | Date, zone)` — projection.
 *
 * Skipped or repeated wall times resolve with Temporal's `compatible` rule by default.
 */
export declare function zoned(input: string | ZonedDateTime, options?: ZonedOptions): ZonedDateTime;
export declare function zoned(input: string | WallInput | PlainDateTime | PlainDate | Instant | ZonedDateTime | Date, timeZone: string, options?: ZonedOptions): ZonedDateTime;
/** Unix time in seconds (fractions allowed, kept to nanosecond precision). Throws `RangeError` past ±8.64e12. */
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
export type ParseISOOptions = Readonly<{
    /** Zone for text without an offset. Default: the runtime zone. */
    timeZone?: string;
}>;
/**
 * Read lenient ISO 8601 text — everything `instant()` accepts plus the forms
 * people actually send: `2026-05-20` (midnight), `2026-05`, `2026`, basic
 * `20260520T1030`, week dates `2026-W41-5`, ordinal dates `2026-283`, a
 * fraction on the last time unit, `24:00`, `±HH` offsets.
 *
 * Text without an offset is a wall-clock reading in `options.timeZone`
 * (default: the runtime zone), resolved with the `'compatible'` DST rule.
 * This is a door for outside text: it never throws on bad input. Anything
 * else returns an `InvalidDateText` failure with `data.reason` `'not_iso'`,
 * and an unknown `options.timeZone` returns `UnknownTimeZone`.
 */
export declare function parseISO(text: string, options?: ParseISOOptions): Instant | InvalidDateText | UnknownTimeZone;
//# sourceMappingURL=core.d.ts.map