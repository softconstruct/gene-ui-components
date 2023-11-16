import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import process from 'process';
import ora from 'ora';

import { execCommand } from './utils';

const spinner = ora({
    color: 'yellow',
    text: 'Analyzing bundle size... \n\n',
    fail: 'Something went wrong please see errors bellow!'
});

const messages = {
    ERROR: (error) => chalk.white.redBright.bold(`error: ${error}.`)
};

const init = () => {
    console.log(
        chalk.yellow(
            figlet.textSync('Analyze bundle size', {
                font: 'small'
            })
        )
    );
};

const askQuestions = () => {
    const questions = [
        {
            name: 'visualizationType',
            type: 'list',
            prefix: '[?]',
            message: 'Please choose the bundle size visualization type: ',
            choices: ['treemap', 'network', 'sunburst']
        }
    ];

    return inquirer.prompt(questions);
};

const analyzeBundleSize = async (visualizationType) => {
    try {
        await execCommand('rm -rf stats');
        await execCommand('npm run build');
        await execCommand(`open-cli stats/${visualizationType}.html`);
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const main = async () => {
    // Show script introduction
    init();

    // Ask questions
    const answers = await askQuestions();
    spinner.start();

    const analyzeBundleSizeResult = await analyzeBundleSize(answers.visualizationType);

    if (analyzeBundleSizeResult?.hasError) {
        spinner.fail(messages.ERROR(analyzeBundleSizeResult?.error));
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
