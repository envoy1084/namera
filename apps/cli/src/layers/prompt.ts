import { Data, Effect, Layer, type Redacted, ServiceMap } from "effect";
import type { QuitError } from "effect/Terminal";
import { Prompt } from "effect/unstable/cli";

import { type EntityType, entityName } from "@/types";

import { ConfigManager } from "./config";

export type PromptManager = {
  aliasPrompt: (
    params: AliasPromptParams,
  ) => Effect.Effect<string, QuitError, Prompt.Environment>;
  passwordPrompt: (
    params: PasswordPromptParams,
  ) => Effect.Effect<Redacted.Redacted<string>, QuitError, Prompt.Environment>;
  selectPrompt: <const A>(
    params: Prompt.SelectOptions<A>,
  ) => Effect.Effect<A, QuitError, Prompt.Environment>;
};

export const PromptManager = ServiceMap.Service<PromptManager>(
  "@namera-ai/cli/PromptManager",
);

export class PromptManagerError extends Data.TaggedError(
  "@namera-ai/cli/PromptManagerError",
)<{
  code: "";
  message: string;
}> {}

export type AliasPromptParams = {
  message: string;
  type: EntityType;
  aliasType: "new" | "existing";
};

export type PasswordPromptParams = {
  message: string;
  validate?: (v: string) => Effect.Effect<string, string, never>;
};

export const layer = Layer.effect(
  PromptManager,
  Effect.gen(function* () {
    const configManager = yield* ConfigManager;

    const aliasPrompt = (params: AliasPromptParams) =>
      Effect.gen(function* () {
        const alias = yield* Prompt.text({
          message: params.message,
          validate: (v) =>
            Effect.gen(function* () {
              if (v.trim() === "") {
                return yield* Effect.fail("Alias cannot be empty");
              }

              const exists = yield* configManager
                .checkEntityExists({
                  alias: v,
                  type: params.type,
                })
                .pipe(
                  Effect.catchTag("@namera-ai/cli/ConfigManagerError", (e) =>
                    Effect.fail(e.message),
                  ),
                );

              if (params.aliasType === "new" && exists) {
                return yield* Effect.fail(
                  `${entityName[params.type]} with alias ${v} already exists`,
                );
              }

              if (params.aliasType === "existing" && !exists) {
                return yield* Effect.fail(
                  `${entityName[params.type]} with alias ${v} does not exist`,
                );
              }

              return v;
            }),
        });

        return alias;
      });

    const passwordPrompt = (params: PasswordPromptParams) =>
      Effect.gen(function* () {
        const password = yield* Prompt.password({
          message: params.message,
          validate: (v) =>
            Effect.gen(function* () {
              if (v.trim() === "") {
                return yield* Effect.fail("Password cannot be empty");
              }

              if (params.validate) {
                return yield* params.validate(v);
              }

              return v;
            }),
        });

        return password;
      });

    const selectPrompt = <const A>(params: Prompt.SelectOptions<A>) =>
      Effect.gen(function* () {
        return yield* Prompt.select(params);
      });

    return PromptManager.of({ aliasPrompt, passwordPrompt, selectPrompt });
  }),
);
