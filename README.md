# 🌐 Safe Browser Environment for Online Exams

Welcome to the **Safe Browser Environment for Online Exams** project! This Electron.js application is designed to provide a secure and controlled environment for conducting online exams. It features advanced proctoring capabilities, including face verification, activity monitoring, and secure browser restrictions to ensure exam integrity.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🔧 Prerequisites](#-prerequisites)
- [🚀 Installation](#-installation)
- [💡 Usage](#-usage)
- [📂 Project Structure](#-project-structure)
- [🌐 API Endpoints](#-api-endpoints)

## ✨ Features

- **🔐 Secure Exam Environment**: Full-screen mode with browser restrictions to prevent access to external resources.
- **📸 Face Verification**: Ensures that the exam is taken by the authorized student.
- **👁️ Activity Monitoring**: Detects and logs prohibited activities such as screen capture, navigation away from the exam window, and the use of unauthorized applications.
- **📝 Exam Module**: Supports various types of questions and tracks exam duration.

## 🔧 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine. Download and install from [Node.js official website](https://nodejs.org/).
- **MongoDB**: A NoSQL database used to store application data. Install MongoDB following the instructions on the [MongoDB official documentation](https://docs.mongodb.com/manual/installation/).
- **Python 3**: Required for running the face verification and activity monitoring scripts. Download and install Python 3 from the [Python official website](https://www.python.org/downloads/).
- **Electron.js**: A framework for creating native applications with web technologies. It will be installed as part of the Node.js dependencies.
- **Flask**: A micro web framework written in Python, used for the backend API. It will be installed as part of the Python environment setup.

## 🚀 Installation

Follow these steps to get your development environment set up:

1. **Clone the repository:**
    - This step copies the project files to your local machine.
    ```bash
    git clone https://github.com/your-repository/safe-browser-environment.git
    cd safe-browser-environment
    ```

2. **Install Node.js dependencies:**
    - This step installs Electron.js along with other necessary Node.js packages defined in `package.json`.
    ```bash
    npm install
    ```

3. **Set up the Python environment:**
    - Navigate to the Python directory within the project.
    - Create a virtual environment for Python dependencies. This keeps your project's dependencies isolated from other Python projects.
    - Activate the virtual environment.
    - Install Python dependencies listed in `requirements.txt`, including Flask.
    ```bash
    cd python
    python -m venv venv
    venv\Scripts\activate  # On Windows
    source venv/bin/activate  # On Unix or MacOS
    pip install -r requirements.txt
    ```

4. **Configure MongoDB:**
    - Ensure MongoDB is running on your machine. You can start MongoDB by following the instructions specific to your operating system.
    - Update the MongoDB connection string in `server/config.js` to point to your local MongoDB instance or a MongoDB Atlas cluster, depending on where you intend to host the database.

## 💡 Usage

1. **Start the Python server:**
    ```bash
    cd python
    python app.py
    ```

2. **Start the Node.js server:**
    ```bash
    npm run server
    ```

3. **Run the Electron app:**
    ```bash
    npm start
    ```

## 📂 Project Structure

```plaintext
safe-browser-environment-
├── python/
│   ├── app.py
│   ├── requirements.txt
│   └── ... (other Python scripts for face verification)
├── server/
│   ├── config.js
│   ├── routes/
│   │   └── ... (Node.js API routes)
│   ├── models/
│   │   └── ... (Mongoose models)
│   └── ... (other server files)
├── src/
│   ├── renderer.js
│   ├── face_verification.js
│   └── ... (other frontend JS files)

```


## 🌐 API Endpoints

Below are the API endpoints available in the Safe Browser Environment for Online Exams project. These endpoints facilitate communication between the client application and the server, handling tasks such as face verification and logging of cheating attempts.

### Face Verification

- **POST /api/verify**
  - **Description**: Verifies the student's face against the registered profile.
  - **Body**:
    - `image`: A base64 encoded image of the student's face.
  - **Response**:
    - `200 OK`: Verification successful.
    - `401 Unauthorized`: Verification failed.

### Cheating Attempts

- **GET /api/cheating_attempts**
  - **Description**: Retrieves a list of logged cheating attempts.
  - **Query Parameters**:
    - `examId`: The unique identifier for the exam.
  - **Response**:
    - `200 OK`: Successfully retrieved.
    - `204 No Content`: No cheating attempts found.

- **POST /api/cheating_attempts/store**
  - **Description**: Logs a new cheating attempt.
  - **Body**:
    - `examId`: The unique identifier for the exam.
    - `studentId`: The unique identifier for the student.
    - `type`: The type of cheating attempt (e.g., "screen_capture", "navigation_away").
    - `timestamp`: The timestamp when the attempt occurred.
  - **Response**:
    - `201 Created`: Successfully logged.
    - `400 Bad Request`: Missing or invalid parameters.

### Exam Management

- **GET /api/exams/{examId}**
  - **Description**: Retrieves details about a specific exam.
  - **Path Parameters**:
    - `examId`: The unique identifier for the exam.
  - **Response**:
    - `200 OK`: Successfully retrieved.
    - `404 Not Found`: Exam not found.

- **POST /api/exams/create**
  - **Description**: Creates a new exam.
  - **Body**:
    - `title`: The title of the exam.
    - `duration`: The duration of the exam in minutes.
    - `questions`: An array of questions for the exam.
  - **Response**:
    - `201 Created`: Successfully created.
    - `400 Bad Request`: Missing or invalid parameters.

These endpoints are designed to be RESTful and should be accessed using the appropriate HTTP methods. Ensure that requests to these endpoints are authenticated and authorized as necessary to protect sensitive data and operations.
