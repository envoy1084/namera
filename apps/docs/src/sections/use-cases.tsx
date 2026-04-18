import { BrainIcon, LightningIcon, PlugsIcon } from "@phosphor-icons/react";

type UseCase = {
  color: string;
  description: string;
  icon: typeof BrainIcon;
  key: string;
  title: string;
};

const useCases: UseCase[] = [
  {
    color: "#b6d6ff",
    description:
      "Give your LLM a wallet it can use. Scoped access, zero key exposure.",
    icon: BrainIcon,
    key: "agents",
    title: "AI Agent Developers",
  },
  {
    color: "#ffa16c",
    description:
      "Automate swaps, positions, and yield strategies with onchain risk rules.",
    icon: LightningIcon,
    key: "defi",
    title: "DeFi Automation",
  },
  {
    color: "#d6fe51",
    description:
      "Let users delegate limited wallet access. Passkeys, batching, and multi-chain included.",
    icon: PlugsIcon,
    key: "protocols",
    title: "Protocol Integrators",
  },
];

const UseCaseCard = ({ useCase }: { useCase: UseCase }) => {
  const Icon = useCase.icon;
  return (
    <div
      className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
      style={{
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.02), 0 8px 24px -12px rgba(0,0,0,0.6)",
      }}
    >
      {/* Top accent */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${useCase.color}, transparent)`,
        }}
      />
      {/* Hover glow */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
        style={{ backgroundColor: useCase.color }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="flex size-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 group-hover:border-white/20"
          style={{ boxShadow: `0 0 24px ${useCase.color}20` }}
        >
          <Icon
            className="size-7 transition-transform duration-300 group-hover:scale-110"
            style={{ color: useCase.color }}
            weight="duotone"
          />
        </div>
      </div>

      <div className="relative flex flex-col gap-3">
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {useCase.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {useCase.description}
        </p>
      </div>
    </div>
  );
};

export const UseCases = () => {
  return (
    <section
      className="relative mx-auto flex max-w-7xl flex-col gap-14 px-4 py-[12dvh]"
      id="use-cases"
    >
      {/* Top divider */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />
      {/* Ambient glow */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-64 max-w-4xl blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 20% 50%, rgba(182,214,255,0.08), transparent 70%), radial-gradient(ellipse 30% 50% at 50% 50%, rgba(255,161,108,0.06), transparent 70%), radial-gradient(ellipse 40% 50% at 80% 50%, rgba(214,254,81,0.08), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col gap-3">
        <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-white/40">
          Use Cases
        </p>
        <h2 className="heading-gradient mx-auto max-w-3xl pb-2 text-center text-3xl tracking-tight sm:text-4xl md:text-5xl">
          Built for builders who move onchain.
        </h2>
      </div>

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
        {useCases.map((useCase) => (
          <UseCaseCard key={useCase.key} useCase={useCase} />
        ))}
      </div>
    </section>
  );
};
