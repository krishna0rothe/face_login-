const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  desktopCapturer,
  session,
} = require("electron");
const path = require("path");

const {startKeyboardMonitoring,} = require("./modules/monitoring/keyboard-monitor");
const {checkAndTerminateApps} = require("./modules/monitoring/app-terminator");
const { initializeMonitoring } = require("./modules/monitoring/monitor");
const { showWarning } = require("./modules/utils/utils");
const { fetchAndStoreIP } = require("./modules/monitoring/ipConfig");
const {logSystemSpecifications} = require("./modules/monitoring/logSystemSpecifications");
const { setupGlobalShortcuts } = require("./modules/shortcuts/globalShortcuts");
const {monitorScreenCaptureTools} = require("./modules/monitoring/screenCaptureMonitor");
const { blockURLs } = require("./modules/session/urlBlocker");
const { setupProctoring } = require("./window");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // Enable contextIsolation for security
      nodeIntegration: false, // Disable nodeIntegration for security
    },
  });

  mainWindow.loadFile("index.html");
  setupProctoring(mainWindow);
}

app.whenReady().then(() => {
  createWindow();

  fetchAndStoreIP();
  logSystemSpecifications();
  initializeMonitoring();

  //setupGlobalShortcuts(showWarning);

  monitorScreenCaptureTools(showWarning , app.quit);

  //startKeyboardMonitoring();
 checkAndTerminateApps();
  //initializeMonitoring();

  //blockURLs(session);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
