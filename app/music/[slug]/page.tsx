import { getProjects } from "@/lib/getProjects";
import ProjectView from "@/app/components/ProjectView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const projects = await getProjects("music");
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const projects = await getProjects("music");
    const project = projects.find((p) => p.slug === slug);

    if (!project) return { title: "Project Not Found" };

    return {
      title: `${project.title} | Music | Namaste Studio`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: [project.coverImage],
      },
    };
  } catch {
    return { title: "Project Not Found" };
  }
}

export default async function MusicProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const projects = await getProjects("music");
    const project = projects.find((p) => p.slug === slug);

    if (!project) notFound();

    return (
      <main>
        <ProjectView
          project={project}
          allProjects={projects}
          isStandalone={true}
        />
      </main>
    );
  } catch {
    notFound();
  }
}
