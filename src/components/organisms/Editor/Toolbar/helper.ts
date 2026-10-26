import { EDITOR_COLORS, NO_COLOR, PRESET_COLOR_COUNT } from "./constants";
import { IMenuTriggerItem } from "./MenuTrigger/MenuTrigger";
import { IToolbarAction, IToolbarState } from "./types";

const HREF_PATTERN = /^([a-z][a-z\d+.-]*:|[/#?])/i;

const RELATIVE_HREF_PATTERN = /^[/#?]/;

const SAFE_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

const parseFontSize = (fontSize?: string): number | undefined =>
    fontSize?.endsWith("px") ? Math.round(Number.parseFloat(fontSize)) : undefined;

const parseFontFamily = (fontFamily: string): string =>
    fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase();

const toHref = (value: string): string => (HREF_PATTERN.test(value) ? value : `https://${value}`);

const isSafeHref = (value: string): boolean => {
    const href = toHref(value);

    if (RELATIVE_HREF_PATTERN.test(href)) {
        return true;
    }

    try {
        return SAFE_PROTOCOLS.includes(new URL(href).protocol);
    } catch {
        return false;
    }
};

const toPresetColors = (customColors: string[] = []): string[] =>
    [NO_COLOR, ...customColors, ...EDITOR_COLORS].slice(0, PRESET_COLOR_COUNT);

const toMenuItems = (actions: IToolbarAction[], state: IToolbarState | null): IMenuTriggerItem[] =>
    actions.map(({ id, label, Icon, isActive }) => ({
        id,
        label,
        Icon,
        selected: state ? isActive(state) : false
    }));

export { parseFontSize, parseFontFamily, toHref, isSafeHref, toPresetColors, toMenuItems };
