const DIGIT_PATTERN = /^\d$/;

const helperTextSizeMap = {
    large: "medium",
    medium: "medium"
} as const;

const createEmptyDigits = (length: number): string[] => {
    return Array.from({ length }, () => "");
};

const normalizeDigitsLength = (digits: string[], length: number): string[] => {
    if (digits.length === length) return digits;

    if (digits.length > length) {
        return digits.slice(0, length);
    }

    return [...digits, ...createEmptyDigits(length - digits.length)];
};

const stringToDigits = (value: string | number | undefined, length: number): string[] => {
    const digits = createEmptyDigits(length);
    if (value === undefined || value === "") return digits;

    if (typeof value === "number") {
        if (!Number.isInteger(value) || value < 0) return digits;

        const str = String(value);

        for (let i = 0; i < length && i < str.length; i += 1) {
            digits[i] = str[i];
        }

        return digits;
    }

    const onlyDigits = value.replace(/\D/g, "");

    for (let i = 0; i < length && i < onlyDigits.length; i += 1) {
        digits[i] = onlyDigits[i];
    }

    return digits;
};

const digitsToString = (digits: string[]): string => {
    return digits.join("");
};

export { DIGIT_PATTERN, createEmptyDigits, digitsToString, helperTextSizeMap, normalizeDigitsLength, stringToDigits };
