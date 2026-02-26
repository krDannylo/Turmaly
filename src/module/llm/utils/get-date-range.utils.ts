export function getDayRange(offset: number) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + offset);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return { start, end };
}