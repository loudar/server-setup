import {spawn} from "child_process";

export class Command {
    static run(command, args, captureOutput = false) {
        let output = null;
        return new Promise((resolve, reject) => {
            const process = spawn(command, args);
            process.stdout.on("data", (data) => {
                console.log(data.toString());
                if (captureOutput) {
                    output = data.toString();
                }
            });
            process.stderr.on("data", (data) => {
                console.log(data.toString());
            });
            process.on("close", (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    reject();
                }
            });
        });
    }
}
