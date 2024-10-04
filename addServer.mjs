import {Input} from "./util/Input.mjs";
import {Command} from "./util/Command.mjs";
import {ServerSetup} from "./util/ServerSetup.mjs";
import dotenv from "dotenv";

dotenv.config();

const environments = ["prod"];
const serverLocations = ["nbg1", "fsn1", "hel1", "ash", "hil"];

async function addServer() {
    const environment = await Input.select("environment", "Environment:", environments);
    process.env.TF_VAR_hcloud_token = process.env.HCLOUD_TOKEN;
    if (!process.env.TF_VAR_hcloud_token || !process.env.TF_VAR_hcloud_token.length) {
        throw new Error("HCLOUD_TOKEN is not set in .env file");
    }

    process.env.TF_VAR_server_location = await Input.select("serverLocation", "Server location:", serverLocations);
    process.env.TF_VAR_server_name = await Input.askServerName(environment);
    process.env.TF_VAR_enable_backups = await Input.confirm("enable_backups", "Do you want to enable backups for the server?");
    process.env.TF_VAR_access_ip = (await Command.run("curl", ["myip.wtf"], true)).trim();
    const setupAfterDeploy = await Input.confirm("setupAfterDeploy", "Do you want to setup the server after deployment?");
    process.env.TF_VAR_ssh_key_name = process.env.SSH_KEY_NAME;
    process.chdir(environment);
    await Command.run("terraform", ["init"]);
    await Command.run("terraform", ["plan"]);
    const approved = await Input.confirm("approved", "Do you want to deploy this server?");
    if (!approved) {
        return;
    }
    await Command.run("terraform", ["apply", "-auto-approve"]);

    if (setupAfterDeploy) {
        const ip = await Input.ask("ip", "Enter the IP of the server:");
        const serverType = await Input.select("serverType", "Select the server type:", ServerSetup.getServerTypes());
        await ServerSetup.setupServer(ip, serverType);
    }
}

console.log("Starting deployment...");
addServer().then(() => console.log("Deployment successful"));
