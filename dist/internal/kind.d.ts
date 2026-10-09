import type { Point } from '../types.js';
/**
 * Returns `result` typed as the same kind as `template`, after checking at
 * runtime that it really is. TypeScript cannot express "a Temporal method
 * returns the receiver's own class" across the `Point` union, so generic
 * helpers (`add`, `startOf`, interval algebra…) funnel their results through
 * this one guarded assertion instead of casting at every call site.
 */
export declare function sameKind<T extends Point>(template: T, result: Point): T;
export declare function assertSameKind(a: Point, b: Point, operation: string): void;
//# sourceMappingURL=kind.d.ts.map