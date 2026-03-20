import { keystoreCommands } from "./keystore";
import { schemaCommand } from "./schema";

export const commands = [keystoreCommands, schemaCommand] as const;
