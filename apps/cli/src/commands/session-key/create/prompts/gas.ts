import { Effect } from "effect";
import { Prompt } from "effect/unstable/cli";
import { parseEther } from "viem";

import type { GasPolicyParams } from "@/schema";

import { etherPrompt } from "./common";

export const getGasPolicyParams = Effect.gen(function* () {
  const allowed = yield* etherPrompt(
    "Total amount of gas allowed (in ETH units)",
  );

  const enforcePaymaster = yield* Prompt.confirm({
    message: "Should UserOperations require Paymaster?",
  });

  const weiUnits = parseEther(allowed);

  return {
    amount: weiUnits,
    type: "gas",
    enforcePaymaster,
  } satisfies GasPolicyParams;
});
