import { ChangeEvent, SyntheticEvent } from "react";
import { Track } from "@react-input/mask";

// Constants
import { MASK_PLACEHOLDER } from "./constants";

/**
 * @description
 * Builds the `track` callback of the input mask: every inserted character is matched against the
 * rule of the slot it lands in, and the ones that do not fit are dropped, so structurally impossible
 * values can never be typed.
 * @param mask the mask the rules belong to
 * @param slotRules one regular expression per placeholder of the mask, in mask order
 */
export const createMaskTrack =
    (mask: string, slotRules: RegExp[]): Track =>
    ({ inputType, data, selectionStart }) => {
        if (inputType !== "insert") return undefined;

        let slot = mask.slice(0, selectionStart).split(MASK_PLACEHOLDER).length - 1;
        let accepted = "";

        Array.from(data).forEach((char) => {
            if (slot < slotRules.length && slotRules[slot].test(char)) {
                accepted += char;
                slot += 1;
            }
        });

        return accepted || false;
    };

/**
 * @description
 * Merges the consumer localization over the defaults, ignoring empty entries so a partially
 * provided object cannot blank out a label (including the accessible ones).
 */
export const resolveLocalization = <T extends Record<string, string | undefined>>(
    defaults: Required<T>,
    localization?: T
): Required<T> => {
    const resolved: Required<T> = { ...defaults };

    if (!localization) return resolved;

    (Object.keys(localization) as (keyof T)[]).forEach((key) => {
        const text = localization[key];

        if (text) {
            resolved[key] = text as Required<T>[keyof T];
        }
    });

    return resolved;
};

/**
 * @description
 * The event reported for a change without an input event of its own (pick, clear, blur commit):
 * a copy of the triggering event with the input as `target` and the value as `target.value`.
 */
export const toChangeEvent = (
    event: SyntheticEvent,
    input: HTMLInputElement | null,
    value: string
): ChangeEvent<HTMLInputElement> => {
    const target = { name: input?.name ?? "", id: input?.id ?? "", value };

    return Object.assign(Object.create(Object.getPrototypeOf(event)), event, {
        target,
        currentTarget: target
    }) as ChangeEvent<HTMLInputElement>;
};
