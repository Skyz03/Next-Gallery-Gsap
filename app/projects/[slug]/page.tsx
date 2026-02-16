import { getProjects } from "@/lib/getProjects";
import ProjectView from "@/app/components/ProjectView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Generate static params for all projects at build time
export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects?.map((project) => ({
      slug: project.slug,
    })) || [];
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const projects = await getProjects();
    const project = projects?.find((p) => p.slug === slug);

    if (!project) {
      return {
        title: "Project Not Found",
      };
    }

    return {
      title: `${project.title} | Wedding Photography`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: [project.coverImage],
      },
    };
  } catch (error) {
    return {
      title: "Project Not Found",
    };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const projects = await getProjects();
    const project = projects?.find((p) => p.slug === slug);

    if (!project) {
      notFound();
    }

    return (
      <main>
        <ProjectView project={project} isStandalone={true} />
      </main>
    );
  } catch (error) {
    console.error("Failed to load project:", error);
    notFound();
  }
}
