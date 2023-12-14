import chalk from 'chalk';
import { lstatSync, readdirSync } from 'fs';
import { copyFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
const execCommand = (cmd, messageNamespace = '') =>
    new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }

            if (messageNamespace && stdout) {
                console.log(chalk.white.green.bold(`${messageNamespace}: ${stdout}`));
            }

            resolve(stdout || stderr);
        });
    });

const isDirectory = (source) => lstatSync(source).isDirectory();

const isFile = (source) => lstatSync(source).isFile();

const copyStaticFilesToDist = async () => {
    const filesToCopy = ['package.json', 'README.md', 'CHANGELOG.md', 'LICENSE']; // need to add also LICENSE
    const copyPromises = filesToCopy.map(async (fileName) => {
        const sourcePath = join(__dirname, '..', fileName);
        const destinationPath = join(__dirname, '..', 'dist', fileName);
        await copyFile(sourcePath, destinationPath);
    });

    await Promise.all(copyPromises);
};

const getDirectories = (source) =>
    readdirSync(source)
        .map((name) => join(source, name))
        .filter(isDirectory);

const getFiles = (source) =>
    readdirSync(source)
        .map((name) => join(source, name))
        .filter(isFile);

export { execCommand, isDirectory, isFile, getDirectories, getFiles, copyStaticFilesToDist };
