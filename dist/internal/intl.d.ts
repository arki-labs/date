/**
 * Bounded caches of `Intl` formatters, one per family so each lookup is typed
 * by construction. Building a formatter costs tens to hundreds of microseconds;
 * using one costs a few. Keys are locale + options; at most `INTL_CACHE_LIMIT`
 * entries per family, dropping the oldest, so callers that vary options cannot
 * grow memory without bound.
 */
/** Maximum cached formatters per family. */
export declare const INTL_CACHE_LIMIT = 100;
export declare function dateTimeFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;
export declare function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat;
export declare function listFormat(locale: string, options: Intl.ListFormatOptions): Intl.ListFormat;
export declare function relativeTimeFormat(locale: string, options: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat;
/** `Intl.DurationFormat` is missing on some engines (Hermes, Node ≤ 22): callers check `hasDurationFormat()` first. */
export declare function hasDurationFormat(): boolean;
export declare function durationFormat(locale: string, options: Intl.DurationFormatOptions): Intl.DurationFormat;
/** How many `Intl.DateTimeFormat`s are cached right now (for tests and diagnostics). */
export declare function intlCacheSize(): number;
//# sourceMappingURL=intl.d.ts.map