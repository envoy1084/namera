import { Effect, Layer, ServiceMap } from "effect";
import { NdJson } from "json-nd";

import { prettyFormat } from "@/helpers/pretty";

export type OutputFormatter = {
  format: (
    data: object | object[],
    format: "pretty" | "json" | "ndjson",
  ) => Effect.Effect<string>;
};

export const OutputFormatter = ServiceMap.Service<OutputFormatter>(
  "@namera-ai/cli/OutputFormatter",
);

export const layer = Layer.succeed(
  OutputFormatter,
  OutputFormatter.of({
    format: (data, format) =>
      Effect.gen(function* () {
        if (format === "pretty") {
          return prettyFormat(data);
        }
        if (format === "json") {
          return JSON.stringify(data, null, 2);
        }

        if (Array.isArray(data)) {
          return NdJson.stringify(data);
        }

        return NdJson.stringify([data]);
      }),
  }),
);
