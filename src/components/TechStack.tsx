// A single quiet line of everyday tools — kept small so it never competes with the work.
const TOOLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Redis",
  "Docker",
  "AWS",
];

export function TechStack() {
  return (
    <p className="font-mono text-xs text-subtle leading-relaxed">
      <span className="uppercase tracking-[0.2em] mr-3">Tools</span>
      {TOOLS.join(" · ")}
    </p>
  );
}
