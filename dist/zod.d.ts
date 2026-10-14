/**
 * Zod v4 schemas for the Temporal values this package returns.
 *
 * Every schema's INPUT accepts an ISO string or an already-built value, and
 * its OUTPUT is the Temporal value, so `z.input` / `z.infer` stay precise for
 * tRPC and oRPC consumers. Import from `@arki/date/zod`; `zod` is an optional
 * peer dependency.
 */
import { z } from 'zod';
import type { Interval } from './interval.js';
import type { Duration, Instant, PlainDate, PlainDateTime, Point, ZonedDateTime } from './types.js';
/** A calendar date: `'YYYY-MM-DD'` or a `PlainDate`. Output is a `PlainDate`. */
export declare function plainDateSchema(): z.ZodType<PlainDate, string | PlainDate>;
/** A zone-less date and time: `'YYYY-MM-DDTHH:mm[:ss]'` or a `PlainDateTime`. Output is a `PlainDateTime`. */
export declare function plainDateTimeSchema(): z.ZodType<PlainDateTime, string | PlainDateTime>;
/** An exact moment: an ISO string with `Z` or an offset, an `Instant`, or a `Date`. Output is an `Instant`. */
export declare function instantSchema(): z.ZodType<Instant, string | Instant | Date>;
/**
 * An exact moment in a zone. Without `timeZone` a string must carry a `[Zone]`
 * annotation; with `timeZone` the value is read in (or projected into) that zone.
 */
export declare function zonedDateTimeSchema(options?: {
    timeZone?: string;
}): z.ZodType<ZonedDateTime, string | ZonedDateTime>;
/** A signed amount of time: an ISO 8601 duration such as `'P1DT2H'`, or a `Duration`. Output is a `Duration`. */
export declare function durationSchema(): z.ZodType<Duration, string | Duration>;
/** An IANA time zone id. Output is the canonical id (for example `'europe/bucharest'` becomes `'Europe/Bucharest'`). */
export declare function timeZoneSchema(): z.ZodType<string, string>;
/**
 * A half-open interval `{ start, end }` whose ends are parsed by `point`.
 * An `end` before `start` is an issue.
 */
export declare function intervalSchema<T extends Point>(point: z.ZodType<T, unknown>): z.ZodType<Interval<T>, {
    start: unknown;
    end: unknown;
}>;
//# sourceMappingURL=zod.d.ts.map