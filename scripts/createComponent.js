import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import process from 'process';
import ora from 'ora';
import prettier from 'prettier';

const spinner = ora({
    color: 'yellow',
    text: 'Creating the component...',
    fail: 'Something went wrong please see errors bellow!'
});

const comments = {
    STORY_CMP_IMPORTS_START: '/** Start components imports */',
    STORY_CMP_IMPORTS_END: '/** End components imports */',
    ADD_STORY_START: '/** Start stories adding */',
    ADD_STORY_END: '/** End stories adding */'
};

const messages = {
    ERROR_NAME_EMPTY: chalk.white.redBright.bold("error: Component's name can't be empty!"),
    ERROR_NAME_IS_NOT_CORRECT: chalk.white.redBright.bold("error: Component's name should start with upper case!"),
    ERROR_COMPONENT_EXISTS: chalk.white.redBright.bold('error: Component with this name already exists.'),
    ERROR_DUPLICATE_NAME: (value) => chalk.white.redBright.bold(`error: ${value} names should be unique.`),
    SUCCESS: (componentName, isStory) =>
        chalk.white.green.bold(
            `success: The ${componentName} ${isStory ? 'story' : 'component'} is successfully created!`
        ),
    ERROR: (error) => chalk.white.redBright.bold(`error: ${error}.`)
};

let prettierConfig;

const generateCmpTemplate = ({ name, description, props, isWithForwardRef }) => {
    const InterfaceName = `I${name}Props`;

    const result = `
    import React${isWithForwardRef ? ', { forwardRef }' : ', { FC }'} from 'react';

    // Styles
    import 'src/assets/styles/globalStyling.scss';
    import './${name}.scss';
    
    interface ${InterfaceName} {
     ${
         props.length
             ? `${[...props].map(
                   (prop) => `
             /**
               * ${prop} description
               */
            ${prop}: any`
               )}`
             : `// fill ${name} component props interface`
     }
    }

    ${description ? `/** \n* ${description}\n*/` : ''}
    const ${name}${!isWithForwardRef ? `: FC<I${name}Props>` : ''} = ${
        isWithForwardRef ? `forwardRef<${InterfaceName}>((` : '('
    }${props.length ? `{${[...props]}}` : 'props'}
    ${isWithForwardRef ? ', ref' : ''}) => {
        return '${name}';
    }${isWithForwardRef ? ')' : ''};

    export { I${name}Props, ${name} as default };
`;
    // console.log(result)
    return result;
};

const generateCmpStoryTemplate = (storyData, rest) => {
    const { title } = storyData;
    const { name, level, props } = rest;

    return `
            import React, { FC } from 'react';
            import { Meta } from '@storybook/react';
            
            // Helpers
            import { args, propCategory } from '../../../../stories/assets/storybook.globals';
            
            // Components
            import ${name}, { I${name}Props } from './index';
            
            const meta: Meta<typeof ${name}> = {
                title: '${level}/${name}',
                component: ${name},
                argTypes: {
                         ${
                             props.length
                                 ? `${[...props].map(
                                       (prop) => `
                                 ${prop}: args({ control: false, ...propCategory.appearance })`
                                   )}`
                                 : `// fill ${name} component argTypes`
                         }
             
                },
                args: {
                        ${
                            props.length
                                ? `${[...props].map(
                                      (prop) => `
                                   ${prop}: "fill the ${prop} prop value"`
                                  )}`
                                : `// fill ${name} component args`
                        }
                } as I${name}Props
            };
            
            export default meta;
            
            `;
};

const getLevelIndexPaths = (level, isStory = false) => {
    // const basePath = isStory ? 'stories' : 'src/lib';
    // return {
    //     desktop: path.join(__dirname, `../${basePath}/${level}/index.js`),
    //     mobile: path.join(__dirname, `../${basePath}/${level}/index.mobile.js`)
    // };
};

const init = () => {
    console.log(
        chalk.yellow(
            figlet.textSync('Add new component', {
                font: 'small'
            })
        )
    );
};

const askQuestions = () => {
    const questions = [
        {
            name: 'level',
            type: 'list',
            prefix: '[?]',
            message: 'Please choose a level of the component: ',
            choices: ['Atom', 'Molecule', 'Organism'],
            filter: (value) => `${value.toLowerCase()}s`
        },
        {
            name: 'name',
            type: 'input',
            message: 'Please enter the component name: ',
            prefix: '[?]',
            filter: (inputValue) =>
                // Todo
                inputValue.trim(),
            validate: async (componentName) => {
                if (typeof componentName !== 'string' || componentName.trim() === '') {
                    console.log(`\n${messages.ERROR_NAME_EMPTY}`);
                    return false;
                }
                if (componentName[0].toUpperCase() !== componentName[0]) {
                    console.log(`\n${messages.ERROR_NAME_IS_NOT_CORRECT}`);
                    return false;
                }

                const atoms = await fs.readdir(path.join(__dirname, '../src/lib/atoms'));
                const molecules = await fs.readdir(path.join(__dirname, '../src/lib/molecules'));
                const organisms = await fs.readdir(path.join(__dirname, '../src/lib/organisms'));

                const components = atoms
                    .filter((atom) => !atom.startsWith('index.'))
                    .concat(molecules.filter((molecule) => !molecule.startsWith('index.')))
                    .concat(organisms.filter((organism) => !organism.startsWith('index.')));

                for (let i = 0; i < components.length; i++) {
                    if (components[i].toLowerCase() === componentName.toLowerCase()) {
                        console.log(`\n${messages.ERROR_COMPONENT_EXISTS}`);
                        return false;
                    }
                }

                return true;
            }
        },
        {
            name: 'props',
            type: 'input',
            message:
                "Please enter props of the component separated by ',' in case you don't know yet what props you need leave the input empty: ",
            prefix: '[?]',
            filter: (value) => (value ? value.split(',').map((prop) => prop.trim()) : []),
            validate: async (componentProps) => {
                const propDict = {};
                for (let i = 0; i < componentProps.length; i++) {
                    const key = componentProps[i];
                    if (propDict.hasOwnProperty(key)) {
                        console.log(`\n${messages.ERROR_DUPLICATE_NAME('Props')}`);
                        return false;
                    }
                    propDict[key] = key;
                }

                return true;
            }
        },
        {
            name: 'files',
            type: 'input',
            message:
                "If you need extra .ts files in the component folder type files names separated by ',' else leave the input empty: ",
            prefix: '[?]',
            filter: (value) => (value ? value.split(',').map((prop) => prop.trim()) : []),
            validate: async (files) => {
                const propDict = {};
                for (let i = 0; i < files.length; i++) {
                    const key = files[i];
                    if (propDict.hasOwnProperty(key)) {
                        console.log(`\n${messages.ERROR_DUPLICATE_NAME('Files')}`);
                        return false;
                    }
                    propDict[key] = key;
                }

                return true;
            }
        },
        {
            name: 'isWithForwardRef',
            type: 'list',
            message: 'Do you need to wrap the component in forwardRef: ',
            prefix: '[?]',
            choices: ['Yes', 'No'],
            filter: (value) => value === 'Yes'
        },
        {
            name: 'description',
            type: 'input',
            message: 'Please enter the component description (you can copy it from the issue): ',
            prefix: '[?]'
        },
        {
            name: 'hasMobileView',
            type: 'list',
            message: 'Is the component has a mobile view: ',
            prefix: '[?]',
            choices: ['Yes', 'No'],
            filter: (value) => value === 'Yes'
        },
        {
            name: 'hasStory',
            type: 'list',
            message: 'Do you want to create story for the component: ',
            prefix: '[?]',
            choices: ['Yes', 'No'],
            filter: (value) => value === 'Yes'
        }
    ];

    return inquirer.prompt(questions);
};

const askStoryQuestions = () => {
    // @TODO tuning for the best view of storybook
    const questions = [
        {
            name: 'title',
            type: 'input',
            message: 'Please enter the component story title: ',
            prefix: '[?]'
        }
    ];

    return inquirer.prompt(questions);
};

const createComponentFiles = async ({ level, name, hasMobileView, files, ...restData }) => {
    try {
        const srcCode = generateCmpTemplate({
            level,
            name,
            hasMobileView,
            files,
            ...restData
        });
        const cmpDir = path.join(__dirname, `../src/lib/${level}/${name}`);

        // Create component folder
        await fs.mkdir(cmpDir);
        // Create index.js file with code

        await fs.appendFile(`${cmpDir}/${name}.tsx`, prettier.format(srcCode, prettierConfig));
        // await fs.appendFile(`${cmpDir}/${name}.tsx`, srcCode);
        // Create scss file for the component
        await fs.appendFile(`${cmpDir}/${name}.scss`, '@import "src/assets/styles/variables";');
        // Create index.mobile.js file if has mobile view
        if (hasMobileView) {
            await fs.appendFile(`${cmpDir}/${name}.mobile.js`, `export * from './${name}';`);
        }
        // Create extra js files in the component dir
        for (let i = 0; i < files.length; i++) {
            await fs.appendFile(`${cmpDir}/${files[i]}.ts`, '');
        }
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const addExports = async ({ level, name, hasMobileView }) => {
    try {
        // const levelPaths = getLevelIndexPaths(level);
        const cmpDir = path.join(__dirname, `../src/lib/${level}/${name}`);
        const indexContent = `export { I${name}Props, default as default } from './${name}';`;

        await fs.writeFile(`${cmpDir}/index.tsx`, indexContent, { flag: 'a+' });
        // Add export to the level index.mobile.js for mobile view
        // if (hasMobileView) {
        //     await fs.writeFile(levelPaths.mobile, `export * from './${name}/index.mobile';`, { flag: 'a+' });
        // }
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const createStoryFiles = async (storyData, { name, level, ...restCmpData }) => {
    // @TODO tuning for the controls and actions
    try {
        const storyCode = generateCmpStoryTemplate(storyData, {
            name,
            level,
            ...restCmpData
        });
        // `../src/lib/${level}/${name}`
        const storyDir = path.join(__dirname, `../src/lib/${level}/${name}`);

        // Create component folder
        // await fs.mkdir(storyDir);
        // Create index.js file with code
        await fs.appendFile(`${storyDir}/${name}.stories.tsx`, storyCode);
        // await fs.appendFile(`${storyDir}/${name}.stories.tsx`, prettier.format(storyCode, prettierConfig));
        // Create data source file for the component
        const componentDataSource = `
            import { faker } from '@faker-js/faker';

            /** 
             * Example how to generate the test data
             * you can discover more functionality by 
             * following the link https://github.com/faker-js/faker#readme
             */

            // export const USERS: User[] = [];

            // export function createRandomUser(): User {
            //     return {
            //         userId: faker.datatype.uuid(),
            //         username: faker.internet.userName(),
            //         email: faker.internet.email(),
            //         avatar: faker.image.avatar(),
            //         password: faker.internet.password(),
            //         birthdate: faker.date.birthdate(),
            //         registeredAt: faker.date.past(),
            //     };
            // }
            
            // Array.from({ length: 10 }).forEach(() => {
            //     USERS.push(createRandomUser());
            // });

            export default [];
        `;
        // await fs.appendFile(`${storyDir}/data.js`, prettier.format(componentDataSource, prettierConfig));
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

// @TODO implement test files generation
const createTestFiles = async () => {};

const addStoryExports = async ({ level, name }) => {
    try {
        const levelPaths = getLevelIndexPaths(level, true);

        // Add export to the level index.js file for desktop view
        const data = await fs.readFile(levelPaths.desktop, 'utf-8');
        const fileRows = data.split('\n');

        const distributedData = {
            components: {
                isLetPush: false,
                list: []
            },
            stories: {
                isLetPush: false,
                list: []
            }
        };

        for (let i = 0; i < fileRows.length; i++) {
            const row = fileRows[i];

            // Add the component import
            if (row === comments.STORY_CMP_IMPORTS_START) {
                distributedData.components.isLetPush = true;
            }
            if (distributedData.components.isLetPush && row !== comments.STORY_CMP_IMPORTS_END) {
                distributedData.components.list.push(row);
            }
            if (row === comments.STORY_CMP_IMPORTS_END) {
                distributedData.components.list.push(`import ${name} from './${name}';`);
                distributedData.components.list.push(row);
                distributedData.components.isLetPush = false;
            }

            // Add new story
            if (row === comments.ADD_STORY_START) {
                distributedData.stories.isLetPush = true;
            }
            if (distributedData.stories.isLetPush && row !== comments.ADD_STORY_END) {
                distributedData.stories.list.push(row.replace(';', ''));
            }
            if (row === comments.ADD_STORY_END) {
                distributedData.stories.list.push(`.add('${name}', ...${name});`);
                distributedData.stories.list.push(row);
                distributedData.stories.isLetPush = false;
            }
        }

        const fileContent = [
            "/** Please don't touch to this file manually as file is generates by CLI */",
            "import { storiesOf } from '@storybook/react';",
            '\n',
            ...distributedData.components.list,
            '\n',
            ...distributedData.stories.list
        ].join('\n');

        await fs.writeFile(levelPaths.desktop, prettier.format(fileContent, prettierConfig));
    } catch (error) {
        console.log(error);
        return {
            hasError: true,
            error
        };
    }
};

const main = async () => {
    // Show script introduction
    init();

    prettierConfig = await prettier.resolveConfig(path.join(__dirname, `../configs/.prettierrc`));

    // Ask questions
    const answers = await askQuestions();
    spinner.start();

    const componentCreationResult = await createComponentFiles(answers);
    const exportsAddingResult = await addExports(answers);

    if (componentCreationResult?.hasError || exportsAddingResult?.hasError) {
        const errorMessage = componentCreationResult?.error || exportsAddingResult?.error;
        spinner.fail(messages.ERROR(errorMessage));
        process.exit(1);
    } else {
        spinner.succeed(messages.SUCCESS(answers.name));
    }

    // Ask story questions
    if (answers.hasStory) {
        const storyAnswers = await askStoryQuestions();
        spinner.start();

        const storyCreationResult = await createStoryFiles(storyAnswers, answers);
        // const storyExportsAddingResult = addStoryExports(answers);

        if (storyCreationResult?.hasError || storyExportsAddingResult?.hasError) {
            const errorMessage = storyCreationResult?.error || storyExportsAddingResult?.error;
            spinner.fail(messages.ERROR(errorMessage));
            process.exit(1);
        } else {
            spinner.succeed(messages.SUCCESS(answers.name, true));
        }
    }
};

process.on('exit', (code) => {
    if (code !== 0) {
        spinner.fail(messages.ERROR(`process exited with ${code} status code`));
    }
});

main();
