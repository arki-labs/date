import { kindOf } from '../types.js';
/**
 * Returns `result` typed as the same kind as `template`, after checking at
 * runtime that it really is. TypeScript cannot express "a Temporal method
 * returns the receiver's own class" across the `Point` union, so generic
 * helpers (`add`, `startOf`, interval algebra…) funnel their results through
 * this one guarded assertion instead of casting at every call site.
 */
export function sameKind(template, result) {
    const expected = kindOf(template);
    const actual = kindOf(result);
    if (expected !== actual) {
        throw new TypeError(`Expected a ${expected} but the operation produced a ${actual}`);
    }
    return result;
}
export function assertSameKind(a, b, operation) {
    const ka = kindOf(a);
    const kb = kindOf(b);
    if (ka !== kb) {
        throw new TypeError(`${operation} needs two values of the same kind, received ${ka} and ${kb}`);
    }
}
//# sourceMappingURL=kind.js.map