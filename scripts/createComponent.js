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

const pathToLib = ['..', 'src', 'lib'];

const generateCmpTemplate = ({ name, description, props, isWithForwardRef }) => {
    const InterfaceName = `I${name}Props`;

    return `
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
            ${prop}?: unknown`
               )}`
             : `// fill ${name} component props interface`
     }
    }

    ${description ? `/** \n* ${description}\n*/` : ''}
    
    const ${name}${!isWithForwardRef ? `: FC<I${name}Props>` : ''} = ${
        isWithForwardRef ? `forwardRef<${InterfaceName}>((` : '('
    }${props.length ? `{${[...props]}}` : 'props'}
    ${isWithForwardRef ? ', ref' : ''}) => {
        return <div className="${name.toLowerCase()}">
            ${name}
        </div>
    }${isWithForwardRef ? ')' : ''};

    export { I${name}Props, ${name} as default };
`;
};

const generateCmpStoryTemplate = ({ name, level, props }) => `
        import React, { FC } from 'react';
        import { Meta } from '@storybook/react';
        
        // Helpers
        import { args, propCategory } from '../../../../stories/assets/storybook.globals';
        
        // Components
        import ${name}, { I${name}Props } from './index';
        
        const meta: Meta<typeof ${name}> = {
            title: '${level.charAt(0).toUpperCase() + level.slice(1)}/${name}',
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
        
        const Template: FC<I${name}Props> = (args) => <${name} {...args} />;
        
        export const Default = Template.bind({});
        
        Default.args = {} as I${name}Props
        
        `;

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

                const atoms = await fs.readdir(path.join(__dirname, ...pathToLib, 'atoms'));
                const molecules = await fs.readdir(path.join(__dirname, ...pathToLib, 'molecules'));
                const organisms = await fs.readdir(path.join(__dirname, ...pathToLib, 'organisms'));

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
            name: 'portal',
            type: 'list',
            prefix: '[?]',
            message: 'Is this component with portal: ',
            choices: ['Yes', 'No'],
            filter: (value) => value.toLowerCase()
        },
        {
            name: 'description',
            type: 'input',
            message: 'Please enter the component description (you can copy it from the issue): ',
            prefix: '[?]'
        }
    ];

    return inquirer.prompt(questions);
};

const createComponentFiles = async ({ level, name, files, ...restData }) => {
    try {
        const srcCode = generateCmpTemplate({
            level,
            name,
            files,
            ...restData
        });
        const cmpDir = path.join(__dirname, ...pathToLib, level, name);

        // Create component folder
        await fs.mkdir(cmpDir);

        const componentPath = path.join(`${cmpDir}`, `${name}.tsx`);
        const componentFormattedData = prettier.format(srcCode, { ...prettierConfig, parser: 'typescript' });

        // Create index.js file with code
        await fs.appendFile(componentPath, componentFormattedData);

        // Create scss file for the component
        const scssContent = `
        @import "src/assets/styles/variables";
        
        .${name.toLowerCase()}{
            //your styles here
        }`;
        const scssPath = path.join(`${cmpDir}`, `${name}.scss`);
        const scssFormattedData = prettier.format(scssContent, { ...prettierConfig, parser: 'scss' });
        await fs.appendFile(scssPath, scssFormattedData);

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

const addExports = async ({ level, name }) => {
    try {
        const cmpDir = path.join(__dirname, ...pathToLib, `${level}`, `${name}`);
        const indexContent = `export { I${name}Props, default as default } from './${name}';`;

        await fs.writeFile(`${cmpDir}/index.tsx`, indexContent, { flag: 'a+' });
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const createStoryFiles = async ({ name, level, props }) => {
    try {
        const storyCode = generateCmpStoryTemplate({
            name,
            level,
            props
        });

        const storyDir = path.join(__dirname, ...pathToLib, level, name);
        const storyPath = path.join(storyDir, `${name}.stories.tsx`);
        const formattedData = prettier.format(storyCode, { ...prettierConfig, parser: 'typescript' });

        await fs.appendFile(storyPath, formattedData);
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const addTsInRollup = async ({ name }) => {
    try {
        const rollupPath = path.join(__dirname, '..', 'configs', 'rollup.config.js');
        const data = await fs.readFile(rollupPath, 'utf-8');
        const regex = /const TSComponentsList = \[(.*?)\]/s;
        const match = data.match(regex)?.[0];
        let dataForReplace = '';
        if (match) {
            dataForReplace = match.replace(']', `, '${name}']`);
        }
        const newData = data.replace(match, dataForReplace);
        await fs.writeFile(rollupPath, prettier.format(newData, prettierConfig));
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const createTestFiles = async ({ name, level, portal }) => {
    const beforeEach = {
        yes: `beforeEach(() => (setup = mount(<${name} />, { wrappingComponent: GeneUIProvider })));`,
        no: `beforeEach(() => (setup = mount(<${name} />)));`
    };

    try {
        const testDir = path.join(__dirname, ...pathToLib, `${level}`, `${name}`, `${name}.test.tsx`);
        const IComponentProps = `I${name}Props`;
        const testFileData = `
            import React from 'react';
            import { ReactWrapper, mount } from 'enzyme';
            
            // Components
            import ${name}, { ${IComponentProps} } from './index';
            ${portal === 'yes' ? `import GeneUIProvider from '../../providers/GeneUIProvider';` : ''}
            
            describe('${name} ', () => {
                let setup: ReactWrapper<${IComponentProps}>;
                ${beforeEach[portal]}

                it('renders without crashing', () => {
                    expect(setup.exists()).toBeTruthy();
                });

                //your tests here
            });
        `;
        const formattedData = prettier.format(testFileData, { ...prettierConfig, parser: 'typescript' });
        await fs.writeFile(testDir, formattedData);
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const addGlobalExportToIndexTs = async ({ level, name }) => {
    try {
        const indexTsPath = path.join(__dirname, '..', 'src', 'index.ts');
        const data = await fs.readFile(indexTsPath, 'utf-8');
        const fromTo = {
            atoms: ['// Atoms', '// Molecules'],
            molecules: ['// Molecules', '// Organisms'],
            organisms: ['// Organisms', '// Providers']
        };

        const [from, to] = fromTo[level];

        const regex = new RegExp(`${from}[\\s\\S]*?${to}`, 'g');

        const match = data.match(regex)?.[0];

        if (match) {
            const exportStatement = `export { default as ${name} } from './lib/${level}/${name}';`;
            const lastIndex = match.lastIndexOf(';');
            if (lastIndex !== -1) {
                const beforeSeparator = match.substring(0, lastIndex + 1);
                const afterSeparator = match.substring(lastIndex + 1);
                const newMatch = beforeSeparator + exportStatement + afterSeparator;
                const newData = data.replace(match, newMatch);
                const formattedData = prettier.format(newData, { ...prettierConfig, parser: 'typescript' });
                await fs.writeFile(indexTsPath, formattedData);
            }
        }
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

    prettierConfig = await prettier.resolveConfig(path.join(__dirname, '..', 'configs', '.prettierrc'));

    // Ask questions
    const answers = await askQuestions();
    spinner.start();

    const componentCreationResult = await createComponentFiles(answers);
    const exportsAddingResult = await addExports(answers);
    const storyCreationResult = await createStoryFiles(answers);
    const testCreationResult = await createTestFiles(answers);
    const addGlobalExportResult = await addGlobalExportToIndexTs(answers);
    // todo remove addTsInRollup after fix
    const tsInRollupResult = await addTsInRollup(answers);

    if (
        componentCreationResult?.hasError ||
        exportsAddingResult?.hasError ||
        storyCreationResult?.hasError ||
        tsInRollupResult?.hasError ||
        testCreationResult?.hasError ||
        addGlobalExportResult?.hasError
    ) {
        const errorMessage =
            componentCreationResult?.error ||
            exportsAddingResult?.error ||
            storyCreationResult?.error ||
            tsInRollupResult?.error ||
            testCreationResult?.error ||
            addGlobalExportResult?.error;
        spinner.fail(messages.ERROR(errorMessage));
        process.exit(1);
    } else {
        spinner.succeed(messages.SUCCESS(answers.name));
    }
};

process.on('exit', (code) => {
    if (code !== 0) {
        spinner.fail(messages.ERROR(`process exited with ${code} status code`));
    }
});

main();
