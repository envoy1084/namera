import { Effect } from "effect";
import { Prompt } from "effect/unstable/cli";

import type { PolicyParams } from "@/schema";

import { policyChoicePrompt } from "./base";
import { getCallPolicyParams } from "./call";
import { getGasPolicyParams } from "./gas";
import { getRateLimitPolicyParams } from "./rate-limit";
import { getSignatureCallerPolicyParams } from "./signature-caller";
import { getTimestampPolicyParams } from "./timestamp";

export const getPoliciesFromUser = () =>
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ok
  Effect.gen(function* () {
    const policyParams: PolicyParams[] = [];

    while (true) {
      if (policyParams.length > 0) {
        const addMore = yield* Prompt.confirm({
          message: "Do you want to add another policy?",
        });
        if (!addMore) break;
      }

      const policyType = yield* policyChoicePrompt(policyParams);

      if (policyType === "sudo") {
        policyParams.push({ type: "sudo" });
        // If sudo is selected, no need to ask for other policies
        break;
      }

      if (policyType === "timestamp") {
        const res = yield* getTimestampPolicyParams;
        policyParams.push(res);
      } else if (policyType === "call") {
        const res = yield* getCallPolicyParams;
        policyParams.push(res);
      } else if (policyType === "gas") {
        const res = yield* getGasPolicyParams;
        policyParams.push(res);
      } else if (policyType === "rate-limit") {
        const res = yield* getRateLimitPolicyParams;
        policyParams.push(res);
      } else if (policyType === "signature-caller") {
        const res = yield* getSignatureCallerPolicyParams;
        policyParams.push(res);
      } else {
        break;
      }
    }

    return policyParams;
  });
