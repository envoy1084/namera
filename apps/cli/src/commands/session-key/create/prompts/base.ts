import { Effect } from "effect";
import { Prompt } from "effect/unstable/cli";

import type { PolicyParams } from "@/schema";

const policyChoices = [
  {
    description: "Grant access to all operations",
    title: "Sudo Permission",
    value: "sudo",
  },
  {
    description: "Whitelist addresses, contract and functions",
    title: "Call Permission",
    value: "call",
  },
  {
    description: "Specify the start and end time for when the key is valid",
    title: "Timestamp Permission",
    value: "timestamp",
  },
  {
    description: "Specify the allowed gas usage for the session key",
    title: "Gas Permission",
    value: "gas",
  },
  {
    description:
      "Specify which addresses can verify signatures from this session key",
    title: "Signature Permission",
    value: "signature-caller",
  },
  {
    description: "Specify the allowed gas usage for the session key",
    title: "Rate Limit Permission",
    value: "rate-limit",
  },
  {
    description: "Complete the session key creation",
    title: "Done",
    value: "done",
  },
] as const;

export const policyChoicePrompt = (prevPolicies: PolicyParams[]) =>
  Effect.gen(function* () {
    // show only those which are not in prevPolicies
    const choices = policyChoices.filter(
      (c) => !prevPolicies.some((p) => p.type === c.value),
    );

    const prompt = Prompt.select({
      choices,
      message: "Select Permission type you want to add for this session key",
    });

    return yield* prompt;
  });
