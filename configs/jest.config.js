// jest.config.js
module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: './configs/tsconfig.json'
            }
        ],
        '^.+\\.js$': [
            'babel-jest',
            {
                configFile: './configs/.babelrc'
            }
        ]
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
        '.svg': '<rootDir>/tests/__mocks__/svg.js',
        '^src': '<rootDir>/src',
        '^utils$': '<rootDir>/src/utils/',
        '^wrappers$': '<rootDir>/src/wrappers/',
        '^configs$': '<rootDir>/src/configs.js',
        '^hooks$': '<rootDir>/src/hooks/',
        '^components$': '<rootDir>/src/index.ts',
        '^__data__$': '<rootDir>/stories/__data__/index.ts',
        d3: '<rootDir>/node_modules/d3/dist/d3.min.js'
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    testMatch: ['**/?(*.)+(test).tsx'], // TODO add .ts also for helpers
    collectCoverageFrom: [
        'src/**/*.tsx',
        'src/hooks/**/*.ts',
        '!src/hooks/index.ts',
        '!src/**/*.d.ts',
        '!src/**/*.stories.tsx'
    ], // TODO add .ts also for helpers
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!react-dnd|dnd-core|@react-dnd)'],
    modulePathIgnorePatterns: ['node_modules', 'jest-test-results.json']
};
