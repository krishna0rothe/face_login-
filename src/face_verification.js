const video = document.getElementById("video");
const captureButton = document.getElementById("capture-button");

// Access the user's webcam
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    console.error("Error accessing webcam:", error);
  });

captureButton.addEventListener("click", async () => {
  const token = localStorage.getItem("jwtToken");
  console.log("Token retrieved from localStorage:", token);
  if (!token) {
    alert("Token not found. Please log in again.");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const photo = canvas.toDataURL("image/jpeg");

  // Convert data URL to Blob
  const response = await fetch(photo);
  const blob = await response.blob();

  const formData = new FormData();
  formData.append("photo", blob, "photo.jpg"); // Ensure file name is set correctly

  console.log("Sending request with token:", token);
  const fetchResponse = await fetch("http://localhost:3000/verify", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // Ensure cookies are included
  });

  console.log("Response status:", fetchResponse.status);
  const result = await fetchResponse.json();

  if (!fetchResponse.ok) {
    alert(result.message);
  } else {
    alert("Verification successful!");
  }
});
