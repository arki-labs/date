/**
 * Temporal values across process boundaries: oRPC's RPC protocol and SuperJSON
 * (TanStack Query SSR dehydration). Both keep `Date` but know nothing about
 * Temporal, so without these codecs a server `Instant` reaches the client as an
 * ISO string still typed as `Instant` (oRPC) or as `{}` (SuperJSON).
 *
 * Register them on BOTH ends:
 *
 * ```ts
 * new RPCHandler(router, { customJsonSerializers: temporalJsonSerializers });
 * new RPCLink({ url, customJsonSerializers: temporalJsonSerializers });
 * registerTemporalTypes(SuperJSON); // once, where the query client is built
 * ```
 *
 * Every value travels as its ISO / RFC 9557 text, so a `ZonedDateTime` keeps its
 * zone and an `Instant` its nanoseconds. Text that does not parse as the
 * announced type throws on arrival instead of becoming a wrong value.
 */
import type { StandardRPCCustomJsonSerializer } from '@orpc/client/standard';
import type SuperJSON from 'superjson';
/**
 * The oRPC custom type ids these codecs use. oRPC's built-in types use 0–8;
 * keep any custom serializers of your own away from 100–104.
 */
export declare const TEMPORAL_RPC_TYPES: Readonly<{
    instant: 100;
    zonedDateTime: 101;
    plainDate: 102;
    plainDateTime: 103;
    duration: 104;
}>;
/** oRPC `customJsonSerializers` for every Temporal type. Pass the same list to `RPCHandler` and `RPCLink`. */
export declare const temporalJsonSerializers: readonly StandardRPCCustomJsonSerializer[];
/**
 * Teach a SuperJSON instance (or the `SuperJSON` default export) the Temporal
 * types. Registering twice replaces the earlier entry, so module reloads are safe.
 */
export declare function registerTemporalTypes(superjson: Pick<typeof SuperJSON, 'registerCustom'>): void;
//# sourceMappingURL=serialize.d.ts.map