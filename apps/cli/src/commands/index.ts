import { keystoreCommands } from "./keystore";
import { schemaCommand } from "./schema";
import { smartAccountCommands } from "./smart-account";

/**
 * Root CLI command set.
 */
export const commands = [
  keystoreCommands,
  smartAccountCommands,
  schemaCommand,
] as const;
