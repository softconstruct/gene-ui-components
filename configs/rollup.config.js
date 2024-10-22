import typescript from '@rollup/plugin-typescript';
import { resolve as resolvePath } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import prefixSelector from 'postcss-prefix-selector';
import autoprefixer from 'autoprefixer';
import { getDirectories, getFiles } from '../scripts/utils';

const packageJson = require('../package.json');

const getInputs = (_name, dir) => {
    const inputs = getDirectories(dir).reduce((obj, item) => {
        const [name] = item.split('/').reverse();
        return {
            ...obj,
            [name]: `${item}/index.tsx`
        };
    }, {});

    return {
        ...inputs
    };
};

const componentsInputs = Object.entries({
    atoms: 'src/components/atoms',
    molecules: 'src/components/molecules',
    // organisms: 'src/components/organisms', TODO: Comment out after first organism will be created
    providers: 'src/components/providers'
}).reduce((obj, entry) => ({ ...obj, ...getInputs(...entry) }), {});

const hooks = getFiles('src/hooks').reduce((acc, path) => {
    const [hookPath] = path.split('/').reverse();
    const hookName = hookPath.replace(/\.(js|ts)$/, '');
    acc[hookName] = path;
    return acc;
}, {});

export default {
    input: {
        ...componentsInputs,
        ...hooks,
        index: 'src/index.ts'
    },
    output: [
        {
            dir: 'dist',
            format: 'esm',
            exports: 'named',
            entryFileNames: ({ facadeModuleId }) => {
                // Check if the module is one of the components that require nested structure

                const folders = ['atoms', 'molecules', 'organisms', 'providers'];
                const isComponent = folders.some((folder) => facadeModuleId.includes(`/src/lib/${folder}/`));
                const isHook = facadeModuleId.includes(`/src/hooks/`);

                let filePath = '[name].js';

                if (isComponent) {
                    filePath = `[name]/index.js`;
                } else if (isHook) {
                    filePath = `hooks/[name].js`;
                }

                return filePath;
            }
        }
    ],
    external: ['react', 'react-dom', 'prop-types'],
    plugins: [
        // peerDepsExternal({
        //     packageJsonPath: resolvePath(__dirname, '../package.json'),
        //     includeDependencies: false
        // }),
        alias({
            entries: {
                src: 'src',
                utils: 'src/utils/index.js',
                hooks: 'src/hooks/index.ts',
                components: 'src/index.ts'
            }
        }),
        resolve(),
        typescript({
            tsconfig: resolvePath(__dirname, 'tsconfig.json')
        }),
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
                    // To prevent global styles isolation
                    exclude: [/^(html|:root|body|\*)/],
                    transform: (prefix, selector, prefixedSelector, file) =>
                        file.includes('src/lib/') ? prefixedSelector : selector
                })
            ]
        }),
        // Make conditional of generation bundle size via script parameter
        visualizer({ template: 'treemap', filename: 'stats/treemap.html', gzipSize: true }),
        visualizer({ template: 'network', filename: 'stats/network.html', gzipSize: true }),
        visualizer({ template: 'sunburst', filename: 'stats/sunburst.html', gzipSize: true })
    ]
};
