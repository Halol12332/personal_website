import Link from 'next/link';
import AboutMe from './components/AboutMe'; // Import the component here!

export default function Home() {
  const projects = [
    {
      title: "Smart Recipee: AI Culinary Assistant",
      description: "A full-stack computer vision application featuring a two-pillar architecture. Utilizes RT-DETR for object detection and YOLOv8n-cls for ingredient freshness classification, powered by a Flask backend and LLM integration.",
      tags: ["Next.js", "Flask", "YOLOv8", "RT-DETR", "Python"],
      link: "/ai-playground"
    },
    {
      title: "Environmental Sustainability Tracker",
      description: "A mobile application to track and visualize environmental metrics, enabling users to analyze sustainability trends through interactive dashboards.",
      tags: ["Flutter", "Firebase", "Firestore"],
      link: "https://github.com/Halol12332/bumicare2.git"
    },
    {
      title: "Simple Molecular Dynamics Simulator",
      description: "A high-performance C++ application utilizing CUDA for GPU acceleration to optimize the simulation of molecular interactions and code execution.",
      tags: ["C++", "CUDA", "Code Optimization", "Algorithms"],
      link: "https://github.com/Halol12332/DSPC.git"
    }
  ];

  return (
    // Updated: Match min-h-screen, bg-gray-900, text-white, and added pt-24 for the navbar
    <main className="min-h-screen bg-gray-900 text-white font-sans selection:bg-gray-700 antialiased pt-24 pb-12">
      
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
          Hello, I'm <span className="text-blue-400">Jaya Hakim Prajna</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Data Scientist & Software Engineer. I bridge the gap between machine learning models and scalable web applications.
        </p>
        <div className="flex gap-4">
          {/* Updated Buttons to match dark theme aesthetics */}
          <a href="https://github.com/halol12332" target="_blank" rel="noreferrer" className="px-6 py-3 bg-gray-800 text-white border border-gray-700 rounded-md font-medium hover:bg-gray-700 transition-colors shadow-sm">
            GitHub
          </a>
          <a href="https://linkedin.com/in/jayahakimprajna" target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
            LinkedIn
          </a>
        </div>
      </section>

      {/* Interactive About Me Section */}
      <AboutMe />

      {/* Projects Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-800 mt-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">Featured Work</h2>
          <p className="text-gray-400 mt-2">Recent projects combining data science and full-stack development.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            // Updated Cards: bg-gray-800, border-gray-700, rounded-xl (matches AI playground)
            <div key={idx} className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:border-gray-600 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, tagIdx) => (
                  // Updated Tags: bg-gray-900, text-gray-300
                  <span key={tagIdx} className="px-2.5 py-0.5 bg-gray-900 text-gray-300 text-xs font-bold rounded-full border border-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
              {/* Updated Link color to match blue-400 accent */}
              <Link href={project.link} className="text-sm font-bold text-blue-400 hover:text-blue-300 inline-flex items-center transition-colors">
                View Project &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main> 
  );
}
