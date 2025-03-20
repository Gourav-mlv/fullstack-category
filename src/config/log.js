const log4js = require("log4js");

log4js.configure({
  appenders: {
    console: { type: "console" }, // Logs to console
    errorFile: { type: "file", filename: "logs/error.log", level: "error" }, // Logs only errors
    combinedFile: { type: "file", filename: "logs/combined.log" }, // Logs all levels
    rollingFile: { type: "dateFile", filename: "logs/app.log", pattern: ".yyyy-MM-dd", compress: true } // Optional: Rotates daily
  },
  categories: {
    default: { appenders: ["console", "combinedFile"], level: "info" },
    error: { appenders: ["errorFile"], level: "error" },
  },
});

module.exports = log4js;