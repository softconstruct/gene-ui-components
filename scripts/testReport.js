import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import process from "process";
import ora from "ora";

import { execCommand, isFileExists } from "./utils";

const reportFilePath = "coverage/lcov-report/index.html";

const spinner = ora({
    color: "yellow",
    text: "Opening the existing coverage report... \n\n",
    fail: "Something went wrong please see errors bellow!"
});

const messages = {
    ERROR: (error) => chalk.white.redBright.bold(`error: ${error}.`)
};

const init = () => {
    console.log(
        chalk.yellow(
            figlet.textSync("Preparing tests report from JEST", {
                font: "small"
            })
        )
    );
};

const askQuestions = () => {
    const questions = [
        {
            name: "isGenerateNewReport",
            type: "list",
            prefix: "[?]",
            message: "Do you want to generate a new test coverage report or see what already exists: ",
            choices: ["Yes generate new one", "No see already exists"],
            filter: (value) => value.startsWith("Yes")
        }
    ];

    return inquirer.prompt(questions);
};

const generateTestsCoverageReport = async (isGenerateNewReport) => {
    try {
        if (isGenerateNewReport) {
            await execCommand("rm -rf coverage");
            await execCommand("npm run test");
        }

        await execCommand(`open-cli ${reportFilePath}`);
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

    const isAskQuestions = await isFileExists(reportFilePath);

    // Ask questions
    const { isGenerateNewReport } = isAskQuestions ? await askQuestions() : { isGenerateNewReport: true };

    if (isGenerateNewReport) {
        spinner.text = "Collecting test coverage... \n\n";
    }

    spinner.start();

    const generateTestsCoverageReportResult = await generateTestsCoverageReport(isGenerateNewReport);

    if (generateTestsCoverageReportResult?.hasError) {
        spinner.fail(messages.ERROR(generateTestsCoverageReportResult?.error));
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
