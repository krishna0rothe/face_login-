const { ipcMain, BrowserWindow } = require("electron");

function setupCheatingAttemptHandler(mainWindow) {
  ipcMain.on("cheating-attempt", (event, type) => {
    if (mainWindow) {
      mainWindow.webContents.send("cheating-attempt", type);
    }
  });
}

module.exports = setupCheatingAttemptHandler;
