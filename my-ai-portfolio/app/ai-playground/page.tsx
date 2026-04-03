"use client";

import { useState, useRef } from 'react';

interface BoundingBox {
  id: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
  label: string;
}

export default function AIPlayground() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState<'rtdetr' | 'yolov8'>('rtdetr');
  
  // Bounding Box State
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Handle Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setBoxes([]); // Clear everything on new image
    }
  };

  // 2. Run the AI Model First
  const runDetection = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('modelType', modelType); // <--- Add this!

    try {
      // Send to Flask
      const response = await fetch('http://localhost:5000/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Detection failed');
      const data = await response.json();
      
      // Expected backend format: 
      // { predictions: [{ label: "Tomato", x: 20, y: 30, width: 15, height: 25 }] }
      // Notice we map the AI's results directly into our interactive boxes state!
      const aiBoxes = data.predictions.map((pred: any, index: number) => ({
        id: `ai-${index}-${Math.random().toString(36).substr(2, 5)}`,
        x: pred.x,
        y: pred.y,
        width: pred.width,
        height: pred.height,
        label: pred.label
      }));

      setBoxes(aiBoxes);

    } catch (error) {
      console.error("Error running model:", error);
      alert("Failed to connect to AI. You can still annotate manually.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Manual Drawing Logic (for corrections)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    const newX = Math.min(startPos.x, currentX);
    const newY = Math.min(startPos.y, currentY);
    const newWidth = Math.abs(currentX - startPos.x);
    const newHeight = Math.abs(currentY - startPos.y);

    setCurrentBox({ x: newX, y: newY, width: newWidth, height: newHeight });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentBox && currentBox.width! > 2) {
      const label = prompt("Missed by AI! What ingredient is this?");
      if (label && label.trim() !== "") {
        const newBox: BoundingBox = {
          id: `human-${Math.random().toString(36).substr(2, 9)}`,
          x: currentBox.x!,
          y: currentBox.y!,
          width: currentBox.width!,
          height: currentBox.height!,
          label: label.trim()
        };
        setBoxes([...boxes, newBox]);
      }
    }
    setIsDrawing(false);
    setCurrentBox(null);
    setStartPos(null);
  };

  const removeBox = (idToRemove: string) => {
    setBoxes(boxes.filter(box => box.id !== idToRemove));
  };

  const submitToDataset = () => {
    // Send `selectedFile` and the final `boxes` state back to Flask to save as YOLO .txt format
    console.log("Sending to training queue:", boxes);
    alert(`Successfully sent ${boxes.length} annotations to the model's training queue!`);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 pt-24 select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-400">AI Culinary Assistant: Active Learning</h1>
          <p className="text-gray-400">
            Upload an image and let the YOLOv8 model detect ingredients. If it makes a mistake, delete the box or draw a new one to help the model relearn!
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col items-center">
          
          <div className="flex w-full gap-4 mb-6">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="flex-grow text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
            />
            <button
              onClick={runDetection}
              disabled={!selectedFile || isLoading}
              className={`px-6 py-2 rounded-md font-bold transition-colors whitespace-nowrap ${
                !selectedFile || isLoading ? 'bg-blue-900/50 text-blue-300/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              }`}
            >
              {isLoading ? 'Detecting...' : '✨ Auto-Detect Ingredients'}
            </button>
          </div>
          <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
            <button 
              onClick={() => setModelType('rtdetr')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${modelType === 'rtdetr' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              RT-DETR
            </button>
            <button 
              onClick={() => setModelType('yolov8')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${modelType === 'yolov8' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              YOLOv8
            </button>
          </div>

          {/* THE ANNOTATION WORKSPACE */}
          <div 
            ref={containerRef}
            onMouseDown={previewUrl ? handleMouseDown : undefined}
            onMouseMove={previewUrl ? handleMouseMove : undefined}
            onMouseUp={previewUrl ? handleMouseUp : undefined}
            onMouseLeave={previewUrl ? handleMouseUp : undefined}
            className={`w-full relative overflow-hidden rounded-lg border-2 border-gray-600 flex items-center justify-center ${previewUrl ? 'cursor-crosshair bg-gray-900' : 'h-64 border-dashed bg-gray-800'}`}
            style={{ aspectRatio: previewUrl ? 'auto' : '16/9' }}
          >
            {!previewUrl && <p className="text-gray-500">No image selected</p>}
            
            {previewUrl && (
              <>
                <img src={previewUrl} alt="Workspace" className="w-full h-auto pointer-events-none" draggable={false} />
                
                {/* Render confirmed boxes (Both AI and Human) */}
                {boxes.map((box) => (
                  <div 
                    key={box.id}
                    className={`absolute border-2 group ${box.id.startsWith('ai') ? 'border-purple-500 bg-purple-500/20' : 'border-green-500 bg-green-500/20'}`}
                    style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.width}%`, height: `${box.height}%` }}
                  >
                    <div className={`absolute -top-6 left-0 text-white text-xs font-bold px-2 py-0.5 rounded shadow whitespace-nowrap flex items-center gap-2 ${box.id.startsWith('ai') ? 'bg-purple-500' : 'bg-green-500'}`}>
                      {box.label} {box.id.startsWith('ai') ? '🤖' : '👤'}
                      <button onClick={() => removeBox(box.id)} className="text-white hover:text-black font-bold ml-1 hidden group-hover:block">×</button>
                    </div>
                  </div>
                ))}

                {/* Render the box currently being drawn */}
                {isDrawing && currentBox && (
                  <div 
                    className="absolute border-2 border-dashed border-green-400 bg-green-400/20 pointer-events-none"
                    style={{ left: `${currentBox.x}%`, top: `${currentBox.y}%`, width: `${currentBox.width}%`, height: `${currentBox.height}%` }}
                  />
                )}
              </>
            )}
          </div>
        </div>
        
        
        {/* Output List & Save Button */}
        {boxes.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-200">Current Annotations</h3>
                <span className="text-xs text-gray-400">Hover over a box in the image to delete it.</span>
             </div>
             
            <div className="flex flex-wrap gap-2">
              {boxes.map((box) => (
                <span key={box.id} className={`px-3 py-1 bg-gray-900 border rounded-full text-sm flex items-center gap-2 ${box.id.startsWith('ai') ? 'border-purple-500/50 text-purple-400' : 'border-green-500/50 text-green-400'}`}>
                  {box.label} {box.id.startsWith('ai') ? '🤖' : '👤'}
                </span>
              ))}
            </div>
            
            <button 
              onClick={submitToDataset}
              className="mt-6 w-full py-3 bg-green-600 hover:bg-green-500 font-bold rounded-lg transition-colors shadow-lg shadow-green-900/20"
            >
              Confirm & Save to Training Dataset
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
