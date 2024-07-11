# 🎓 Face Login System

Welcome to the **Face Login System** project! This Electron.js application ensures a secure exam environment with an advanced proctoring system. It features user authentication, face verification, and exam proctoring capabilities.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🔧 Prerequisites](#-prerequisites)
- [🚀 Installation](#-installation)
- [💡 Usage](#-usage)
- [📂 Project Structure](#-project-structure)
- [🌐 API Endpoints](#-api-endpoints)
- [📜 License](#-license)

## ✨ Features

- **🔐 User Authentication**: Log in using student ID and password.
- **📸 Face Verification**: Verify identity with a live photo.
- **📊 Exam Proctoring**: Detect and log cheating attempts using TensorFlow.js.
- **👩‍🏫 Instructor Interface**: Manage exams, view logs, and create quizzes.
- **📝 Exam Module**: Multiple-choice questions, duration tracking, and results.

## 🔧 Prerequisites

- Node.js
- MongoDB
- Python 3
- OpenCV
- DeepFace
- Flask

## 🚀 Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/krishna0rothe/face_login-.git
    cd face_login-
    ```

2. **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3. **Set up the Python environment:**
    ```bash
    cd python
    pip install -r requirements.txt
    ```

4. **Configure MongoDB:**
    - Ensure MongoDB is running on your machine.
    - Update the MongoDB connection string in `server/config.js`.

## 💡 Usage

1. **Start the Python server:**
    ```bash
    cd python
    python app.py
    ```

2. **Start the Node.js server:**
    ```bash
    npm start
    ```

3. **Run the Electron app:**
    ```bash
    npm run electron
    ```

## 📂 Project Structure

```plaintext
face_login-
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
