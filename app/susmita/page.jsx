"use client";

import { useEffect, useRef } from "react";



const scenes = [
  {
    id: "intro",
    image: "/susmita/DSC_6655.JPG",
    accent: "/susmita/DSC_6668.JPG",
    tag: "I.",
    heading: "The morning\narrives quietly.",
    caption: "She already knows. Today, everything changes.",
    bg: "#ffe9ee",
  },
  {
    id: "preparation",
    image: "/susmita/DSC_6692.JPG",
    accent: "/susmita/DSC_6703.JPG",
    tag: "II.",
    heading: "Hands. Mirror.\nSilence.",
    caption: "Each detail placed like a small prayer.",
    bg: "#ffe3ea",
  },
  {
    id: "emotion",
    image: "/susmita/DSC_6819.JPG",
    accent: "/susmita/DSC_6803.JPG",
    tag: "III.",
    heading: "She pauses.\nJust for a second.",
    caption: "Her eyes tell everything words cannot.",
    bg: "#ffdde5",
  },
  {
    id: "transition",
    image: "/susmita/DSC_6846.JPG",
    accent: "/susmita/DSC_6841.JPG",
    tag: "IV.",
    heading: "Between two worlds\nnow.",
    caption: "The door opens. The air shifts.",
    bg: "#ffd7e1",
  },
  {
    id: "ceremony",
    image: "/susmita/DSC_6892.JPG",
    accent: "/susmita/DSC_6916.JPG",
    tag: "V.",
    heading: "This is where\neverything changes.",
    caption: "Two people. One breath. A thousand witnesses.",
    bg: "#ffe0e8",
    pin: true,
  },
  {
    id: "celebration",
    image: "/susmita/DSC_7117.JPG",
    accent: "/susmita/DSC_7162.JPG",
    tag: "VI.",
    heading: "And then —\nParental blessing.",
    caption: "Joy that fills the room before anyone speaks.",
    bg: "#ffe5ec",
  },
  {
    id: "closing",
    image: "/susmita/DSC_7216.JPG",
    accent: null,
    tag: "VII.",
    heading: "They walk away\ntogether.",
    caption: "Everything that was will always have been.",
    bg: "#ffdde7",
  },
];

export default function WeddingStory() {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const imageRefs = useRef([]);
  const accentRefs = useRef([]);
  const textRefs = useRef([]);
  const tagRefs = useRef([]);
  useEffect(() => {
    document.title = "Susmita Story | Wedding Echos";
  }, []);
  useEffect(() => {
    let ctx;
    let gsap;
    let ScrollTrigger;

    const init = async () => {
      const gsapModule = await import("gsap");
      const stModule = await import("gsap/ScrollTrigger");

      gsap = gsapModule.gsap || gsapModule.default;
      ScrollTrigger = stModule.ScrollTrigger;
      const isMobile = window.matchMedia("(max-width: 900px)").matches;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Global smooth scroll feel
        gsap.set("body", { overflowX: "hidden" });

        scenes.forEach((scene, i) => {
          const section = sectionRefs.current[i];
          const img = imageRefs.current[i];
          const accent = accentRefs.current[i];
          const text = textRefs.current[i];
          const tag = tagRefs.current[i];

          if (!section) return;

          // --- Parallax on hero image ---
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: isMobile ? 1.4 : 2.4,
                },
              }
            );

            // Keep photos floating gently to amplify motion.
            gsap.to(img, {
              y: i % 2 === 0 ? -14 : -10,
              rotation: i % 2 === 0 ? -0.4 : 0.4,
              duration: 5 + i * 0.3,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }

          // --- Accent image fade + float ---
          if (accent) {
            gsap.fromTo(
              accent,
              { opacity: 0, y: 24, rotation: accent.dataset.rotation || 0 },
              {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 75%",
                  toggleActions: "play none none reverse",
                },
              }
            );

            gsap.to(accent, {
              y: i % 2 === 0 ? -18 : -13,
              rotation: i % 2 === 0 ? 1.6 : -1.6,
              duration: 3.8 + i * 0.2,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }

          // --- Tag counter ---
          if (tag) {
            gsap.fromTo(
              tag,
              { opacity: 0, x: -12 },
              {
                opacity: 1,
                x: 0,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 68%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          // --- Text block stagger ---
          if (text) {
            const children = text.querySelectorAll("[data-animate]");
            gsap.fromTo(
              children,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 1.05,
                stagger: 0.14,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 64%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          // --- Pin ceremony section ---
          if (scene.pin && !isMobile) {
            ScrollTrigger.create({
              trigger: section,
              start: "top top",
              end: "+=120%",
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              pinReparent: true,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            });

            // Extra slow parallax for pinned section
            if (img) {
              gsap.to(img, {
                scale: 1.03,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: "+=120%",
                  scrub: 3.2,
                  invalidateOnRefresh: true,
                },
              });
            }
          }
        });

        // --- Intro title cinematic reveal ---
        const introHeading = document.querySelector("#intro-heading");
        const introCaption = document.querySelector("#intro-caption");
        if (introHeading) {
          gsap.fromTo(
            introHeading,
            { opacity: 0, y: 60, letterSpacing: "0.3em" },
            {
              opacity: 1,
              y: 0,
              letterSpacing: "0.05em",
              duration: 1.6,
              ease: "power4.out",
              delay: 0.4,
            }
          );
        }
        if (introCaption) {
          gsap.fromTo(
            introCaption,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.4 }
          );
        }
      }, containerRef);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Caveat:wght@400;500&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: #ffe9ee;
          font-family: 'EB Garamond', Georgia, serif;
          overflow-x: hidden;
        }

        .section-wrap {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .section-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, #b24b5f55, transparent);
        }

        .serif-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          line-height: 1.15;
          color: #5f0f1f;
        }

        .handwritten {
          font-family: 'Caveat', cursive;
          color: #a3203d;
          letter-spacing: 0.02em;
        }

        .img-frame {
          overflow: hidden;
          border-radius: 2px;
        }

        .img-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform-origin: center center;
          backface-visibility: hidden;
          will-change: transform;
        }

        .scrapbook-shadow {
          box-shadow:
            2px 3px 0 #d4375938,
            4px 8px 20px #00000018,
            0 0 0 1px #ff9fb26b;
        }

        .tape-effect::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%) rotate(-1deg);
          width: 60px;
          height: 22px;
          background: #ffccd799;
          border: 1px solid #f18fa688;
          border-radius: 1px;
          z-index: 10;
        }

        .section-number {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(48px, 8vw, 96px);
          color: #cb20453b;
          position: absolute;
          user-select: none;
          line-height: 1;
        }

        .rule-line {
          width: 40px;
          height: 1px;
          background: #c1123e;
          display: inline-block;
          vertical-align: middle;
          margin-right: 12px;
        }

        @media (max-width: 900px) {
          .section-wrap {
            min-height: auto !important;
          }

          #intro {
            min-height: 100svh !important;
            padding-top: 56px !important;
            padding-bottom: 28px !important;
            align-items: flex-end !important;
          }

          #intro > div:nth-child(1) {
            background: linear-gradient(to bottom, #ffd2dd 0%, #ffe9ee 100%) !important;
          }

          #intro > div:nth-child(2) {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            opacity: 0.34 !important;
          }

          #intro > div:nth-child(2) > div {
            background: linear-gradient(to top, #ffe9ee 5%, rgba(255, 233, 238, 0.72) 32%, transparent 68%) !important;
          }

          #intro > div:nth-child(3) {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 24px 0 !important;
          }

          #intro > div:nth-child(4) {
            left: auto !important;
            right: 20px !important;
            bottom: 18px !important;
            width: 120px !important;
            height: 160px !important;
          }

          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }

          div[style*="padding: 0 6vw"] {
            padding: 0 20px !important;
          }

          div[style*="width: 80%"][style*="padding-bottom: 110%"],
          div[style*="width: 75%"][style*="padding-bottom: 100%"] {
            width: 100% !important;
            margin-left: 0 !important;
          }

          div[style*="width: 45%"][style*="padding-bottom: 55%"],
          div[style*="width: 40%"][style*="padding-bottom: 50%"],
          div[style*="width: 42%"][style*="padding-bottom: 52%"] {
            width: 46% !important;
          }

          #ceremony {
            min-height: 100svh !important;
            align-items: flex-end !important;
            padding: 24px 0 30px !important;
          }

          #ceremony > div:nth-child(2) {
            position: relative !important;
            left: auto !important;
            bottom: auto !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 20px !important;
          }

          #ceremony > div:nth-child(2) h2 {
            font-size: clamp(34px, 11vw, 52px) !important;
            line-height: 1.08 !important;
          }

          #ceremony > div:nth-child(2) p {
            font-size: clamp(17px, 5.2vw, 22px) !important;
          }

          #ceremony > div:nth-child(3) {
            top: 16px !important;
            right: 14px !important;
            width: 104px !important;
            height: 138px !important;
            opacity: 0.92 !important;
          }
        }
      `}</style>

      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      <main ref={containerRef}>

        {/* ═══ SECTION 1: INTRO ═══ */}
        <section
          ref={(el) => (sectionRefs.current[0] = el)}
          className="section-wrap"
          style={{ background: scenes[0].bg, minHeight: "100vh" }}
          id="intro"
        >
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 60% 50%, #ffc1d0 0%, #ffe9ee 72%)"
          }} />

          {/* Large background image - right side */}
          <div
            ref={(el) => (imageRefs.current[0] = el)}
            className="img-frame"
            style={{
              position: "absolute",
              right: 0, top: 0, bottom: 0,
              width: "64%",
            }}
          >
            <img
              src={scenes[0].image}
              alt="Bride on her wedding morning"
              style={{ width: "100%", height: "120%", objectFit: "cover", marginTop: "-10%" }}
            />
            {/* Gradient mask */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, #ffe9ee 0%, transparent 38%)"
            }} />
          </div>

          {/* Text block */}
          <div style={{
            position: "relative", zIndex: 2,
            padding: "0 6vw",
            maxWidth: "460px",
          }}>
            <span
              ref={(el) => (tagRefs.current[0] = el)}
              className="handwritten"
              style={{ fontSize: "16px", opacity: 0, display: "block", marginBottom: "24px" }}
            >
              <span className="rule-line" />
              a wedding story
            </span>

            <h1
              id="intro-heading"
              className="serif-heading"
              style={{
                fontSize: "clamp(48px, 7vw, 96px)",
                opacity: 0,
                whiteSpace: "pre-line",
                marginBottom: "28px",
              }}
            >
              {scenes[0].heading}
            </h1>

            <p
              id="intro-caption"
              className="handwritten"
              style={{ fontSize: "clamp(14px, 1.5vw, 18px)", opacity: 0, lineHeight: 1.65 }}
            >
              {scenes[0].caption}
            </p>

            <div style={{ marginTop: "48px", opacity: 0 }} id="intro-caption">
              <span className="handwritten" style={{ fontSize: "13px", color: "#b71f44" }}>
                scroll to begin ↓
              </span>
            </div>
          </div>

          {/* Decorative accent image */}
          <div
            ref={(el) => (accentRefs.current[0] = el)}
            className="img-frame scrapbook-shadow tape-effect"
            data-rotation="-3"
            style={{
              position: "absolute",
              bottom: "8%", left: "38%",
              width: "clamp(120px, 16vw, 200px)",
              height: "clamp(160px, 20vw, 260px)",
              transform: "rotate(-3deg)",
              zIndex: 3,
              opacity: 0,
            }}
          >
            <img src={scenes[0].accent} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══ SECTION 2: PREPARATION ═══ */}
        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          className="section-wrap"
          style={{ background: scenes[1].bg, minHeight: "100vh", padding: "80px 0" }}
        >
          <div style={{
            width: "100%", maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 6vw",
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr",
            gap: "clamp(40px, 6vw, 100px)",
            alignItems: "center",
          }}>

            {/* Images side */}
            <div style={{ position: "relative" }}>
              <div
                ref={(el) => (imageRefs.current[1] = el)}
                className="img-frame scrapbook-shadow"
                style={{
                  width: "80%",
                  paddingBottom: "110%",
                  position: "relative",
                  transform: "rotate(1.5deg)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={scenes[1].image}
                  alt="Preparation"
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "120%",
                    objectFit: "cover",
                    marginTop: "-5%"
                  }}
                />
              </div>

              <div
                ref={(el) => (accentRefs.current[1] = el)}
                className="img-frame scrapbook-shadow tape-effect"
                style={{
                  position: "absolute",
                  bottom: "-20px", right: "0",
                  width: "45%",
                  paddingBottom: "55%",
                  transform: "rotate(-2.5deg)",
                  overflow: "hidden",
                  opacity: 0,
                  zIndex: 2,
                }}
              >
                <img
                  src={scenes[1].accent}
                  alt=""
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
            </div>

            {/* Text side */}
            <div ref={(el) => (textRefs.current[1] = el)}>
              <span
                ref={(el) => (tagRefs.current[1] = el)}
                className="section-number"
                style={{ opacity: 0, position: "relative", display: "block", marginBottom: "8px" }}
              >
                {scenes[1].tag}
              </span>
              <h2
                data-animate
                className="serif-heading"
                style={{
                  fontSize: "clamp(36px, 5vw, 68px)",
                  whiteSpace: "pre-line",
                  marginBottom: "24px",
                  opacity: 0,
                }}
              >
                {scenes[1].heading}
              </h2>
              <p
                data-animate
                className="handwritten"
                style={{ fontSize: "clamp(14px, 1.4vw, 17px)", opacity: 0, lineHeight: 1.6 }}
              >
                {scenes[1].caption}
              </p>
              <div
                data-animate
                style={{
                  marginTop: "40px",
                  width: "80px",
                  height: "1px",
                  background: "#c1123e",
                  opacity: 0
                }}
              />
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══ SECTION 3: EMOTION ═══ */}
        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className="section-wrap"
          style={{ background: scenes[2].bg, minHeight: "100vh", padding: "80px 0" }}
        >
          <div style={{
            width: "100%", maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 6vw",
            display: "grid",
            gridTemplateColumns: "0.75fr 1.25fr",
            gap: "clamp(40px, 6vw, 100px)",
            alignItems: "center",
          }}>

            {/* Text side - LEFT */}
            <div ref={(el) => (textRefs.current[2] = el)} style={{ order: 1 }}>
              <span
                ref={(el) => (tagRefs.current[2] = el)}
                className="section-number"
                style={{ opacity: 0, position: "relative", display: "block", marginBottom: "8px" }}
              >
                {scenes[2].tag}
              </span>
              <h2
                data-animate
                className="serif-heading"
                style={{
                  fontSize: "clamp(36px, 5vw, 68px)",
                  fontStyle: "italic",
                  whiteSpace: "pre-line",
                  marginBottom: "24px",
                  opacity: 0,
                }}
              >
                {scenes[2].heading}
              </h2>
              <p
                data-animate
                className="handwritten"
                style={{ fontSize: "clamp(14px, 1.4vw, 17px)", opacity: 0, lineHeight: 1.6 }}
              >
                {scenes[2].caption}
              </p>
            </div>

            {/* Images side - RIGHT */}
            <div style={{ position: "relative", order: 2 }}>
              <div
                ref={(el) => (imageRefs.current[2] = el)}
                className="img-frame scrapbook-shadow"
                style={{
                  width: "75%",
                  marginLeft: "auto",
                  paddingBottom: "100%",
                  position: "relative",
                  transform: "rotate(-1deg)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={scenes[2].image}
                  alt="Emotional moment"
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "120%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                ref={(el) => (accentRefs.current[2] = el)}
                className="img-frame scrapbook-shadow"
                style={{
                  position: "absolute",
                  top: "-15px", left: "0",
                  width: "40%",
                  paddingBottom: "50%",
                  transform: "rotate(3deg)",
                  overflow: "hidden",
                  opacity: 0,
                  zIndex: 2,
                }}
              >
                <img
                  src={scenes[2].accent}
                  alt=""
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══ SECTION 4: TRANSITION ═══ */}
        <section
          ref={(el) => (sectionRefs.current[3] = el)}
          className="section-wrap"
          style={{ background: scenes[3].bg, minHeight: "100vh", overflow: "hidden" }}
        >
          {/* Full-bleed image with overlay */}
          <div
            ref={(el) => (imageRefs.current[3] = el)}
            style={{
              position: "absolute", inset: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={scenes[3].image}
              alt="Transition"
              style={{
                width: "100%", height: "115%",
                objectFit: "cover",
                objectPosition: "center",
                marginTop: "-7.5%",
              }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, #ffc7d499 0%, transparent 50%, #ffcad666 100%)"
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, transparent 30%, #ffc5d1cc 100%)"
            }} />
          </div>

          {/* Centered text overlay */}
          <div
            ref={(el) => (textRefs.current[3] = el)}
            style={{
              position: "relative", zIndex: 2,
              textAlign: "center",
              padding: "0 6vw",
              width: "100%",
            }}
          >
            <span
              ref={(el) => (tagRefs.current[3] = el)}
              className="handwritten"
              style={{ fontSize: "15px", opacity: 0, display: "block", marginBottom: "20px", color: "#b71f44" }}
            >
              {scenes[3].tag}
            </span>
            <h2
              data-animate
              className="serif-heading"
              style={{
                fontSize: "clamp(34px, 5.2vw, 68px)",
                fontStyle: "italic",
                whiteSpace: "pre-line",
                marginBottom: "24px",
                opacity: 0,
                textShadow: "0 2px 20px rgba(245,240,232,0.8)",
              }}
            >
              {scenes[3].heading}
            </h2>
            <p
              data-animate
              className="handwritten"
              style={{ fontSize: "clamp(14px, 1.4vw, 18px)", opacity: 0, lineHeight: 1.6 }}
            >
              {scenes[3].caption}
            </p>
          </div>

          {/* Accent corner image */}
          <div
            ref={(el) => (accentRefs.current[3] = el)}
            className="img-frame scrapbook-shadow tape-effect"
            style={{
              position: "absolute",
              bottom: "6%", right: "5%",
              width: "clamp(100px, 14vw, 180px)",
              height: "clamp(130px, 18vw, 240px)",
              transform: "rotate(2deg)",
              overflow: "hidden",
              opacity: 0,
              zIndex: 3,
            }}
          >
            <img src={scenes[3].accent} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══ SECTION 5: CEREMONY (PINNED) ═══ */}
        <section
          ref={(el) => (sectionRefs.current[4] = el)}
          className="section-wrap"
          style={{ background: scenes[4].bg, minHeight: "100vh", overflow: "hidden" }}
          id="ceremony"
        >
          {/* Parallax hero */}
          <div
            ref={(el) => (imageRefs.current[4] = el)}
            style={{ position: "absolute", inset: 0, overflow: "hidden" }}
          >
            <img
              src={scenes[4].image}
              alt="Ceremony"
              style={{
                width: "100%", height: "110%",
                objectFit: "cover",
                objectPosition: "center top",
                marginTop: "-5%",
              }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, #ffc5d1cc 0%, transparent 60%, #ffcad6aa 100%)"
            }} />
          </div>

          {/* Text - bottom left */}
          <div
            ref={(el) => (textRefs.current[4] = el)}
            style={{
              position: "absolute",
              bottom: "10%", left: "6vw",
              zIndex: 2,
              maxWidth: "520px",
            }}
          >
            <span
              ref={(el) => (tagRefs.current[4] = el)}
              className="handwritten"
              style={{
                fontSize: "15px", opacity: 0,
                display: "block", marginBottom: "16px",
                color: "#b71f44",
              }}
            >
              {scenes[4].tag}
            </span>
            <h2
              data-animate
              className="serif-heading"
              style={{
                fontSize: "clamp(34px, 5vw, 64px)",
                whiteSpace: "pre-line",
                marginBottom: "20px",
                opacity: 0,
                textShadow: "0 2px 30px rgba(245,240,232,0.9)",
              }}
            >
              {scenes[4].heading}
            </h2>
            <p
              data-animate
              className="handwritten"
              style={{ fontSize: "clamp(14px, 1.35vw, 17px)", opacity: 0, lineHeight: 1.6 }}
            >
              {scenes[4].caption}
            </p>
          </div>

          {/* Decorative accent */}
          <div
            ref={(el) => (accentRefs.current[4] = el)}
            className="img-frame scrapbook-shadow"
            style={{
              position: "absolute",
              top: "8%", right: "5%",
              width: "clamp(120px, 16vw, 220px)",
              height: "clamp(160px, 20vw, 280px)",
              transform: "rotate(-2deg)",
              overflow: "hidden",
              opacity: 0,
              zIndex: 3,
            }}
          >
            <img src={scenes[4].accent} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══ SECTION 6: CELEBRATION ═══ */}
        <section
          ref={(el) => (sectionRefs.current[5] = el)}
          className="section-wrap"
          style={{ background: scenes[5].bg, minHeight: "100vh", padding: "80px 0" }}
        >
          <div style={{
            width: "100%", maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 6vw",
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr",
            gap: "clamp(40px, 6vw, 100px)",
            alignItems: "center",
          }}>

            {/* Images side */}
            <div style={{ position: "relative" }}>
              <div
                ref={(el) => (imageRefs.current[5] = el)}
                className="img-frame scrapbook-shadow"
                style={{
                  width: "80%", marginLeft: "10%",
                  paddingBottom: "105%",
                  position: "relative",
                  transform: "rotate(-1.5deg)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={scenes[5].image}
                  alt="Celebration"
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "120%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                ref={(el) => (accentRefs.current[5] = el)}
                className="img-frame scrapbook-shadow tape-effect"
                style={{
                  position: "absolute",
                  bottom: "-10px", right: "5%",
                  width: "42%",
                  paddingBottom: "52%",
                  transform: "rotate(2.5deg)",
                  overflow: "hidden",
                  opacity: 0,
                  zIndex: 2,
                }}
              >
                <img
                  src={scenes[5].accent}
                  alt=""
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
            </div>

            {/* Text side */}
            <div ref={(el) => (textRefs.current[5] = el)}>
              <span
                ref={(el) => (tagRefs.current[5] = el)}
                className="section-number"
                style={{ opacity: 0, position: "relative", display: "block", marginBottom: "8px" }}
              >
                {scenes[5].tag}
              </span>
              <h2
                data-animate
                className="serif-heading"
                style={{
                  fontSize: "clamp(36px, 5vw, 68px)",
                  whiteSpace: "pre-line",
                  marginBottom: "24px",
                  opacity: 0,
                }}
              >
                {scenes[5].heading}
              </h2>
              <p
                data-animate
                className="handwritten"
                style={{ fontSize: "clamp(14px, 1.4vw, 17px)", opacity: 0, lineHeight: 1.6 }}
              >
                {scenes[5].caption}
              </p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══ SECTION 7: CLOSING ═══ */}
        <section
          ref={(el) => (sectionRefs.current[6] = el)}
          className="section-wrap"
          style={{
            background: scenes[6].bg,
            minHeight: "100vh",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Background image */}
          <div
            ref={(el) => (imageRefs.current[6] = el)}
            style={{ position: "absolute", inset: 0, overflow: "hidden" }}
          >
            <img
              src={scenes[6].image}
              alt="Closing frame"
              style={{
                width: "100%", height: "115%",
                objectFit: "cover",
                objectPosition: "center",
                marginTop: "-7.5%",
                filter: "sepia(8%) brightness(0.97)",
              }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, #f3e0e6cc 0%, #f3e0e644 40%, #f3e0e6dd 100%)"
            }} />
          </div>

          {/* Centered closing text */}
          <div
            ref={(el) => (textRefs.current[6] = el)}
            style={{
              position: "relative", zIndex: 2,
              textAlign: "center",
              padding: "0 6vw",
              width: "100%",
            }}
          >
            <span
              ref={(el) => (tagRefs.current[6] = el)}
              className="handwritten"
              style={{ fontSize: "15px", opacity: 0, display: "block", marginBottom: "20px", color: "#b71f44" }}
            >
              {scenes[6].tag}
            </span>
            <h2
              data-animate
              className="serif-heading"
              style={{
                fontSize: "clamp(34px, 5.2vw, 68px)",
                fontStyle: "italic",
                whiteSpace: "pre-line",
                marginBottom: "28px",
                opacity: 0,
              }}
            >
              {scenes[6].heading}
            </h2>
            <p
              data-animate
              className="handwritten"
              style={{ fontSize: "clamp(14px, 1.4vw, 18px)", opacity: 0, lineHeight: 1.6 }}
            >
              {scenes[6].caption}
            </p>

            {/* Closing ornament */}
            <div
              data-animate
              style={{
                marginTop: "60px",
                opacity: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <div style={{ width: "60px", height: "1px", background: "#b24b5f" }} />
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "22px",
                color: "#a1485a",
                fontStyle: "italic",
              }}>
                ✦
              </span>
              <div style={{ width: "60px", height: "1px", background: "#b24b5f" }} />
            </div>

            <p
              data-animate
              className="handwritten"
              style={{
                marginTop: "24px",
                fontSize: "13px",
                color: "#b71f44",
                opacity: 0,
                letterSpacing: "0.1em",
              }}
            >
              fin.
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
