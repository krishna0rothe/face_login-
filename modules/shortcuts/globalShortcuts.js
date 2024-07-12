const { globalShortcut } = require("electron");

function setupGlobalShortcuts(showWarning) {
  globalShortcut.register("CommandOrControl+C", () => {
    showWarning("Copy action is disabled.");
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
