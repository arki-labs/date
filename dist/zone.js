/**
 * Time-zone projection. Two deliberately different operations:
 * `inZone` keeps the instant and changes the wall clock;
 * `reinterpretZone` keeps the wall clock and changes the instant.
 */
import { instant, plainDateTime } from './core.js';
import { Temporal } from './types.js';
/**
 * The same instant, shown in another zone. `timeZone` is the caller's own value:
 * an unknown name throws `RangeError`. Check zone text from outside with
 * `isValidTimeZone` first, or read it with a `parse*` door that returns `UnknownTimeZone`.
 */
export function inZone(value, timeZone) {
    // A Date goes straight to its ZonedDateTime, without an intermediate Instant.
    if (value instanceof Date) {
        const ms = value.getTime();
        if (Number.isNaN(ms))
            throw new RangeError('instant() received an invalid Date');
        return new Temporal.ZonedDateTime(BigInt(ms) * 1000000n, timeZone);
    }
    return instant(value).toZonedDateTimeISO(timeZone);
}
/** The same instant in UTC. */
export function toUTC(value) {
    return inZone(value, 'UTC');
}
/** The same wall-clock fields, read as if they were in another zone (the instant changes). */
export function reinterpretZone(value, timeZone, options) {
    return value.toPlainDateTime().toZonedDateTime(timeZone, options);
}
/** A calendar date at a wall-clock time in a zone. */
export function atTime(date, time, timeZone, options) {
    return plainDateTime({ year: date.year, month: date.month, day: date.day, ...time }).toZonedDateTime(timeZone, options);
}
/** The UTC offset as text, e.g. `+03:00`. */
export function offset(value) {
    return value.offset;
}
/** The UTC offset in minutes (east positive). */
export function offsetMinutes(value) {
    return value.offsetNanoseconds / 60_000_000_000;
}
export { isValidTimeZone } from './internal/system-zone.js';
//# sourceMappingURL=zone.js.map