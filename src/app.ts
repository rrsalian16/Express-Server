import express from "express";
import config from "config";
import log from "./logger";
import connect from "./db/connect";
import routes from "./routes";
import deserializeUser from "./middleware/deSerializeUser";

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();
app.use(deserializeUser);

// Parses incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log("hello-rakshith");


app.listen(port, () => {
    log.info(`Server listing at http://${host}:${port}`);
    connect();

    routes(app);
});