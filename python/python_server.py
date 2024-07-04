from flask import Flask, request, jsonify
from deepface import DeepFace
import cv2
import numpy as np
import base64

app = Flask(__name__)

def decode_image(base64_str):
    try:
        image_data = base64.b64decode(base64_str)
        np_arr = np.frombuffer(image_data, np.uint8)
        return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception as e:
        print(f"Error decoding image: {str(e)}")
        return None

@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()

    if 'uploadedPhoto' not in data or 'storedPhoto' not in data:
        return jsonify({"error": "Images not provided"}), 400

    try:
        uploaded_photo = decode_image(data['uploadedPhoto'])
        stored_photo = decode_image(data['storedPhoto'])

        # Ensure images are correctly read
        if uploaded_photo is None:
            return jsonify({"error": "Error decoding uploaded photo"}), 400
        if stored_photo is None:
            return jsonify({"error": "Error decoding stored photo"}), 400

        # Debug information
        print("Uploaded photo shape:", uploaded_photo.shape)
        print("Stored photo shape:", stored_photo.shape)

        # Perform face verification
        result = DeepFace.verify(uploaded_photo, stored_photo, model_name='Facenet', enforce_detection=True)
        verified = result["verified"]
        return jsonify({"verified": verified})
    except Exception as e:
        print("Exception:", str(e))  # Print the exact exception message
        if 'Face could not be detected' in str(e):
            return jsonify({"error": "No face detected in the uploaded photo"}), 400
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
