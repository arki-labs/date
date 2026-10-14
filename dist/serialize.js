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
import { isDuration, isInstant, isPlainDate, isPlainDateTime, isZonedDateTime, Temporal } from './types.js';
/**
 * The oRPC custom type ids these codecs use. oRPC's built-in types use 0–8;
 * keep any custom serializers of your own away from 100–104.
 */
export const TEMPORAL_RPC_TYPES = Object.freeze({
    instant: 100,
    zonedDateTime: 101,
    plainDate: 102,
    plainDateTime: 103,
    duration: 104,
});
const CODECS = [
    {
        name: 'Temporal.Instant',
        type: TEMPORAL_RPC_TYPES.instant,
        is: isInstant,
        parse: text => Temporal.Instant.from(text),
    },
    {
        name: 'Temporal.ZonedDateTime',
        type: TEMPORAL_RPC_TYPES.zonedDateTime,
        is: isZonedDateTime,
        parse: text => Temporal.ZonedDateTime.from(text),
    },
    {
        name: 'Temporal.PlainDate',
        type: TEMPORAL_RPC_TYPES.plainDate,
        is: isPlainDate,
        parse: text => Temporal.PlainDate.from(text),
    },
    {
        name: 'Temporal.PlainDateTime',
        type: TEMPORAL_RPC_TYPES.plainDateTime,
        is: isPlainDateTime,
        parse: text => Temporal.PlainDateTime.from(text),
    },
    {
        name: 'Temporal.Duration',
        type: TEMPORAL_RPC_TYPES.duration,
        is: isDuration,
        parse: text => Temporal.Duration.from(text),
    },
];
function decode(codec, serialized) {
    if (typeof serialized !== 'string') {
        throw new TypeError(`${codec.name}: expected ISO text on the wire, received ${typeof serialized}`);
    }
    return codec.parse(serialized);
}
/** oRPC `customJsonSerializers` for every Temporal type. Pass the same list to `RPCHandler` and `RPCLink`. */
export const temporalJsonSerializers = Object.freeze(CODECS.map(codec => ({
    type: codec.type,
    condition: codec.is,
    serialize: (value) => value.toString(),
    deserialize: (serialized) => decode(codec, serialized),
})));
/**
 * Teach a SuperJSON instance (or the `SuperJSON` default export) the Temporal
 * types. Registering twice replaces the earlier entry, so module reloads are safe.
 */
export function registerTemporalTypes(superjson) {
    for (const codec of CODECS) {
        superjson.registerCustom({
            isApplicable: codec.is,
            serialize: value => value.toString(),
            deserialize: serialized => decode(codec, serialized),
        }, codec.name);
    }
}
//# sourceMappingURL=serialize.js.map