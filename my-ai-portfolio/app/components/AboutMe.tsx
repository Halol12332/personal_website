"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AboutMe() {
  const [score, setScore] = useState(0);
  const [bugPosition, setBugPosition] = useState({ top: '50%', left: '50%' });

  // Function to move the bug randomly inside its container
  const moveBug = () => {
    const randomTop = Math.floor(Math.random() * 80) + 10; // 10% to 90%
    const randomLeft = Math.floor(Math.random() * 80) + 10;
    setBugPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  const catchBug = () => {
    setScore(score + 1);
    moveBug();
  };

  // Move the bug every 2 seconds to make it tricky!
  useEffect(() => {
    const interval = setInterval(moveBug, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm flex flex-col md:flex-row gap-10 items-center">
        
        {/* Left Side: Profile & Specialties */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 bg-zinc-200 rounded-full overflow-hidden mb-6 border-4 border-white shadow-sm flex-shrink-0 relative">
            {/* Replace /profile.jpg with your actual image path in the public folder */}
            <Image 
                src="/profile.jpg" 
                alt="My Profile Picture" 
                fill
                className="object-cover"
            />
          </div>
          
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">About Me</h2>
          <p className="text-zinc-600 mb-6 leading-relaxed">
            I am a Data Science student and to be aspiring Fullstack Developer, passionate about bridging the gap between complex machine learning models and intuitive user interfaces. When I'm not training object detection models or optimizing C++ code, you can usually find me trying to keep my cat from walking across my keyboard.
          </p>
          
          <div className="w-full">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['Frontend (React/Next.js)', 'Backend (Node/Flask)', 'Computer Vision (YOLOv8)', 'Data Analysis'].map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Mini-Game */}
        <div className="w-full md:w-1/2">
          <div className="bg-zinc-900 rounded-xl p-6 text-white h-[300px] flex flex-col relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-center mb-4 z-10">
              <h3 className="text-sm font-mono text-zinc-400">interactive-terminal.exe</h3>
              <p className="text-sm font-mono text-green-400">Bugs Squashed: {score}</p>
            </div>
            
            <p className="text-xs text-zinc-500 font-mono mb-2 z-10">
              {">"} Recruiter Challenge: Catch the bug before it escapes!
            </p>
            
            {/* The Game Area */}
            <div className="flex-grow relative bg-zinc-800/50 rounded-lg border border-zinc-700/50 mt-2">
              <button 
                onClick={catchBug}
                onMouseEnter={moveBug} // Moves away if they try to hover over it slowly!
                className="absolute text-2xl transition-all duration-200 ease-in-out cursor-crosshair transform -translate-x-1/2 -translate-y-1/2"
                style={{ top: bugPosition.top, left: bugPosition.left }}
                title="Squash me!"
              >
                🐛
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
