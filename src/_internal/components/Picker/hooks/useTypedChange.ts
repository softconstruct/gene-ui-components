import { useEffect, useRef } from "react";

// Hooks
import useDebouncedCallback from "@hooks/useDebounceCallback";

// Constants
import { INPUT_CHANGE_DEBOUNCE_MS } from "../constants";

/**
 * Reports typed text through `onChange` after a pause, or at once when the field is left.
 */
const useTypedChange = <TPayload>(emit: (payload: TPayload) => void) => {
    const pendingRef = useRef<TPayload | null>(null);
    // The delayed report runs from the render the text was typed in; it calls the handler of the latest one.
    const emitRef = useRef(emit);

    emitRef.current = emit;

    const emitPending = () => {
        const pending = pendingRef.current;
        pendingRef.current = null;

        if (pending) {
            emitRef.current(pending);
        }
    };

    const { debouncedCallback: emitLater, clearDebounce } = useDebouncedCallback(emitPending, INPUT_CHANGE_DEBOUNCE_MS);

    useEffect(() => clearDebounce, [clearDebounce]);

    return {
        report: (payload: TPayload) => {
            pendingRef.current = payload;
            emitLater();
        },
        flush: () => {
            clearDebounce();
            emitPending();
        }
    };
};

export default useTypedChange;
