export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      
      {/* Hero Section */}
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Jaya Hakim Prajna
        </h1>
        <h2 className="text-2xl text-blue-400 font-semibold">
          Data Scientist & Software Engineer
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Building AI-driven applications, scalable cloud infrastructure, and modern web interfaces.
        </p>
        
        {/* Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <a 
            href="https://github.com/halol12332" 
            target="_blank"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors border border-gray-700"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/jayahakimprajna" 
            target="_blank"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>

    </main>
  );
}
