"use client";

import { useState } from 'react';

export default function AIPlayground() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle the user selecting an image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectedItems([]); // Reset previous results
    }
  };

  // Send the image to your Python backend
  const runDetection = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    // We use FormData to send actual files to a server
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // This will point to your Flask/FastAPI server running YOLOv8
      const response = await fetch('http://localhost:5000/api/detect', {
        method: 'POST',
        body: formData, // Notice we don't need 'Content-Type' headers for FormData
      });

      if (!response.ok) {
        throw new Error('Detection failed');
      }

      const data = await response.json();
      
      // Assuming your Python backend returns a list like: { "ingredients": ["Tomato", "Onion", "Egg"] }
      setDetectedItems(data.ingredients || []);

    } catch (error) {
      console.error("Error running model:", error);
      setDetectedItems(["Error: Could not connect to the YOLOv8 backend."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-400">Computer Vision Ingredient Detector</h1>
          <p className="text-gray-400">
            Powered by YOLOv8 and RT-DETR. Upload an image of your ingredients, and the object detection model will identify them.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg space-y-6 flex flex-col items-center">
          
          {/* Image Preview Area */}
          <div className="w-full h-64 bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center overflow-hidden relative">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="object-contain h-full w-full" />
            ) : (
              <p className="text-gray-500">No image selected</p>
            )}
          </div>

          {/* Upload Button */}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-500 cursor-pointer"
          />
          
          <button
            onClick={runDetection}
            disabled={!selectedFile || isLoading}
            className={`w-full py-3 rounded-lg font-bold transition-colors ${
              !selectedFile || isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {isLoading ? 'Running YOLOv8 Model...' : 'Detect Ingredients'}
          </button>
        </div>

        {/* Output Section */}
        {detectedItems.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-green-400">Detected Items:</h3>
            <div className="flex flex-wrap gap-2">
              {detectedItems.map((item, index) => (
                <span key={index} className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-full text-blue-300 font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
