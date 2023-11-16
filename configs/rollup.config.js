import { resolve as resolvePath } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';

// import url from 'postcss-url';
import postcss from 'rollup-plugin-postcss';
import prefixSelector from 'postcss-prefix-selector';
import autoprefixer from 'autoprefixer';
import { getDirectories, getFiles } from '../scripts/utils';
// import scss from 'rollup-plugin-scss';

const packageJson = require('../package.json');
// console.log('🚀 ~ file: rollup.config.js ~ line 103 ~ packageJson', packageJson);

const getInputs = (name, dir) => {
    const inputs = getDirectories(dir).reduce((obj, item) => {
        const [name] = item.split('/').reverse();
        return {
            ...obj,
            [name]: `${item}/index.js`
        };
    }, {});

    return {
        ...inputs
    };
};

const scriptsInputs = Object.entries({
    atoms: 'src/lib/atoms',
    molecules: 'src/lib/molecules',
    organisms: 'src/lib/organisms',
    providers: 'src/lib/providers'
}).reduce((obj, entry) => ({ ...obj, ...getInputs(...entry) }), {});

const getFormableInputs = (name, dir) =>
    getFiles(dir).reduce((obj, item) => {
        const [name] = item.split('/').reverse();
        const [nameWithoutExt] = name.split('.');
        return {
            ...obj,
            [nameWithoutExt]: item
        };
    }, {});

const formableInputs = Object.entries({
    formables: 'src/lib/organisms/Form/Formables',
    validatable: 'src/lib/molecules/ValidatableElements/Elements'
}).reduce((obj, entry) => ({ ...obj, ...getFormableInputs(...entry) }), {});

export default {
    input: {
        ...scriptsInputs,
        ...formableInputs,
        index: 'src/index.js',
        configs: 'src/configs.js'
    },
    output: [
        {
            dir: 'dist',
            format: 'esm',
            entryFileNames: '[name].js',
            exports: 'named'
        }
    ],
    external: ['react', 'react-dom'],
    plugins: [
        // peerDepsExternal({
        //     packageJsonPath: resolvePath(__dirname, '../package.json'),
        //     includeDependencies: false
        // }),
        alias({
            entries: {
                src: 'src',
                utils: 'src/utils/index.js',
                wrappers: 'src/wrappers/index.js',
                configs: 'src/configs.js',
                hooks: 'src/hooks/index.js',
                indexof: 'src/utils/indexof.js'
            }
        }),
        resolve(),
        babel({
            babelHelpers: 'bundled',
            babelrc: true,
            configFile: resolvePath(__dirname, '.babelrc'),
            extensions: ['.js'],
            exclude: 'node_modules/**'
        }),
        image(),
        commonjs({
            sourceMap: true
        }),
        json(),
        postcss({
            inject: true,
            minimize: true,
            use: ['sass'],
            plugins: [
                autoprefixer,
                prefixSelector({
                    prefix: `[data-gene-ui-version="${packageJson.version}"]`,
                    // to prevent global styles isolation
                    exclude: [new RegExp(/^(html|:root|body|\*)/)],
                    transform: (prefix, selector, prefixedSelector, file) =>
                        file.includes('src/lib/') ? prefixedSelector : selector
                })
            ]
        }),
        // make conditional of generation bundle size via script parameter
        visualizer({ template: 'treemap', filename: 'stats/treemap.html', gzipSize: true }),
        visualizer({ template: 'network', filename: 'stats/network.html', gzipSize: true }),
        visualizer({ template: 'sunburst', filename: 'stats/sunburst.html', gzipSize: true })
    ]
};
