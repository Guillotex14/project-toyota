import { App } from "./app";
import { connectToDB } from "./database";

//declarando cronjobs
import { cronInit } from "./cronjobs";

async function main() {
    const app = new App();
    await connectToDB();
    cronInit();
    app.start();
}

main();