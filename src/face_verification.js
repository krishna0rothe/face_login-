const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture-button");
const confirmButton = document.getElementById("confirm-button");
const retryButton = document.getElementById("retry-button");

// Access the user's webcam
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    console.error("Error accessing webcam:", error);
  });

captureButton.addEventListener("click", () => {
  capturePhoto();
});

confirmButton.addEventListener("click", () => {
  sendVerificationRequest();
});

retryButton.addEventListener("click", () => {
  retryCapture();
});

function capturePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  video.style.display = "none";
  canvas.style.display = "block";
  captureButton.style.display = "none";
  confirmButton.style.display = "inline-block";
  retryButton.style.display = "inline-block";
}

function retryCapture() {
  video.style.display = "block";
  canvas.style.display = "none";
  captureButton.style.display = "inline-block";
  confirmButton.style.display = "none";
  retryButton.style.display = "none";
}

async function sendVerificationRequest() {
  const token = localStorage.getItem("jwtToken");
  console.log("Token retrieved from localStorage:", token);
  if (!token) {
    alert("Token not found. Please log in again.");
    return;
  }

  const photo = canvas.toDataURL("image/jpeg");

  // Convert data URL to Blob
  const response = await fetch(photo);
  const blob = await response.blob();

  const formData = new FormData();
  formData.append("photo", blob, "photo.jpg");

  console.log("Sending request with token:", token);
  const fetchResponse = await fetch("http://localhost:3000/verify", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  console.log("Response status:", fetchResponse.status);
  const result = await fetchResponse.json();

  if (!fetchResponse.ok) {
    alert(result.message);
  } else {
    alert("Verification successful!");
  }
}
