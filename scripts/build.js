import chalk from 'chalk';
import process from 'process';
import ora from 'ora';

import { rmSync } from 'fs';
import { resolve } from 'path';
import { execCommand, copyStaticFilesToDist } from './utils';

const spinner = ora({
    color: 'yellow',
    fail: 'Something went wrong please see errors bellow!'
});

const messages = {
    ERROR: (error) => chalk.white.redBright.bold(`error: ${error}.`)
};

const build = async () => {
    try {
        rmSync(resolve(__dirname, '../dist'), { recursive: true, force: true });

        await execCommand('rollup -c ./configs/rollup.config.js --bundleConfigAsCjs', 'rollup.config');

        await copyStaticFilesToDist();
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const lint = async () => {
    try {
        await execCommand('npm run fix-code-style');
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const semanticRelease = async () => {
    try {
        await execCommand('npm run semantic-release');
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const main = async () => {
    spinner.start('Linting source code of the @geneui/components package...');
    const lintResult = await lint();

    if (lintResult?.hasError) {
        spinner.fail(messages.ERROR(lintResult?.error));
        process.exit(1);
    } else {
        spinner.succeed();
    }

    spinner.start('Semantic versioning and changelog generation of the @geneui/components package...');
    const semanticReleaseResult = await semanticRelease();

    if (semanticReleaseResult?.hasError) {
        spinner.fail(messages.ERROR(semanticReleaseResult?.error));
        process.exit(1);
    } else {
        spinner.succeed();
    }

    spinner.start('Rollup build of the @geneui/components package...');
    const buildResult = await build();

    if (buildResult?.hasError) {
        spinner.fail(messages.ERROR(buildResult?.error));
        process.exit(1);
    } else {
        spinner.succeed();
    }
};

process.on('exit', (code) => {
    if (code !== 0) {
        spinner.fail(messages.ERROR(`process exited with ${code} status code`));
    }
});

main();
