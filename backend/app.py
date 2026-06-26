import os
import json
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np

from pymongo import MongoClient
from dotenv import load_dotenv
from tensorflow.keras.models import load_model

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
predictions_collection = db[COLLECTION_NAME]

try:
    client.admin.command("ping")
    print("MongoDB connected successfully")
except Exception as e:
    print("MongoDB connection failed:", e)

# Model loading
MODEL_PATH = os.path.join("model", "lung_cancer_model.h5")
LABELS_PATH = os.path.join("model", "labels.json")

model = load_model(MODEL_PATH)

with open(LABELS_PATH, "r") as f:
    class_names = json.load(f)

print("Model loaded successfully")
print("Class labels:", class_names)


def invalid_image_response(reason):
    return {
        "predicted_class": "invalid_image",
        "confidence": 0,
        "risk_level": "Unknown",
        "other_probabilities": {},
        "suggestion": reason,
    }


def is_likely_ct_scan(image_path):
    try:
        image = Image.open(image_path).convert("RGB")
        image = image.resize((224, 224))
        img = np.array(image)

        r = img[:, :, 0].astype("float32")
        g = img[:, :, 1].astype("float32")
        b = img[:, :, 2].astype("float32")

        rg_diff = np.mean(np.abs(r - g))
        rb_diff = np.mean(np.abs(r - b))
        gb_diff = np.mean(np.abs(g - b))

        avg_channel_diff = (rg_diff + rb_diff + gb_diff) / 3

        # CT scan images are usually grayscale-like.
        # Colorful non-medical images usually have higher channel difference.
        return avg_channel_diff < 18

    except Exception:
        return False


def predict_image(image_path):
    # Step 1: Reject obvious non-CT images
    if not is_likely_ct_scan(image_path):
        return invalid_image_response(
            "The uploaded image does not appear to be a valid lung CT scan. "
            "Please upload a proper medical scan image."
        )

    # Step 2: Preprocess image
    image = Image.open(image_path).convert("RGB")
    image = image.resize((224, 224))

    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Step 3: Model prediction
    predictions = model.predict(img_array, verbose=0)[0]

    probs = {
        class_names[str(i)]: round(float(predictions[i] * 100), 2)
        for i in range(len(predictions))
    }

    predicted_class = max(probs, key=probs.get)
    confidence = probs[predicted_class]

    # Step 4: Reject uncertain predictions
    if confidence < 55:
        return invalid_image_response(
            "The uploaded image is not a valid or clear lung CT scan. "
            "Please upload a clearer and proper medical scan image."
        )

    # Step 5: Risk logic
    if predicted_class == "normal":
        if confidence > 80:
            risk_level = "Low"
        else:
            risk_level = "Moderate"
    else:
        if confidence > 80:
            risk_level = "High"
        elif confidence > 60:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

    # Step 6: Suggestion logic
    if predicted_class == "normal":
        suggestion = (
            "The scan appears closer to normal patterns. Please still consult "
            "a doctor for proper medical confirmation."
        )
    elif predicted_class == "adenocarcinoma":
        if risk_level == "High":
            suggestion = (
                "High-confidence adenocarcinoma pattern detected. Please "
                "consult an oncologist or chest specialist immediately."
            )
        elif risk_level == "Moderate":
            suggestion = (
                "Possible adenocarcinoma pattern detected. Further clinical "
                "evaluation and diagnostic testing are recommended."
            )
        else:
            suggestion = (
                "Adenocarcinoma probability is low, but medical review is still "
                "advised for confirmation."
            )
    elif predicted_class == "large_cell_carcinoma":
        if risk_level == "High":
            suggestion = (
                "High-confidence large cell carcinoma pattern detected. "
                "Immediate specialist consultation is recommended."
            )
        elif risk_level == "Moderate":
            suggestion = (
                "Possible large cell carcinoma pattern detected. Please undergo "
                "further evaluation by a specialist."
            )
        else:
            suggestion = (
                "Large cell carcinoma probability is low, but clinical review "
                "is recommended."
            )
    elif predicted_class == "squamous_cell_carcinoma":
        if risk_level == "High":
            suggestion = (
                "High-confidence squamous cell carcinoma pattern detected. "
                "Please seek medical evaluation and further screening urgently."
            )
        elif risk_level == "Moderate":
            suggestion = (
                "Possible squamous cell carcinoma pattern detected. Additional "
                "diagnostic consultation is recommended."
            )
        else:
            suggestion = (
                "Squamous cell carcinoma probability is low, but medical review "
                "is still advised."
            )
    else:
        suggestion = "Please consult a doctor for proper diagnosis."

    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "risk_level": risk_level,
        "other_probabilities": probs,
        "suggestion": suggestion,
    }


@app.route("/")
def home():
    return jsonify({"message": "Backend is running"})


@app.route("/api/test")
def test():
    return jsonify({"message": "API is working properly"})


@app.route("/api/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    prediction_result = predict_image(filepath)

    document = {
        "image_name": filename,
        "image_path": filepath,
        "predicted_class": prediction_result["predicted_class"],
        "confidence": prediction_result["confidence"],
        "risk_level": prediction_result["risk_level"],
        "other_probabilities": prediction_result["other_probabilities"],
        "suggestion": prediction_result["suggestion"],
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    inserted = predictions_collection.insert_one(document)
    document["_id"] = str(inserted.inserted_id)

    return jsonify(document)


@app.route("/api/history", methods=["GET"])
def get_history():
    documents = list(predictions_collection.find().sort("_id", -1))

    for doc in documents:
        doc["_id"] = str(doc["_id"])

    return jsonify(documents)


if __name__ == "__main__":
    app.run(debug=True)