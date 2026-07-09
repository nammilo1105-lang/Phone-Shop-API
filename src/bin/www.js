const app = require("../apps/app")
const config = require("config")
// const open = require("open")
const server =  app.listen(port = config.get("app.serverPort"), async () => {
    console.log(`server running on port ${port}`);
    console.log(`Swagger: http://localhost:${port}/api-docs`);
    // open(`http://localhost:${port}/api-docs`);
})





