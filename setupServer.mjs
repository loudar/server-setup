import {Input} from "./util/Input.mjs";
import {ServerSetup} from "./util/ServerSetup.mjs";

const ip = await Input.ask("ip", "Enter the IP of the server:");
const serverType = await Input.select("serverType", "Select the server type:", ServerSetup.getServerTypes());
await ServerSetup.setupServer(ip, serverType);