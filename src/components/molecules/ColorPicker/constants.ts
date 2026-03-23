import { RGB } from "@components/molecules/ColorPicker/types";

const ALPHA_SCALE_MAX = 100;
const RGB_CHANNELS: (keyof RGB)[] = ["r", "g", "b"];

export { RGB_CHANNELS, ALPHA_SCALE_MAX };
