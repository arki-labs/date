import type { CalendarUnit, Overflow, Point, Unit } from '../types.js';
import type { DurationInput } from './amount.js';
/** Temporal ordering of two same-kind points (zoned values compare by instant). */
export declare function comparePoints(a: Point, b: Point): number;
/** `value + amount` for any point; Temporal rejects calendar fields on an Instant. */
export declare function addPoint(value: Point, amount: DurationInput, options?: Readonly<{
    overflow?: Overflow;
}>): Point;
export declare function isCalendarUnit(unit: Unit): unit is CalendarUnit;
//# sourceMappingURL=point.d.ts.map