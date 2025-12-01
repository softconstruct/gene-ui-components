import { ChangeEvent } from "react";

export const allowOnlyDigits = (event: ChangeEvent<HTMLInputElement>): boolean => {
    const currentValue = event.target.value;
    return /^\d*$/.test(currentValue);
};
