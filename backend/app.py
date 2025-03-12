from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError
import joblib
import os
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Define absolute paths to the model files
waste_model_path = r'C:\Users\shrad\mini_project\ai-waste-project\backend\models\trashnet_mobilenetv2_nutrients.h5'
soil_model_path = r'C:\Users\shrad\mini_project\ai-waste-project\backend\models\soil_model.pkl'

# Check if the model files exist
if not os.path.exists(waste_model_path):
    raise FileNotFoundError(f"Waste classification model file not found at {waste_model_path}. Please train the model first.")

if not os.path.exists(soil_model_path):
    raise FileNotFoundError(f"Soil model file not found at {soil_model_path}. Please train the model first.")

# Load waste classification and nutrient prediction model
waste_model = load_model(waste_model_path, custom_objects={'mse': MeanSquaredError()})
soil_model = joblib.load(soil_model_path)

# Define waste and nutrient labels
waste_class_labels = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
nutrient_labels = ['zinc', 'copper', 'iron', 'nitrogen', 'phosphorus', 'potassium', 'magnesium']

# Root route
@app.route('/')
def home():
    return "Welcome to the Waste Classification API! Use the /classify_waste endpoint to classify waste."

# Helper function to preprocess the image
def preprocess_image(file):
    try:
        image = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Unable to decode the image. Please ensure the file is a valid image.")
        resized_image = cv2.resize(image, (224, 224))
        normalized_image = resized_image / 255.0
        input_image = np.expand_dims(normalized_image, axis=0)  # Shape: (1, 224, 224, 3)
        return input_image
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        raise

# Classify waste endpoint
@app.route('/classify_waste', methods=['POST'])
def classify_waste():
    try:
        # Get the image file from the request
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']
        input_image = preprocess_image(file)

        # Debug: Print input image shape and values
        logger.debug(f"Input Image Shape: {input_image.shape}")  # Should be (1, 224, 224, 3)
        logger.debug(f"Input Image Values (Min, Max): {input_image.min()}, {input_image.max()}")  # Should be 0.0 and 1.0

        # Use default soil features if not provided
        soil_features = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]  # Default values
        soil_features = np.array([soil_features])  # Shape: (1, 7)

        # Predict waste class and nutrient levels
        waste_class_pred, nutrient_levels_pred = waste_model.predict([input_image, soil_features])
        predicted_class = waste_class_labels[np.argmax(waste_class_pred)]
        nutrient_levels = {nutrient_labels[i]: float(nutrient_levels_pred[0][i]) for i in range(len(nutrient_labels))}

        # Debug: Print model predictions
        logger.debug(f"Waste Class Predictions: {waste_class_pred}")
        logger.debug(f"Predicted Class: {predicted_class}")
        logger.debug(f"Nutrient Levels Predictions: {nutrient_levels_pred}")
        logger.debug(f"Nutrient Levels: {nutrient_levels}")

        # Determine if waste is biodegradable
        biodegradable = predicted_class in ['cardboard', 'paper', 'trash']

        return jsonify({
            'class': predicted_class,
            'biodegradable': biodegradable,
            'nutrient_levels': nutrient_levels
        })

    except Exception as e:
        logger.error(f"Error in classify_waste: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)