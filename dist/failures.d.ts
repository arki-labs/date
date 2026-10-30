/**
 * The expected failures of reading outside input: text that is not a date,
 * a native `Date` that cannot be a calendar date, a time-zone name the
 * runtime does not know. Match on `code` or with `Def.is`, never on the message.
 *
 * Failure data carries no more than the reason, the operation and a bounded
 * copy of the text, so it is safe to log and to send over the wire.
 */
import type { StandardSchemaV1 } from '@arki/schema';
/** The parsing operations that return {@link InvalidDateText}. Written once; the union below comes from it. */
export declare const DATE_TEXT_OPERATIONS: readonly ['parseDate', 'parseDateTime', 'parseZoned', 'parseISO'];
/** Why the text was refused. Written once; the union below comes from it. */
export declare const DATE_TEXT_REASONS: readonly ['no_match', 'trailing_text', 'conflicting_tokens', 'invalid_date', 'invalid_time', 'invalid_wall_time', 'weekday_mismatch', 'offset_out_of_range', 'not_iso'];
/** Why a native `Date` is not a calendar date. */
export declare const NATIVE_DATE_REASONS: readonly ['invalid_date'];
export type DateTextOperation = (typeof DATE_TEXT_OPERATIONS)[number];
export type DateTextReason = (typeof DATE_TEXT_REASONS)[number];
export type NativeDateReason = (typeof NATIVE_DATE_REASONS)[number];
/** The first {@link MAX_INPUT_LENGTH} units of `text`, never ending in half a surrogate pair. */
export declare function boundedInput(text: string): Readonly<{
    input: string;
    truncated: boolean;
}>;
/** The data of {@link InvalidDateText}. */
export type InvalidDateTextData = Readonly<{
    operation: DateTextOperation;
    reason: DateTextReason;
    input: string;
    truncated: boolean;
}>;
/** The data of {@link InvalidNativeDate}. */
export type InvalidNativeDateData = Readonly<{
    reason: NativeDateReason;
}>;
/** The data of {@link UnknownTimeZone}. */
export type UnknownTimeZoneData = Readonly<{
    timeZone: string;
    truncated: boolean;
}>;
/** Text the pattern or ISO reader refused. `data.reason` says why; `data.input` is a bounded copy of the text.
 * @fix Show the user the reason and ask for the text again, or read it with another pattern. A bad pattern is a bug and throws instead.
 * @verify bun run test -- src/parse.test.ts src/iso.test.ts
 */
export declare const InvalidDateText: import("@arki/failure").FailureDefinition<"date.invalid_text", StandardSchemaV1<Readonly<{
    operation: DateTextOperation;
    reason: DateTextReason;
    input: string;
    truncated: boolean;
}>, Readonly<{
    operation: DateTextOperation;
    reason: DateTextReason;
    input: string;
    truncated: boolean;
}>>>;
/** A {@link InvalidDateText} failure value. */
export type InvalidDateText = ReturnType<typeof InvalidDateText>;
/** A native `Date` that holds no calendar date: an Invalid Date (`new Date('nope')`). Every valid `Date` fits a Temporal date.
 * @fix Check the picker or API that built the `Date`. Reject the value or ask for another.
 * @verify bun run test -- src/interop.test.ts
 */
export declare const InvalidNativeDate: import("@arki/failure").FailureDefinition<"date.invalid_native_date", StandardSchemaV1<Readonly<{
    reason: NativeDateReason;
}>, Readonly<{
    reason: NativeDateReason;
}>>>;
/** A {@link InvalidNativeDate} failure value. */
export type InvalidNativeDate = ReturnType<typeof InvalidNativeDate>;
/** A time-zone name the runtime does not know. `data.timeZone` is a bounded copy of the name.
 * @fix Ask for an IANA name such as `Europe/Bucharest` or a fixed offset such as `+02:00`. Check a name first with `isValidTimeZone`.
 * @verify bun run test -- src/parse.test.ts src/interop.test.ts
 */
export declare const UnknownTimeZone: import("@arki/failure").FailureDefinition<"date.unknown_time_zone", StandardSchemaV1<Readonly<{
    timeZone: string;
    truncated: boolean;
}>, Readonly<{
    timeZone: string;
    truncated: boolean;
}>>>;
/** A {@link UnknownTimeZone} failure value. */
export type UnknownTimeZone = ReturnType<typeof UnknownTimeZone>;
/** Builds the failure for unknown zone text. */
export declare function unknownTimeZone(timeZone: string): UnknownTimeZone;
//# sourceMappingURL=failures.d.ts.map