import { useState } from "react";

/**
 * The state every picker field shares: the committed value (the `value` prop when controlled) and
 * the text typed since the field was last left, picked from or cleared.
 */
const usePickerFieldState = (value?: string | null, defaultValue?: string | null) => {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
    const [draftValue, setDraftValue] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    return {
        isControlled,
        committedValue: isControlled ? (value ?? null) : internalValue,
        draftValue: isEditing ? draftValue : null,
        isEditing,
        setInternalValue,
        setValue: (nextValue: string | null) => {
            if (!isControlled) setInternalValue(nextValue);
        },
        setDraftValue,
        setIsEditing: (editing: boolean) => {
            setIsEditing(editing);
            if (!editing) setDraftValue(null);
        }
    };
};

export default usePickerFieldState;
