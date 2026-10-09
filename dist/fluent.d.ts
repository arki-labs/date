/**
 * The fluent face of the package: `date(x, { timeZone })` wraps a
 * `ZonedDateTime` plus the display/clock settings it should use, and exposes
 * every receiver-first function as a method. Each method returns a new
 * `DateValue` or a plain result; nothing mutates.
 *
 * `date()` is for moments. A calendar date (`'2026-01-31'`) is rejected with
 * a hint to use `plainDate()` — the two are different things on purpose.
 */
import type { Clock } from '@arki/clock';
import type { BusinessCalendar } from './business.js';
import type { WeekInfo } from './calendar.js';
import type { BucketUnitFor, SameOptions } from './compare.js';
import type { FormatOptions } from './format.js';
import type { ArithmeticOptions, DiffOptions, PartsFor, RoundOptions, SetOptions, UntilOptions } from './math.js';
import type { RelativeOptions } from './relative.js';
import type { Amount, Bounds, Disambiguation, Duration, Instant, PlainDate, PlainDateTime, Point, TimeUnit, Unit, WallParts, Weekday, WeekRules, ZonedDateTime } from './types.js';
export type DateContextOptions = Readonly<{
    timeZone?: string;
    locale?: string;
    week?: WeekRules;
    clock?: Clock;
}>;
type Settings = Readonly<{
    timeZone: string;
    locale: string;
    week: WeekRules;
    clock: Clock;
}>;
/** Anything a `DateValue` method accepts as "the other moment". */
export type DateLike = DateValue | ZonedDateTime | Instant | Date | string;
/** An immutable moment in a zone with chainable operations. Create one with `date()`. */
export declare class DateValue {
    #private;
    constructor(value: ZonedDateTime, settings: Settings);
    /** The underlying immutable `ZonedDateTime`. */
    value(): ZonedDateTime;
    toInstant(): Instant;
    toPlainDate(): PlainDate;
    toPlainDateTime(): PlainDateTime;
    /** A fresh mutable `Date` at this instant. */
    toDate(): Date;
    toISO(): string;
    toString(): string;
    toJSON(): string;
    /** Numeric coercion is a bug waiting to happen; use `toInstant().epochMilliseconds`. */
    [Symbol.toPrimitive](hint: string): string;
    get timeZoneId(): string;
    get locale(): string;
    get year(): number;
    get month(): number;
    get day(): number;
    get hour(): number;
    get minute(): number;
    get second(): number;
    get epochMilliseconds(): number;
    parts(): WallParts;
    add(amount: Amount | Duration, options?: ArithmeticOptions): DateValue;
    sub(amount: Amount | Duration, options?: ArithmeticOptions): DateValue;
    set(patch: Partial<PartsFor<ZonedDateTime>>, options?: SetOptions): DateValue;
    startOf(unit: Unit): DateValue;
    endOf(unit: Unit): DateValue;
    nextBoundary(unit: Unit): DateValue;
    floor(unit: Unit, options?: RoundOptions): DateValue;
    ceil(unit: Unit, options?: RoundOptions): DateValue;
    round(unit: Unit, options?: RoundOptions): DateValue;
    /** `other − this` in whole units (see `diff`). */
    diff(other: DateLike, unit: Unit, options?: DiffOptions): number;
    until(other: DateLike, options: UntilOptions<ZonedDateTime>): Duration;
    /** Exact elapsed time to `other` (a day is 24 h here). */
    diffElapsed(other: DateLike, unit: TimeUnit | 'day' | 'week', options?: DiffOptions): number;
    equals(other: DateLike): boolean;
    sameInstant(other: DateLike): boolean;
    compare(other: DateLike): -1 | 0 | 1;
    isBefore(other: DateLike): boolean;
    isAfter(other: DateLike): boolean;
    isSameOrBefore(other: DateLike): boolean;
    isSameOrAfter(other: DateLike): boolean;
    isSame(other: DateLike, unit: BucketUnitFor<ZonedDateTime>, options?: SameOptions): boolean;
    isSameDay(other: DateLike): boolean;
    isSameWeek(other: DateLike): boolean;
    isSameMonth(other: DateLike): boolean;
    isSameYear(other: DateLike): boolean;
    isBetween(start: DateLike, end: DateLike, options?: Readonly<{
        bounds?: Bounds;
    }>): boolean;
    clamp(minimum: DateLike, maximum: DateLike): DateValue;
    isToday(): boolean;
    isTomorrow(): boolean;
    isYesterday(): boolean;
    isThisWeek(): boolean;
    isThisMonth(): boolean;
    isThisYear(): boolean;
    isPast(): boolean;
    isFuture(): boolean;
    /** "3 days ago" / "in 2 hours" relative to the context clock. */
    fromNow(options?: RelativeOptions): string;
    dayOfWeek(): Weekday;
    dayOfYear(): number;
    daysInMonth(): number;
    isLeapYear(): boolean;
    isWeekend(weekend?: readonly Weekday[]): boolean;
    isWeekday(weekend?: readonly Weekday[]): boolean;
    isoWeek(): WeekInfo;
    weekOf(rules?: WeekRules): WeekInfo;
    quarter(): 1 | 2 | 3 | 4;
    /** Same instant, another zone. */
    inZone(timeZone: string): DateValue;
    /** Same wall clock, another zone (the instant changes). */
    reinterpretZone(timeZone: string, options?: Readonly<{
        disambiguation?: Disambiguation;
    }>): DateValue;
    toUTC(): DateValue;
    offset(): string;
    isBusinessDay(calendar?: BusinessCalendar): boolean;
    addBusinessDays(count: number, calendar?: BusinessCalendar): DateValue;
    subBusinessDays(count: number, calendar?: BusinessCalendar): DateValue;
    nextBusinessDay(calendar?: BusinessCalendar): DateValue;
    previousBusinessDay(calendar?: BusinessCalendar): DateValue;
    /** Token formatting (`'yyyy-MM-dd HH:mm'`) in the context locale. */
    format(pattern: string, options?: FormatOptions): string;
    /** `Intl.DateTimeFormat` formatting in the context locale. */
    formatIntl(options?: Intl.DateTimeFormatOptions & FormatOptions): string;
    /** "3 days ago" / "in 2 hours" relative to `reference`. */
    relativeTo(reference: DateLike, options?: RelativeOptions): string;
    /** Apply any function to the underlying value; a `ZonedDateTime` result is re-wrapped. */
    pipe<R>(fn: (value: ZonedDateTime) => R): R extends ZonedDateTime ? DateValue : R;
}
/**
 * Wrap a moment for fluent use. A `Date`, `Instant` or offset string is
 * projected into `options.timeZone` (runtime zone by default); a
 * `ZonedDateTime` or `[Zone]`-annotated string keeps its own zone.
 */
export declare function date(input: DateLike, options?: DateContextOptions): DateValue;
/** A `date()` factory with zone, locale, week rules and clock bound once (inject a `MockClock` in tests). */
export type DateContext = Readonly<{
    timeZone: string;
    locale: string;
    week: WeekRules;
    clock: Clock;
    /** The current moment in the context zone. */
    now(): DateValue;
    /** Today's calendar date in the context zone. */
    today(): PlainDate;
    date(input: DateLike): DateValue;
    isToday(value: Point): boolean;
    isPast(value: Instant | ZonedDateTime | Date): boolean;
    isFuture(value: Instant | ZonedDateTime | Date): boolean;
}>;
export declare function createDateContext(options?: DateContextOptions): DateContext;
export {};
//# sourceMappingURL=fluent.d.ts.map