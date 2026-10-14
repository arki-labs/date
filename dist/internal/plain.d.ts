/**
 * Fast paths for ISO-calendar PlainDate arithmetic.
 *
 * A PlainDate is cheap to construct (about 120 ns on V8, 20 ns on Bun), but
 * `add`, `with` and `until` run Temporal's general algorithms and cost several
 * times that. These functions compute the result's fields directly and
 * construct it once; they convert to a day count only when days or weeks are
 * involved. They return `undefined` whenever they would not match
 * Temporal exactly (another calendar, a fractional or mixed-sign amount, time
 * fields, `reject` on a clamped day, the edge of Temporal's range); the caller
 * then uses Temporal itself.
 */
import type { CalendarUnit, Overflow, PlainDate, WeekRules } from '../types.js';
import type { DurationFields } from './amount.js';
/** `startOf(date, unit)` for a calendar unit. */
export declare function startOfPlainDate(value: PlainDate, unit: CalendarUnit, rules: WeekRules): PlainDate | undefined;
/** `endOf(date, unit)` for a calendar unit: the last day of that day, week, month, quarter or year. */
export declare function endOfPlainDate(value: PlainDate, unit: CalendarUnit, rules: WeekRules): PlainDate | undefined;
/** `date + amount` for whole calendar amounts of one sign, as Temporal's ISO calendar adds them. */
export declare function addPlainDate(value: PlainDate, amount: DurationFields, overflow?: Overflow): PlainDate | undefined;
//# sourceMappingURL=plain.d.ts.map