// jest.config.js
module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "./tsconfig.json"
            }
        ],
        "^.+\\.js$": [
            "babel-jest",
            {
                configFile: "./.babelrc"
            }
        ]
    },
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
        ".svg": "<rootDir>/tests/__mocks__/svg.js",
        "^src": "<rootDir>/src",
        "^@components/(.*)$": "<rootDir>/src/components/$1",
        "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
        "^@assets/(.*)$": "<rootDir>/src/assets/$1",
        "^@types/(.*)$": "<rootDir>/src/types/$1"
    },
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    testMatch: ["**/?(*.)+(test).tsx"], // TODO add .ts also for helpers
    collectCoverageFrom: [
        "src/**/*.tsx",
        "src/hooks/**/*.ts",
        "!src/hooks/index.ts",
        "!src/**/*.d.ts",
        "!src/**/*.stories.tsx"
    ], // TODO add .ts also for helpers
    coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
    transformIgnorePatterns: ["<rootDir>/node_modules/(?!@geneui/tokens|@geneui/icons)"],
    modulePathIgnorePatterns: ["node_modules", "jest-test-results.json"]
};
