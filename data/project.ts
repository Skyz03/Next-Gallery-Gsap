export interface Project {
    id: string;
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
        title: "ethereal grace",
        client: "marco & brittney",
        location: "Thamel",
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
        title: "urban solitude",
        client: "kevin & sarah",
        location: "Thamel",
        aspect: "portrait",
        description: "Modern love meets the brutalist architecture of London.",
        coverImage: "/wed6.jpg",
        gallery: [
            "/wed6.jpg",
            "/wed7.jpg",
            "/wed8.jpg"
        ]
    },
    {
        id: "golden-hour-vows",
        title: "golden hour vows",
        client: "siddharth & rhea",
        location: "Mustang",
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