import Link from 'next/link';

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
    <main className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200 antialiased">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl mb-6">
          Hello, I'm <span className="text-blue-600">Jaya Hakim Prajna</span>
        </h1>
        <p className="text-xl text-zinc-600 max-w-2xl mb-10 leading-relaxed">
          Data Scientist & Software Engineer. I bridge the gap between machine learning models and scalable web applications.
        </p>
        <div className="flex gap-4">
          <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="px-6 py-3 bg-zinc-900 text-white rounded-md font-medium hover:bg-zinc-800 transition-colors">
            GitHub
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-md font-medium hover:bg-zinc-100 transition-colors shadow-sm">
            LinkedIn
          </a>
        </div>
      </section>

      {/* Projects Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-200">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Featured Work</h2>
          <p className="text-zinc-500 mt-2">Recent projects combining data science and full-stack development.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div key={idx} className="flex flex-col bg-white border border-zinc-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">{project.title}</h3>
              <p className="text-zinc-600 text-sm mb-6 flex-grow leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="px-2.5 py-0.5 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-full border border-zinc-200">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={project.link} className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center">
                View Project &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
