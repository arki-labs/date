/**
 * Shared vocabulary for `@arki/date`.
 *
 * Value types are Temporal's own (via the `temporal-polyfill` ponyfill, which
 * hands back the native `Temporal` object where the runtime ships one). This
 * package adds no parallel date classes — only functions, one `Interval`
 * record shape, and the type aliases below that name the policies every
 * module shares.
 */
import { Temporal } from 'temporal-polyfill';
/** ISO 8601 weeks: Monday start, week 1 contains January 4. The package default. */
export const ISO_WEEK = Object.freeze({ startsOn: 1, minimalDays: 4 });
/** North-American convention: Sunday start, week 1 contains January 1. */
export const SUNDAY_WEEK = Object.freeze({ startsOn: 7, minimalDays: 1 });
export function isPlainDate(value) {
    return value instanceof Temporal.PlainDate;
}
export function isPlainDateTime(value) {
    return value instanceof Temporal.PlainDateTime;
}
export function isZonedDateTime(value) {
    return value instanceof Temporal.ZonedDateTime;
}
export function isInstant(value) {
    return value instanceof Temporal.Instant;
}
export function isDuration(value) {
    return value instanceof Temporal.Duration;
}
export function isPoint(value) {
    return isPlainDate(value) || isPlainDateTime(value) || isZonedDateTime(value) || isInstant(value);
}
export function kindOf(value) {
    if (isPlainDate(value))
        return 'plainDate';
    if (isPlainDateTime(value))
        return 'plainDateTime';
    if (isZonedDateTime(value))
        return 'zonedDateTime';
    return 'instant';
}
export { Temporal } from 'temporal-polyfill';
//# sourceMappingURL=types.js.map