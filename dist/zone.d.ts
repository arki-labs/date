/**
 * Time-zone projection. Two deliberately different operations:
 * `inZone` keeps the instant and changes the wall clock;
 * `reinterpretZone` keeps the wall clock and changes the instant.
 */
import type { ZonedOptions } from './core.js';
import type { PlainDate, Timeline, TimeParts, ZonedDateTime } from './types.js';
/**
 * The same instant, shown in another zone. `timeZone` is the caller's own value:
 * an unknown name throws `RangeError`. Check zone text from outside with
 * `isValidTimeZone` first, or read it with a `parse*` door that returns `UnknownTimeZone`.
 */
export declare function inZone(value: Timeline | Date, timeZone: string): ZonedDateTime;
/** The same instant in UTC. */
export declare function toUTC(value: Timeline | Date): ZonedDateTime;
/** The same wall-clock fields, read as if they were in another zone (the instant changes). */
export declare function reinterpretZone(value: ZonedDateTime, timeZone: string, options?: ZonedOptions): ZonedDateTime;
/** A calendar date at a wall-clock time in a zone. */
export declare function atTime(date: PlainDate, time: Partial<TimeParts>, timeZone: string, options?: ZonedOptions): ZonedDateTime;
/** The UTC offset as text, e.g. `+03:00`. */
export declare function offset(value: ZonedDateTime): string;
/** The UTC offset in minutes (east positive). */
export declare function offsetMinutes(value: ZonedDateTime): number;
export { isValidTimeZone } from './internal/system-zone.js';
//# sourceMappingURL=zone.d.ts.map