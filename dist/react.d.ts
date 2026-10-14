/**
 * React 19 hooks that keep a Temporal value in step with a clock.
 * Import from `@arki/date/react`; `react` is an optional peer dependency.
 *
 * The first render reads the clock synchronously, so server and client both
 * render a value. Pass a `MockClock` for deterministic tests.
 */
import type { Clock } from '@arki/clock';
import type { RelativeOptions } from './relative.js';
import type { Instant, PlainDate, Timeline } from './types.js';
/** How often a hook re-reads the clock. */
export type NowOptions = Readonly<{
    /** Milliseconds between ticks. `0` or `Infinity` means never tick. */
    every?: number;
    /** Clock to read. Default: the system clock. */
    clock?: Clock;
}>;
/** The current `Instant`, re-read every `every` ms (default 1000). */
export declare function useNow(options?: NowOptions): Instant;
/**
 * Today's date in `timeZone` (runtime zone by default), re-read every `every`
 * ms (default 60 000). It only re-renders when the date changes.
 */
export declare function useToday(options?: NowOptions & Readonly<{
    timeZone?: string;
}>): PlainDate;
/** `relative(target, now)` text such as "in 3 minutes", refreshed every `every` ms (default 60 000). */
export declare function useRelativeTime(target: Timeline | Date, options?: RelativeOptions & NowOptions): string;
//# sourceMappingURL=react.d.ts.map