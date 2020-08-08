import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { routes } from "./Routes/routes";

import pino = require("pino");
import expressPino = require("express-pino-logger");

dotenv.config();

const port = process.env.PORT;
const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const expressLogger = expressPino({ logger });
try {
  const app = express();
  app.use(expressLogger);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  routes(app);
  app.listen(port, () => {
    logger.info("Server running on port %d", port);
  });
} catch (e) {
  console.log(e.message);
}
