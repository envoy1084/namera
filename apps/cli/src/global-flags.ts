import { Flag, GlobalFlag } from "effect/unstable/cli";

export const output = GlobalFlag.setting("output")({
  flag: Flag.choice("output", ["markdown", "json", "ndjson"]).pipe(
    Flag.withAlias("o"),
    Flag.withDefault("markdown"),
    Flag.withDescription("Output format (markdown, json, ndjson)"),
  ),
});

const quite = GlobalFlag.setting("quite")({
  flag: Flag.boolean("quite").pipe(
    Flag.withAlias("q"),
    Flag.withDefault(false),
    Flag.withDescription("Do not print output"),
  ),
});

export const globalFlags = [output, quite] as const;
