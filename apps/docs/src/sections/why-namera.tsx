import {
  CheckIcon,
  QuestionMarkIcon,
  TriangleIcon,
  XIcon,
} from "@phosphor-icons/react";

const withoutNamera = [
  "Exposing private keys to agents",
  "Building permission systems from scratch",
  "No safe way to delegate wallet access",
];

const withNamera = [
  "Scoped session keys with onchain enforcement",
  "Policies defined once, applied everywhere",
  "Agents execute automatically — within limits",
  "No infrastructure to manage",
];

const slowLines = Array.from({ length: 100 }, () => ({
  marginTop: `${Math.random() * 160}px`,
  width: `${20 + Math.random() * 40}px`,
}));

const fastLines = Array.from({ length: 100 }, () => ({
  marginTop: `${Math.random() * 160}px`,
  width: `${20 + Math.random() * 60}px`,
}));

const MovingRails = () => {
  return (
    <>
      <div className="absolute inset-0">
        <div className="flex w-max animate-[scroll_20s_linear_infinite] gap-10">
          {slowLines.map((line, i) => (
            <div
              className="rounded-full border-neutral-700 h-px border opacity-80"
              key={`slow-${i.toString()}`}
              style={{
                marginTop: line.marginTop,
                width: line.width,
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0">
        <div className="flex w-max animate-[scroll_8s_linear_infinite] gap-10">
          {fastLines.map((line, i) => (
            <div
              className="rounded-full border-neutral-700 border h-px"
              key={`fast-${i.toString()}`}
              style={{
                marginTop: line.marginTop,
                width: line.width,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export const WhyNamera = () => {
  return (
    <section
      className="relative px-4 max-w-7xl mx-auto py-[14dvh] flex items-center justify-center flex-col gap-16"
      id="why-namera"
    >
      <div className="flex flex-col gap-3">
        <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-white/40">
          The Difference
        </p>
        <h2 className="text-3xl max-w-3xl mx-auto text-center heading-gradient pb-2 sm:text-4xl md:text-5xl tracking-tight">
          Building agent wallets is complex.
          <br />
          Without Namera, it's harder.
        </h2>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Without Namera — red-tinted card */}
        <div
          className="relative flex flex-col gap-4 rounded-2xl border border-red-500/15 bg-gradient-to-b from-red-500/[0.04] to-transparent p-6 overflow-hidden"
          style={{
            boxShadow: "inset 0 1px 0 rgba(239,68,68,0.08)",
          }}
        >
          <div
            aria-hidden={true}
            className="pointer-events-none absolute -top-24 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl"
          />
          <div className="relative bg-muted/40 rounded-xl h-28 w-full overflow-hidden border border-white/5">
            <MovingRails />
            <div className="absolute top-1/2 right-1/2 size-7 bg-white rounded-full flex items-center justify-center animate-path confused translate-x-1/2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <QuestionMarkIcon className="text-red-500" strokeWidth={2} />
            </div>
          </div>
          <div className="relative flex flex-col gap-3 w-full">
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-red-400">
                <span className="size-1 rounded-full bg-red-400" />
                Without Namera
              </span>
            </div>
            <div className="text-xl text-muted-foreground font-medium">
              The hard way
            </div>
            <div className="flex flex-col text-sm gap-2.5 text-muted-foreground pt-1">
              {withoutNamera.map((text, i) => (
                <div
                  className="flex flex-row gap-2.5 items-center"
                  key={`without-namera-${i.toString()}`}
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                    <XIcon className="size-3" weight="bold" />
                  </span>
                  <span className="leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* With Namera — green-tinted card */}
        <div
          className="relative flex flex-col gap-4 rounded-2xl border border-[#d6fe51]/20 bg-gradient-to-b from-[#d6fe51]/[0.05] to-transparent p-6 overflow-hidden"
          style={{
            boxShadow: "inset 0 1px 0 rgba(214,254,81,0.08)",
          }}
        >
          <div
            aria-hidden={true}
            className="pointer-events-none absolute -top-24 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-[#d6fe51]/10 blur-3xl"
          />
          <div className="relative bg-muted/40 rounded-xl h-28 w-full overflow-hidden border border-white/5">
            <MovingRails />
            <div className="rotate-90 absolute top-1/2 right-1/2">
              <TriangleIcon
                className="animate-triangle-path size-8 fill-[#d6fe51] drop-shadow-[0_0_8px_rgba(214,254,81,0.6)]"
                weight="fill"
              />
            </div>
          </div>
          <div className="relative flex flex-col gap-3 w-full">
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6fe51]/30 bg-[#d6fe51]/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[#d6fe51]">
                <span className="size-1 rounded-full bg-[#d6fe51]" />
                With Namera
              </span>
            </div>
            <div className="text-xl text-foreground font-semibold">
              The Namera way
            </div>
            <div className="flex flex-col text-sm gap-2.5 text-foreground pt-1">
              {withNamera.map((text, i) => (
                <div
                  className="flex flex-row gap-2.5 items-center"
                  key={`with-namera-${i.toString()}`}
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-[#d6fe51]/40 bg-[#d6fe51]/15 text-[#d6fe51]">
                    <CheckIcon className="size-3" weight="bold" />
                  </span>
                  <span className="leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
