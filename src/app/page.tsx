"use client";

import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { ArrowUpRightIcon, ArrowDownIcon } from "@phosphor-icons/react";
import { SocialIcon } from "@/components/SocialIcon";
import { Typewriter } from "@/components/Typewriter";
import { ContactForm } from "@/components/ContactForm";
import { TechStack } from "@/components/TechStack";

type Theme = "dark" | "light";

// Define ViewTransition API types
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
}

interface DocumentWithViewTransition {
  startViewTransition?: (callback: () => void) => ViewTransition;
}

const AVATAR_URL = "/avator/Frenchie_lines.png";

const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

const SPIRA_CASE = [
  {
    step: "Problem",
    body: "AI products need to ship — agents and media tooling that hold up past the demo.",
  },
  {
    step: "Approach",
    body: "Remote full-stack at Spira AI (US AI startup). Design, build, and ship AI agents into real product surfaces.",
  },
  {
    step: "Result",
    body: "Shipping AI agent products with the Spira team. Open-source stays on the side.",
  },
] as const;

const PROJECTS = [
  {
    title: "Video Text Chrome Extension",
    summary: "Chrome side panel that turns videos into text with local AI. Private, free, unlimited.",
    link: "https://github.com/kangchainx/video-text-chrome-extension",
  },
  {
    title: "YouTube Analysis Platform",
    summary: "Analysis tools that help YouTubers understand their channels.",
    link: "https://github.com/kangchainx/youtube-analysis-project",
  },
  {
    title: "GitHub Studio",
    summary: "Visual drag-and-drop builder for GitHub profile READMEs.",
    link: "https://github.com/kangchainx/github-readme-studio",
  },
  {
    title: "GitHub Christmas Kit",
    summary: "A little holiday spirit for your GitHub profile.",
    link: "https://github.com/kangchainx/github-christmas-kit",
  },
] as const;

const SOCIALS = [
  {
    title: "Email",
    href: "mailto:kangchenhe666@gmail.com",
    path: "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z",
  },
  {
    title: "GitHub",
    href: "https://github.com/kangchainx",
    path: "M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z",
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/kangchainh",
    path: "M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z",
  },
  {
    title: "X",
    href: "https://x.com/kangchainx",
    path: "M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z",
  },
  {
    title: "Telegram",
    href: "https://t.me/Chris_K_g",
    path: "M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19Zm-61.14,36L78.15,126.35l-49.6-9.73ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z",
  },
  {
    title: "Buy me a coffee",
    href: "https://buymeacoffee.com/kangchainx",
    path: "M80,56V24a8,8,0,0,1,16,0V56a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,120,64Zm32,0a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,152,64Zm96,56v8a40,40,0,0,1-37.51,39.91,96.59,96.59,0,0,1-27,40.09H208a8,8,0,0,1,0,16H32a8,8,0,0,1,0-16H56.54A96.3,96.3,0,0,1,24,136V88a8,8,0,0,1,8-8H208A40,40,0,0,1,248,120ZM200,96H40v40a80.27,80.27,0,0,0,45.12,72h69.76A80.27,80.27,0,0,0,200,136Zm32,24a24,24,0,0,0-16-22.62V136a95.78,95.78,0,0,1-1.2,15A24,24,0,0,0,232,128Z",
  },
] as const;

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [isBarking, setIsBarking] = useState(false);
  const [isTilting, setIsTilting] = useState<"left" | "right" | null>(null);
  const [avatarRotation, setAvatarRotation] = useState(0);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === "dark" ? "light" : "dark";

    const doc = document as unknown as DocumentWithViewTransition;

    // Check if View Transition API is supported
    if (!doc.startViewTransition) {
      setTheme(newTheme);

      localStorage.setItem("theme", newTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;

    // Trigger bark effect
    setIsBarking(true);
    setTimeout(() => setIsBarking(false), 800);

    // Trigger tilt effect
    setIsTilting(newTheme === "dark" ? "left" : "right");
    setTimeout(() => setIsTilting(null), 600);

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
      // Manually set attribute to ensure immediate DOM update for the transition snapshot
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 1000,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  useEffect(() => {
    // Check localStorage on mount
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme);
    }
  }, []); // Only run once

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hint animation on page load (only when not scrolled)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.scrollY > 80) {
        return;
      }

      // Show Woof and start tilting
      setIsBarking(true);
      setIsTilting("left");

      // Tilt right (smooth transition)
      setTimeout(() => {
        setIsTilting("right");
      }, 350);

      // Reset to normal
      setTimeout(() => {
        setIsTilting(null);
        setIsBarking(false);
      }, 700);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 72; // Offset for header
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handleAvatarClick = () => {
    setAvatarRotation((prev) => prev - 360);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <header
        className={`fixed top-0 inset-x-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-border"
            : "bg-transparent border-transparent"
        }`}
      >
        <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleAvatarClick}
            className="flex items-center gap-3 group"
            aria-label="Back to top"
          >
            <span
              className="w-8 h-8 rounded-full border border-border overflow-hidden transition-transform duration-700 ease-in-out"
              style={{ transform: `rotate(${avatarRotation}deg)` }}
            >
              <Image
                src={AVATAR_URL}
                alt="Chris Kang"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </span>
            <span className="hidden sm:inline text-sm font-medium text-foreground tracking-tight">
              Chris Kang
            </span>
          </button>

          <div className="flex items-center gap-6 sm:gap-8">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="relative group">
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                className="w-7 h-7 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src="/icons/french-bulldog.png"
                  alt=""
                  width={28}
                  height={28}
                  className={`w-full h-full object-contain transition-transform duration-500 ease-in-out ${
                    isTilting === "left"
                      ? "-rotate-45"
                      : isTilting === "right"
                        ? "rotate-45"
                        : "rotate-0"
                  }`}
                />
              </button>
              {/* Tooltip */}
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-surface border border-border text-foreground px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
              {/* Bark Effect */}
              {isBarking && (
                <span className="absolute -top-3 -right-6 text-xs font-semibold text-foreground animate-bark-fade pointer-events-none">
                  Woof!
                </span>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="min-h-[min(92svh,960px)] max-w-5xl mx-auto px-6 pt-40 pb-20 flex flex-col justify-end animate-fade-in-up">
        <p className="type-eyebrow mb-8">Chris Kang — Remote full-stack engineer</p>
        <h1 className="type-display max-w-4xl">
          Building AI agents, remotely<span className="text-accent">.</span>
        </h1>
        <p className="mt-10 max-w-xl text-lg md:text-xl leading-relaxed text-muted">
          Full-stack at Spira AI, a US AI startup. I design, build, and ship
          agents into real products — open-source on the side.
        </p>
        <p className="mt-6 font-mono text-sm text-subtle min-h-[1.5em]">
          <span className="mr-2">currently</span>
          <Typewriter
            texts={[
              "building AI agents at Spira",
              "working remote, full-stack",
              "open-sourcing on the side",
              "walking the Frenchie",
            ]}
          />
        </p>
        <div className="mt-14 flex flex-wrap items-center gap-6 text-sm">
          <a
            href="#work"
            onClick={(e) => handleNavClick(e, "work")}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 font-medium hover:opacity-90 transition-opacity"
          >
            Read the case
            <ArrowDownIcon size={14} weight="bold" />
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="text-muted hover:text-foreground transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* Spira — primary case study */}
      <section id="work" className="max-w-5xl mx-auto px-6 pb-24 md:pb-32">
        <article className="rounded-3xl border border-border bg-surface p-8 md:p-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="type-eyebrow flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Spira AI · Day job
            </p>
            <p className="type-eyebrow">Remote · Full-stack · AI agents</p>
          </div>

          <h2 className="type-section mt-12 md:mt-16 max-w-3xl">
            Agents that hold up past the demo.
          </h2>

          <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {SPIRA_CASE.map((block, i) => (
              <div key={block.step} className="border-t border-border pt-6">
                <p className="type-eyebrow mb-4">
                  <span className="text-accent mr-2">0{i + 1}</span>
                  {block.step}
                </p>
                <p className="text-base md:text-lg leading-relaxed text-foreground">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* About */}
      <section id="about" className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <p className="type-eyebrow md:col-span-4 md:pt-2">About</p>
          <div className="md:col-span-8 space-y-10">
            <p className="text-xl md:text-2xl leading-relaxed text-foreground tracking-tight">
              I&apos;m Chris Kang, a full-stack engineer working remotely with
              Spira AI, where I design and ship AI agents into real products.{" "}
              <span className="text-muted">
                On the side I build open-source tools for creators and
                developers. Off-screen there&apos;s an amateur&apos;s guitar and a
                Frenchie named Tiantong.
              </span>
            </p>
            <TechStack />
          </div>
        </div>
      </section>

      {/* Open source — secondary list */}
      <section id="oss" className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4 md:pt-2">
            <p className="type-eyebrow">Open source</p>
            <p className="mt-3 text-sm text-subtle">Side projects, all on GitHub.</p>
          </div>
          <ul className="md:col-span-8 border-t border-border">
            {PROJECTS.map((project) => (
              <li key={project.link} className="border-b border-border">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-6 py-6"
                >
                  <div>
                    <h3 className="text-base md:text-lg font-medium text-foreground tracking-tight group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{project.summary}</p>
                  </div>
                  <ArrowUpRightIcon
                    size={18}
                    className="mt-1 shrink-0 text-subtle group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-8">
            <p className="type-eyebrow">Contact</p>
            <h2 className="type-section">Let&apos;s talk.</h2>
            <p className="text-muted leading-relaxed max-w-sm">
              Email is fastest:{" "}
              <a
                href="mailto:kangchenhe666@gmail.com"
                className="text-foreground underline decoration-border underline-offset-4 hover:decoration-accent transition-colors"
              >
                kangchenhe666@gmail.com
              </a>
              . I&apos;m also on{" "}
              <a
                href="/QR/WeChatQRCode.JPG"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-border underline-offset-4 hover:decoration-accent transition-colors"
              >
                WeChat
              </a>{" "}
              and the places below.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {SOCIALS.map((social) => (
                <SocialIcon key={social.title} href={social.href} title={social.title}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={social.path} />
                  </svg>
                </SocialIcon>
              ))}
            </div>
          </div>
          <div className="md:col-span-7">
            <ContactForm />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-12 flex flex-col sm:flex-row justify-between gap-3 text-xs text-subtle">
          <p>&copy; 2026 Chris Kang</p>
          <p className="font-mono">Make it work, make it right, make it fast.</p>
        </div>
      </footer>
    </main>
  );
}
