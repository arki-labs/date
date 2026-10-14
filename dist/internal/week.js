/** The first day of the week containing `date` under `rules`. */
export function startOfWeekDate(date, rules) {
    const back = (date.dayOfWeek - rules.startsOn + 7) % 7;
    return back === 0 ? date : date.subtract({ days: back });
}
//# sourceMappingURL=week.js.map