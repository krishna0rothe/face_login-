const { desktopCapturer } = require("electron");

function monitorScreenCaptureTools(showWarning, quitApp) {
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
      });
  }, 1000);
}

module.exports = { monitorScreenCaptureTools };



