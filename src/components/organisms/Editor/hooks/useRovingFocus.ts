import { KeyboardEvent as ReactKeyboardEvent, RefObject, useEffect, useRef } from "react";
import type { Editor as TiptapEditor } from "@tiptap/core";

const CONTROL_SELECTOR = "button:not([disabled]), input:not([disabled])";

const TOOLBAR_SHORTCUT_KEY = "F10";

const OBSERVED_MUTATIONS = {
    attributes: true,
    attributeFilter: ["disabled"],
    subtree: true,
    childList: true
};

const getControls = (toolbar: HTMLDivElement | null): HTMLElement[] =>
    Array.from(toolbar?.querySelectorAll<HTMLElement>(CONTROL_SELECTOR) ?? []);

const getActiveControl = (controls: HTMLElement[]): HTMLElement | undefined =>
    controls.find((control) => control.tabIndex === 0) ?? controls[0];

const isCaretAtEdge = (target: HTMLElement, key: string): boolean => {
    if (!(target instanceof HTMLInputElement)) {
        return true;
    }

    const { selectionStart, selectionEnd, value } = target;

    if (selectionStart === null || selectionStart !== selectionEnd) {
        return false;
    }

    return key === "ArrowLeft" ? selectionStart === 0 : selectionStart === value.length;
};

const setTabStop = (controls: HTMLElement[], activeControl?: HTMLElement): void => {
    controls.forEach((control) => {
        const tabIndex = control === activeControl ? "0" : "-1";

        if (control.getAttribute("tabindex") !== tabIndex) {
            control.setAttribute("tabindex", tabIndex);
        }
    });
};

interface IRovingFocus {
    toolbarRef: RefObject<HTMLDivElement>;
    handleKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
}

/**
 * Makes the toolbar a single tab stop, navigated with the left and right arrow keys, as the ARIA
 * `toolbar` pattern expects. `Alt + F10` moves focus from the editing area into the toolbar and
 * `Escape` returns it.
 */
const useRovingFocus = (editor: TiptapEditor | null): IRovingFocus => {
    const toolbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const toolbar = toolbarRef.current;

        if (!toolbar) {
            return undefined;
        }

        const placeTabStop = (): void => {
            const controls = getControls(toolbar);

            setTabStop(controls, getActiveControl(controls));
        };

        const handleFocusIn = (event: FocusEvent): void => {
            const controls = getControls(toolbar);
            const focusedControl = controls.find((control) => control === event.target);

            if (focusedControl) {
                setTabStop(controls, focusedControl);
            }
        };

        placeTabStop();

        const observer = new MutationObserver(placeTabStop);

        observer.observe(toolbar, OBSERVED_MUTATIONS);
        toolbar.addEventListener("focusin", handleFocusIn);

        return () => {
            observer.disconnect();
            toolbar.removeEventListener("focusin", handleFocusIn);
        };
    }, []);

    useEffect(() => {
        const editingArea = editor?.view.dom;

        if (!editingArea) {
            return undefined;
        }

        const handleShortcut = (event: KeyboardEvent): void => {
            const hasOnlyAltKey = event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;

            if (hasOnlyAltKey && event.key === TOOLBAR_SHORTCUT_KEY) {
                event.preventDefault();
                getActiveControl(getControls(toolbarRef.current))?.focus();
            }
        };

        editingArea.addEventListener("keydown", handleShortcut);

        return () => {
            editingArea.removeEventListener("keydown", handleShortcut);
        };
    }, [editor]);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
        if (event.defaultPrevented) {
            return;
        }

        const target = event.target as HTMLElement;

        if (event.key === "Escape") {
            if (target.getAttribute("aria-expanded") !== "true") {
                editor?.commands.focus();
            }

            return;
        }

        const isButton = target instanceof HTMLButtonElement;
        const isNavigationKey =
            event.key === "ArrowRight" ||
            event.key === "ArrowLeft" ||
            (isButton && (event.key === "Home" || event.key === "End"));

        if (!isNavigationKey || !isCaretAtEdge(target, event.key)) {
            return;
        }

        const controls = getControls(toolbarRef.current);
        const index = controls.indexOf(target);

        if (index === -1) {
            return;
        }

        let nextControl: HTMLElement | undefined;

        if (event.key === "ArrowRight") {
            nextControl = controls[(index + 1) % controls.length];
        } else if (event.key === "ArrowLeft") {
            nextControl = controls[(index - 1 + controls.length) % controls.length];
        } else if (event.key === "Home") {
            [nextControl] = controls;
        } else {
            nextControl = controls[controls.length - 1];
        }

        if (!nextControl) {
            return;
        }

        event.preventDefault();
        setTabStop(controls, nextControl);
        nextControl.focus();
    };

    return { toolbarRef, handleKeyDown };
};

export default useRovingFocus;
