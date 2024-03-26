import chalk from 'chalk';
import { lstatSync, readdirSync } from 'fs';
import { copyFile, stat, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { exec } from 'child_process';
import dayjs from 'dayjs';

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
    const filesToCopy = ['package.json', 'README.md', 'CHANGELOG.md', 'LICENSE'];
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

const isFileExists = async (filePath) => {
    try {
        await stat(filePath);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
};

const replaceCanaryVersionInDistPGK = async (canaryVersion, commitSHA) => {
    try {
        const [version] = canaryVersion.split('/').reverse();
        const packageJsonFile = await readFile(resolve(__dirname, '../dist/package.json'), 'utf8');
        const packageJson = JSON.parse(packageJsonFile);
        packageJson.version = `${version}-canary-${commitSHA}-${dayjs().format('DDMMYYYY')}`;
        await writeFile(resolve(__dirname, '../dist/package.json'), JSON.stringify(packageJson, null, 4), 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
};

export {
    execCommand,
    isDirectory,
    isFile,
    isFileExists,
    getDirectories,
    getFiles,
    copyStaticFilesToDist,
    replaceCanaryVersionInDistPGK
};
