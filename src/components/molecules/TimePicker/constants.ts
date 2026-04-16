import { generateRange } from "@components/molecules/TimePicker/helpers";

const HOURS_24 = generateRange(0, 23);
const HOURS_12 = generateRange(1, 12);
const MINUTES = generateRange(0, 59);
const SECONDS = generateRange(0, 59);

export { HOURS_24, HOURS_12, MINUTES, SECONDS };
