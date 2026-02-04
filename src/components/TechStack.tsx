import { cn } from "@/lib/utils";
import React from "react";
import {
  GlobeIcon,
  DatabaseIcon,
  CodeIcon,
  CloudIcon,
} from "@phosphor-icons/react";

interface TechArea {
  id: string;
  title: string;
  skills: string[];
  icon: React.ReactNode;
  colorClass: string; // Background color style for hover/active state
  textColorClass: string;
}

const techAreas: TechArea[] = [
  { 
    id: "frontend", 
    title: "FRONTEND", 
    skills: ["React", "Next.js", "Vue", "TypeScript", "JavaScript", "Uni-App", "React Native"],
    icon: <GlobeIcon weight="duotone" className="w-6 h-6" />,
    colorClass: "hover:bg-blue-600 dark:hover:bg-blue-600",
    textColorClass: "group-hover:text-white"
  },
  { 
    id: "backend", 
    title: "BACKEND", 
    skills: ["Node.js (Express/Nest.js)", "Python (FastAPI)", "Java (Spring Boot/Cloud/WebFlux)"],
    icon: <CodeIcon weight="duotone" className="w-6 h-6" />,
    colorClass: "hover:bg-emerald-600 dark:hover:bg-emerald-600",
    textColorClass: "group-hover:text-white"
  },
  { 
    id: "database", 
    title: "DATABASE", 
    skills: ["PostgreSQL", "Oracle", "MySQL", "Redis", "Kafka", "MQTT", "Elasticsearch", "InfluxDB"],
    icon: <DatabaseIcon weight="duotone" className="w-6 h-6" />,
    colorClass: "hover:bg-cyan-600 dark:hover:bg-cyan-600",
    textColorClass: "group-hover:text-white"
  },
  { 
    id: "devops", 
    title: "DEVOPS", 
    skills: ["AWS Lambda", "Amazon S3", "Docker", "GitHub Actions", "K3s", "Linux"],
    icon: <CloudIcon weight="duotone" className="w-6 h-6" />, 
    colorClass: "hover:bg-violet-600 dark:hover:bg-violet-600",
    textColorClass: "group-hover:text-white"
  },
];

export function TechStack() {
  return (
    <div className="w-full h-28 md:h-32 flex overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 backdrop-blur-md shadow-xl">
      {techAreas.map((area, index) => (
        <div
          key={area.id}
          className={cn(
            "relative group flex-1 flex flex-col items-center justify-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default overflow-hidden px-4",
            "hover:flex-[2.5]", // Expand significantly on hover
            area.colorClass,
            // Vertical separators
            index !== techAreas.length - 1 && "border-r border-zinc-200 dark:border-white/5"
          )}
        >
          {/* Subtle background pattern or noise could go here */}
          
          {/* Icon & Title Group */}
          <div className={cn(
            "flex flex-col items-center gap-2 transition-all duration-300 group-hover:-translate-y-6",
            // On hover, we might want to move this or keep it centered
            "text-zinc-500 dark:text-zinc-400",
            area.textColorClass
          )}>
            <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              {area.icon}
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              {area.title}
            </span>
          </div>
          
          {/* Skills List - Hidden by default, reveals on hover */}
          <div className="absolute inset-x-0 bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 group-hover:duration-500 group-hover:delay-100 flex flex-wrap justify-center gap-x-3 gap-y-1 px-2 pointer-events-none">
             {area.skills.map((skill) => (
               <span key={skill} className="text-[10px] font-medium text-white/90">
                 {skill}
               </span>
             ))}
          </div>
        </div>
      ))}
    </div>
  );
}
