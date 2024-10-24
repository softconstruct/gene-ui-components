// jest.config.js
module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "./configs/tsconfig.json"
            }
        ],
        "^.+\\.js$": [
            "babel-jest",
            {
                configFile: "./configs/.babelrc"
            }
        ]
    },
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
        ".svg": "<rootDir>/tests/__mocks__/svg.js",
        "^src": "<rootDir>/src",
        "^utils$": "<rootDir>/src/utils/",
        "^hooks$": "<rootDir>/src/hooks/",
        "^components$": "<rootDir>/src/index.ts"
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
