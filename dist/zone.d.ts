/**
 * Time-zone projection. Two deliberately different operations:
 * `inZone` keeps the instant and changes the wall clock;
 * `reinterpretZone` keeps the wall clock and changes the instant.
 */
import type { Disambiguation, PlainDate, Timeline, TimeParts, ZonedDateTime } from './types.js';
/** The same instant, shown in another zone. */
export declare function inZone(value: Timeline | Date, timeZone: string): ZonedDateTime;
/** The same instant in UTC. */
export declare function toUTC(value: Timeline | Date): ZonedDateTime;
/** The same wall-clock fields, read as if they were in another zone (the instant changes). */
export declare function reinterpretZone(value: ZonedDateTime, timeZone: string, options?: Readonly<{
    disambiguation?: Disambiguation;
}>): ZonedDateTime;
/** A calendar date at a wall-clock time in a zone. */
export declare function atTime(date: PlainDate, time: Partial<TimeParts>, timeZone: string, options?: Readonly<{
    disambiguation?: Disambiguation;
}>): ZonedDateTime;
/** The UTC offset as text, e.g. `+03:00`. */
export declare function offset(value: ZonedDateTime): string;
/** The UTC offset in minutes (east positive). */
export declare function offsetMinutes(value: ZonedDateTime): number;
/** Is this a time zone the runtime knows (IANA name or fixed offset)? */
export declare function isValidTimeZone(id: string): boolean;
//# sourceMappingURL=zone.d.ts.map