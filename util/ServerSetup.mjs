import {Command} from "./Command.mjs";

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
        await Command.run("ssh", [`root@${ip}`, command]);
    }

    static getServerTypes() {
        return [
            "coolify"
        ];
    }
}