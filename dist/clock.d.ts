/**
 * "What time is it?" — answered only through an `@arki/clock` `Clock`, read
 * once per call and copied into an immutable value. There is no package-level
 * test clock; pass a `MockClock` (or use `createDateContext` from `fluent`).
 *
 * `timeZone` defaults to the runtime's zone. On a server that is usually UTC
 * and in a browser it is the user's zone — pass it explicitly whenever the
 * result is rendered on both sides.
 */
import type { Clock } from '@arki/clock';
import type { Instant, PlainDate, Point, Timeline, WeekRules, ZonedDateTime } from './types.js';
/** The current instant. */
export declare function now(clock?: Clock): Instant;
/** The current moment in a zone (runtime zone by default). */
export declare function nowIn(timeZone?: string, clock?: Clock): ZonedDateTime;
export type CurrentOptions = Readonly<{
    timeZone?: string;
    clock?: Clock;
    week?: WeekRules;
}>;
/** Today's calendar date in a zone (runtime zone by default). */
export declare function today(options?: CurrentOptions): PlainDate;
export declare function isToday(value: Point, options?: CurrentOptions): boolean;
export declare function isTomorrow(value: Point, options?: CurrentOptions): boolean;
export declare function isYesterday(value: Point, options?: CurrentOptions): boolean;
export declare function isThisWeek(value: Point, options?: CurrentOptions): boolean;
export declare function isThisMonth(value: Point, options?: CurrentOptions): boolean;
export declare function isThisYear(value: Point, options?: CurrentOptions): boolean;
/** Strictly before now. */
export declare function isPast(value: Timeline | Date, clock?: Clock): boolean;
/** Strictly after now. */
export declare function isFuture(value: Timeline | Date, clock?: Clock): boolean;
//# sourceMappingURL=clock.d.ts.map