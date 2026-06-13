import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedsechos.com";

export const metadata: Metadata = {
  title: "About",
  description: "Wedding Photo & Video Studio based in Kathmandu, Nepal — Weds Echos captures weddings and builds model portfolios with cinematic elegance.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Weds Echos | Cinematic Wedding Photography, Kathmandu",
    description: "Wedding Photo & Video Studio based in Kathmandu, Nepal — Weds Echos captures weddings and builds model portfolios with cinematic elegance.",
    url: `${siteUrl}/about`,
    type: "website",
    locale: "en_US",
    siteName: "Weds Echos",
    images: [{ url: `${siteUrl}/wed1.jpg`, width: 1200, height: 800, alt: "Weds Echos — Wedding Photography Kathmandu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Weds Echos | Cinematic Wedding Photography, Kathmandu",
    description: "Wedding Photo & Video Studio based in Kathmandu, Nepal — Weds Echos captures weddings and builds model portfolios with cinematic elegance.",
    images: [`${siteUrl}/wed1.jpg`],
  },
};

const galleryImages = [
  { src: "/wed3.jpg",  aspect: "aspect-[3/4]" },
  { src: "/wed8.jpg",  aspect: "aspect-[4/5]" },
  { src: "/wed14.jpg", aspect: "aspect-[3/4]" },
  { src: "/wed19.jpg", aspect: "aspect-[4/5]" },
  { src: "/wed22.jpg", aspect: "aspect-[3/4]" },
  { src: "/wed26.jpg", aspect: "aspect-[4/5]" },
];

export default function AboutPage() {
  return (
    <main className="bg-[#faf9f6] text-black">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/wed1.jpg"
          alt="Weds Echos — Wedding Photography Kathmandu"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* back link */}
        <Link
          href="/"
          className="absolute top-10 left-10 z-10 uppercase tracking-[0.4em] text-[10px] font-bold text-white hover:opacity-60 transition-opacity"
        >
          ← Back
        </Link>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <p className="uppercase tracking-[0.4em] text-[10px] text-white/60 mb-4">
            Kathmandu, Nepal
          </p>
          <h1 className="font-serif italic text-5xl md:text-8xl lg:text-[10rem] text-white leading-[0.9] lowercase">
            our story
          </h1>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <div className="w-[1px] h-12 bg-white/40 animate-pulse" />
        </div>
      </section>

      {/* ── INTRO ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-20 lg:px-32 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <div>
          <p className="uppercase tracking-[0.4em] text-[10px] opacity-40 mb-8">Who we are</p>
          <h2 className="font-serif italic text-4xl md:text-6xl leading-[1.05] lowercase mb-8">
            Where light<br />meets love
          </h2>
          <div className="space-y-5 text-[13px] md:text-[15px] leading-relaxed opacity-70 max-w-md">
            <p>
              Weds Echos is a wedding photo and video studio rooted in the heart of Kathmandu.
              We believe every wedding holds a universe of quiet, unrepeatable moments — a stolen
              glance, a trembling hand, the exhale just before "I do."
            </p>
            <p>
              Our work is cinematic and unhurried. We don't chase perfect poses; we follow
              real feeling. Whether your celebration fills a valley or gathers in a courtyard,
              we come ready to listen with our lenses.
            </p>
            <p>
              But weddings are only part of the story. We also work with models — aspiring faces
              looking to build a portfolio that actually opens doors. From the hills of Nepal
              to destination events beyond, Weds Echos is open to brand collaborations too,
              bringing the same editorial care to every frame.
            </p>
          </div>
        </div>

        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src="/wed9.jpg"
            alt="Weds Echos studio — Kathmandu"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* ── PHILOSOPHY STRIP ──────────────────────────────────── */}
      <section className="bg-[#1a1a1a] text-white px-6 md:px-20 lg:px-32 py-20 md:py-28">
        <p className="uppercase tracking-[0.4em] text-[10px] opacity-40 mb-10">Our approach</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {[
            {
              title: "Cinematic",
              body: "Every frame is composed with the same intentionality a director brings to film. Natural light, honest colour, and editorial pacing.",
            },
            {
              title: "Unobtrusive",
              body: "We stay at the edge of the moment so you forget the camera exists. The best photographs are ones you didn't know were being taken.",
            },
            {
              title: "Timeless",
              body: "Trends fade. We make images that feel as alive in thirty years as they do today — documents of feeling, not just occasion.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-serif italic text-2xl md:text-3xl lowercase mb-4">{title}</h3>
              <p className="text-[12px] md:text-[13px] leading-relaxed opacity-60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODEL PORTFOLIO ───────────────────────────────────── */}
      <section className="px-6 md:px-20 lg:px-32 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <div className="relative aspect-[3/4] w-full overflow-hidden order-2 md:order-1">
          <Image
            src="/wed20.jpg"
            alt="Model portfolio shoot — Weds Echos"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="order-1 md:order-2">
          <p className="uppercase tracking-[0.4em] text-[10px] opacity-40 mb-8">More than weddings</p>
          <h2 className="font-serif italic text-4xl md:text-6xl leading-[1.05] lowercase mb-8">
            We build<br />model portfolios
          </h2>
          <div className="space-y-5 text-[13px] md:text-[15px] leading-relaxed opacity-70 max-w-md">
            <p>
              We don't just shoot weddings. If you're a model — beginner or experienced —
              looking to build a strong portfolio, we can help. We create editorial-quality
              images that show casting directors, brands, and agencies exactly what you're
              capable of.
            </p>
            <p>
              Just starting out and not sure where to begin? Reach out. We offer shoots
              designed specifically for new faces: relaxed, collaborative sessions that let
              your personality come through in every frame.
            </p>
          </div>

          {/* Feature CTA */}
          <div className="mt-12 p-6 md:p-8 bg-[#1a1a1a] text-white">
            <p className="uppercase tracking-[0.4em] text-[10px] opacity-50 mb-4">Get featured</p>
            <p className="text-[13px] md:text-[14px] leading-relaxed opacity-80 mb-6">
              The best of our model shoots get featured directly on our Instagram and website.
              If you're a beginner looking for visibility — DM us or call to book your session
              and get your work seen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.instagram.com/wedsechos/"
                target="_blank"
                rel="noopener noreferrer"
                className="uppercase tracking-[0.4em] text-[10px] font-bold border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-all text-center"
              >
                DM on Instagram
              </a>
              <a
                href="tel:+9779813741089"
                className="uppercase tracking-[0.4em] text-[10px] font-bold border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-all text-center"
              >
                Call +977 9813741089
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SAMPLE GALLERY ────────────────────────────────────── */}
      <section className="px-6 md:px-20 lg:px-32 py-20 md:py-28">
        <p className="uppercase tracking-[0.4em] text-[10px] opacity-40 mb-10">Selected work</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryImages.map(({ src, aspect }, i) => (
            <div key={i} className={`relative ${aspect} w-full overflow-hidden group`}>
              <Image
                src={src}
                alt={`Weds Echos — sample ${i + 1}`}
                fill
                className="object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPLORE OUR WORK ──────────────────────────────────── */}
      <section className="px-6 md:px-20 lg:px-32 pb-20 md:pb-28">
        <div className="flex flex-col sm:flex-row gap-6 md:gap-10">
          <Link
            href="/"
            className="uppercase tracking-[0.4em] text-[10px] font-bold border-b-2 border-black pb-1 hover:opacity-50 transition-opacity"
          >
            View Wedding Portfolio →
          </Link>
          <Link
            href="/music"
            className="uppercase tracking-[0.4em] text-[10px] font-bold border-b-2 border-black pb-1 hover:opacity-50 transition-opacity"
          >
            Explore Music &amp; Events →
          </Link>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="px-6 md:px-20 lg:px-32 py-20 md:py-32 border-t border-black/10">
        <p className="uppercase tracking-[0.4em] text-[10px] opacity-40 mb-10">Let's work together</p>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <h2 className="font-serif italic text-4xl md:text-7xl leading-[0.95] lowercase">
            A wedding,<br />a portfolio,<br />or a dream —<br />we're ready.
          </h2>
          <div className="flex flex-col gap-4 items-start md:items-end">
            <a
              href="tel:+9779813741089"
              className="uppercase tracking-[0.4em] text-[11px] font-bold border-b-2 border-black pb-1 hover:opacity-50 transition-opacity whitespace-nowrap"
            >
              Call +977 9813741089
            </a>
            <a
              href="https://www.instagram.com/wedsechos/"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase tracking-[0.4em] text-[11px] font-bold border-b-2 border-black pb-1 hover:opacity-50 transition-opacity whitespace-nowrap"
            >
              DM @wedsechos
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
