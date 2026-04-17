const generateRange = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString().padStart(2, "0"));

const composeTime = (p: Record<string, string | undefined>, is12Hours: boolean) => {
    const hh = p.hours ?? "00";
    const mm = p.minutes ?? "00";
    const ss = p.seconds ?? "00";
    const meridiem = is12Hours && p.meridiem ? p.meridiem : "";
    return `${hh}:${mm}:${ss} ${meridiem}`;
};

export { generateRange, composeTime };
