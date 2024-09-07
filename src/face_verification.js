const video = document.getElementById("video");
const captureButton = document.getElementById("capture-button");
const confirmButton = document.getElementById("confirm-button");
const retryButton = document.getElementById("retry-button");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const threshold = 0.2; // Adjusted threshold for object detection

let worker = new Worker("src/worker.js");
worker.onmessage = function (event) {
  if (event.data.loaded) {
    console.log("Model loaded in worker.");
  } else {
    const predictions = event.data.predictions;
    //console.log("Predictions:", predictions);

    const phoneDetected = predictions.some(
      (prediction) =>
        prediction.class === "cell phone" && prediction.score >= threshold
    );

    if (phoneDetected) {
      alert(
        "Warning: Cell phone detected in the video feed. Please remove it and try again."
      );
      const screenshot = canvas.toDataURL("image/jpeg");
      sendCheatingAttempt(
        screenshot,
        "Cell phone detected, while face verification"
      );
    }
  }
};

async function detectPhone() {
  // Draw the video frame to the canvas at full resolution
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the image data from the full-resolution canvas
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  // Post the image data to the worker for detection
  worker.postMessage({
    imageData,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
  });

  setTimeout(detectPhone, 500); // Adjust detection frequency if needed
}

function sendCheatingAttempt(screenshot, type) {
  const token = localStorage.getItem("jwtToken");
  console.log("Token retrieved from localStorage:", token);
  if (!token) {
    alert("Token not found. Please log in again.");
    return;
  }

  fetch(screenshot)
    .then((res) => res.blob())
    .then((blob) => {
      const formData = new FormData();
      formData.append("screenshot", blob, "screenshot.jpg");
      formData.append("type", type);
      formData.append("examID", "66a778fd5a309a0b62ba2fd1"); // Hardcoded exam ID

      fetch("http://localhost:5000/cheating-attempts/store", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to log cheating attempt");
          }
          console.log("Cheating attempt logged successfully");
        })
        .catch((error) => {
          console.error("Error logging cheating attempt:", error);
        });
    })
    .catch((error) => {
      console.error("Error converting screenshot to Blob:", error);
    });
}

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      detectPhone(); // Start detecting phone in live feed
    };
  })
  .catch((error) => {
    console.error("Error accessing webcam:", error);
  });

captureButton.addEventListener("click", () => {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  video.pause();
  captureButton.style.display = "none";
  confirmButton.style.display = "block";
  retryButton.style.display = "block";
});

confirmButton.addEventListener("click", async () => {
  const token = localStorage.getItem("jwtToken");
  console.log("Token retrieved from localStorage:", token);
  if (!token) {
    alert("Token not found. Please log in again.");
    return;
  }

  const photo = canvas.toDataURL("image/jpeg");

  fetch(photo)
    .then((res) => res.blob())
    .then((blob) => {
      const formData = new FormData();
      formData.append("photo", blob, "photo.jpg");
      console.log("Sending request with token:", token);

      fetch("http://localhost:5000/verify", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })
        .then((response) => {
          console.log("Response status:", response.status);
          if (!response.ok) {
            throw new Error(
              "Verification failed. Not verified, please try again."
            );
          }
          return response.json();
        })
        .then((result) => {
          console.log("Verification result:", result);
          if (result.verified === true) {
            // Check the 'verified' property in the result object
            window.location.href = "verification_success.html"; // Redirect to success page
          } else {
            alert("Verification failed. Not verified, please try again.");
            captureButton.style.display = "block";
            confirmButton.style.display = "none";
            retryButton.style.display = "none";
            video.play();
          }
        })
        .catch((error) => {
          console.error("Error during verification:", error);
          captureButton.style.display = "block";
          confirmButton.style.display = "none";
          retryButton.style.display = "none";
          video.play();
        });
    })
    .catch((error) => {
      console.error("Error converting photo to Blob:", error);
    });
});

retryButton.addEventListener("click", () => {
  captureButton.style.display = "block";
  confirmButton.style.display = "none";
  retryButton.style.display = "none";
  video.play();
  detectPhone(); // Resume phone detection when retrying
});
