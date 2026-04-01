from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io

app = Flask(__name__)
# 🚨 CRITICAL: This line allows localhost:3000 (React) to talk to localhost:5000 (Flask)
CORS(app) 

# Load the YOLOv8 model. 
# It will auto-download the standard 'yolov8n.pt' the first time you run it.
# (If you have your own custom trained weights from your resume project, you can change this to 'best.pt' later!)
model = YOLO('best.pt') 

@app.route('/api/detect', methods=['POST'])
def detect_ingredients():
    # 1. Check if an image was actually sent
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']

    try:
        # 2. Open the image file
        img = Image.open(io.BytesIO(file.read()))

        # 3. Run YOLOv8 inference
        results = model(img)

        # 4. Extract the names of the detected objects
        detected_items = []
        for r in results:
            for box in r.boxes:
                class_id = int(box.cls[0])
                class_name = model.names[class_id]
                detected_items.append(class_name)

        # 5. Remove duplicates (so if it sees 3 carrots, it just says "carrot" once)
        unique_items = list(set(detected_items))

        # 6. Send the list back to Next.js!
        return jsonify({"ingredients": unique_items})

    except Exception as e:
        print("Error during detection:", e)
        return jsonify({"error": "Detection failed"}), 500

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)
