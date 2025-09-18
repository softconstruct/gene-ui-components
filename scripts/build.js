import chalk from "chalk";
import process from "process";
import ora from "ora";
import yargs from "yargs";

import { rmSync } from "fs";
import { resolve } from "path";
import { execCommand, copyStaticFilesToDist, replaceVersionInDistPGK } from "./utils";

// In case of true the build script should skip lint and semver steps
const { pure: isBuildRunInPureMode } = yargs.option("pure", {
    describe: "If --pure option specified then lint and semver steps will be skipped from build job.",
    type: "boolean",
    default: false
}).argv;

// The canary version branch name. If provided package json file version will be replaced
const { canary: canaryVersion } = yargs.option("canary", {
    describe: "If --canary argument is specified then package json version will be generated as canary version.",
    type: "string",
    default: null
}).argv;

// The next version branch name. If provided package json file version will be replaced
const { next: nextVersion } = yargs.option("next", {
    describe: "If --next argument is specified then package json version will be generated as next version.",
    type: "string",
    default: null
}).argv;

// The commit SHA. It should be provided for canary and next versions only
const { commitSHA } = yargs.option("commitSHA", {
    describe: "If --canary or --next versions is provided this argument should be provided too --commitSHA.",
    type: "string",
    default: null
}).argv;

const spinner = ora({
    color: "yellow",
    fail: "Something went wrong please see errors bellow!"
});

const messages = {
    ERROR: (error) => chalk.white.redBright.bold(`error: ${error}.`)
};

const build = async () => {
    try {
        rmSync(resolve(__dirname, "../dist"), { recursive: true, force: true });

        await execCommand("tsc -p ./tsconfig.build.json");

        await execCommand("rollup -c ./rollup.config.js --bundleConfigAsCjs", "rollup.config");

        await copyStaticFilesToDist();

        if (commitSHA) {
            if (canaryVersion) {
                await replaceVersionInDistPGK(canaryVersion, commitSHA, "canary");
            }

            if (nextVersion) {
                await replaceVersionInDistPGK(nextVersion, commitSHA, "next");
            }
        }
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const lint = async () => {
    try {
        await execCommand("npm run fix-code-style");
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const semanticRelease = async () => {
    try {
        await execCommand("npm run semantic-release");
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const main = async () => {
    if (!isBuildRunInPureMode) {
        spinner.start("Linting source code of the @geneui/components package...");
        const lintResult = await lint();

        if (lintResult?.hasError) {
            spinner.fail(messages.ERROR(lintResult?.error));
            process.exit(1);
        } else {
            spinner.succeed();
        }

        spinner.start("Semantic versioning and changelog generation of the @geneui/components package...");
        const semanticReleaseResult = await semanticRelease();

        if (semanticReleaseResult?.hasError) {
            spinner.fail(messages.ERROR(semanticReleaseResult?.error));
            process.exit(1);
        } else {
            spinner.succeed();
        }
    }

    spinner.start("Rollup build of the @geneui/components package...");
    const buildResult = await build();

    if (buildResult?.hasError) {
        spinner.fail(messages.ERROR(buildResult?.error));
        process.exit(1);
    } else {
        spinner.succeed();
    }
};

process.on("exit", (code) => {
    if (code !== 0) {
        spinner.fail(messages.ERROR(`process exited with ${code} status code`));
    }
});

main();
