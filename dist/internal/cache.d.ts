/** Insert-ordered bounded memo: when `limit` is reached the oldest entry is dropped. */
export declare function remember<V>(cache: Map<string, V>, key: string, limit: number, create: () => V): V;
//# sourceMappingURL=cache.d.ts.map