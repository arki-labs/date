/**
 * Zod v4 schemas for the Temporal values this package returns.
 *
 * Every schema's INPUT accepts an ISO string or an already-built value, and
 * its OUTPUT is the Temporal value, so `z.input` / `z.infer` stay precise for
 * tRPC and oRPC consumers. Import from `@arki/date/zod`; `zod` is an optional
 * peer dependency.
 */
import { z } from 'zod';
import { instant, plainDate, plainDateTime, zoned } from './core.js';
import { interval } from './interval.js';
import { isDuration, isInstant, isPlainDate, isPlainDateTime, isZonedDateTime, Temporal } from './types.js';
function describe(value) {
    return typeof value === 'string' ? `"${value}"` : Object.prototype.toString.call(value);
}
function reason(error) {
    return error instanceof Error ? ` (${error.message})` : '';
}
/** A string-or-value schema: `build` turns the input into the Temporal value or throws. */
function temporalSchema(name, expected, accepts, build) {
    return z
        .union([z.string(), z.custom(accepts, { message: `Invalid ${name}: expected ${expected}` })])
        .transform((value, ctx) => {
        try {
            return build(value);
        }
        catch (error) {
            ctx.addIssue({
                code: 'custom',
                message: `Invalid ${name}: expected ${expected}, received ${describe(value)}${reason(error)}`,
            });
            return z.NEVER;
        }
    });
}
/** A calendar date: `'YYYY-MM-DD'` or a `PlainDate`. Output is a `PlainDate`. */
export function plainDateSchema() {
    return temporalSchema('PlainDate', 'YYYY-MM-DD or a PlainDate', isPlainDate, value => plainDate(value));
}
/** A zone-less date and time: `'YYYY-MM-DDTHH:mm[:ss]'` or a `PlainDateTime`. Output is a `PlainDateTime`. */
export function plainDateTimeSchema() {
    return temporalSchema('PlainDateTime', 'a zone-less ISO date-time or a PlainDateTime', isPlainDateTime, value => plainDateTime(value));
}
function isInstantOrDate(value) {
    return isInstant(value) || value instanceof Date;
}
/** An exact moment: an ISO string with `Z` or an offset, an `Instant`, or a `Date`. Output is an `Instant`. */
export function instantSchema() {
    return temporalSchema('Instant', 'an ISO string with Z or an offset, an Instant, or a Date', isInstantOrDate, value => instant(value));
}
/**
 * An exact moment in a zone. Without `timeZone` a string must carry a `[Zone]`
 * annotation; with `timeZone` the value is read in (or projected into) that zone.
 */
export function zonedDateTimeSchema(options) {
    const timeZone = options?.timeZone;
    const expected = timeZone === undefined
        ? 'an ISO string with a [TimeZone] annotation or a ZonedDateTime'
        : `an ISO string or a ZonedDateTime, read in ${timeZone}`;
    return temporalSchema('ZonedDateTime', expected, isZonedDateTime, value => timeZone === undefined ? zoned(value) : zoned(value, timeZone));
}
/** A signed amount of time: an ISO 8601 duration such as `'P1DT2H'`, or a `Duration`. Output is a `Duration`. */
export function durationSchema() {
    return temporalSchema('Duration', 'an ISO 8601 duration such as P1DT2H or a Duration', isDuration, value => Temporal.Duration.from(value));
}
/** An IANA time zone id. Output is the canonical id (for example `'europe/bucharest'` becomes `'Europe/Bucharest'`). */
export function timeZoneSchema() {
    return z.string().transform((value, ctx) => {
        try {
            return new Intl.DateTimeFormat('en-US', { timeZone: value }).resolvedOptions().timeZone;
        }
        catch {
            ctx.addIssue({
                code: 'custom',
                message: `Invalid time zone: expected an IANA id such as Europe/Bucharest, received ${describe(value)}`,
            });
            return z.NEVER;
        }
    });
}
/**
 * A half-open interval `{ start, end }` whose ends are parsed by `point`.
 * An `end` before `start` is an issue.
 */
export function intervalSchema(point) {
    return z.object({ start: point, end: point }).transform((value, ctx) => {
        try {
            return interval(value.start, value.end);
        }
        catch (error) {
            ctx.addIssue({
                code: 'custom',
                message: `Invalid interval: expected start not after end${reason(error)}`,
            });
            return z.NEVER;
        }
    });
}
//# sourceMappingURL=zod.js.map