export type ProjectCategory = "wedding" | "music" | "commercial";

const categoryRouteMap: Record<ProjectCategory, string> = {
  wedding: "/projects",
  music: "/music",
  commercial: "/commercial",
};

export function getProjectHref(project: { category: ProjectCategory; slug: string }) {
  const base = categoryRouteMap[project.category] ?? "/projects";
  return `${base}/${project.slug}`;
}

export interface Project {
    id: string;
    slug: string;
    category: ProjectCategory;
    title: string;
    client: string;
    description: string;
    coverImage: string;
    gallery: string[];
    location: string;
    aspect: "portrait" | "landscape";
}

export const projects: Project[] = [
    {
        id: "ethereal-grace",
        slug: "marco-and-brittney",
        category: "wedding",
        title: "Sumit & Britannice",
        client: "Marco & Brittney",
        location: "Thamel, Kathmandu",
        aspect: "portrait",
        description: "A cinematic exploration of light and intimacy, captured through the Namaste Flux lens in the hills of Tuscany.",
        coverImage: "/wed1.jpg",
        gallery: [
            "/wed1.jpg",
            "/wed2.jpg",
            "/wed3.jpg",
            "/wed4.jpg",
            "/wed5.jpg"
        ]
    },
    {
        id: "urban-solitude",
        slug: "kevin-and-sarah",
        category: "wedding",
        title: "Kevin & Sarah",
        client: "Kevin & Sarah",
        location: "Thamel, Kathmandu",
        aspect: "portrait",
        description: "Modern love meets the brutalist architecture of London, blending sharp lines with soft emotions.",
        coverImage: "/wed6.jpg",
        gallery: [
            "/wed6.jpg",
            "/wed7.jpg",
            "/wed8.jpg"
        ]
    },
    {
        id: "golden-hour-vows",
        slug: "siddharth-and-rhea",
        category: "wedding",
        title: "Siddharth & Rhea",
        client: "Siddharth & Rhea",
        location: "Upper Mustang, Nepal",
        aspect: "portrait",
        description: "High-altitude romance set against the rugged, wind-swept landscapes of Upper Mustang.",
        coverImage: "/wed9.jpg",
        gallery: [
            "/wed9.jpg",
            "/wed10.jpg",
            "/wed11.jpg",
            "/wed12.jpg"
        ]
    }
];