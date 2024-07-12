const { exec } = require("child_process");
const os = require("os");
const { app } = require("electron");
const { showWarning, logEvent } = require("../utils/utils");

// Array to track the state of each app
let appStates = {};

function terminateApp(appName) {
  exec(`taskkill /F /IM ${appName}`, (error, stdout, stderr) => {
    if (error) {
      logEvent(`Failed to terminate ${appName}: ${error}`);
      return;
    }
    if (stderr) {
      logEvent(`stderr: ${stderr}`);
      return;
    }
    logEvent(`${appName} terminated successfully.`);
  });
}

function checkAndTerminateApps() {
  if (os.platform() === "win32") {
    // Windows
    const appsToTerminate = [
      "wireshark.exe",
      "charles.exe",
      "fiddler.exe",
      "msedge.exe",
      "postman.exe",
    ];

    // Check each app in the list
    appsToTerminate.forEach((appName) => {
      exec(
        `tasklist /FI "IMAGENAME eq ${appName}"`,
        (error, stdout, stderr) => {
          if (error) {
            logEvent(`exec error: ${error}`);
            return;
          }
          if (stderr) {
            logEvent(`stderr: ${stderr}`);
            return;
          }

          const running = stdout.toLowerCase().includes(appName.toLowerCase());

          // If app is running and was previously not running, log it and terminate
          if (running && !appStates[appName]) {
            logEvent(`${appName} started running. Terminating...`);
            terminateApp(appName);
          } else if (!running && appStates[appName]) {
            // If app is not running and was previously running, log it
            logEvent(`${appName} stopped running.`);
          }

          // Update app state
          appStates[appName] = running;
        }
      );
    });
  } else {
    // macOS and Linux (Add appropriate commands for other platforms if needed)
    logEvent("App termination check is not implemented for this platform.");
  }
}

// Log initial state on app startup
app.on("ready", () => {
  checkAndTerminateApps();
});

// Check and log every 5 seconds
setInterval(checkAndTerminateApps, 5000);

module.exports = {
  checkAndTerminateApps,
};
