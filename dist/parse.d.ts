/**
 * Pattern parsing: the inverse of `format`. `parseDate`, `parseDateTime` and
 * `parseZoned` read text laid out by a Unicode LDML pattern (the date-fns v4
 * token subset below) and return a Temporal value; the `tryParse…` doors
 * return `undefined` for text that does not match.
 *
 * Policies (one for the whole package):
 * - Round trip: for every supported token, `parseX(format(value, p), p)`
 *   equals `value`. Word tokens (month, weekday, AM/PM) are matched,
 *   case-insensitively, against the exact words `format` prints for the
 *   locale, so the two can never drift apart.
 * - Supported tokens: `y` `yy` `yyy` `yyyy`, `M`…`MMMM`, `L`…`LLLL`, `d` `dd`,
 *   `D` `DDD` (day of year, only without month/day tokens), `E`…`EEEE`,
 *   `i`…`iiii`, `H` `HH`, `h` `hh`, `K` `KK`, `k` `kk`, `a`…`aaaa`, `m` `mm`,
 *   `s` `ss`, `S`…`SSSSSSSSS`, `X`…`XXX`, `x`…`xxx`, `'quoted text'` (`''` is
 *   a quote) and any non-letter as itself. Single-letter numeric tokens read
 *   1-2 digits, doubled ones exactly 2. `y` reads 1+ digits with an optional
 *   sign (an ISO year), `yy` is 2000-2099, `yyy` 3+ digits, `yyyy` exactly 4.
 *   Ordinals (`do`, `Mo`…), quarters, eras, week-numbering, zone names and the
 *   `P`/`p` presets are not parsed: they throw like any unknown letter.
 * - Fail loud with a `RangeError` whose message starts with the function name:
 *   text the pattern does not account for (missing or leftover text, with its
 *   position), an unknown word, an invalid date or time (Feb 30, hour 24,
 *   minute 60 — values are built with `overflow: 'reject'`), a weekday that
 *   does not match the date, two tokens that disagree, `h`/`K` without an
 *   AM/PM token, and an unsupported pattern letter.
 * - `parseDate` needs a year plus month and day (or a day of year). Time
 *   tokens are read and validated, then dropped. `parseDateTime` fills missing
 *   time fields with zero. Both refuse offset tokens: an offset names an exact
 *   instant, so use `parseZoned`, which shows that instant in the given zone.
 *   Without an offset, `parseZoned` resolves the wall clock in the zone with
 *   `disambiguation` (default `'compatible'`, as `zoned` does).
 * - `tryParse…` returns `undefined` only when the text is wrong. A bad
 *   pattern or time zone is a programming error and still throws.
 * - Default locale is `'en-US'`.
 */
import type { ZonedOptions } from './core.js';
import type { PlainDate, PlainDateTime, ZonedDateTime } from './types.js';
/** Locale (BCP 47, default `'en-US'`) whose month, weekday and AM/PM words are accepted. */
export type ParseOptions = Readonly<{
    locale?: string;
}>;
/**
 * A calendar date read from `text` laid out by `pattern`, e.g.
 * `parseDate('Mar 5, 2026', 'MMM d, yyyy')`. The pattern needs a year and a
 * month + day (or a day of year `D`). Time tokens are read, validated and
 * dropped; offset tokens are refused (use `parseZoned`).
 */
export declare function parseDate(text: string, pattern: string, options?: ParseOptions): PlainDate;
/**
 * A wall-clock date and time read from `text` laid out by `pattern`, e.g.
 * `parseDateTime('03/05/2026 9:30 PM', 'MM/dd/yyyy h:mm a')`. Missing time
 * fields are zero; offset tokens are refused (use `parseZoned`).
 */
export declare function parseDateTime(text: string, pattern: string, options?: ParseOptions): PlainDateTime;
/**
 * A moment in `timeZone` read from `text` laid out by `pattern`. With an
 * offset token (`X`, `x`…) the text names an exact instant, which is shown in
 * `timeZone`. Without one, the text is a wall-clock time in `timeZone`;
 * skipped or repeated times resolve with `disambiguation` (default `'compatible'`).
 */
export declare function parseZoned(text: string, pattern: string, timeZone: string, options?: ParseOptions & ZonedOptions): ZonedDateTime;
/** `parseDate` that returns `undefined` when the text does not match. A bad pattern still throws. */
export declare function tryParseDate(text: string, pattern: string, options?: ParseOptions): PlainDate | undefined;
/** `parseDateTime` that returns `undefined` when the text does not match. A bad pattern still throws. */
export declare function tryParseDateTime(text: string, pattern: string, options?: ParseOptions): PlainDateTime | undefined;
/**
 * `parseZoned` that returns `undefined` when the text does not match or names
 * a wall time that `disambiguation: 'reject'` refuses. A bad pattern or time zone still throws.
 */
export declare function tryParseZoned(text: string, pattern: string, timeZone: string, options?: ParseOptions & ZonedOptions): ZonedDateTime | undefined;
//# sourceMappingURL=parse.d.ts.map