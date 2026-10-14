/**
 * UTC offsets of time zones, answered from a per-day cache.
 *
 * Temporal answers "what is the offset at this moment" correctly, but each
 * answer builds a ZonedDateTime (hundreds of nanoseconds on V8). Offsets change
 * only at transitions, so the cache keeps one entry per UTC day: the day's
 * offset, or, for the few days holding a transition, the exact moment of the
 * change (found by binary search to the millisecond). Only offset queries are
 * used; the polyfill's transition search can miss transitions (it reports none
 * after 2028 for Africa/Casablanca on V8).
 *
 * Assumption: a zone never changes its offset and changes it back within one
 * UTC day. A day whose start and end offsets differ, but whose change point is
 * not a single step, is marked complex and always asks Temporal.
 *
 * All values are epoch or wall-clock milliseconds. A wall-clock millisecond is
 * the zone's local reading counted as if it were UTC.
 */
import type { Disambiguation } from '../types.js';
/** The zone's UTC offset in milliseconds at an exact moment (east positive). */
export declare function offsetAt(zone: string, epochMs: number): number;
/** How a wall-clock reading maps onto exact time when the zone has at most one transition around it. */
export type WallResolution = Readonly<{
    kind: 'unique';
    epochMs: number;
}>
/** Repeated hour: two moments, `earlier` < `later`. */
 | Readonly<{
    kind: 'fold';
    earlier: number;
    later: number;
}>
/** Skipped hour: `transition` is the first moment after the gap. */
 | Readonly<{
    kind: 'gap';
    offsetBefore: number;
    offsetAfter: number;
    transition: number;
}>;
/**
 * The moments a wall-clock reading names in `zone`, with the same ±1 day window
 * Temporal uses. Returns `undefined` when two transitions fall inside that
 * window (rare historical changes); callers then use Temporal itself.
 */
export declare function resolveWall(zone: string, wallMs: number): WallResolution | undefined;
/**
 * The exact moment of a wall-clock reading under Temporal's disambiguation
 * rules, or `undefined` when the fast path does not apply (`reject` on a
 * fold or gap, or several transitions nearby): callers then use Temporal.
 */
export declare function epochFromWall(zone: string, wallMs: number, disambiguation?: Disambiguation): number | undefined;
/** The first moment of the day whose midnight is `wallMs` (Temporal's `startOfDay`). */
export declare function startOfDayEpoch(zone: string, wallMs: number): number | undefined;
//# sourceMappingURL=offsets.d.ts.map