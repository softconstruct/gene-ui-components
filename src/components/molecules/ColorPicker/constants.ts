import { RGB, RGBA } from "@components/molecules/ColorPicker/types";
import { IDropdownOption } from "@components/molecules/Dropdown/types";

const ALPHA_SCALE_MAX = 100;
const RGB_CHANNELS: (keyof RGB)[] = ["r", "g", "b"];

/**
 * Default empty RGBA state used when resetting or clearing color selection
 */
const EMPTY_RGBA: RGBA = { r: "", g: "", b: "", a: 1 };

const FORMAT_OPTIONS: IDropdownOption[] = [
    { id: "rgb", label: "RGB", value: "rgb" },
    { id: "hex", label: "HEX", value: "hex" }
];

export { RGB_CHANNELS, ALPHA_SCALE_MAX, EMPTY_RGBA, FORMAT_OPTIONS };
