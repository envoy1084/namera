"use client";

export const Hero = () => {
  return (
    <section className="relative pt-[18dvh] pb-[8dvh] overflow-hidden">
      {/* Ambient radial glow behind headline */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-x-0 -top-40 h-[80dvh] mx-auto max-w-5xl"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(214,254,81,0.08), transparent 60%), radial-gradient(ellipse 40% 60% at 70% 40%, rgba(182,214,255,0.06), transparent 70%)",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, #000 30%, transparent 80%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto flex flex-col gap-6 px-4">
        <div className="flex flex-col gap-7 text-center sm:text-left">
          {/* Eyebrow badge */}
          <div className="self-center sm:self-start">
            <a
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              href="/changelog"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#d6fe51] opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#d6fe51]" />
              </span>
              <span className="font-medium tracking-wide">Now in beta</span>
              <span className="h-3 w-px bg-white/15" />
              <span className="text-white/50 group-hover:text-white/80 transition-colors">
                Agent-native infrastructure
              </span>
              <span className="text-white/40 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>

          <h1 className="text-4xl leading-none sm:text-5xl md:text-6xl lg:text-7xl md:leading-[0.9] text-balance tracking-tight font-medium bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
            Programmable wallets
            <br />
            for autonomous agents
          </h1>
          <p className="text-muted-foreground text-sm font-normal md:text-base max-w-xl mx-auto sm:mx-0">
            <span className="block">
              Secure, policy-driven onchain infrastructure for autonomous
              agents.
            </span>
            <span className="block">
              Give your models a wallet they can use, with constraints they
              can't break.
            </span>
          </p>
          <div className="inline-flex items-stretch rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-sm self-center sm:self-start shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_8px_24px_-8px_rgba(0,0,0,0.6)] hover:border-white/15 transition-colors">
            <div className="flex items-center px-4 py-3 border-r border-white/10">
              <span className="text-white/30 text-xs uppercase tracking-widest font-medium whitespace-nowrap">
                Install
              </span>
            </div>
            <button
              className="group flex items-center gap-3 px-4 py-3 font-mono text-sm text-white/60 hover:text-white/90 transition-colors border-r border-white/10"
              onClick={() => {
                navigator.clipboard.writeText("npm i -g @namera-ai/cli");
              }}
              title="Click to copy"
              type="button"
            >
              npm i -g @namera-ai/cli
              <svg
                aria-hidden={true}
                className="shrink-0 text-white/25 group-hover:text-white/50 transition-colors"
                fill="none"
                height="13"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="13"
              >
                <rect height="13" rx="2" width="13" x="9" y="9" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <div className="flex items-center divide-x divide-white/10">
              <a
                className="flex items-center gap-1 px-4 py-3 text-sm text-white/50 hover:text-white/90 transition-colors whitespace-nowrap"
                href="/docs"
              >
                Docs <span>→</span>
              </a>
              <a
                className="flex items-center gap-1 px-4 py-3 text-sm text-white/50 hover:text-white/90 transition-colors whitespace-nowrap"
                href="/quickstart"
              >
                Video Demo <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Video container with glowing border + fade mask */}
        <div className="relative mt-6">
          {/* Outer glow */}
          <div
            aria-hidden={true}
            className="pointer-events-none absolute -inset-px rounded-[18px] opacity-70"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 30%, transparent 60%)",
            }}
          />
          {/* Ambient colored glow behind video */}
          <div
            aria-hidden={true}
            className="pointer-events-none absolute -inset-8 -z-10 blur-3xl opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 0%, rgba(182,214,255,0.25), transparent 70%), radial-gradient(ellipse 60% 60% at 70% 0%, rgba(214,254,81,0.15), transparent 70%)",
            }}
          />
          <div className="relative rounded-[18px] border border-white/10 bg-white/[0.02] p-1.5 backdrop-blur-sm">
            <div className="relative overflow-hidden rounded-xl">
              <video
                autoPlay={true}
                className="w-full block"
                controls={false}
                disablePictureInPicture={true}
                loop={true}
                muted={true}
                poster="https://6iw07yybtp.ufs.sh/f/9tvkThgRlUcK8urJOvLOaQlLduTRAgwbGEzMkpcHBZnDfY9P"
                src="https://6iw07yybtp.ufs.sh/f/9tvkThgRlUcKlPJKvydv8A6jcXM3ehpNnSUiG7f0Vs2glHFW"
              />
              {/* Bottom fade mask */}
              <div
                aria-hidden={true}
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, #08090a 95%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
