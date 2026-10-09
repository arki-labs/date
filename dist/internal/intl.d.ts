/**
 * A bounded cache of `Intl.DateTimeFormat` instances.
 *
 * Building a formatter is far slower than using one, and `format` asks for the
 * same few (month names, weekday names, AM/PM) on every call. The cache keys on
 * locale + options and keeps at most `INTL_CACHE_LIMIT` entries, dropping the
 * oldest insert when full, so a caller that varies time zones or options
 * cannot grow it without bound.
 */
/** Maximum number of cached formatters. */
export declare const INTL_CACHE_LIMIT = 100;
/** A cached `Intl.DateTimeFormat` for `locale` + `options` (created on first use). */
export declare function dateTimeFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;
/** How many formatters are cached right now (for tests and diagnostics). */
export declare function intlCacheSize(): number;
//# sourceMappingURL=intl.d.ts.map