/**
 * Pattern parsing: the inverse of `format`. `parseDate`, `parseDateTime` and
 * `parseZoned` read text laid out by a Unicode LDML pattern (the date-fns v4
 * token subset below) and return a Temporal value; the `tryParse…` doors
 * return `undefined` for text that does not match.
 *
 * Policies (one for the whole package):
 * - Round trip: for every supported token, `parseX(format(value, p), p)`
 *   equals `value`. Word tokens (month, weekday, AM/PM) are matched,
 *   case-insensitively, against the exact words `format` prints for the
 *   locale, so the two can never drift apart.
 * - Supported tokens: `y` `yy` `yyy` `yyyy`, `M`…`MMMM`, `L`…`LLLL`, `d` `dd`,
 *   `D` `DDD` (day of year, only without month/day tokens), `E`…`EEEE`,
 *   `i`…`iiii`, `H` `HH`, `h` `hh`, `K` `KK`, `k` `kk`, `a`…`aaaa`, `m` `mm`,
 *   `s` `ss`, `S`…`SSSSSSSSS`, `X`…`XXX`, `x`…`xxx`, `'quoted text'` (`''` is
 *   a quote) and any non-letter as itself. Single-letter numeric tokens read
 *   1-2 digits, doubled ones exactly 2. `y` reads 1+ digits with an optional
 *   sign (an ISO year), `yy` is 2000-2099, `yyy` 3+ digits, `yyyy` exactly 4.
 *   Ordinals (`do`, `Mo`…), quarters, eras, week-numbering, zone names and the
 *   `P`/`p` presets are not parsed: they throw like any unknown letter.
 * - Fail loud with a `RangeError` whose message starts with the function name:
 *   text the pattern does not account for (missing or leftover text, with its
 *   position), an unknown word, an invalid date or time (Feb 30, hour 24,
 *   minute 60 — values are built with `overflow: 'reject'`), a weekday that
 *   does not match the date, two tokens that disagree, `h`/`K` without an
 *   AM/PM token, and an unsupported pattern letter.
 * - `parseDate` needs a year plus month and day (or a day of year). Time
 *   tokens are read and validated, then dropped. `parseDateTime` fills missing
 *   time fields with zero. Both refuse offset tokens: an offset names an exact
 *   instant, so use `parseZoned`, which shows that instant in the given zone.
 *   Without an offset, `parseZoned` resolves the wall clock in the zone with
 *   `disambiguation` (default `'compatible'`, as `zoned` does).
 * - `tryParse…` returns `undefined` only when the text is wrong. A bad
 *   pattern or time zone is a programming error and still throws.
 * - Default locale is `'en-US'`.
 */
import { format } from './format.js';
import { Temporal } from './types.js';
import { isValidTimeZone } from './zone.js';
const DEFAULT_LOCALE = 'en-US';
// ---------------------------------------------------------------------------
// matchers
function assign(fields, field, value, operation, token) {
    const previous = fields[field];
    if (previous !== undefined && previous !== value) {
        throw new RangeError(`${operation}: "${token}" reads ${field} ${value}, which conflicts with ${previous} read earlier`);
    }
    fields[field] = value;
}
/** Text matching the regular expression `source` at the current position. */
function regex(source, expected, apply) {
    const sticky = new RegExp(source, 'y');
    return {
        expected,
        read: (text, at, fields) => {
            sticky.lastIndex = at;
            const match = sticky.exec(text);
            if (match === null)
                return;
            apply(match[0], fields);
            return at + match[0].length;
        },
    };
}
function digits(source, expected, field, operation, token, map = value => value) {
    return regex(source, `${expected} for "${token}"`, (match, fields) => {
        assign(fields, field, map(Number(match)), operation, token);
    });
}
/** 1-2 digits for a single letter, exactly 2 for a doubled one. */
function oneOrTwo(token, what, field, operation) {
    return token.length === 1
        ? digits(String.raw `\d{1,2}`, `a 1-2 digit ${what}`, field, operation, token)
        : digits(String.raw `\d{2}`, `a 2-digit ${what}`, field, operation, token);
}
/** One of `words` (case-insensitive, longest first so a prefix never wins). */
function words(entries, expected, field, operation, token, locale) {
    const candidates = entries
        .map(([word, value]) => [word.toLocaleLowerCase(locale), value])
        .toSorted((left, right) => right[0].length - left[0].length);
    return {
        expected: `${expected} for "${token}"`,
        read: (text, at, fields) => {
            for (const [word, value] of candidates) {
                if (text.slice(at, at + word.length).toLocaleLowerCase(locale) === word) {
                    assign(fields, field, value, operation, token);
                    return at + word.length;
                }
            }
            return;
        },
    };
}
function literal(text) {
    return {
        expected: JSON.stringify(text),
        read: (input, at) => (input.startsWith(text, at) ? at + text.length : undefined),
    };
}
function range(from, to) {
    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}
/** The words `format` prints for `token`, so parsing accepts exactly what formatting produces. */
function monthWords(token, locale) {
    return range(1, 12).map(month => [
        format(Temporal.PlainDate.from({ year: 2000, month, day: 1 }), token, { locale }),
        month,
    ]);
}
/** ISO weekdays: 2000-01-03 was a Monday. */
function weekdayWords(token, locale) {
    return range(1, 7).map(weekday => [
        format(Temporal.PlainDate.from({ year: 2000, month: 1, day: 2 + weekday }), token, { locale }),
        weekday,
    ]);
}
function periodWords(token, locale) {
    return [0, 1].map(period => [
        format(Temporal.PlainDateTime.from({ year: 2000, month: 1, day: 1, hour: period === 0 ? 9 : 15 }), token, {
            locale,
        }),
        period,
    ]);
}
const OFFSET_SOURCES = {
    1: String.raw `[+-]\d{2}(?:\d{2})?`,
    2: String.raw `[+-]\d{4}`,
    3: String.raw `[+-]\d{2}:\d{2}`,
};
function offsetMatcher(token, operation) {
    const source = OFFSET_SOURCES[token.length];
    if (source === undefined)
        return undefined;
    const allowsZ = token.charAt(0) === 'X';
    const shape = token.length === 3 ? '+02:00' : token.length === 2 ? '+0200' : '+02';
    return regex(allowsZ ? `Z|${source}` : source, `an offset like ${shape}${allowsZ ? ' or Z' : ''} for "${token}"`, (match, fields) => {
        if (match === 'Z') {
            assign(fields, 'offset', 0, operation, token);
            return;
        }
        const numbers = match.slice(1).replace(':', '');
        const hours = Number(numbers.slice(0, 2));
        const minutes = numbers.length > 2 ? Number(numbers.slice(2)) : 0;
        if (hours > 23 || minutes > 59)
            throw new RangeError(`${operation}: offset "${match}" is out of range`);
        assign(fields, 'offset', (match.startsWith('-') ? -1 : 1) * (hours * 60 + minutes), operation, token);
    });
}
function yearMatcher(token, operation) {
    switch (token.length) {
        case 1: {
            return digits(String.raw `[+-]?\d+`, 'a year', 'year', operation, token);
        }
        case 2: {
            return digits(String.raw `\d{2}`, 'a 2-digit year', 'year', operation, token, value => 2000 + value);
        }
        case 3: {
            return digits(String.raw `\d{3,}`, 'a year of 3+ digits', 'year', operation, token);
        }
        default: {
            return digits(String.raw `\d{${token.length}}`, `a ${token.length}-digit year`, 'year', operation, token);
        }
    }
}
function tokenMatcher(token, operation, locale) {
    const length = token.length;
    switch (token.charAt(0)) {
        case 'y': {
            return yearMatcher(token, operation);
        }
        case 'M':
        case 'L': {
            if (length <= 2)
                return oneOrTwo(token, 'month', 'month', operation);
            if (length <= 4)
                return words(monthWords(token, locale), 'a month name', 'month', operation, token, locale);
            return undefined;
        }
        case 'd': {
            return length <= 2 ? oneOrTwo(token, 'day', 'day', operation) : undefined;
        }
        case 'D': {
            if (length === 1)
                return digits(String.raw `\d{1,3}`, 'a 1-3 digit day of year', 'dayOfYear', operation, token);
            if (length === 3)
                return digits(String.raw `\d{3}`, 'a 3-digit day of year', 'dayOfYear', operation, token);
            return undefined;
        }
        case 'E': {
            return length <= 4
                ? words(weekdayWords(token, locale), 'a weekday name', 'weekday', operation, token, locale)
                : undefined;
        }
        case 'i': {
            if (length <= 2)
                return oneOrTwo(token, 'weekday number', 'weekday', operation);
            return length <= 4
                ? words(weekdayWords(token, locale), 'a weekday name', 'weekday', operation, token, locale)
                : undefined;
        }
        case 'a': {
            return length <= 4
                ? words(periodWords(token, locale), 'AM or PM', 'period', operation, token, locale)
                : undefined;
        }
        case 'H': {
            return length <= 2 ? oneOrTwo(token, 'hour', 'hour', operation) : undefined;
        }
        case 'k': {
            return length <= 2 ? oneOrTwo(token, 'hour', 'hour24', operation) : undefined;
        }
        case 'h': {
            return length <= 2 ? oneOrTwo(token, 'hour', 'hour12', operation) : undefined;
        }
        case 'K': {
            return length <= 2 ? oneOrTwo(token, 'hour', 'hour11', operation) : undefined;
        }
        case 'm': {
            return length <= 2 ? oneOrTwo(token, 'minute', 'minute', operation) : undefined;
        }
        case 's': {
            return length <= 2 ? oneOrTwo(token, 'second', 'second', operation) : undefined;
        }
        case 'S': {
            if (length > 9)
                return undefined;
            // Right-padded to nanoseconds: "5" for "S" is 500 ms.
            return regex(String.raw `\d{${length}}`, `${length} fraction digit(s) for "${token}"`, (match, fields) => {
                assign(fields, 'fraction', Number(match.padEnd(9, '0')), operation, token);
            });
        }
        case 'X':
        case 'x': {
            return offsetMatcher(token, operation);
        }
        default: {
            return undefined;
        }
    }
}
// ---------------------------------------------------------------------------
// pattern compilation (same tokenizer grammar as `format`)
const TOKENS = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(?:''|[^'])+(?:'|$)|./g;
const ESCAPED = /^'([\s\S]*?)'?$/;
const DOUBLE_QUOTE = /''/g;
const LATIN_LETTER = /[a-z]/i;
function unquote(chunk) {
    const inner = ESCAPED.exec(chunk);
    return (inner?.[1] ?? chunk).replaceAll(DOUBLE_QUOTE, "'");
}
function compile(operation, pattern, options) {
    const locale = options?.locale ?? DEFAULT_LOCALE;
    const matchers = [];
    const letters = new Set();
    for (const chunk of pattern.match(TOKENS) ?? []) {
        if (chunk === "''") {
            matchers.push(literal("'"));
        }
        else if (chunk.startsWith("'")) {
            matchers.push(literal(unquote(chunk)));
        }
        else if (LATIN_LETTER.test(chunk.charAt(0))) {
            // Ordinal forms (`do`, `Mo`, …) are not parsed.
            const matcher = chunk.endsWith('o') ? undefined : tokenMatcher(chunk, operation, locale);
            if (matcher === undefined) {
                throw new RangeError(`${operation}: unsupported pattern token "${chunk}"; wrap literal text in single quotes`);
            }
            matchers.push(matcher);
            letters.add(chunk.charAt(0));
        }
        else {
            matchers.push(literal(chunk));
        }
    }
    const plan = { operation, pattern, matchers, letters };
    checkPattern(plan);
    return plan;
}
function has(plan, ...letters) {
    return letters.some(letter => plan.letters.has(letter));
}
function checkPattern(plan) {
    const { operation, pattern } = plan;
    if (!has(plan, 'y'))
        throw new RangeError(`${operation}: pattern "${pattern}" has no year token (y)`);
    if (has(plan, 'D')) {
        if (has(plan, 'M', 'L', 'd')) {
            throw new RangeError(`${operation}: pattern "${pattern}" mixes day of year (D) with month or day tokens`);
        }
    }
    else {
        if (!has(plan, 'M', 'L'))
            throw new RangeError(`${operation}: pattern "${pattern}" has no month token (M or L)`);
        if (!has(plan, 'd'))
            throw new RangeError(`${operation}: pattern "${pattern}" has no day token (d)`);
    }
    if (has(plan, 'h', 'K') && !has(plan, 'a')) {
        throw new RangeError(`${operation}: pattern "${pattern}" uses a 12-hour token (h or K) without an AM/PM token (a)`);
    }
    if (operation !== 'parseZoned' && has(plan, 'X', 'x')) {
        throw new RangeError(`${operation}: pattern "${pattern}" has an offset token, which names an exact instant; use parseZoned`);
    }
}
// ---------------------------------------------------------------------------
// reading and building
function readFields(plan, text) {
    const fields = {};
    let at = 0;
    for (const matcher of plan.matchers) {
        const next = matcher.read(text, at, fields);
        if (next === undefined) {
            throw new RangeError(`${plan.operation}: expected ${matcher.expected} at position ${at} of "${text}" (pattern "${plan.pattern}")`);
        }
        at = next;
    }
    if (at < text.length) {
        throw new RangeError(`${plan.operation}: unexpected text "${text.slice(at)}" at position ${at} of "${text}" (pattern "${plan.pattern}")`);
    }
    return fields;
}
/** Runs a Temporal constructor and prefixes its `RangeError` with the operation name. */
function build(operation, what, construct) {
    try {
        return construct();
    }
    catch (error) {
        if (error instanceof RangeError)
            throw new RangeError(`${operation}: ${what} is invalid`, { cause: error });
        throw error;
    }
}
function two(value) {
    return String(value).padStart(2, '0');
}
function toDate(plan, fields) {
    const { operation } = plan;
    const { year = 0, dayOfYear } = fields;
    let date;
    if (dayOfYear === undefined) {
        const { month = 0, day = 0 } = fields;
        date = build(operation, `date ${year}-${two(month)}-${two(day)}`, () => Temporal.PlainDate.from({ year, month, day }, { overflow: 'reject' }));
    }
    else {
        const first = build(operation, `year ${year}`, () => Temporal.PlainDate.from({ year, month: 1, day: 1 }, { overflow: 'reject' }));
        if (dayOfYear < 1 || dayOfYear > first.daysInYear) {
            throw new RangeError(`${operation}: day of year ${dayOfYear} is out of range for ${year} (1-${first.daysInYear})`);
        }
        date = first.add({ days: dayOfYear - 1 });
    }
    if (fields.weekday !== undefined && fields.weekday !== date.dayOfWeek) {
        throw new RangeError(`${operation}: weekday ${fields.weekday} does not match ${date.toString()}, which is weekday ${date.dayOfWeek} (1 = Monday)`);
    }
    return date;
}
/** The 0-23 hour each hour token implies; every one present must agree. */
function hourOf(plan, fields) {
    const { operation } = plan;
    const { hour, hour24, hour12, hour11, period } = fields;
    const pm = period === 1;
    const readings = [];
    if (hour !== undefined)
        readings.push(hour);
    if (hour24 !== undefined) {
        if (hour24 < 1 || hour24 > 24)
            throw new RangeError(`${operation}: hour ${hour24} is out of range for "k" (1-24)`);
        readings.push(hour24 % 24);
    }
    if (hour12 !== undefined) {
        if (hour12 < 1 || hour12 > 12)
            throw new RangeError(`${operation}: hour ${hour12} is out of range for "h" (1-12)`);
        readings.push((hour12 % 12) + (pm ? 12 : 0));
    }
    if (hour11 !== undefined) {
        if (hour11 > 11)
            throw new RangeError(`${operation}: hour ${hour11} is out of range for "K" (0-11)`);
        readings.push(hour11 + (pm ? 12 : 0));
    }
    const [first = 0] = readings;
    if (readings.some(reading => reading !== first) || (period !== undefined && first >= 12 !== pm)) {
        throw new RangeError(`${operation}: the hour and AM/PM tokens disagree in pattern "${plan.pattern}"`);
    }
    return first;
}
function toTime(plan, fields) {
    const hour = hourOf(plan, fields);
    const { minute = 0, second = 0, fraction = 0 } = fields;
    return build(plan.operation, `time ${two(hour)}:${two(minute)}:${two(second)}`, () => Temporal.PlainTime.from({
        hour,
        minute,
        second,
        millisecond: Math.trunc(fraction / 1_000_000),
        microsecond: Math.trunc(fraction / 1000) % 1000,
        nanosecond: fraction % 1000,
    }, { overflow: 'reject' }));
}
function toDateTime(plan, fields) {
    return toDate(plan, fields).toPlainDateTime(toTime(plan, fields));
}
function offsetId(minutes) {
    const absolute = Math.abs(minutes);
    return `${minutes < 0 ? '-' : '+'}${two(Math.trunc(absolute / 60))}:${two(absolute % 60)}`;
}
function toZoned(plan, fields, timeZone, options) {
    const wall = toDateTime(plan, fields);
    if (fields.offset !== undefined)
        return wall.toZonedDateTime(offsetId(fields.offset)).withTimeZone(timeZone);
    return build(plan.operation, `wall time ${wall.toString()} in ${timeZone}`, () => wall.toZonedDateTime(timeZone, { disambiguation: options?.disambiguation ?? 'compatible' }));
}
function zonedPlan(pattern, timeZone, options) {
    if (!isValidTimeZone(timeZone))
        throw new RangeError(`parseZoned: unknown time zone "${timeZone}"`);
    return compile('parseZoned', pattern, options);
}
/** `undefined` for text errors only; pattern errors are raised before `read` runs. */
function attempt(read) {
    try {
        return read();
    }
    catch (error) {
        if (error instanceof RangeError)
            return undefined;
        throw error;
    }
}
// ---------------------------------------------------------------------------
// public API
/**
 * A calendar date read from `text` laid out by `pattern`, e.g.
 * `parseDate('Mar 5, 2026', 'MMM d, yyyy')`. The pattern needs a year and a
 * month + day (or a day of year `D`). Time tokens are read, validated and
 * dropped; offset tokens are refused (use `parseZoned`).
 */
export function parseDate(text, pattern, options) {
    const plan = compile('parseDate', pattern, options);
    const fields = readFields(plan, text);
    toTime(plan, fields);
    return toDate(plan, fields);
}
/**
 * A wall-clock date and time read from `text` laid out by `pattern`, e.g.
 * `parseDateTime('03/05/2026 9:30 PM', 'MM/dd/yyyy h:mm a')`. Missing time
 * fields are zero; offset tokens are refused (use `parseZoned`).
 */
export function parseDateTime(text, pattern, options) {
    const plan = compile('parseDateTime', pattern, options);
    const fields = readFields(plan, text);
    return toDateTime(plan, fields);
}
/**
 * A moment in `timeZone` read from `text` laid out by `pattern`. With an
 * offset token (`X`, `x`…) the text names an exact instant, which is shown in
 * `timeZone`. Without one, the text is a wall-clock time in `timeZone`;
 * skipped or repeated times resolve with `disambiguation` (default `'compatible'`).
 */
export function parseZoned(text, pattern, timeZone, options) {
    const plan = zonedPlan(pattern, timeZone, options);
    const fields = readFields(plan, text);
    return toZoned(plan, fields, timeZone, options);
}
/** `parseDate` that returns `undefined` when the text does not match. A bad pattern still throws. */
export function tryParseDate(text, pattern, options) {
    const plan = compile('parseDate', pattern, options);
    return attempt(() => {
        const fields = readFields(plan, text);
        toTime(plan, fields);
        return toDate(plan, fields);
    });
}
/** `parseDateTime` that returns `undefined` when the text does not match. A bad pattern still throws. */
export function tryParseDateTime(text, pattern, options) {
    const plan = compile('parseDateTime', pattern, options);
    return attempt(() => toDateTime(plan, readFields(plan, text)));
}
/**
 * `parseZoned` that returns `undefined` when the text does not match or names
 * a wall time that `disambiguation: 'reject'` refuses. A bad pattern or time zone still throws.
 */
export function tryParseZoned(text, pattern, timeZone, options) {
    const plan = zonedPlan(pattern, timeZone, options);
    return attempt(() => toZoned(plan, readFields(plan, text), timeZone, options));
}
//# sourceMappingURL=parse.js.map