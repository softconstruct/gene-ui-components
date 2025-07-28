module.exports = {
    disableEmoji: false,
    format: "{type}({scope}): {emoji}{subject}",
    list: ["test", "feat", "fix", "chore", "docs", "refactor", "style", "ci", "perf"],
    maxMessageLength: 64,
    minMessageLength: 3,
    questions: ["type", "scope", "subject", "body", "breaking", "issues", "lerna"],
    scopes: [],
    types: {
        chore: {
            description: "Build process or auxiliary tool changes",
            value: "chore"
        },
        ci: {
            description: "CI related changes",
            value: "ci"
        },
        docs: {
            description: "Documentation only changes",
            value: "docs"
        },
        feat: {
            description: "A new feature",
            value: "feat"
        },
        fix: {
            description: "A bug fix",
            value: "fix"
        },
        perf: {
            description: "A code change that improves performance",
            value: "perf"
        },
        refactor: {
            description: "A code change that neither fixes a bug or adds a feature",
            value: "refactor"
        },
        release: {
            description: "Create a release commit",
            value: "release"
        },
        style: {
            description: "Markup, white-space, formatting, missing semi-colons...",
            value: "style"
        },
        test: {
            description: "Adding missing tests",
            value: "test"
        },
        messages: {
            type: "Select the type of change that you're committing:",
            customScope: "Select the scope this component affects:",
            subject: "Write a short, imperative mood description of the change:\n",
            body: "Provide a longer description of the change:\n ",
            breaking: "List any breaking changes:\n",
            footer: "Issues this commit closes, e.g #123:",
            confirmCommit: "The packages that this commit has affected\n"
        }
    }
};
