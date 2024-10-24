module.exports = {
    extends: ["@commitlint/config-conventional"],
    /*
     * Any rules defined here will override rules from @commitlint/config-conventional
     */
    rules: {
        "scope-case": [0, "always", ["pascal-case", "lower-case"]]
    }
};
