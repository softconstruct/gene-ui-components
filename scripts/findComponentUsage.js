import { readdir, readFile } from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import process from 'process';
import ora from 'ora';
import treeify from 'treeify';

const basePath = '../src/lib/';

const spinner = ora({
    color: 'yellow',
    text: 'Searching the component usage... \n\n',
    fail: 'Something went wrong please see errors bellow!'
});

const messages = {
    SUCCESS: (componentName) =>
        chalk.white.green.bold(`The ${componentName} component is used in the listed components`),
    ERROR: (error) => chalk.white.redBright.bold(`error: ${error}.`)
};

const init = () => {
    console.log(
        chalk.yellow(
            figlet.textSync('Find component usage', {
                font: 'small'
            })
        )
    );
};

const askQuestions = (componentsList = []) => {
    const questions = [
        {
            name: 'name',
            type: 'list',
            prefix: '[?]',
            message: 'Please choose the component: ',
            choices: componentsList
        }
    ];

    return inquirer.prompt(questions);
};

const formatComponentsNames = (list = [], level = 'atoms') =>
    list
        .filter((dirent) => dirent.isDirectory())
        .map(({ name }) => ({
            name,
            level
        }));

const getComponentsList = async (withTree = false) => {
    const atoms = await readdir(path.join(__dirname, `${basePath}atoms`), { withFileTypes: true });
    const molecules = await readdir(path.join(__dirname, `${basePath}molecules`), { withFileTypes: true });
    const organisms = await readdir(path.join(__dirname, `${basePath}organisms`), { withFileTypes: true });

    const formattedAtoms = [...formatComponentsNames(atoms, 'atoms')];
    const formattedMolecules = [...formatComponentsNames(molecules, 'molecules')];
    const formattedOrganisms = [...formatComponentsNames(organisms, 'organisms')];

    if (withTree) {
        return {
            atoms: formattedAtoms,
            molecules: formattedMolecules,
            organisms: formattedOrganisms
        };
    }

    return [...formattedAtoms, ...formattedMolecules, ...formattedOrganisms];
};

const findComponentUsage = async (usedComponentName) => {
    try {
        const { atoms, molecules, organisms } = await getComponentsList(true);
        const componentsList = [...atoms, ...molecules, ...organisms];
        const componentsListLength = componentsList.length;
        const matchedComponents = {};
        let matchedComponentsCount = 0;

        for (let i = 0; i < componentsListLength; i++) {
            const { name, level } = componentsList[i];

            const fileContent = await readFile(path.join(__dirname, `${basePath}${level}/${name}/index.js`), 'utf8');

            if (fileContent.search(`<${usedComponentName}`) !== -1) {
                if (level in matchedComponents) {
                    matchedComponents[level][name] = name;
                } else {
                    matchedComponents[level] = { [name]: name };
                }

                matchedComponentsCount++;
            }
        }

        return {
            matchedComponents,
            matchedComponentsCount
        };
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

    const componentsList = await getComponentsList();
    // Ask questions
    const answers = await askQuestions(componentsList);
    spinner.start();

    const usageSearchResult = await findComponentUsage(answers.name);

    if (usageSearchResult?.hasError) {
        spinner.fail(messages.ERROR(usageSearchResult?.error));
        process.exit(1);
    } else {
        console.log(chalk.yellow(treeify.asTree(usageSearchResult.matchedComponents, false)), '\n\n');
        spinner.succeed(messages.SUCCESS(answers.name));
    }
};

process.on('exit', (code) => {
    if (code !== 0) {
        spinner.fail(messages.ERROR(`process exited with ${code} status code`));
    }
});

main();
