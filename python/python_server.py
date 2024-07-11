from flask import Flask, request, jsonify
import cv2
import numpy as np
from deepface import DeepFace
import tempfile

app = Flask(__name__)

def decode_image(file_storage):
    try:
        image_path = tempfile.mktemp(suffix='.jpg')
        file_storage.save(image_path)
        image = cv2.imread(image_path)
        return image
    except Exception as e:
        print(f"Error decoding image: {str(e)}")
        return None

@app.route('/verify', methods=['POST'])
def verify():
    try:
        uploaded_photo = None
        stored_photo = None
        print(request.files)
        if 'uploadedPhoto' in request.files:
            uploaded_photo = decode_image(request.files['uploadedPhoto'])

        if 'storedPhoto' in request.files:
            stored_photo = decode_image(request.files['storedPhoto'])

        if uploaded_photo is None or stored_photo is None:
            return jsonify({"error": "Uploaded or stored photo not provided or cannot be decoded"}), 400

        result = DeepFace.verify(uploaded_photo, stored_photo, model_name='Facenet', enforce_detection=True,
                                  distance_metric='cosine', threshold=0.7)
        verified = result["verified"]

        return jsonify({"verified": verified})

    except Exception as e:
        print("Exception:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
