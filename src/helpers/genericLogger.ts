import { createLogger, format, transports } from "winston";
const { combine, timestamp, prettyPrint } = format;

const Logger = createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "info.log" }),
    new transports.File({ filename: "debug.log", level: "debug" }),
  ],
});

export default Logger;
