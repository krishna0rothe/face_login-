const video = document.getElementById("video");
const captureButton = document.getElementById("capture-button");
const confirmButton = document.getElementById("confirm-button");
const retryButton = document.getElementById("retry-button");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const threshold = 0.2; // Adjusted threshold for object detection

let model;

async function loadModel() {
  console.log("Loading model...");
  model = await cocoSsd.load();
  console.log("Model loaded.");
}

async function detectPhone() {
  // Draw the video frame to the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the image data from the canvas
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  // Convert the canvas image to a tensor
  const img = tf.browser.fromPixels(canvas);

  // Detect objects in the image
  const predictions = await model.detect(img);
  img.dispose();

  console.log("Predictions:", predictions);

  // Check for phone detection
  const phoneDetected = predictions.some(
    (prediction) =>
      prediction.class === "cell phone" && prediction.score >= threshold
  );

  if (phoneDetected) {
    alert(
      "Warning: Cell phone detected in the video feed. Please remove it and try again."
    );

    // Take a screenshot including the detected phone
    const screenshot = canvas.toDataURL("image/jpeg");

    // Send the cheating attempt to the server
    sendCheatingAttempt(
      screenshot,
      "Cell phone detected, while face verification "
    );
  }

  // Continue detection every half second
  setTimeout(detectPhone, 500);
}

function sendCheatingAttempt(screenshot, type) {
  const token = localStorage.getItem("jwtToken");
  console.log("Token retrieved from localStorage:", token);
  if (!token) {
    alert("Token not found. Please log in again.");
    return;
  }

  // Convert base64 data URL to Blob
  fetch(screenshot)
    .then((res) => res.blob())
    .then((blob) => {
      const formData = new FormData();
      formData.append("screenshot", blob, "screenshot.jpg"); // Append the Blob with a filename

      formData.append("type", type); // Append other form data

      fetch("http://localhost:3000/cheating-attempts/store", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // Ensure cookies are included
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

loadModel().then(() => {
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
});

captureButton.addEventListener("click", () => {
  // Draw the video frame to the canvas
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

  // Convert data URL to Blob
  fetch(photo)
    .then((res) => res.blob())
    .then((blob) => {
      const formData = new FormData();
      formData.append("photo", blob, "photo.jpg"); // Ensure file name is set correctly
      console.log("Sending request with token:", token);

      fetch("http://localhost:3000/verify", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // Ensure cookies are included
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
          if (result === true) {
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
