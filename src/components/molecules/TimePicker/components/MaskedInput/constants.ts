import { IMask } from "react-imask";

/**
 * These define the validation rules for each part of date/time string.
 */
const MASKED_INPUT_DEFAULT_BLOCKS = {
    // Date Blocks
    d: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2 },
    dd: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2 },
    DD: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2 },
    m: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
    mm: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
    MM: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
    Y: { mask: IMask.MaskedRange, from: 1900, to: 2999, maxLength: 4 },
    YYYY: { mask: IMask.MaskedRange, from: 1900, to: 2999, maxLength: 4 },
    YY: { mask: IMask.MaskedRange, from: 0, to: 99, maxLength: 2 },

    // Time Blocks
    H: { mask: IMask.MaskedRange, from: 0, to: 23, maxLength: 2 },
    HH: { mask: IMask.MaskedRange, from: 0, to: 23, maxLength: 2 },
    h: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
    hh: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
    M: { mask: IMask.MaskedRange, from: 0, to: 59, maxLength: 2 },
    mm_time: { mask: IMask.MaskedRange, from: 0, to: 59, maxLength: 2 },
    s: { mask: IMask.MaskedRange, from: 0, to: 59, maxLength: 2 },
    ss: { mask: IMask.MaskedRange, from: 0, to: 59, maxLength: 2 }
};

export default MASKED_INPUT_DEFAULT_BLOCKS;
