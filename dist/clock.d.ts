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
/** Which clock to read. Default: the system clock. */
export type ClockOptions = Readonly<{
    clock?: Clock;
}>;
export type CurrentOptions = ClockOptions & Readonly<{
    timeZone?: string;
    week?: WeekRules;
}>;
/** The current instant. */
export declare function now(options?: ClockOptions): Instant;
/** The current moment in a zone (runtime zone by default). */
export declare function nowIn(options?: CurrentOptions): ZonedDateTime;
/** Today's calendar date in a zone (runtime zone by default). */
export declare function today(options?: CurrentOptions): PlainDate;
export declare function isToday(value: Point, options?: CurrentOptions): boolean;
export declare function isTomorrow(value: Point, options?: CurrentOptions): boolean;
export declare function isYesterday(value: Point, options?: CurrentOptions): boolean;
export declare function isThisWeek(value: Point, options?: CurrentOptions): boolean;
export declare function isThisMonth(value: Point, options?: CurrentOptions): boolean;
export declare function isThisYear(value: Point, options?: CurrentOptions): boolean;
/** Strictly before now. */
export declare function isPast(value: Timeline | Date, options?: ClockOptions): boolean;
/** Strictly after now. */
export declare function isFuture(value: Timeline | Date, options?: ClockOptions): boolean;
//# sourceMappingURL=clock.d.ts.map