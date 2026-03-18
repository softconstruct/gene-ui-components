const OTP_LENGTH = 6;
type OTPIndices = number[];
const OTP_INDICES: OTPIndices = Array.from({ length: OTP_LENGTH }, (_, i) => i);

const DIGIT_PATTERN = /^\d$/;

const helperTextSizeMap = {
    large: "medium",
    medium: "medium"
} as const;

const createEmptyDigits = (): string[] => {
    return Array.from({ length: OTP_LENGTH }, () => "");
};

const normalizeDigitsLength = (digits: string[]): string[] => {
    if (digits.length === OTP_LENGTH) return digits;

    if (digits.length > OTP_LENGTH) {
        return digits.slice(0, OTP_LENGTH);
    }

    return [...digits, ...createEmptyDigits().slice(0, OTP_LENGTH - digits.length)];
};

const stringToDigits = (value: string | number | undefined): string[] => {
    const digits = createEmptyDigits();
    if (value === undefined || value === "") return digits;

    if (typeof value === "number") {
        if (!Number.isInteger(value) || value < 0) return digits;

        const str = String(value);

        for (let i = 0; i < OTP_LENGTH && i < str.length; i += 1) {
            digits[i] = str[i];
        }

        return digits;
    }

    const onlyDigits = value.replace(/\D/g, "");

    for (let i = 0; i < OTP_LENGTH && i < onlyDigits.length; i += 1) {
        digits[i] = onlyDigits[i];
    }

    return digits;
};

const digitsToString = (digits: string[]): string => {
    return digits.join("");
};

export {
    DIGIT_PATTERN,
    OTP_LENGTH,
    OTP_INDICES,
    createEmptyDigits,
    digitsToString,
    helperTextSizeMap,
    normalizeDigitsLength,
    stringToDigits
};
