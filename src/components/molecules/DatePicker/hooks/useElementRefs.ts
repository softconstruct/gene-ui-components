import { useRef } from "react";

/**
 * The elements of a list by key, with one stable callback ref per key, so a memoized item does not
 * re-render because of a new ref.
 */
const useElementRefs = <T extends HTMLElement>() => {
    const elementsRef = useRef(new Map<string, T>());
    const callbacksRef = useRef(new Map<string, (node: T | null) => void>());

    const getRef = (key: string) => {
        let callback = callbacksRef.current.get(key);

        if (!callback) {
            callback = (node: T | null) => {
                if (node) elementsRef.current.set(key, node);
                else elementsRef.current.delete(key);
            };
            callbacksRef.current.set(key, callback);
        }

        return callback;
    };

    return { getRef, get: (key: string) => elementsRef.current.get(key) };
};

export default useElementRefs;
