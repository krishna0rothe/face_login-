const { BrowserWindow, dialog, app } = require("electron");
const path = require("path");
const { showWarning } = require("./modules/utils/utils");

/**
 * Sets up proctoring and detection for the given window.
 * @param {BrowserWindow} mainWindow - The window to set up proctoring for.
 */
function setupProctoring(mainWindow) {
  let isWarningActive = false; // Initialize isWarningActive
  let blurCooldown = false; // Initialize blurCooldown

  mainWindow.webContents.on("devtools-opened", () => {
    mainWindow.webContents.closeDevTools();
    showWarning("Developer Tools are disabled.");
  });

  mainWindow.webContents.setWindowOpenHandler(() => {
    showWarning("Opening new windows or tabs is not allowed.");
    return { action: "deny" };
  });

  mainWindow.webContents.on("context-menu", (e) => {
    e.preventDefault();
    showWarning("Right-click is disabled.");
  });

  mainWindow.webContents.on("before-input-event", (event, input) => {
    const blockedKeys = [
      "F12",
      "Escape",
      "PrintScreen",
      "Insert",
      "Delete",
      "End",
      "Home",
      "PageUp",
      "PageDown",
    ];
    if (blockedKeys.includes(input.key)) {
      event.preventDefault();
      showWarning("Key combination is disabled.");
    }
  });

  mainWindow.webContents.on("will-navigate", (e, url) => {
    e.preventDefault();
    showWarning("Navigation is disabled.");
  });

  mainWindow.webContents.on("new-window", (e, url) => {
    e.preventDefault();
    showWarning("Opening new windows is disabled.");
  });

  mainWindow.on("blur", () => {
    if (!isWarningActive && !blurCooldown) {
      isWarningActive = true;
      blurCooldown = true;
      mainWindow.focus();

      setTimeout(() => {
        blurCooldown = false;
        isWarningActive = false;
      }, 2000);
    }
  });

  mainWindow.on("resize", (e) => {
    e.preventDefault();
    mainWindow.setFullScreen(true);
  });

  mainWindow.on("minimize", (e) => {
    e.preventDefault();
    showWarning("Minimizing the window is disabled.");
    mainWindow.restore();
  });

  mainWindow.on("close", (e) => {
    if (!isWarningActive) {
      e.preventDefault();
      isWarningActive = true;

      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: "question",
        buttons: ["Yes", "No"],
        title: "Confirm",
        message: "Are you sure you want to quit?",
      });

      if (choice === 0) {
        app.exit(0); // Ensure the application exits correctly
      } else {
        isWarningActive = false;
      }
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

module.exports = { setupProctoring };
