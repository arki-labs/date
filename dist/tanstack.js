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
import { createSerializationAdapter } from '@tanstack/react-router';
import { isDuration, isInstant, isPlainDate, isPlainDateTime, isZonedDateTime, Temporal } from './types.js';
export const instantSerializationAdapter = createSerializationAdapter({
    key: 'arki-date/instant',
    test: isInstant,
    toSerializable: value => value.toString(),
    fromSerializable: text => Temporal.Instant.from(text),
});
export const zonedDateTimeSerializationAdapter = createSerializationAdapter({
    key: 'arki-date/zoned-date-time',
    test: isZonedDateTime,
    toSerializable: value => value.toString(),
    fromSerializable: text => Temporal.ZonedDateTime.from(text),
});
export const plainDateSerializationAdapter = createSerializationAdapter({
    key: 'arki-date/plain-date',
    test: isPlainDate,
    toSerializable: value => value.toString(),
    fromSerializable: text => Temporal.PlainDate.from(text),
});
export const plainDateTimeSerializationAdapter = createSerializationAdapter({
    key: 'arki-date/plain-date-time',
    test: isPlainDateTime,
    toSerializable: value => value.toString(),
    fromSerializable: text => Temporal.PlainDateTime.from(text),
});
export const durationSerializationAdapter = createSerializationAdapter({
    key: 'arki-date/duration',
    test: isDuration,
    toSerializable: value => value.toString(),
    fromSerializable: text => Temporal.Duration.from(text),
});
/** All five adapters, for `createStart(() => ({ serializationAdapters }))`. */
export const temporalSerializationAdapters = [
    instantSerializationAdapter,
    zonedDateTimeSerializationAdapter,
    plainDateSerializationAdapter,
    plainDateTimeSerializationAdapter,
    durationSerializationAdapter,
];
//# sourceMappingURL=tanstack.js.map