/** Insert-ordered bounded memo: when `limit` is reached the oldest entry is dropped. */
export function remember(cache, key, limit, create) {
    const hit = cache.get(key);
    if (hit !== undefined)
        return hit;
    const created = create();
    if (cache.size >= limit) {
        const oldest = cache.keys().next();
        if (oldest.done !== true)
            cache.delete(oldest.value);
    }
    cache.set(key, created);
    return created;
}
//# sourceMappingURL=cache.js.map