const { desktopCapturer } = require("electron");
const axios = require("axios");
const FormData = require("form-data");
const jwtHandler = require("../jwtHandler");

async function captureScreenshot(type) {
  try {
    const sources = await desktopCapturer.getSources({ types: ["screen"] });

    for (const source of sources) {
      if (source.name === "Entire screen" || source.name === "Screen 1") {
        const screenshot = await captureHighResolutionScreenshot(source);
        const token = jwtHandler.getJwtToken(); // Retrieve JWT token
        await sendCheatingAttempt(screenshot, type, token);
        console.log("Captured high-resolution screenshot", screenshot.length);
        break;
      }
    }
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
  }
}

async function captureHighResolutionScreenshot(source) {
  const image = source.thumbnail.toDataURL({ scaleFactor: 2 }); // Increase scaleFactor to improve resolution
  const base64Data = image.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64Data, "base64");
}

async function sendCheatingAttempt(screenshot, type, token) {
  const formData = new FormData();
  formData.append("screenshot", screenshot, "screenshot.png");
  formData.append("type", type);
  formData.append("examID", "66a778fd5a309a0b62ba2fd1"); // Hardcoded exam ID

  try {
    const response = await axios.post(
      "http://localhost:5000/cheating-attempts/store",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,

        },
        withCredentials: true, // Ensure credentials are sent with the request
      }
    );

    if (response.status !== 201) {
      throw new Error(`Failed to log cheating attempt, server responded with status: ${response.status}`);
    }

    console.log("Cheating attempt logged successfully");
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200
      console.error("Error logging cheating attempt:", error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error("Error logging cheating attempt, no response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error logging cheating attempt:", error.message);
    }
  }
}

module.exports = {
  captureScreenshot,
};
