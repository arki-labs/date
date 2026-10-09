/**
 * "What time is it?" — answered only through an `@arki/clock` `Clock`, read
 * once per call and copied into an immutable value. There is no package-level
 * test clock; pass a `MockClock` (or use `createDateContext` from `fluent`).
 *
 * `timeZone` defaults to the runtime's zone. On a server that is usually UTC
 * and in a browser it is the user's zone — pass it explicitly whenever the
 * result is rendered on both sides.
 */
import { SystemClock } from '@arki/clock';
import { instant, plainDate } from './core.js';
import { systemTimeZone } from './interop.js';
import { startOf } from './math.js';
import { isInstant, isZonedDateTime, Temporal } from './types.js';
const systemClock = new SystemClock();
/** The current instant. */
export function now(clock = systemClock) {
    return instant(clock.now());
}
/** The current moment in a zone (runtime zone by default). */
export function nowIn(timeZone = systemTimeZone(), clock = systemClock) {
    return now(clock).toZonedDateTimeISO(timeZone);
}
/** Today's calendar date in a zone (runtime zone by default). */
export function today(options) {
    return nowIn(options?.timeZone, options?.clock).toPlainDate();
}
/**
 * Project any point into the comparison zone: plain values are taken as-is,
 * zoned values keep their zone unless one is given, instants need a zone.
 */
function civilIn(value, timeZone) {
    if (isInstant(value))
        return value.toZonedDateTimeISO(timeZone ?? systemTimeZone());
    if (isZonedDateTime(value) && timeZone)
        return value.withTimeZone(timeZone);
    return value;
}
function sameCurrentUnit(value, unit, offsetUnits, options) {
    const civil = civilIn(value, options?.timeZone);
    const zone = isZonedDateTime(civil) ? civil.timeZoneId : (options?.timeZone ?? systemTimeZone());
    const target = startOf(plainDate(civil), unit, options);
    const base = startOf(today({ ...options, timeZone: zone }), unit, options);
    const shifted = offsetUnits === 0 ? base : base.add({ [`${unit}s`]: offsetUnits });
    return Temporal.PlainDate.compare(target, shifted) === 0;
}
export function isToday(value, options) {
    return sameCurrentUnit(value, 'day', 0, options);
}
export function isTomorrow(value, options) {
    return sameCurrentUnit(value, 'day', 1, options);
}
export function isYesterday(value, options) {
    return sameCurrentUnit(value, 'day', -1, options);
}
export function isThisWeek(value, options) {
    return sameCurrentUnit(value, 'week', 0, options);
}
export function isThisMonth(value, options) {
    return sameCurrentUnit(value, 'month', 0, options);
}
export function isThisYear(value, options) {
    return sameCurrentUnit(value, 'year', 0, options);
}
/** Strictly before now. */
export function isPast(value, clock = systemClock) {
    return Temporal.Instant.compare(instant(value), now(clock)) < 0;
}
/** Strictly after now. */
export function isFuture(value, clock = systemClock) {
    return Temporal.Instant.compare(instant(value), now(clock)) > 0;
}
//# sourceMappingURL=clock.js.map