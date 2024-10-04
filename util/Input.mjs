import inquirer from "inquirer";

export class Input {
    static async ask(varName, message, validate) {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: varName,
                message: message,
                validate: validate
            }
        ]);
        return answers[varName];
    }

    static async confirm(varName, message) {
        const answers = await inquirer.prompt([
            {
                type: "confirm",
                name: varName,
                message: message
            }
        ]);
        return answers[varName];
    }

    static async select(varName, message, choices) {
        const answers = await inquirer.prompt([
            {
                type: "list",
                name: varName,
                message: message,
                choices: [
                    ...choices.map(choice => {
                        return {
                            name: choice,
                            value: choice
                        };
                    })
                ]
            }
        ]);
        return answers[varName];
    }

    static async askHetznerToken(serverType) {
        const answers = await inquirer.prompt([
            {
                type: "password",
                name: "hcloudToken",
                message: `Hetzner Cloud API token for ${serverType}:`,
                validate: (input) => {
                    if (input.length === 0) {
                        return "Token cannot be empty";
                    }
                    return true;
                }
            }
        ]);
        return answers["hcloudToken"];
    }

    static async askServerName(serverType) {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "serverName",
                message: `Server name for new ${serverType} server:`,
                validate: (input) => {
                    if (input.length === 0) {
                        return "Server name cannot be empty";
                    }
                    return true;
                }
            }
        ]);
        return answers["serverName"];
    }
}