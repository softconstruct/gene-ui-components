import logo from './assets/logo.svg';
const colorPrimary = `#E90789`;

//for all theming adjustable features visit -> https://storybook.js.org/docs/react/configure/theming
const baseConfig = {
    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    brandTitle: 'Gene UI by SoftConstruct',
    barSelectedColor: colorPrimary,
    colorSecondary: colorPrimary,
    brandImage: logo
};

export const softConstructThem = {
    dark: { ...baseConfig },
    light: { ...baseConfig }
};
