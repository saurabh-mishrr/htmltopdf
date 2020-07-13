import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { routes } from "./Routes/routes";

dotenv.config();

const port = process.env.PORT;

try {
    const app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    routes(app);
    app.listen(port);
} catch (e) {
    console.log(e.message);
}

