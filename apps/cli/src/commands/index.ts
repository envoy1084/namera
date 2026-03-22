import { keystoreCommands } from "./keystore";
import { schemaCommand } from "./schema";
import { sessionKeyCommands } from "./session-key";
import { smartAccountCommands } from "./smart-account";

/**
 * Root CLI command set.
 */
export const commands = [
  keystoreCommands,
  smartAccountCommands,
  sessionKeyCommands,
  schemaCommand,
] as const;
