import express from "express";
import bodyParser from "body-parser";
import { routes } from "./Routes/routes";
import logger from "./Modules/Logging";

const port = process.env.PORT;
try {
  const app = express();
  app.use(logger);
  app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));
  app.use(bodyParser.json());
  routes(app);
  app.listen(port);
} catch (e) {
  console.log(e.message);
}
