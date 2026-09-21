import { FiCode, FiMail } from "react-icons/fi";
import { SiDiscord, SiGithub } from "react-icons/si";
import type { IconType } from "react-icons";

export interface Link {
  label: string;
  href: string;
  icon: IconType;
}

export const links: Link[] = [
  { label: "github", href: "https://github.com/batman76221", icon: SiGithub },
  { label: "discord", href: "https://discord.com/users/1447292903654428733", icon: SiDiscord },
  { label: "source", href: "https://github.com/batman76221/PersonalBiolink", icon: FiCode },
];
