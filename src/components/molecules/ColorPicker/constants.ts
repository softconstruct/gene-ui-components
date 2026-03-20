import { RGB, RGBA } from "@components/molecules/ColorPicker/types";

const DEFAULT_RGBA: RGBA = {
    r: 170,
    g: 187,
    b: 204,
    a: 1
};

const ALPHA_SCALE_MAX = 100;
const RGB_CHANNELS: (keyof RGB)[] = ["r", "g", "b"];

export { RGB_CHANNELS, ALPHA_SCALE_MAX, DEFAULT_RGBA };
