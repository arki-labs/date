/**
 * `parseISO` — a drop-in for date-fns `parseISO`, built on Temporal.
 *
 * Semantics (identical to date-fns v4 with its default `additionalDigits: 2`):
 * - A date or date-time with no offset is read as LOCAL time in the runtime
 *   zone (`systemTimeZone()`); a skipped DST time moves forward, a repeated
 *   one takes the earlier instant (Temporal `'compatible'`, same as `Date`).
 * - `Z` or a `±HH`, `±HHMM`, `±HH:MM` suffix makes the result exact.
 * - Accepted dates: `YYYY`, `YY` (century), `YYYY-MM`, `YYYY-MM-DD`,
 *   `YYYYMMDD`, `±YYYYYY…` extended years, week dates (`2026-W41`,
 *   `2026-W41-5`, `2026W415`) and ordinal dates (`2026-283`, `2026283`).
 * - Accepted times (after `T` or a space): `HH`, `HH:mm`, `HH:mm:ss`, basic
 *   `HHmmss`, a decimal fraction (`.` or `,`) on the last unit, and `24:00`.
 * - Invalid input returns `new Date(NaN)`; it never throws for a string.
 */
/**
 * Parse ISO 8601 text into a `Date`, exactly as date-fns `parseISO` does.
 * Zone-less text is local time; `Z`/offset text is exact; invalid text gives
 * an Invalid Date (`getTime()` is `NaN`) instead of throwing.
 */
export declare function parseISO(text: string): Date;
//# sourceMappingURL=parseISO.d.ts.map