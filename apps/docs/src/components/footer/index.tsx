import { Link } from "@tanstack/react-router";

import { NameraIcon } from "@namera-ai/ui/icons";
import {
  EnvelopeIcon,
  GithubLogoIcon,
  TelegramLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

const socials = [
  {
    href: "https://github.com/thenamespace/namera",
    icon: GithubLogoIcon,
    title: "Github",
  },
  {
    href: "https://twitter.com/namera_ai",
    icon: XLogoIcon,
    title: "Twitter",
  },
  {
    href: "mailto:hi@namera.ai",
    icon: EnvelopeIcon,
    title: "Discord",
  },
  {
    href: "https://t.me/namera_ai",
    icon: TelegramLogoIcon,
    title: "Telegram",
  },
];

export const Footer = () => {
  return (
    <footer className="w-full">
      <div className="max-w-6xl px-4 w-full mx-auto">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between py-5 items-end border-y px-4 border-border/50">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center">
                <NameraIcon className="size-6 fill-white" />
                <div className="text-white text-2xl">Namera</div>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs text-wrap">
                Secure, programmable smart accounts for autonomous agents.
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <a
                className="text-muted-foreground text-[15px]"
                href="mailto:hi@namera.ai"
                rel="noreferrer"
                target="_blank"
                title="Contact us"
              >
                hi@namera.ai
              </a>
              <div className="text-muted-foreground">|</div>
              <div className="flex flex-row items-center gap-3">
                {socials.map((social) => (
                  <a
                    className="text-muted-foreground text-sm"
                    href={social.href}
                    key={social.title}
                    rel="noreferrer"
                    target="_blank"
                    title={social.title}
                  >
                    <social.icon className="size-4.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between border-border/50 px-4 py-2">
            <div className="flex flex-row gap-4 items-center">
              <Link className="text-xs text-muted-foreground" to="/">
                Terms of Service
              </Link>
              <Link className="text-xs text-muted-foreground" to="/">
                Privacy Policy
              </Link>
            </div>
            <div className="text-muted-foreground text-xs">
              @2026 Namespace Inc.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
