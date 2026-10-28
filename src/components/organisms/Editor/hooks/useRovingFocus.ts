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
    const activeControlRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const toolbar = toolbarRef.current;

        if (!toolbar) {
            return undefined;
        }

        const switchActiveControl = (nextActive: HTMLElement | undefined): void => {
            const currentActive = activeControlRef.current;

            if (currentActive === nextActive) {
                return;
            }

            if (currentActive && currentActive.getAttribute("tabindex") !== "-1") {
                currentActive.setAttribute("tabindex", "-1");
            }

            if (nextActive && nextActive.getAttribute("tabindex") !== "0") {
                nextActive.setAttribute("tabindex", "0");
            }

            activeControlRef.current = nextActive ?? null;
        };

        const syncAllTabStops = (): void => {
            const controls = getControls(toolbar);
            const active = getActiveControl(controls);

            controls.forEach((control) => {
                const tabIndex = control === active ? "0" : "-1";

                if (control.getAttribute("tabindex") !== tabIndex) {
                    control.setAttribute("tabindex", tabIndex);
                }
            });

            activeControlRef.current = active ?? null;
        };

        const handleFocusIn = (event: FocusEvent): void => {
            const target = (event.target as HTMLElement).closest<HTMLElement>(CONTROL_SELECTOR);

            if (target && toolbar.contains(target)) {
                switchActiveControl(target);
            }
        };

        syncAllTabStops();

        const observer = new MutationObserver((mutations) => {
            const hasRelevantChange = mutations.some(
                (mutation) =>
                    mutation.type === "childList" ||
                    (mutation.target === activeControlRef.current &&
                        (mutation.target as HTMLElement).hasAttribute("disabled"))
            );

            if (hasRelevantChange || !activeControlRef.current) {
                syncAllTabStops();
            }
        });

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
                const target = activeControlRef.current ?? getActiveControl(getControls(toolbarRef.current));
                target?.focus();
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

        if (event.key === "Escape") {
            if ((event.target as HTMLElement).getAttribute("aria-expanded") !== "true") {
                editor?.commands.focus();
            }

            return;
        }

        const target = (event.target as HTMLElement)?.closest<HTMLElement>(CONTROL_SELECTOR);

        if (!target) {
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
        nextControl.focus();
    };

    return { toolbarRef, handleKeyDown };
};

export default useRovingFocus;
