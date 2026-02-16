# Namaste Gallery | Cinematic Portfolio

A high-end, editorial-style photography portfolio built with **Next.js 15**, **Framer Motion**, and **Tailwind CSS**. This project features a bespoke "Bottega Veneta" inspired horizontal scroll experience and a structured local-first data architecture.

## ✨ Key Features

* **Editorial Masonry Grid**: A dynamic 3-column layout that intelligently distributes projects while maintaining varied aspect ratios.
* **Cinematic Project View**:
* **Gatefold Hero**: A 50/50 split-screen introduction for every project.
* **Horizontal Physics**: Vertical mouse-wheel-to-horizontal-scroll conversion on desktop with spring-based inertia.
* **Mobile-First Stack**: Seamless transition to a full-bleed vertical scrolling experience on mobile devices.


* **Structured Data Architecture**: Centralized `data/project.ts` store allowing for rapid content updates and easy migration to a Headless CMS/Database.
* **Optimized Performance**: Next.js `<Image />` component integration with `fill` and `priority` loading for high-resolution wedding assets.

---

## 🛠️ Technical Stack

| Category | Technology |
| --- | --- |
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **Type Safety** | TypeScript |
| **Database (Planned)** | Supabase / PostgreSQL |

---

## 📂 Project Structure

```text
├── app/
│   ├── page.tsx            # Home: Masonry grid logic & state management
│   ├── layout.tsx          # Root layout & global typography
│   └── globals.css         # Custom scrollbar & utility classes
├── components/
│   ├── Hero.tsx            # Brand header & intro
│   ├── ProjectCard.tsx     # Animated grid item with aspect ratio support
│   └── ProjectView.tsx     # The cinematic horizontal scroll overlay
├── data/
│   └── project.ts          # Type-safe project definitions & gallery arrays
└── public/                 # Local image assets (e.g., /wed1.jpg)

```

---

## 🚀 Getting Started

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/namaste-flux.git

```


2. **Install dependencies**:
```bash
npm install

```


3. **Add your assets**:
Place your wedding photos (e.g., `wed1.jpg`, `wed2.jpg`) into the `/public` folder.
4. **Configure Data**:
Update `data/project.ts` with your specific project titles, descriptions, and gallery paths.
5. **Run Development Server**:
```bash
npm run dev

```



---

## 📸 Data Schema

Every project follows a strict TypeScript interface to ensure UI consistency:

```typescript
export interface Project {
    id: string;
    title: string;      // Couple Names (e.g., "Sumit & Britannice")
    client: string;     // Professional reference
    description: string;// Narrative text
    coverImage: string; // Landing page visual
    gallery: string[];  // Sequential images for ProjectView
    location: string;   // Destination (e.g., "Thamel, Kathmandu")
    aspect: "portrait" | "landscape";
}

```

---

## 🎨 Design Philosophy

* **Typography**: Combination of minimalist Sans-serif for metadata and elegant, italicized Serif for storytelling.
* **Whitespace**: Large gutters and "breathing room" to emphasize the high-resolution photography.
* **Motion**: Subtle `opacity` and `scale` transitions using `AnimatePresence` to prevent jarring UI jumps.

---

**Next Steps**: Would you like me to add a **Deployment** section to this README with instructions on how to host this on Vercel?
