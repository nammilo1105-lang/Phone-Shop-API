const app = require("../apps/app")
const config = require("config")
const open = require("open")
const port = process.env.PORT || config.get("app.serverPort");
const server =  app.listen(port, () => {
    console.log(`server running on port ${port}`);
    console.log(`Swagger: http://localhost:${port}/api-docs`);
    open(`http://localhost:${port}/api-docs`);
})





