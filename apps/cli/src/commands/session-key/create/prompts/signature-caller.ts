import { Effect, Schema } from "effect";
import { Prompt } from "effect/unstable/cli";

import { EthereumAddress, type SignatureCallerPolicyParams } from "@/schema";

export const getSignatureCallerPolicyParams = Effect.gen(function* () {
  const allowed = yield* Prompt.text({
    message: "Comma-separated list of allowed callers:",
    validate: (v) =>
      Effect.gen(function* () {
        const address = v.split(",").map((a) => a.trim());

        for (let i = 0; i < address.length; i++) {
          const a = address[i] as string;
          const res = Schema.decodeUnknownOption(EthereumAddress)(a);
          if (res._tag === "None") {
            return yield* Effect.fail(`Invalid Ethereum Address at index ${i}`);
          }
        }

        return v;
      }),
  });

  const allowedCallers = allowed
    .split(",")
    .map((a) => a.trim())
    .map((a) => Schema.decodeUnknownSync(EthereumAddress)(a));

  return {
    type: "signature-caller",
    allowedCallers,
  } satisfies SignatureCallerPolicyParams;
});
