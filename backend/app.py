from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io

app = Flask(__name__)
# 🚨 CRITICAL: This line allows localhost:3000 (React) to talk to localhost:5000 (Flask)
CORS(app) 

# Load both models at startup
models = {
    'rtdetr': YOLO('rtdetr.pt'),
    'yolov8': YOLO('yolov8.pt') # Ensure this file exists in your backend folder!
}

@app.route('/api/detect', methods=['POST'])
def detect_ingredients():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    # Get the model type from the request (default to rtdetr)
    model_type = request.form.get('modelType', 'rtdetr')
    model = models.get(model_type, models['rtdetr'])

    file = request.files['image']

    try:
        img = Image.open(io.BytesIO(file.read()))
        results = model(img)

        predictions = []
        for r in results:
            boxes = r.boxes.xyxyn.tolist() 
            classes = r.boxes.cls.tolist()
            
            for i in range(len(boxes)):
                x_min, y_min, x_max, y_max = boxes[i]
                predictions.append({
                    "label": model.names[int(classes[i])],
                    "x": x_min * 100,
                    "y": y_min * 100,
                    "width": (x_max - x_min) * 100,
                    "height": (y_max - y_min) * 100
                })

        return jsonify({
            "predictions": predictions,
            "modelUsed": model_type # Tell frontend which one was used
        })

    except Exception as e:
        print(f"Error with {model_type}:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/save-correction', methods=['POST'])
def save_correction():
    model_type = request.form.get('modelType')
    # Use model_type to save the image to /train/rtdetr/ or /train/yolov8/
    save_path = f"./train/{model_type}/"
    # ... logic to save file ...
    return jsonify({"status": "saved", "path": save_path})
if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)
