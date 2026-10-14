/**
 * Temporal values across TanStack Router and Start boundaries: loader data,
 * server-function results and the dehydrated SSR payload. They travel through
 * seroval, which keeps `Date` but throws on a Temporal value, so a loader or a
 * server function that returns an `Instant` fails without these adapters.
 *
 * Register them once, in `src/start.ts`:
 *
 * ```ts
 * import { createStart } from '@tanstack/react-start';
 * import { temporalSerializationAdapters } from '@arki/date/tanstack';
 *
 * export const startInstance = createStart(() => ({
 *   serializationAdapters: temporalSerializationAdapters,
 * }));
 * ```
 *
 * Every value travels as its ISO / RFC 9557 text, so a `ZonedDateTime` keeps its
 * zone and an `Instant` its nanoseconds.
 */
import { Temporal } from './types.js';
export declare const instantSerializationAdapter: import("@tanstack/react-router").SerializationAdapter<Temporal.Instant, string, never>;
export declare const zonedDateTimeSerializationAdapter: import("@tanstack/react-router").SerializationAdapter<Temporal.ZonedDateTime, string, never>;
export declare const plainDateSerializationAdapter: import("@tanstack/react-router").SerializationAdapter<Temporal.PlainDate, string, never>;
export declare const plainDateTimeSerializationAdapter: import("@tanstack/react-router").SerializationAdapter<Temporal.PlainDateTime, string, never>;
export declare const durationSerializationAdapter: import("@tanstack/react-router").SerializationAdapter<Temporal.Duration, string, never>;
/** All five adapters, for `createStart(() => ({ serializationAdapters }))`. */
export declare const temporalSerializationAdapters: readonly [import("@tanstack/react-router").SerializationAdapter<Temporal.Instant, string, never>, import("@tanstack/react-router").SerializationAdapter<Temporal.ZonedDateTime, string, never>, import("@tanstack/react-router").SerializationAdapter<Temporal.PlainDate, string, never>, import("@tanstack/react-router").SerializationAdapter<Temporal.PlainDateTime, string, never>, import("@tanstack/react-router").SerializationAdapter<Temporal.Duration, string, never>];
//# sourceMappingURL=tanstack.d.ts.map