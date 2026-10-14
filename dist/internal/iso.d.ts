/**
 * Lenient ISO 8601 text, shared by `parseISO` in core.
 */
import { Temporal } from '../types.js';
/**
 * Lenient ISO 8601 reader (the date-fns `parseISO` grammar): calendar, week
 * and ordinal dates, basic and extended forms, fractional last time unit,
 * `24:00`, `Z`/`±HH[:MM]` offsets. Zone-less text is a wall-clock reading in
 * `timeZone`. Returns `undefined` for text the grammar rejects.
 */
export declare function readLenientISO(text: string, timeZone: string): Temporal.Instant | undefined;
/**
 * The common ISO 8601 shapes — `YYYY-MM-DD`, optionally followed by `T` or a
 * space, `HH:MM`, `:SS`, a `.`/`,` fraction and `Z` or `±HH[[:]MM]` — read
 * with plain arithmetic. Returns epoch milliseconds, or `undefined` for any
 * other text; the caller then uses `readLenientISO`, so every answer equals
 * the lenient reader's (same validation, same fraction arithmetic).
 */
export declare function readCommonISO(text: string, timeZone: () => string): number | undefined;
//# sourceMappingURL=iso.d.ts.map