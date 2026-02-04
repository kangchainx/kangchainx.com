"use client";

import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { HeartIcon, CaretDownIcon } from "@phosphor-icons/react";
import { SocialIcon } from "@/components/SocialIcon";
import { Typewriter } from "@/components/Typewriter";
import { ContactForm } from "@/components/ContactForm";
import { TechStack } from "@/components/TechStack";

// Define ViewTransition API types
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
}

interface DocumentWithViewTransition {
  startViewTransition?: (callback: () => void) => ViewTransition;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isBarking, setIsBarking] = useState(false);
  const [isTilting, setIsTilting] = useState<"left" | "right" | null>(null);

  const [avatarRotation, setAvatarRotation] = useState(0);
  const [hasShownScrollHint, setHasShownScrollHint] = useState(false);

  const avatarUrl = "/avator/Frenchie_lines.png";

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme);
    }
  }, []); // Only run once

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;
      setScrolled(isScrolled);
      
      // Trigger avatar rotation hint when first scrolled
      if (isScrolled && !hasShownScrollHint) {
        setHasShownScrollHint(true);
        // Delay to allow the avatar to appear first
        setTimeout(() => {
          setAvatarRotation(prev => prev - 360);
        }, 300);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShownScrollHint]);

  // Hint animation on page load (only when not scrolled)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only show animation if page is at top (not scrolled)
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

  const projects = [
    {
      title: "YouTube Analysis Platform",
      category: "SaaS Platform ｜ Creator Efficiency",
      image: "/projec-shot/youtube-analysis-project.png",
      link: "https://github.com/kangchainx/youtube-analysis-project",
    },
    {
      title: "Video Text Chrome Extension",
      category: "Privacy-First | AI-Powered",
      image: "/projec-shot/video-text-chrome-extension.png",
      link: "https://github.com/kangchainx/video-text-chrome-extension",
    },
    {
      title: "GitHub Studio",
      // category: "Developer Tool / Visualization",
      category: "WYSIWYG | Markdown Rendering",
      image: "/projec-shot/github-readme-studio.png",
      link: "https://github.com/kangchainx/github-readme-studio",
    },
    {
      title: "GitHub Christmas Kit",
      category: "Holiday Vibes | Creative Ideas",
      image: "/projec-shot/github-christmas-kit.png",
      link: "https://github.com/kangchainx",
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
        element.getBoundingClientRect().top + window.scrollY - 30; // Offset for header
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

  const handleAvatarClick = () => {
    setAvatarRotation((prev) => prev - 360);
    scrollToTop();
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden scroll-smooth">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 noise-bg"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navigation Island */}
      <div className="fixed top-8 left-0 w-full z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          <div
            className={`hidden md:flex pointer-events-auto items-center gap-3 transition-all duration-700 ${scrolled ? "translate-x-[calc(50vw-230px)] sm:translate-x-[calc(50vw-280px)] opacity-0 invisible" : "translate-x-0"}`}
          >
            <div className="w-10 h-10 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group transition-colors">
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex items-center">
              <span className="text-foreground font-bold tracking-[0.2em] text-sm whitespace-nowrap">
                &lt;kangchainx /&gt;
              </span>
            </div>
          </div>

          <div
            className={`pointer-events-auto absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${scrolled ? "w-[360px] sm:w-[480px] bg-card backdrop-blur-2xl border border-border rounded-full py-2 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "w-auto bg-card backdrop-blur-md border border-border rounded-full py-3 px-8"}`}
          >
            <div className="flex items-center justify-center gap-8 relative">
              <div
                className={`transition-all duration-500 overflow-hidden flex items-center shrink-0 ${scrolled ? "w-7 opacity-100" : "w-0 opacity-0"}`}
              >
                <button
                  onClick={handleAvatarClick}
                  className="w-7 h-7 rounded-full border border-white/20 overflow-hidden cursor-pointer transition-transform duration-700 ease-in-out hover:scale-110"
                  style={{ transform: `rotate(${avatarRotation}deg)` }}
                >
                  <Image
                    src={avatarUrl}
                    alt="Chris Kang"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
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
            <div className="absolute inset-0 blur-2xl rounded-full scale-110 bg-zinc-400/10 [html[data-theme=dark]_&]:bg-blue-500/20"></div>
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
                "an Indie Hacker",
                "a Full-Stack Software Engineer",
                "an AI-Powered Developer",
                "a Frenchie Lover 🐶",
              ]}
            />
          </div>

          {/* Icon Group */}
          <div className="flex items-center justify-center gap-5">
            <SocialIcon
              href="https://github.com/kangchainx"
              title="GitHub"
              brandColor="#181717"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 256 256"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z" />
              </svg>
            </SocialIcon>
            <SocialIcon
              href="https://www.linkedin.com/in/kangchainh"
              title="LinkedIn"
              brandColor="#0077B5"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 256 256"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
              </svg>
            </SocialIcon>
            <SocialIcon
              href="https://t.me/Chris_K_g"
              title="Telegram"
              brandColor="#24A1DE"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 256 256"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19Zm-61.14,36L78.15,126.35l-49.6-9.73ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z" />
              </svg>
            </SocialIcon>
            <SocialIcon
              href="mailto:kangchenhe666@gmail.com"
              title="Email"
              brandColor="#EA4335"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 256 256"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
              </svg>
            </SocialIcon>
            <SocialIcon
              href="https://x.com/kangchainx"
              title="X"
              brandColor="#000000"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z" />
              </svg>
            </SocialIcon>
            <SocialIcon
              href="https://buymeacoffee.com/kangchainx"
              title="Coffee"
              brandColor="#C59D00"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 256 256"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M80,56V24a8,8,0,0,1,16,0V56a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,120,64Zm32,0a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,152,64Zm96,56v8a40,40,0,0,1-37.51,39.91,96.59,96.59,0,0,1-27,40.09H208a8,8,0,0,1,0,16H32a8,8,0,0,1,0-16H56.54A96.3,96.3,0,0,1,24,136V88a8,8,0,0,1,8-8H208A40,40,0,0,1,248,120ZM200,96H40v40a80.27,80.27,0,0,0,45.12,72h69.76A80.27,80.27,0,0,0,200,136Zm32,24a24,24,0,0,0-16-22.62V136a95.78,95.78,0,0,1-1.2,15A24,24,0,0,0,232,128Z" />
              </svg>
            </SocialIcon>
          </div>

          {/* Motto */}
          <div className="pt-12">
            <p className="text-zinc-600 italic font-serif text-sm md:text-base tracking-wide max-w-lg opacity-80 border-l border-blue-500/30 pl-4">
              &quot;Make it work, make it right, make it fast.&quot;
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-50 animate-bounce">
          <CaretDownIcon size={28} className="text-foreground" />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-16 lg:py-24 px-6 max-w-5xl mx-auto relative z-10 border-t border-white/5"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-4 sticky top-32 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-4">
              About Me
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-6 text-lg md:text-xl text-foreground leading-relaxed font-medium">
              <p>
                Hello, I&apos;m{" "}
                <span className="text-foreground font-bold">Chris Kang</span>, a
                passionate{" "}
                <span className="font-bold text-foreground">
                  full-stack developer
                </span>
                . I enjoy programming and building delightful products. I love
                to experiment with new technologies and use them to solve
                real-world problems.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="shrink-0">🎒</span>
                  <span>I am currently a freelancer.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0">🎸</span>
                  <span>An amateur guitarist.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0">🐶</span>
                  <span>I have a Frenchie named Tiantong.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0">🤝</span>
                  <span>Always open to new opportunities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0">👥</span>
                  <span>
                    I&apos;m actively looking to contribute to the open-source
                    community
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0">👏</span>
                  <span>
                    Happy to connect, reach me via{" "}
                    <a
                      href="/QR/WeChatQRCode.JPG"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-500 hover:text-blue-600 no-underline"
                    >
                      WeChat
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://t.me/Chris_K_g"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-500 hover:text-blue-600 no-underline"
                    >
                      Telegram
                    </a>
                    , or follow me on{" "}
                    <a
                      href="https://x.com/kangchainx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-500 hover:text-blue-600 no-underline"
                    >
                      X (Twitter)
                    </a>{" "}
                    to see what I&apos;m working on.
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-white/5">
              <div className="flex justify-end pt-2 mb-2">
                <a
                  href="/cv/ChrisKang_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-foreground transition-colors group"
                >
                  <span>View Resume</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </a>
              </div>
              <TechStack />
            </div>
          </div>
        </div>
      </section>

      {/* Selected Projects Section */}
      <section
        id="projects"
        className="py-16 lg:py-24 px-6 max-w-5xl mx-auto relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6">
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
            Projects
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-10">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[2/1] 2xl:aspect-[16/9] overflow-hidden rounded-[2.5rem] bg-card border-border transition-colors duration-300">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[0.8s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                <div className="absolute inset-0 p-6 2xl:p-12 flex flex-col justify-end translate-y-4 2xl:translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                  <h3 className="text-foreground text-2xl 2xl:text-3xl font-bold tracking-tighter mb-4">
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
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      {/* Footer / Contact Section */}
      <footer
        id="contact"
        className="py-16 lg:py-24 px-6 border-t border-white/5 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 lg:mb-12 gap-6">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
              Contact
            </h2>
          </div>

          <div className="mb-12 lg:mb-24">
            <ContactForm />
          </div>

          <p className="text-center text-zinc-500 text-[10px] tracking-wider">
            &copy; 2026 Chris Kang. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
