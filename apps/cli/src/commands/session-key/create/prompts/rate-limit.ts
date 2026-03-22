/** biome-ignore-all lint/suspicious/noExplicitAny: safe */
import { Duration, Effect } from "effect";
import { Prompt } from "effect/unstable/cli";

import type { RateLimitPolicyParams } from "@/schema";

export const getRateLimitPolicyParams = Effect.gen(function* () {
  const interval = yield* Prompt.text({
    message:
      "Duration for which rate limit is enforced? (e.g. 1 hour, 1 day, 1 week)",
    validate: (v) =>
      Effect.gen(function* () {
        const valid = Duration.fromInput(v as any);
        if (valid._tag === "None") {
          return yield* Effect.fail("Invalid duration");
        }

        return v;
      }),
  });

  const intervalDuration = Duration.fromInputUnsafe(interval as any);

  const count = yield* Prompt.integer({
    message: "Number of requests allowed per interval.",
    validate: (v) =>
      Effect.gen(function* () {
        if (v < 1) return yield* Effect.fail("Count must be greater than 0");
        return v;
      }),
  });

  const startAt = yield* Prompt.date({
    initial: new Date(),
    message: "Date at which the rate limit is enforced.",
    validate: (d) =>
      Effect.gen(function* () {
        if (d < new Date())
          return yield* Effect.fail("Date must be in the future");
        return d;
      }),
  });

  return {
    type: "rate-limit",
    count,
    interval: Duration.toMillis(intervalDuration),
    startAt: Math.floor(startAt.getTime() / 1000),
  } satisfies RateLimitPolicyParams;
});
