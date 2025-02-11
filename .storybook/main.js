const path = require("path");

module.exports = {
    stories: [
        "./../stories/introduction.mdx",
        "./../stories/changelog.mdx",
        "./../stories/gettingStarted.mdx",
        "./../src/components/**/**/*.stories.tsx",
        "./../src/hooks/**/*.mdx"
    ],
    addons: [
        "@storybook/preset-scss",
        "storybook-dark-mode",
        {
            name: "@storybook/addon-essentials",
            options: {
                backgrounds: true
            }
        },
        "@storybook/addon-a11y",
        "@storybook/addon-jest"
    ],
    staticDirs: ["./public"],
    framework: {
        name: "@storybook/react-webpack5",
        options: {
            fastRefresh: true
        }
    },
    core: {
        builder: "webpack5"
    },
    typescript: {
        reactDocgen: "react-docgen-typescript-plugin"
    },
    webpackFinal: async (config, options) => {
        const aliasPaths = {
            src: "../src/",
            hooks: "../src/hooks/index.ts",
            components: "../src/index.ts",
            stories: "../stories/"
        };

        for (let aliasPath in aliasPaths) {
            config.resolve.alias[aliasPath] = path.resolve(__dirname, aliasPaths[aliasPath]);
        }

        // Hardcode to specify custom babel config file path for storybook
        // as the last one not supporting the babel custom config file path
        const babelLoader = config.module.rules[3].use[0];
        babelLoader.options = {
            ...babelLoader.options,
            babelrc: true,
            configFile: "./.storybook/.babelrc"
        };
        options.cache.set = () => Promise.resolve();

        return config;
    },
    features: {
        previewMdx2: true
    },
    docs: {
        autodocs: true
    }
};
