/**
 * Time-zone projection. Two deliberately different operations:
 * `inZone` keeps the instant and changes the wall clock;
 * `reinterpretZone` keeps the wall clock and changes the instant.
 */
import { instant, plainDateTime } from './core.js';
import { Temporal } from './types.js';
/** The same instant, shown in another zone. */
export function inZone(value, timeZone) {
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
/** Is this a time zone the runtime knows (IANA name or fixed offset)? */
export function isValidTimeZone(id) {
    try {
        new Temporal.ZonedDateTime(0n, id);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=zone.js.map