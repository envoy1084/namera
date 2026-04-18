import {
  KeyIcon,
  LightningIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "@phosphor-icons/react";

type Step = {
  color: string;
  description: string;
  icon: typeof WalletIcon;
  key: string;
  label: string;
  number: string;
  title: string;
};

const steps: Step[] = [
  {
    color: "#b6d6ff",
    description:
      "Deterministic address, deployable on demand. Works before deployment — fund, receive, and plan without an onchain transaction.",
    icon: WalletIcon,
    key: "create",
    label: "Smart Account",
    number: "01",
    title: "Create a Smart Account",
  },
  {
    color: "#ffa16c",
    description:
      "Issue a scoped key to your agent with explicit policy boundaries. The root key never leaves your device.",
    icon: KeyIcon,
    key: "session",
    label: "Session Key",
    number: "02",
    title: "Define a Session Key",
  },
  {
    color: "#d6fe51",
    description:
      "Restrict by contract, function, gas limit, rate, or time window. Every rule is enforced at the smart contract level.",
    icon: ShieldCheckIcon,
    key: "policies",
    label: "Policies",
    number: "03",
    title: "Set Policies",
  },
  {
    color: "#d6fe51",
    description:
      "Agent signs and submits transactions within the allowed scope. Policies enforced onchain — not on a server.",
    icon: LightningIcon,
    key: "execute",
    label: "Execution",
    number: "04",
    title: "Agent Executes",
  },
];

const StepCard = ({ step, index }: { step: Step; index: number }) => {
  const Icon = step.icon;
  const isLast = index === steps.length - 1;

  return (
    <div className="relative flex flex-col">
      {/* Connector line to next step (desktop only) */}
      {!isLast && (
        <div
          aria-hidden={true}
          className="pointer-events-none absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.2) 100%)",
          }}
        />
      )}

      <div
        className="group relative flex h-full flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
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
            background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
          }}
        />
        {/* Glow on hover */}
        <div
          aria-hidden={true}
          className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
          style={{ backgroundColor: step.color }}
        />

        <div className="flex items-start justify-between">
          <div
            className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 group-hover:border-white/20"
            style={{ boxShadow: `0 0 20px ${step.color}15` }}
          >
            <Icon
              className="size-6 transition-transform duration-300 group-hover:scale-110"
              style={{ color: step.color }}
              weight="duotone"
            />
          </div>
          <span
            className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: `${step.color}` }}
          >
            {step.number}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
            {step.label}
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-white">
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const HowItWorks = () => {
  return (
    <section
      className="relative mx-auto flex max-w-7xl flex-col gap-16 px-4 py-[12dvh]"
      id="how-it-works"
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
        className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-64 max-w-3xl blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(214,254,81,0.1), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col gap-3">
        <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-white/40">
          How It Works
        </p>
        <h2 className="heading-gradient mx-auto max-w-3xl pb-2 text-center text-3xl tracking-tight sm:text-4xl md:text-5xl">
          From smart account to agent execution
        </h2>
      </div>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {steps.map((step, i) => (
          <StepCard index={i} key={step.key} step={step} />
        ))}
      </div>
    </section>
  );
};
