import fs from 'fs/promises';
import chalk from 'chalk';
import { execCommand } from './utils';

const messages = {
    ERROR: (error) => chalk.white.redBright.bold(`error: ${error}.`)
};

const addVersionToHistory = async () => {
    try {
        const libVersionsFromRepo = await execCommand('npm view @geneui/components versions');

        const libVersionsFromRepoArr = libVersionsFromRepo
            .split(',')
            .map((version) => `v${version.replace(/[\[\]\\n']/g, '').trim()}`);
        // .filter((version) => version.endsWith('0'));

        const libVersions = {
            versions: libVersionsFromRepoArr
        };

        await fs.writeFile('./.storybook/lib-versions.json', JSON.stringify(libVersions));
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const main = async () => {
    const addVersionToHistoryResult = await addVersionToHistory();

    if (addVersionToHistoryResult?.hasError) {
        console.log(messages.ERROR(addVersionToHistoryResult?.error));
        process.exit(1);
    }
};

process.on('exit', (code) => {
    if (code !== 0) {
        console.log(messages.ERROR(`process exited with ${code} status code`));
    }
});

main();
