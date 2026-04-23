import { useState } from "react";

import {
  ChartLineUp,
  GameController,
  Robot,
  ShoppingCart,
  Wallet,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, type Variants } from "motion/react";

import { AmbientGlow, Hr } from "@/components/misc";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    y: 0,
  },
};

const panelVariants: Variants = {
  center: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    y: 0,
  },
  enter: { opacity: 0, y: 10 },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
    y: -6,
  },
};

const industries = [
  {
    bullets: [
      "Automated trading (arbitrage, liquidity provision, execution)",
      "Portfolio rebalancing across protocols and chains",
      "Strategy-driven actions with strict risk controls",
      "High-frequency trading",
    ],
    icon: ChartLineUp,
    key: "defi",
    label: "DeFi",
    tagline: "Let agents manage and execute strategies within defined limits.",
    title: "DeFi & Trading Platforms",
  },
  {
    bullets: [
      "Agents executing transactions on behalf of users",
      "Tool-using agents interacting with smart contracts",
      "Autonomous workflows with built-in permissioning",
    ],
    icon: Robot,
    key: "ai",
    label: "AI Agents",
    tagline: "Give agents the ability to act and operate onchain.",
    title: "AI Agent Platforms",
  },
  {
    bullets: [
      "Automated purchasing and checkout",
      "Subscription management and optimization",
      "Agents paying for APIs, compute, and services",
      "Refunds, payouts, and transaction handling",
    ],
    icon: ShoppingCart,
    key: "commerce",
    label: "Commerce",
    tagline: "Let agents discover, decide, and transact on behalf of users.",
    title: "Agentic Commerce",
  },
  {
    bullets: [
      "Delegate limited access to apps and services",
      "Enable automation without compromising custody",
      "Add policy-based controls for users",
    ],
    icon: Wallet,
    key: "fintech",
    label: "Fintech",
    tagline: "Upgrade wallets into programmable systems.",
    title: "Wallets & Fintech Apps",
  },
  {
    bullets: [
      "AI-driven asset and resource management",
      "Autonomous in-game economies",
      "Controlled execution of in-game actions",
    ],
    icon: GameController,
    key: "gaming",
    label: "Gaming",
    tagline: "Enable agents to manage assets and actions in real time.",
    title: "Gaming & Onchain Economies",
  },
];

export const Industries = () => {
  const [active, setActive] = useState(industries[0].key);
  const current = industries.find((i) => i.key === active)!;
  const Icon = current.icon;

  return (
    <section
      className="relative mx-auto flex max-w-7xl flex-col gap-14 px-4 py-[12dvh]"
      id="industries"
    >
      <Hr />
      <AmbientGlow />

      {/* Header */}
      <motion.div
        className="flex flex-col gap-3"
        initial="hidden"
        variants={sectionVariants}
        viewport={{ margin: "-80px", once: true }}
        whileInView="visible"
      >
        <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-white/40">
          Industries
        </p>
        <h2 className="heading-gradient mx-auto max-w-2xl pb-2 text-center text-3xl tracking-tight sm:text-4xl md:text-5xl">
          Built for every vertical
        </h2>
      </motion.div>

      {/* Tab bar */}
      <motion.div
        className="flex flex-wrap justify-center gap-2"
        initial="hidden"
        variants={sectionVariants}
        viewport={{ margin: "-80px", once: true }}
        whileInView="visible"
      >
        {industries.map((industry) => {
          const TabIcon = industry.icon;
          const isActive = industry.key === active;
          return (
            <button
              className={[
                "relative flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-all duration-200 font-geist-mono",
                isActive
                  ? "border-white/20 bg-white/[0.06] text-white"
                  : "border-white/8 bg-white/[0.02] text-white/40 hover:border-white/12 hover:text-white/60",
              ].join(" ")}
              key={industry.key}
              onClick={() => setActive(industry.key)}
              type="button"
            >
              <TabIcon
                className={isActive ? "size-3.5 text-white/70" : "size-3.5"}
                weight="duotone"
              />
              {industry.label}
              {isActive && (
                <motion.span
                  className="absolute inset-0 rounded-xl border border-white/15"
                  layoutId="active-tab-ring"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Content panel */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden max-w-5xl mx-auto w-full">
        {/* Scanline texture */}
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,1) 3px, rgba(255,255,255,1) 4px)",
          }}
        />
        {/* Top edge highlight */}
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            animate="center"
            className="grid grid-cols-1 gap-10 p-8 md:grid-cols-2 md:gap-0 md:p-0"
            exit="exit"
            initial="enter"
            key={current.key}
            variants={panelVariants}
          >
            {/* Left: identity */}
            <div className="flex flex-col justify-between gap-8 md:border-r md:border-white/[0.06] md:p-10">
              <div className="flex flex-col gap-4">
                <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <Icon className="size-4.5 text-white/50" weight="duotone" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {current.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {current.tagline}
                  </p>
                </div>
              </div>
              <div
                aria-label="Industry tabs"
                className="flex items-center gap-1.5"
                role="tablist"
              >
                {industries.map((ind) => (
                  <button
                    aria-label={ind.label}
                    aria-selected={ind.key === active}
                    className="h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:outline-offset-2"
                    key={ind.key}
                    onClick={() => setActive(ind.key)}
                    role="tab"
                    style={{
                      background:
                        ind.key === active
                          ? "rgba(255,255,255,0.4)"
                          : "rgba(255,255,255,0.12)",
                      width: ind.key === active ? "1.25rem" : "0.375rem",
                    }}
                    type="button"
                  />
                ))}
              </div>
            </div>

            {/* Right: capability pills */}
            <div className="flex flex-col justify-center gap-3 md:p-10">
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                Capabilities
              </p>
              <div className="flex flex-col gap-2">
                {current.bullets.map((bullet, i) => (
                  <motion.span
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-sm leading-snug text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.95 }}
                    key={bullet}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {bullet}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
