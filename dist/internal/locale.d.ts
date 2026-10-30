/**
 * Locale text from outside (an `Accept-Language` header, a cookie) can be
 * malformed. `Intl` throws a `RangeError` for a bad tag, so every public door
 * that takes a `locale` option passes it through {@link resolveLocale}: a
 * malformed tag falls back to the default locale and is logged at DEBUG.
 */
/** The locale used when none is given or the given one is malformed. */
export declare const DEFAULT_LOCALE = "en-US";
/** `locale` when it is a well-formed BCP 47 tag, `en-US` when it is missing or malformed (logged at DEBUG). */
export declare function resolveLocale(locale: string | undefined): string;
//# sourceMappingURL=locale.d.ts.map