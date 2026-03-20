import { NodeRuntime, NodeServices } from "@effect/platform-node";
import { Console, Effect, Layer } from "effect";
import { Command } from "effect/unstable/cli";

import { commands } from "./commands";
import { globalFlags } from "./global-flags";
import {
  ConfigManager,
  KeystoreManager,
  OutputFormatter,
  PromptManager,
} from "./layers";

const command = Command.make("namera", {}, () => Effect.void).pipe(
  Command.withDescription(
    "Programmable Session keys for Smart Contracts Accounts.",
  ),
  Command.withGlobalFlags(globalFlags),
  Command.withSubcommands(commands),
  Command.withExamples([
    {
      command: "namera --help",
      description: "Print help",
    },
    {
      command: "namera --version",
      description: "Print version",
    },
  ]),
);

const Layers = KeystoreManager.layer.pipe(
  Layer.provideMerge(PromptManager.layer),
  Layer.provideMerge(ConfigManager.layer),
  Layer.provideMerge(OutputFormatter.layer),
  Layer.provideMerge(NodeServices.layer),
);

const cli = Effect.gen(function* () {
  const configManager = yield* ConfigManager.ConfigManager;
  yield* configManager.ensureConfigDirExists();

  yield* Command.run(command, {
    version: "0.0.1",
  });
}).pipe(
  Effect.provide(Layers),
  Effect.catch((e) => Console.error(e.message)),
);

// @ts-expect-error - TODO: fix this
cli.pipe(NodeRuntime.runMain);
