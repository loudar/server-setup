import {Command} from "./Command.mjs";
import fs from "fs";
import os from "os";
import {Input} from "./Input.mjs";

const homeDir = os.homedir();
const sshDir = `${homeDir}/.ssh`;
const knownHostsPath = `${sshDir}/known_hosts`;

export class ServerSetup {
    static async setupServer(ip, type) {
        switch (type) {
            case "coolify":
                await ServerSetup.setupCoolify(ip);
                break;
            default:
                throw new Error("Unknown server setup type");
        }
    }

    static async setupCoolify(ip) {
        const command = "curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash";
        const filesInSshDir = await Command.run("ls", ["-al", sshDir], true);

        if (filesInSshDir.includes("known_hosts")) {
            const fileContent = fs.readFileSync(knownHostsPath, "utf8");
            const newFileContent = fileContent.replace(new RegExp(`^${ip}.*`, "gm"), "");
            if (fileContent !== newFileContent) {
                const shouldRemove = await Input.confirm("removeKnownHosts", `Existing entries for ${ip} in known_hosts file. Do you want to remove them?`);
                if (shouldRemove) {
                    fs.writeFileSync(knownHostsPath, newFileContent);
                }
            }
        }

        await Command.run("ssh", [`root@${ip}`, command]);
    }

    static getServerTypes() {
        return [
            "coolify"
        ];
    }
}