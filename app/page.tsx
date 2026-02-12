import Hero from "./components/Hero";
import ProjectCard from "./components/ProjectCard";

const weddingProjects = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  image: `/wed${i + 1}.jpg`,
  title: `Wedding ${i + 1}`,
  location: "Destination Wedding",
  aspect: "portrait" as const,
}));

export default function Home() {
  // Split projects into 3 columns using the id to keep a nice staggered layout
  const columns = [0, 1, 2].map((col) =>
    weddingProjects.filter((project) => project.id % 3 === col)
  );

  return (
    <main className="relative bg-[#faf9f6]">
      {/* 1. Hero Section (200vh total height for scroll room) */}
      <Hero />

      {/* 2. Transition Space / Only Images Section */}
      <section className="relative z-20 -mt-[30vh] pb-24 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1 */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            {columns[0].map((project) => (
              <ProjectCard
                key={project.id}
                index={project.id}
                image={project.image}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
              />
            ))}
          </div>

          {/* Column 2 - Offset for that staggered luxury look */}
          <div className="lg:col-span-4 lg:mt-64 flex flex-col gap-12">
            {columns[1].map((project) => (
              <ProjectCard
                key={project.id}
                index={project.id}
                image={project.image}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
              />
            ))}
          </div>

          {/* Column 3 - Offset differently */}
          <div className="lg:col-span-4 lg:mt-32 flex flex-col gap-12">
            {columns[2].map((project) => (
              <ProjectCard
                key={project.id}
                index={project.id}
                image={project.image}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}