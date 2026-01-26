"use client";

import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import {
  HeartIcon,
  GlobeIcon,
  CodeIcon,
  LayoutIcon,
  LightningIcon,
  CaretDownIcon,
  CaretUpIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
  EnvelopeIcon,
  CoffeeIcon,
  XLogoIcon,
  TelegramLogoIcon,
  SnowflakeIcon,
} from "@phosphor-icons/react";
import { SocialIcon } from "@/components/SocialIcon";
import { Typewriter } from "@/components/Typewriter";
import { SnowEffect } from "@/components/SnowEffect";
import { cn } from "@/lib/utils";

// Define ViewTransition API types
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
}

interface DocumentWithViewTransition extends Document {
  startViewTransition?: (callback: () => void) => ViewTransition;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isBarking, setIsBarking] = useState(false);
  const [isTilting, setIsTilting] = useState<"left" | "right" | null>(null);
  const [isSnowing, setIsSnowing] = useState(false);

  const avatarUrl = "/avator/avator_03.png";

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
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "light") {
      setIsSnowing(false);
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const projects = [
    {
      title: "Nova Dashboard",
      category: "Fintech Solution",
      image:
        "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "Aether OS",
      category: "Conceptual UI/UX",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "Zenith App",
      category: "Mobile Productivity",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
    },
  ];
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 100; // Offset for header
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden scroll-smooth">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 noise-bg"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      {isSnowing && <SnowEffect />}

      {/* Navigation Island */}
      <div className="fixed top-8 left-0 w-full z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          <div
            className={`pointer-events-auto flex items-center gap-3 transition-all duration-700 ${scrolled ? "translate-x-[calc(50vw-230px)] sm:translate-x-[calc(50vw-280px)] opacity-0 invisible" : "translate-x-0"}`}
          >
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-red-500 shadow-2xl group hover:border-red-500/50 transition-colors">
              <HeartIcon
                weight="fill"
                size={18}
                className="group-hover:scale-110 transition-all duration-300"
              />
            </div>
            <div className="flex items-center">
              <span className="text-foreground font-bold tracking-[0.2em] text-sm uppercase whitespace-nowrap">
                Code Lover
              </span>
            </div>
          </div>

          <div
            className={`pointer-events-auto absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${scrolled ? "w-[320px] sm:w-[480px] bg-card backdrop-blur-2xl border border-border rounded-full py-2 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "w-auto bg-card backdrop-blur-md border border-border rounded-full py-3 px-8"}`}
          >
            <div className="flex items-center justify-center gap-8 relative">
              <div
                className={`transition-all duration-500 overflow-hidden flex items-center shrink-0 ${scrolled ? "w-7 opacity-100" : "w-0 opacity-0"}`}
              >
                <div className="w-7 h-7 rounded-full border border-white/20 p-0.5 overflow-hidden bg-zinc-800">
                  <Image
                    src={avatarUrl}
                    alt="Chris Kang"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, "about")}
                  className="text-zinc-500 hover:text-foreground transition-colors"
                >
                  About
                </a>
                <a
                  href="#projects"
                  onClick={(e) => handleNavClick(e, "projects")}
                  className="text-zinc-500 hover:text-foreground transition-colors"
                >
                  Projects
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "contact")}
                  className="text-zinc-500 hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </div>
              <div
                className={`transition-all duration-500 overflow-hidden flex items-center shrink-0 ${scrolled ? "w-7 opacity-100" : "w-0 opacity-0"}`}
              >
                <div className="relative group">
                  <button
                    onClick={toggleTheme}
                    className="w-7 h-7 flex items-center justify-center transition-transform hover:scale-110"
                  >
                    <Image
                      src="/icons/french-bulldog.png"
                      alt="Theme Toggle"
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
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-zinc-900 text-white px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap">
                    {theme === "dark" ? "Light" : "Dark"}
                  </span>
                  {/* Bark Effect */}
                  {isBarking && (
                    <span className="absolute -top-4 -right-4 text-xs font-bold text-foreground animate-bark-fade pointer-events-none">
                      Woof!
                    </span>
                  )}
                </div>
              </div>

              {/* Scroll to Top Arrow */}
              <div
                className={`absolute -bottom-12 left-1/2 -translate-x-1/2 transition-all duration-500 ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              >
                <button
                  onClick={scrollToTop}
                  className="text-zinc-500 hover:text-foreground transition-colors p-1"
                >
                  <CaretUpIcon size={14} weight="bold" />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`hidden md:flex pointer-events-auto items-center gap-4 transition-all duration-700 ${scrolled ? "translate-x-[-calc(50vw-280px)] opacity-0 invisible" : "translate-x-0"}`}
          >
            <div className="relative group">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95"
              >
                <Image
                  src="/icons/french-bulldog.png"
                  alt="Theme Toggle"
                  width={32}
                  height={32}
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
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-zinc-900/90 text-white px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap backdrop-blur-sm">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
              {/* Bark Effect */}
              {isBarking && (
                <span className="absolute top-0 -right-6 text-sm font-bold text-foreground animate-bark-fade pointer-events-none">
                  Woof!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center px-6 max-w-5xl mx-auto relative text-center z-10">
        <div className="space-y-6 flex flex-col items-center w-full animate-fade-in-up">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-110"></div>
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-[2.5rem] bg-card border-border shadow-2xl transition-all duration-300">
              <Image
                src={avatarUrl}
                alt="Chris Kang"
                width={112}
                height={112}
                className="w-full h-full object-cover rounded-[2.2rem] transition-all duration-700"
              />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight animate-fade-in-up">
            Hi, I&apos;m Chris Kang{" "}
            <span className="animate-waving-hand inline-block">👋</span>
          </h1>

          <div className="text-lg md:text-2xl font-medium text-zinc-500 leading-relaxed min-h-[1.6em] max-w-2xl">
            <Typewriter
              texts={[
                "I'm a full-stack developer crafting seamless digital experiences",
                "I'm a minimalist polishing every single pixel",
                "I'm a lifelong learner turning complex logic into art",
              ]}
            />
          </div>

          {/* Icon Group */}
          <div className="flex items-center justify-center gap-3">
            <SocialIcon
              href="https://github.com/kangchainx"
              title="GitHub"
              brandColor="#FFFFFF"
            >
              <GithubLogoIcon size={18} />
            </SocialIcon>
            <SocialIcon
              href="https://www.linkedin.com/in/kangchainh"
              title="LinkedIn"
              brandColor="#0077B5"
            >
              <LinkedinLogoIcon size={18} />
            </SocialIcon>
            <SocialIcon
              href="https://t.me/Chris_K_g"
              title="Telegram"
              brandColor="#24A1DE"
            >
              <TelegramLogoIcon size={18} />
            </SocialIcon>
            <SocialIcon
              href="mailto:kangchenhe666@gmail.com"
              title="Email"
              brandColor="#EA4335"
            >
              <EnvelopeIcon size={18} />
            </SocialIcon>
            <SocialIcon
              href="https://x.com/kangchainx"
              title="X"
              brandColor="#FFFFFF"
            >
              <XLogoIcon size={16} />
            </SocialIcon>
            <SocialIcon
              href="https://buymeacoffee.com/kangchainx"
              title="Coffee"
              brandColor="#FFDD00"
            >
              <CoffeeIcon size={18} />
            </SocialIcon>
          </div>

          {/* Motto */}
          <div className="pt-12">
            <p className="text-zinc-600 italic font-serif text-sm md:text-base tracking-wide max-w-lg opacity-80 border-l border-blue-500/30 pl-4">
              &quot;Logic will get you from A to B. Imagination will take you
              everywhere.&quot;
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-10 animate-bounce">
          <CaretDownIcon size={28} className="text-foreground" />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-32 px-6 max-w-5xl mx-auto relative z-10 border-t border-white/5"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 sticky top-32 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-4 italic">
              About Me<span className="text-blue-500">.</span>
            </h2>
            <p className="text-zinc-600 font-mono text-sm tracking-widest uppercase">
              The Soul Behind the Code
            </p>
          </div>
          <div className="md:col-span-8 space-y-12">
            <p className="text-xl md:text-3xl font-light text-zinc-300 leading-relaxed">
              Based in Tokyo, I am a software architect driven by the belief
              that
              <span className="text-foreground font-medium italic">
                {" "}
                beauty lies in performance.{" "}
              </span>
              I specialize in building full-stack applications that are as
              robust on the backend as they are delightful on the frontend.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
              <div className="space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-card border-border flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                  <LayoutIcon size={20} />
                </div>
                <h4 className="text-foreground font-bold tracking-tight">
                  Pixel-Perfect UI
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  I craft interfaces that feel natural and intuitive, with a
                  deep obsession for typography and motion.
                </p>
              </div>
              <div className="space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-card border-border flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                  <CodeIcon size={20} />
                </div>
                <h4 className="text-foreground font-bold tracking-tight">
                  Robust Backend
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Designing scalable architectures and efficient databases is my
                  core strength. I love solving complex logic.
                </p>
              </div>
              <div className="space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-card border-border flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                  <LightningIcon size={20} />
                </div>
                <h4 className="text-foreground font-bold tracking-tight">
                  Performance First
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Fast is a feature. I optimize every line of code to ensure the
                  highest performance benchmarks.
                </p>
              </div>
              <div className="space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-card border-border flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                  <GlobeIcon size={20} />
                </div>
                <h4 className="text-foreground font-bold tracking-tight">
                  Global Scale
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Building with an international mindset, ensuring accessibility
                  and cross-cultural user satisfaction.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-wrap gap-3">
              {[
                "React",
                "TypeScript",
                "Node.js",
                "Go",
                "PostgreSQL",
                "AWS",
                "TailwindCSS",
                "Figma",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-card border-border text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:border-blue-500 transition-colors cursor-default shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Selected Projects Section */}
      <section
        id="projects"
        className="py-40 px-6 max-w-5xl mx-auto relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic">
            Selected Projects<span className="text-blue-500">.</span>
          </h2>
          <span className="text-zinc-700 font-mono text-sm tracking-widest uppercase mb-2">
            Portfolio / 2026
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-40">
          {projects.map((project, index) => (
            <div
              key={index}
              className={cn(
                "group cursor-pointer",
                index % 2 !== 0 ? "md:mt-48" : "",
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-card border-border transition-colors duration-300">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                <div className="absolute inset-0 p-12 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                  <span className="text-blue-500 font-mono text-[10px] mb-3 tracking-[0.2em] font-bold">
                    CASE STUDY 0{index + 1}
                  </span>
                  <h3 className="text-foreground text-4xl font-bold tracking-tighter mb-4">
                    {project.title}
                  </h3>
                  <div className="w-0 group-hover:w-full h-[1px] bg-blue-500/50 transition-all duration-700"></div>
                </div>
              </div>
              <div className="mt-8 px-4 opacity-40 group-hover:opacity-100 transition-opacity">
                <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] font-bold">
                  {project.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="pt-60 pb-20 px-6 border-t border-white/5 relative z-10"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl md:text-9xl font-black text-foreground tracking-tighter mb-20 opacity-10 hover:opacity-100 transition-all duration-1000 cursor-default uppercase">
            Let&apos;s Chat
          </h2>

          <p className="mt-24 text-zinc-800 text-[9px] font-mono tracking-widest uppercase">
            Designed & Built by Chris Kang — 2026
          </p>
        </div>
      </footer>

      {/* Snowflake Icon - Fixed Bottom Left */}
      {theme === "dark" && (
        <button
          onClick={() => setIsSnowing(!isSnowing)}
          className={`fixed bottom-6 left-6 z-50 pointer-events-auto transition-all duration-300 hover:scale-110 ${isSnowing ? "opacity-100 text-blue-500" : "opacity-40 text-foreground hover:opacity-100"}`}
          aria-label="Toggle Snow Effect"
        >
          <SnowflakeIcon
            size={24}
            weight={isSnowing ? "fill" : "duotone"}
            className={isSnowing ? "animate-spin" : "animate-spin-slow"}
          />
        </button>
      )}
    </main>
  );
}
