const path = require('path');

module.exports = {
    stories: [
        './../stories/introduction.story.mdx',
        './../stories/changelog.story.mdx',
        './../stories/gettingStarted.story.mdx',
        './../stories/*/**/*.stories.jsx',
        './../stories/*/**/*.stories.mdx'
    ], // '../stories/atoms/*/*.stories.jsx'
    addons: [
        '@storybook/preset-scss',
        'storybook-dark-mode',
        {
            name: '@storybook/addon-essentials',
            options: {
                backgrounds: true // 👈 control addon params
            }
        },
        '@storybook/addon-a11y'
    ],
    framework: '@storybook/react',
    reactOptions: {
        fastRefresh: true
    },
    core: {
        builder: 'webpack5'
    },
    webpackFinal: async (config) => {
        const aliasPaths = {
            src: '../src/',
            utils: '../src/utils',
            lib: '../src/lib/',
            wrappers: '../src/wrappers/index.js',
            configs: '../src/configs.js',
            hooks: '../src/hooks/index.js',
            indexof: '../src/utils/indexof.js'
        };

        for (let aliasPath in aliasPaths) {
            config.resolve.alias[aliasPath] = path.resolve(__dirname, aliasPaths[aliasPath]);
        }
        return config;
    },
    features: {
        previewMdx2: true // 👈 MDX 2 enabled here
    }
};
