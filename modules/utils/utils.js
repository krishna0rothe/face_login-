const { dialog } = require("electron");
const fs = require("fs").promises;
const path = require("path");

const logFile = path.join(__dirname, "../../logs/activity.log");

let activeWarnings = {}; // Object to track active warnings
let warningTimeout; // Timeout to handle debouncing

async function showWarning(message) {
  if (activeWarnings[message]) return; // If warning is already active, return

  activeWarnings[message] = true; // Mark warning as active

  await logEvent(message);

  dialog
    .showMessageBox({
      type: "warning",
      buttons: ["OK"],
      defaultId: 0,
      title: "Warning",
      message: message,
    })
    .then(() => {
      // Set timeout to clear active warning after some time
      warningTimeout = setTimeout(() => {
        delete activeWarnings[message]; // Clear active warning after timeout
        clearTimeout(warningTimeout);
        warningTimeout = null;
      }, 5000); // Debounce time of 5 seconds (adjust as needed)
    })
    .catch((error) => {
      console.error("Error showing warning:", error);
    });
}

async function logEvent(message) {
  try {
    const timestamp = new Date().toISOString();
    await fs.appendFile(logFile, `[${timestamp}] ${message}\n`);
  } catch (error) {
    console.error("Error logging event:", error);
  }
}

module.exports = { showWarning, logEvent };
