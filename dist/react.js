/**
 * React 19 hooks that keep a Temporal value in step with a clock.
 * Import from `@arki/date/react`; `react` is an optional peer dependency.
 *
 * The first render reads the clock synchronously, so server and client both
 * render a value. Pass a `MockClock` for deterministic tests.
 */
import { useEffect, useState } from 'react';
import { now, today } from './clock.js';
import { relative } from './relative.js';
/** Run `tick` every `every` ms; `0`, `Infinity` and negatives never tick. Returns the cleanup. */
function startTicker(every, tick) {
    if (!Number.isFinite(every) || every <= 0)
        return undefined;
    const id = setInterval(tick, every);
    return () => {
        clearInterval(id);
    };
}
/** The current `Instant`, re-read every `every` ms (default 1000). */
export function useNow(options) {
    const clock = options?.clock;
    const [value, setValue] = useState(() => now({ clock }));
    const every = options?.every ?? 1000;
    useEffect(() => startTicker(every, () => setValue(now({ clock }))), [every, clock]);
    return value;
}
/**
 * Today's date in `timeZone` (runtime zone by default), re-read every `every`
 * ms (default 60 000). It only re-renders when the date changes.
 */
export function useToday(options) {
    const clock = options?.clock;
    const timeZone = options?.timeZone;
    const [value, setValue] = useState(() => today({ clock, timeZone }));
    const every = options?.every ?? 60_000;
    useEffect(() => startTicker(every, () => {
        const next = today({ clock, timeZone });
        setValue(previous => (previous.equals(next) ? previous : next));
    }), [every, clock, timeZone]);
    return value;
}
/** `relative(target, now)` text such as "in 3 minutes", refreshed every `every` ms (default 60 000). */
export function useRelativeTime(target, options) {
    const clock = options?.clock;
    const [reference, setReference] = useState(() => now({ clock }));
    const every = options?.every ?? 60_000;
    useEffect(() => startTicker(every, () => setReference(now({ clock }))), [every, clock]);
    return relative(target, reference, options);
}
//# sourceMappingURL=react.js.map