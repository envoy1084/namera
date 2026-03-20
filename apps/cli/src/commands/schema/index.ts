import { Console, Effect, Schema } from "effect";
import { Argument, Command } from "effect/unstable/cli";

import {
  CreateKeystoreParams,
  DecryptKeystoreParams,
  GetKeystoreParams,
  ListKeystoreParams,
} from "@/dto";
import { extractPaths, getSchema } from "@/helpers/paths";

const schemas = {
  keystore: {
    create: CreateKeystoreParams,
    decrypt: DecryptKeystoreParams,
    info: GetKeystoreParams,
    list: ListKeystoreParams,
  },
};

const commands = extractPaths(schemas);
const command = Argument.choice("command", commands).pipe(
  Argument.withDescription("The command to get the schema for"),
);

export const schemaCommand = Command.make(
  "schema",
  { command },
  ({ command }) =>
    Effect.gen(function* () {
      const schema = getSchema(schemas, command);
      const json = Schema.toJsonSchemaDocument(schema);
      yield* Console.log(JSON.stringify(json, null, 2));
    }),
).pipe(Command.withDescription("Get the schema for a command"));
