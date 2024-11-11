import fs from "fs/promises";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import process from "process";
import ora from "ora";
import prettier from "prettier";

const firstLetterCase = (str = "", toUpperCase = true) => {
    const [firstChar, ...remainingChars] = str;
    return (toUpperCase ? firstChar.toUpperCase() : firstChar.toLowerCase()) + remainingChars.join("");
};

const spinner = ora({
    color: "yellow",
    text: "Creating the component...",
    fail: "Something went wrong please see errors bellow!"
});

const messages = {
    ERROR_NAME_EMPTY: chalk.white.redBright.bold("error: Component's name can't be empty!"),
    ERROR_NAME_IS_NOT_CORRECT: chalk.white.redBright.bold("error: Component's name should start with upper case!"),
    ERROR_PROPS_IS_NOT_CORRECT: chalk.white.redBright.bold("error: Component's props should not contain any symbol!"),
    ERROR_COMPONENT_EXISTS: chalk.white.redBright.bold("error: Component with this name already exists."),
    ERROR_DUPLICATE_NAME: (value) => chalk.white.redBright.bold(`error: ${value} names should be unique.`),
    SUCCESS: (componentName) =>
        chalk.white.green.bold(`success: The ${componentName} component is successfully created!`),
    ERROR: (error) => chalk.white.redBright.bold(`error: ${error}.`)
};

let prettierConfig;

const pathToComponents = ["..", "src", "components"];

const generateCmpTemplate = ({ name, description, props, isWithForwardRef }) => {
    const InterfaceName = `I${name}Props`;

    return `
        import React${isWithForwardRef ? ", { forwardRef }" : ", { FC }"} from 'react';
        import classNames from 'classnames';
        // Styles
        import './${name}.scss';
        
        interface ${InterfaceName} {
                /**
                * Additional class for the parent element.
                * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
                */
                className?: string;
            ${
                props.length
                    ? `${props.map(
                          (prop) => `
                                /**
                                * ${prop} description
                                */
                                ${prop}?: unknown`
                      )}`
                    : `// fill ${name} component props interface`
            }
        }

        ${description ? `/** \n* ${description}\n*/` : ""}
        const ${name}${!isWithForwardRef ? `: FC<${InterfaceName}>` : ""} = ${
            isWithForwardRef ? `forwardRef<unknown , ${InterfaceName}>((` : "("
        }${props.length ? `{${[...props]}, className} ${isWithForwardRef ? `:${InterfaceName}` : ""}` : "{ className }"}
        ${isWithForwardRef ? ", ref" : ""}) => {
            return <div className={classNames("${firstLetterCase(name, false)}", className)}>
                ${name}
            </div>
        }${isWithForwardRef ? ")" : ""};

        export { ${InterfaceName}, ${name} as default };
    `;
};

const generateCmpStoryTemplate = ({ name, level, props }) => {
    const InterfaceName = `I${name}Props`;

    return `
        import React, { FC } from 'react';
        import { Meta } from '@storybook/react';
        
        // Helpers
        import { args, propCategory } from '../../../../stories/assets/storybook.globals';
        
        // Components
        import ${name}, { ${InterfaceName} } from './index';
        
        const meta: Meta<typeof ${name}> = {
            title: '${firstLetterCase(level)}/${name}',
            component: ${name},
            argTypes: {
                className: args({ control: 'false', ...propCategory.appearance }),
                 ${
                     props.length
                         ? `${props.map(
                               (prop) => `
                         ${prop}: args({ control: false, ...propCategory.others })`
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
            } as ${InterfaceName}
        };
        
        export default meta;
        
        const Template: FC<${InterfaceName}> = (props) => <${name} {...props} />;
        
        export const Default = Template.bind({});
        
        Default.args = {} as ${InterfaceName};
        `;
};

const generateCmpTestTemplate = ({ name, portal }) => {
    const beforeEach = portal
        ? `beforeEach(() => {
                setup = mount(<${name} />, { wrappingComponent: GeneUIProvider })
            });`
        : `beforeEach(() => {
                setup = mount(<${name} />)
            });`;

    const InterfaceName = `I${name}Props`;

    return `
            import React from 'react';
            import { ReactWrapper, mount } from 'enzyme';

            // Components
            import ${name}, { ${InterfaceName} } from './index';
            ${portal ? `import GeneUIProvider from '../../providers/GeneUIProvider';` : ""}
            
            describe('${name} ', () => {
                let setup: ReactWrapper<${InterfaceName}>;
                ${beforeEach}

                it('renders without crashing', () => {
                    expect(setup.exists()).toBeTruthy();
                });
                
                it('renders className prop correctly', () => {
                    const className = 'test-class';
                    const wrapper = setup.setProps({ className });

                    expect(wrapper.hasClass(className)).toBeTruthy();
                });

                // Your tests here
            });
        `;
};

const init = () => {
    console.log(
        chalk.yellow(
            figlet.textSync("Add new component", {
                font: "small"
            })
        )
    );
};

const askQuestions = () => {
    const questions = [
        {
            name: "level",
            type: "list",
            prefix: "[?]",
            message: "Please choose a level of the component: ",
            choices: ["Atom", "Molecule", "Organism"],
            filter: (value) => `${value.toLowerCase()}s`
        },
        {
            name: "name",
            type: "input",
            message: "Please enter the component name: ",
            prefix: "[?]",
            filter: (inputValue) => inputValue.replace(/\s/g, ""),
            validate: async (componentName) => {
                if (componentName === "") {
                    console.log(`\n${messages.ERROR_NAME_EMPTY}`);
                    return false;
                }

                const [firstCharOfName] = componentName;

                if (firstCharOfName.toUpperCase() !== firstCharOfName) {
                    console.log(`\n${messages.ERROR_NAME_IS_NOT_CORRECT}`);
                    return false;
                }

                const atoms = await fs.readdir(path.join(__dirname, ...pathToComponents, "atoms"));
                const molecules = await fs.readdir(path.join(__dirname, ...pathToComponents, "molecules"));
                const organisms = await fs.readdir(path.join(__dirname, ...pathToComponents, "organisms"));

                const components = [...atoms, ...molecules, ...organisms];

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
            name: "props",
            type: "input",
            message:
                "Please enter props of the component separated by ',' in case you don't know yet what props you need leave the input empty: ",
            prefix: "[?]",
            filter: (value) => (value ? value.split(",").map((prop) => prop.trim()) : []),
            validate: (componentProps) => {
                const propDict = {};

                for (let i = 0; i < componentProps.length; i++) {
                    const key = componentProps[i];

                    if (propDict.hasOwnProperty(key)) {
                        console.log(`\n${messages.ERROR_DUPLICATE_NAME("Props")}`);
                        return false;
                    }

                    if (!/^[a-zA-Z0-9_]+$/.test(key)) {
                        console.log(`\n${messages.ERROR_PROPS_IS_NOT_CORRECT}`);
                        return false;
                    }

                    propDict[key] = key;
                }

                return true;
            }
        },
        {
            name: "files",
            type: "input",
            message:
                "If you need extra .ts files in the component folder type files names separated by ',' else leave the input empty: ",
            prefix: "[?]",
            filter: (value) => (value ? value.split(",").map((prop) => prop.trim()) : []),
            validate: (files) => {
                const propDict = {};
                for (let i = 0; i < files.length; i++) {
                    const key = files[i];
                    if (propDict.hasOwnProperty(key)) {
                        console.log(`\n${messages.ERROR_DUPLICATE_NAME("Files")}`);
                        return false;
                    }
                    propDict[key] = key;
                }

                return true;
            }
        },
        {
            name: "isWithForwardRef",
            type: "list",
            message: "Do you need to wrap the component in forwardRef: ",
            prefix: "[?]",
            choices: ["No", "Yes"],
            filter: (value) => value === "Yes"
        },
        {
            name: "portal",
            type: "list",
            prefix: "[?]",
            message: "Is this component with portal: ",
            choices: ["No", "Yes"],
            filter: (value) => value === "Yes"
        },
        {
            name: "description",
            type: "input",
            message: "Please enter the component description (you can copy it from the issue): ",
            prefix: "[?]"
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
        const cmpDir = path.join(__dirname, ...pathToComponents, level, name);

        // Create component folder
        await fs.mkdir(cmpDir);

        const componentPath = path.join(`${cmpDir}`, `${name}.tsx`);
        const componentFormattedData = await prettier.format(srcCode, { ...prettierConfig, parser: "typescript" });

        // Create index.tsx file with code
        await fs.appendFile(componentPath, componentFormattedData);

        // Create SCSS file for the component
        const scssContent = `
        
        .${firstLetterCase(name, false)} {
            // Your styles here
            color: var(--guit-ref-color-magenta-500base);
            font-size: var(--guit-sem-font-caption-large-medium-font-size);
        }`;
        const scssPath = path.join(`${cmpDir}`, `${name}.scss`);
        const scssFormattedData = await prettier.format(scssContent, { ...prettierConfig, parser: "scss" });
        await fs.appendFile(scssPath, scssFormattedData);

        // Create extra ts files in the component dir
        await Promise.all(files.map((extraFile) => fs.appendFile(`${cmpDir}/${extraFile}.ts`, "")));
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const addExports = async ({ level, name }) => {
    try {
        const cmpDir = path.join(__dirname, ...pathToComponents, `${level}`, `${name}`);
        const indexContent = `export { I${name}Props, default } from './${name}';`;

        await fs.writeFile(`${cmpDir}/index.tsx`, indexContent, { flag: "a+" });
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

        const storyDir = path.join(__dirname, ...pathToComponents, level, name);
        const storyPath = path.join(storyDir, `${name}.stories.tsx`);
        const formattedData = await prettier.format(storyCode, { ...prettierConfig, parser: "typescript" });

        await fs.appendFile(storyPath, formattedData);
    } catch (error) {
        return {
            hasError: true,
            error
        };
    }
};

const createTestFiles = async ({ name, level, portal }) => {
    try {
        const srcCode = generateCmpTestTemplate({
            name,
            portal
        });

        const testDir = path.join(__dirname, ...pathToComponents, `${level}`, `${name}`, `${name}.test.tsx`);
        const formattedData = await prettier.format(srcCode, { ...prettierConfig, parser: "typescript" });
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
        const indexTsPath = path.join(__dirname, "..", "src", "index.ts");
        const data = await fs.readFile(indexTsPath, "utf-8");
        const fromTo = {
            atoms: ["// Atoms", "// Molecules"],
            molecules: ["// Molecules", "// Organisms"],
            organisms: ["// Organisms", "// Providers"]
        };

        const [from, to] = fromTo[level];

        const regex = new RegExp(`${from}[\\s\\S]*?${to}`, "g");

        const match = data.match(regex)?.[0];

        if (match) {
            const exportStatement = `export { default as ${name} } from './components/${level}/${name}';`;
            const lastIndex = match.lastIndexOf(";");
            if (lastIndex !== -1) {
                const beforeSeparator = match.substring(0, lastIndex + 1);
                const afterSeparator = match.substring(lastIndex + 1);
                const newMatch = beforeSeparator + exportStatement + afterSeparator;
                const newData = data.replace(match, newMatch);
                const formattedData = await prettier.format(newData, { ...prettierConfig, parser: "typescript" });
                await fs.writeFile(indexTsPath, formattedData);
            }
        }
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

    prettierConfig = await prettier.resolveConfig(path.join(__dirname, "..", "configs", ".prettierrc"));

    // Ask questions
    const answers = await askQuestions();
    spinner.start();

    const componentCreationResult = await createComponentFiles(answers);
    const exportsAddingResult = await addExports(answers);
    const storyCreationResult = await createStoryFiles(answers);
    const testCreationResult = await createTestFiles(answers);
    const addGlobalExportResult = await addGlobalExportToIndexTs(answers);

    if (
        componentCreationResult?.hasError ||
        exportsAddingResult?.hasError ||
        storyCreationResult?.hasError ||
        testCreationResult?.hasError ||
        addGlobalExportResult?.hasError
    ) {
        const errorMessage =
            componentCreationResult?.error ||
            exportsAddingResult?.error ||
            storyCreationResult?.error ||
            testCreationResult?.error ||
            addGlobalExportResult?.error;
        spinner.fail(messages.ERROR(errorMessage));
        process.exit(1);
    } else {
        spinner.succeed(messages.SUCCESS(answers.name));
    }
};

process.on("exit", (code) => {
    if (code !== 0) {
        spinner.fail(messages.ERROR(`process exited with ${code} status code`));
    }
});

main();
