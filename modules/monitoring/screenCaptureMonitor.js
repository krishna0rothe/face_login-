const { showWarning } = require("../utils/utils");
const { desktopCapturer } = require("electron");

function monitorScreenCaptureTools() {
  setInterval(() => {
    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then((sources) => {
        sources.forEach((source) => {
          if (
            source.name.includes("Snipping Tool") ||
            source.name.includes("Screenshot")
          ) {
            showWarning("Screen capture tools are not allowed.");
          }
        });
      })
      .catch((error) => {
        console.error("Error detecting screen capture tools:", error);
      });
  }, 1000); // Interval time (adjust as needed)
}

module.exports = { monitorScreenCaptureTools };
