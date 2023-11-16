import { date } from '@storybook/addon-knobs';

function dateKnob(name, defaultValue) {
    const stringTimestamp = date(name, defaultValue);
    return new Date(stringTimestamp);
}

export { dateKnob };
