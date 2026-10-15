import { EDITOR_COLORS, NO_COLOR, PRESET_COLOR_COUNT } from "./constants";
import { IMenuTriggerItem } from "./MenuTrigger/MenuTrigger";
import { IToolbarAction, IToolbarState } from "./types";

const HREF_PATTERN = /^([a-z][a-z\d+.-]*:|[/#?])/i;

const parseFontSize = (fontSize?: string): number | undefined =>
    fontSize?.endsWith("px") ? Math.round(Number.parseFloat(fontSize)) : undefined;

const parseFontFamily = (fontFamily: string): string =>
    fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase();

const toHref = (value: string): string => (HREF_PATTERN.test(value) ? value : `https://${value}`);

const toPresetColors = (customColors: string[] = []): string[] =>
    [NO_COLOR, ...customColors, ...EDITOR_COLORS].slice(0, PRESET_COLOR_COUNT);

const toMenuItems = (actions: IToolbarAction[], state: IToolbarState | null): IMenuTriggerItem[] =>
    actions.map(({ id, label, Icon, divider, isActive }) => ({
        id,
        label,
        Icon,
        divider,
        selected: state ? isActive(state) : false
    }));

export { parseFontSize, parseFontFamily, toHref, toPresetColors, toMenuItems };
