/** Is this a time zone the runtime knows (IANA name or fixed offset)? Re-exported from `zone`. */
export declare function isValidTimeZone(id: string): boolean;
/**
 * The runtime's IANA time zone (e.g. `Europe/Bucharest`). The lookup costs
 * ~0.2 ms on the polyfill, so the answer is reused for one second; the zone
 * can change at runtime (`process.env.TZ`, a travelling laptop) and a change
 * shows up within that second.
 */
export declare function systemTimeZone(): string;
//# sourceMappingURL=system-zone.d.ts.map