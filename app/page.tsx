import Image from "next/image";
import Hero from "./components/Hero";
import ProjectCard from "./components/ProjectCard";

export default function Home() {
  return (

    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-center">
      <div className="lg:col-span-4">
        <ProjectCard image="wed1.jpg" title="The Villa" location="Como" aspect="portrait" />
      </div>

      <div className="lg:col-span-4">
        <ProjectCard image="/wed2.jpg" title="Ethereal Grace" location="Tuscany" aspect="portrait" />
      </div>
    </section>
  );
}
