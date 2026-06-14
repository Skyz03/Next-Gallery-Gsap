import { getProjects } from "@/lib/getProjects";
import ProjectView from "@/app/components/ProjectView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedsechos.com";

// Generate static params for all projects at build time
export async function generateStaticParams() {
  try {
    const projects = await getProjects("wedding");
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch {
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
    const projects = await getProjects("wedding");
    const project = projects?.find((p) => p.slug === slug);

    if (!project) {
      return {
        title: "Project Not Found",
      };
    }

    return {
      title: project.title,
      description: project.description,
      alternates: { canonical: `/projects/${slug}` },
      openGraph: {
        title: `${project.title} | Weds Echos`,
        description: project.description,
        url: `${siteUrl}/projects/${slug}`,
        images: [{ url: project.coverImage, width: 1200, height: 800, alt: project.title }],
        type: "article",
        locale: "en_US",
        siteName: "Weds Echos",
      },
      twitter: {
        card: "summary_large_image",
        title: `${project.title} | Weds Echos`,
        description: project.description,
        images: [project.coverImage],
      },
    };
  } catch {
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
    const projects = await getProjects("wedding");
    const project = projects?.find((p) => p.slug === slug);

    if (!project) {
      notFound();
    }

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Wedding Photography", item: siteUrl },
        { "@type": "ListItem", position: 3, name: project!.title, item: `${siteUrl}/projects/${slug}` },
      ],
    };

    return (
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <ProjectView project={project!} allProjects={projects ?? []} isStandalone={true} />
      </main>
    );
  } catch {
    notFound();
  }
}
