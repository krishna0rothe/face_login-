const { globalShortcut } = require("electron");
const { captureScreenshot } = require("../monitoring/screenshot");

function setupGlobalShortcuts(showWarning) {
  globalShortcut.register("CommandOrControl+C", () => {
    showWarning("Copy action is disabled.");
    captureScreenshot("Copy action detected!...");
  });
  globalShortcut.register("CommandOrControl+X", () => {
    showWarning("Cut action is disabled.");
  });
  globalShortcut.register("CommandOrControl+V", () => {
    showWarning("Paste action is disabled.");
  });
  globalShortcut.register("CommandOrControl+A", () => {
    showWarning("Select all action is disabled.");
  });
}

module.exports = { setupGlobalShortcuts };
