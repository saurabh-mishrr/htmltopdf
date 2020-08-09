import dotenv from "dotenv";
import os from "os";
dotenv.config();
// Pino logging config
const pino = require("pino");
const logger = require("pino-http")({
  logger: pino(
    {
      name: os.hostname,
      base: {
        pid: process.pid,
        hostname: os.hostname,
      },
    },
    pino.destination({
      dest: "/var/log/pdfgen_pino.log",
      sync: false,
    })
  ),
  useLevel:
    process.env.ENV == "development"
      ? "debug"
      : process.env.LOG_LEVEL || "info",
  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "timeTaken",
  },
});

/* export function debugLog(err: Error) {
  pino.log.debug(err);
} */

/* export function errorLog(err: Error) {
  pino.log.error(err);
} */

export function infoLog(err: Error) {
  logger(err);
}

export function log(msg: string) {
  console.log(msg);
}

export default logger;
