import { Link } from "@tanstack/react-router";

import { NameraIcon } from "@namera-ai/ui/icons";

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const navigationGroups = [
  {
    links: [
      { external: false, href: "/docs", title: "Platform" },
      { external: false, href: "/docs/sdk", title: "SDKs" },
      { external: false, href: "/docs/cli", title: "CLI" },
    ],
    title: "Product",
  },
  {
    links: [
      { external: false, href: "/blog", title: "Blog" },
      { external: false, href: "/docs", title: "Dev Docs" },
      { external: false, href: "/changelog", title: "Changelog" },
    ],
    title: "Company",
  },
  {
    links: [
      { external: false, href: "/terms", title: "Terms of Service" },
      { external: false, href: "/privacy-policy", title: "Privacy Policy" },
    ],
    title: "Legal",
  },
];

const socials = [
  {
    href: "https://github.com/thenamespace/namera",
    icon: GitHubIcon,
    label: "GitHub",
  },
  {
    href: "https://x.com/namera_ai",
    icon: XIcon,
    label: "X / Twitter",
  },
  {
    href: "https://linkedin.com/company/namera-ai",
    icon: LinkedInIcon,
    label: "LinkedIn",
  },
];

export const Footer = ({ showDesign = true }: { showDesign?: boolean }) => {
  return (
    <div className="relative flex flex-col gap-4 mt-16">
      <div
        aria-hidden={true}
        className="pointer-events-none max-w-7xl mx-auto w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />
      <footer className="w-full">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start justify-between p-10 md:gap-4 gap-12 border-b border-white/10">
          <div className="flex flex-col gap-6 order-2 md:order-1 mx-auto md:mx-0">
            <div className="flex flex-row items-center gap-2 justify-center md:justify-start">
              <NameraIcon className="size-5 fill-white" />
              <div className="text-xl text-white font-semibold tracking-tight">
                Namera
              </div>
            </div>
            <p className="max-w-sm text-center text-sm leading-relaxed text-muted-foreground md:text-left md:text-base">
              Secure, programmable smart accounts for autonomous agents.
            </p>
            {/* Social icons */}
            <div className="flex items-center justify-center gap-3 md:justify-start">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
                  href={href}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end justify-between gap-8 order-1 md:order-2 md:mx-0">
            <div className="grid sm:grid-cols-3 md:gap-4 grid-cols-2 mx-auto gap-8 md:mx-0">
              {navigationGroups.map((group) => (
                <div
                  className="flex flex-col gap-2 w-full place-items-start"
                  key={group.title}
                >
                  <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 pb-3">
                    {group.title}
                  </div>
                  {group.links.map((link) =>
                    link.external ? (
                      <a
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        href={link.href}
                        key={link.title}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {link.title}
                      </a>
                    ) : (
                      <Link
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        key={link.title}
                        to={link.href}
                      >
                        {link.title}
                      </Link>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="py-4 text-center text-[11px] text-muted-foreground/80">
          © 2026 Namespace Inc. All rights reserved.
        </p>
      </footer>
      <div
        className={
          showDesign
            ? "pb-[10dvh] sm:pb-[15dvh] md:pb-[20dvh] lg:pb-[25dvh]"
            : "pb-4"
        }
      />
      {showDesign && (
        <div className="absolute bottom-0 left-1/2 overflow-hidden -translate-x-1/2 pointer-events-none">
          <div className="text-[30dvw] sm:text-[30dvw] leading-none select-none text-muted [textStroke:1px_var(--color-neutral-700)] translate-y-1/4 [-webkit-text-stroke:1px_var(--color-neutral-700)]">
            namera
          </div>
        </div>
      )}
    </div>
  );
};
