import { NodeRuntime, NodeServices } from "@effect/platform-node";
import { Console, Effect } from "effect";
import { Command } from "effect/unstable/cli";

import { globalFlags, output } from "./global-flags";

const command = Command.make("namera", {}, () => Effect.void).pipe(
  Command.withDescription(
    "Programmable Session keys for Smart Contracts Accounts.",
  ),
  Command.withGlobalFlags(globalFlags),
  Command.withSubcommands([
    Command.make("account", {}, () => Effect.void).pipe(
      Command.withSubcommands([
        Command.make("create", {}, (p) =>
          Effect.gen(function* () {
            const out = yield* output;
            yield* Console.log("Creating account", out);
          }),
        ),
      ]),
    ),
  ]),
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

const cli = Command.run(command, {
  version: "0.0.1",
}).pipe(Effect.catchTag("InvalidValue", (e) => Console.error(e.message)));

cli.pipe(Effect.provide(NodeServices.layer), NodeRuntime.runMain);
