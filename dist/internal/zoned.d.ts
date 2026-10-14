/**
 * Fast path for ISO-calendar ZonedDateTime boundaries.
 *
 * Temporal reaches a zoned boundary through three objects (to a PlainDate, a
 * `with`, back to a ZonedDateTime), and on V8 each costs hundreds of
 * nanoseconds. This computes the boundary with integer calendar math and the
 * cached zone offsets, then builds exactly one ZonedDateTime. It returns
 * `undefined` whenever it would not match Temporal exactly (another calendar,
 * several transitions nearby, the edge of Temporal's range); the caller then
 * uses Temporal itself.
 *
 * `add` has no such path: it replaces a single Temporal call, and building the
 * result costs more than that call on V8.
 */
import type { CalendarUnit, WeekRules, ZonedDateTime } from '../types.js';
/** `startOf(value, unit)` for a calendar unit: the first moment of that day, week, month, quarter or year. */
export declare function startOfZoned(value: ZonedDateTime, unit: CalendarUnit, rules: WeekRules): ZonedDateTime | undefined;
//# sourceMappingURL=zoned.d.ts.map