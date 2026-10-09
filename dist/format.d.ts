/**
 * Formatting: Unicode LDML patterns (`format`), ISO 8601 text (`formatISO`)
 * and locale-native output (`formatIntl`).
 *
 * Policies (one for the whole package):
 * - `format` reproduces date-fns v4 `format` output (en-US) for its token
 *   subset, so code moving off date-fns keeps its strings. Word tokens (month,
 *   weekday, AM/PM, era, zone names) come from `Intl.DateTimeFormat` in the
 *   requested locale; numbers, ordinals (`do`), quarters and the `P`/`p`
 *   presets follow date-fns en-US.
 * - A `Date` or `Instant` is projected into `options.timeZone`, defaulting to
 *   the runtime zone (what date-fns does implicitly). A `ZonedDateTime` keeps
 *   its own zone. A `PlainDate`/`PlainDateTime` has no zone and refuses one.
 * - Asking for something the value does not carry fails loud with a
 *   `RangeError`: a time token on a `PlainDate`, a zone token on a
 *   `PlainDateTime`, an unknown pattern letter, an invalid `Date`.
 * - Default locale is `'en-US'`.
 */
import type { Duration, Point } from './types.js';
/** Locale (BCP 47, default `'en-US'`) and time zone (IANA id) for formatting. */
export type FormatOptions = Readonly<{
    locale?: string;
    timeZone?: string;
}>;
/** `Intl.DateTimeFormat` options plus this package's `locale` / `timeZone`. */
export type FormatIntlOptions = Readonly<Intl.DateTimeFormatOptions> & FormatOptions;
/**
 * Format with a Unicode LDML pattern, producing the same text as date-fns v4
 * `format` (en-US) for the supported tokens.
 *
 * Tokens: `G…GGGGG` era · `y yy yyy… yo` year · `R…` ISO week-year ·
 * `Q QQ QQQ QQQQ QQQQQ Qo` quarter · `M… L… Mo Lo` month (L = stand-alone) ·
 * `I II Io` ISO week · `d dd do` day · `D DD DDD Do` day of year ·
 * `E…EEEEEE` weekday · `i…iiiiii io` ISO weekday · `a…aaaaa` AM/PM ·
 * `b…bbbbb` AM/PM/noon/midnight · `h H K k` (+ `o`) hours · `m s` (+ `o`) ·
 * `S…` fraction (truncated) · `X… x…` ISO offset · `O OOOO` GMT offset ·
 * `z zzzz` zone name (Intl) · `P…PPPP p…pppp Pp…` date-fns en-US presets ·
 * `'literal'` with `''` for a quote. Any other letter throws `RangeError`.
 *
 * `Date`/`Instant` are shown in `options.timeZone ?? systemTimeZone()`.
 * Time tokens on a `PlainDate`, and zone tokens on a `PlainDate`/`PlainDateTime`,
 * throw `RangeError`.
 */
export declare function format(value: Point | Date, pattern: string, options?: FormatOptions): string;
/** `May 20, 2026` — `format(value, 'LLL dd, y')`, the legacy `@arki/date/format` helper. */
export declare function toHumanReadableDate(value: Point | Date, options?: FormatOptions): string;
/** ISO 8601 / RFC 9557 text: the value's `toString()` (`2026-05-20`, `PT1H30M`, `…+03:00[Europe/Bucharest]`). */
export declare function formatISO(value: Point | Duration): string;
/**
 * Locale-native output through `Intl.DateTimeFormat` (`dateStyle`, `month: 'long'`, …).
 *
 * - `PlainDate`: date fields only; time options (`hour`, `minute`, `second`,
 *   `fractionalSecondDigits`, `dayPeriod`, `timeStyle`, `timeZoneName`) throw `RangeError`.
 * - `PlainDateTime`: the wall clock as-is, no zone (`timeZoneName` throws).
 * - `ZonedDateTime`: its own zone; a different `timeZone` option throws.
 * - `Date`/`Instant`: `options.timeZone ?? systemTimeZone()`.
 * A `timeZone` option on a `PlainDate`/`PlainDateTime` throws.
 */
export declare function formatIntl(value: Point | Date, options?: FormatIntlOptions): string;
//# sourceMappingURL=format.d.ts.map