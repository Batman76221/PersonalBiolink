import { techIcons, type TechName } from "../data/tech";

export default function TechIcon({ name }: { name: TechName }) {
  const Icon = techIcons[name];
  if (!Icon) return null;

  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-white/10 text-zinc-300">
      <Icon className="h-2.5 w-2.5" aria-hidden="true" />
    </span>
  );
}
