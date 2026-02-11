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
      <div className="lg:col-span-4">
        <ProjectCard image="/wed3.jpg" title="Moments De Luxe" location="Catelo" aspect="portrait" />
      </div>
      <div className="lg:col-span-4">
        <ProjectCard image="/wed4.jpg" title="Graceful Moments" location="Boracay" aspect="portrait" />
      </div>
      <div className="lg:col-span-4">
        <ProjectCard image="/wed5.jpg" title="Tuscany" location="Fanteko" aspect="portrait" />
      </div>
      <div className="lg:col-span-4">
        <ProjectCard image="/wed6.jpg" title="Mystical Moments" location="Valino" aspect="portrait" />
      </div>
      <div className="lg:col-span-4">
        <ProjectCard image="/wed7.jpg" title="Scorching Moments" location="Botesaka" aspect="portrait" />
      </div>
      <div className="lg:col-span-4">
        <ProjectCard image="/wed8.jpg" title="Find Your Perfect Moment" location="Boadesa" aspect="portrait" />
      </div>
      <div className="lg:col-span-4">
        <ProjectCard image="/wed3.jpg" title="Gathering De Luxe" location="Dumess" aspect="portrait" />
      </div>
      <div className="lg:col-span-4">
        <ProjectCard image="/wed10.jpg" title="Dane De Cate" location="Rackeo" aspect="portrait" />
      </div>
      <div className="lg:col-span-4">
        <ProjectCard image="/wed11.jpg" title="Ethereal Di Fout" location="Barbero" aspect="portrait" />
      </div>
      <div className="lg:col-span-4">
        <ProjectCard image="/wed12.jpg" title="Mixining Moments" location="Pluta" aspect="portrait" />
      </div>
    </section>
  );
}
