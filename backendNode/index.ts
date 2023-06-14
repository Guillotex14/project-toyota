import { App } from "./app";
import { connectToDB } from "./database";

async function main() {
    const app = new App();
    await connectToDB();
    app.start();
}

main();