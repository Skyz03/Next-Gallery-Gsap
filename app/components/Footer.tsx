import Link from "next/link";

const navLink = "uppercase tracking-[0.4em] text-[10px] hover:opacity-60 transition-opacity";

export default function SiteFooter() {
  return (
    <footer className="bg-[#1a1a1a] text-white px-10 md:px-20 py-12 md:py-16">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
        <div>
          <p className="font-serif italic text-2xl md:text-3xl lowercase mb-4">Weds Echos</p>
          <p className="text-[11px] opacity-50 max-w-xs leading-relaxed">
            Cinematic wedding and events photography studio based in Kathmandu, Nepal.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col md:flex-row gap-6 md:gap-12">
          <Link href="/" className={navLink}>Wedding Photography</Link>
          <Link href="/music" className={navLink}>Music &amp; Events</Link>
          <Link href="/about" className={navLink}>About</Link>
        </nav>
      </div>

      <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4">
        <p className="text-[10px] uppercase tracking-widest opacity-30">
          © {new Date().getFullYear()} Weds Echos. All rights reserved.
        </p>
        <p className="text-[10px] uppercase tracking-widest opacity-30">Kathmandu, Nepal</p>
      </div>
    </footer>
  );
}
