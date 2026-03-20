import { Wallet as EthereumJSWallet } from "@ethereumjs/wallet";
import { Data, Effect, Layer, Redacted, ServiceMap } from "effect";
import type { QuitError } from "effect/Terminal";
import type { Prompt } from "effect/unstable/cli";
import type { Environment } from "effect/unstable/cli/Prompt";

import type {
  CreateKeystoreParams,
  DecryptKeystoreParams,
  DecryptKeystoreResponse,
  GetKeystoreParams,
} from "@/dto";
import type { Keystore, V3Keystore } from "@/types";

import { ConfigManager, type ConfigManagerError } from "./config";
import { PromptManager } from "./prompt";

export type KeystoreManager = {
  getKeystore: (
    params: GetKeystoreParams,
  ) => Effect.Effect<Keystore, ConfigManagerError | KeystoreManagerError>;
  listKeystores: () => Effect.Effect<
    Keystore[],
    ConfigManagerError | KeystoreManagerError
  >;
  selectKeystore: () => Effect.Effect<
    Keystore,
    ConfigManagerError | KeystoreManagerError | QuitError,
    Environment
  >;
  createKeystore: (
    params: CreateKeystoreParams,
  ) => Effect.Effect<Keystore, ConfigManagerError | KeystoreManagerError>;
  decryptKeystore: (
    params: DecryptKeystoreParams,
  ) => Effect.Effect<
    DecryptKeystoreResponse,
    KeystoreManagerError | ConfigManagerError
  >;
};

export const KeystoreManager = ServiceMap.Service<KeystoreManager>(
  "@namera-ai/cli/KeystoreManager",
);

export class KeystoreManagerError extends Data.TaggedError(
  "@namera-ai/cli/KeystoreManagerError",
)<{
  code:
    | "KeystoreParseError"
    | "KeystoreAlreadyExists"
    | "KeystoreCreationFailed"
    | "KeystoreDecryptionFailed";
  message: string;
}> {}

export const layer = Layer.effect(
  KeystoreManager,
  Effect.gen(function* () {
    const configManager = yield* ConfigManager;
    const promptManager = yield* PromptManager;

    const getKeystore = (params: GetKeystoreParams) =>
      Effect.gen(function* () {
        const res = yield* configManager.getEntity({
          alias: params.alias,
          type: "keystore",
        });

        const parsedKeystore = yield* Effect.try({
          catch: () =>
            new KeystoreManagerError({
              code: "KeystoreParseError",
              message: "Unable to parse keystore",
            }),
          try: () => JSON.parse(res.content) as V3Keystore,
        });

        const wallet: Keystore = {
          alias: res.alias,
          data: {
            ...parsedKeystore,
            address: `0x${parsedKeystore.address}`,
          },
          path: res.path,
        };

        return wallet;
      });

    const listKeystores = () =>
      Effect.gen(function* () {
        const res = yield* configManager.getEntitiesForType("keystore");

        const effects = res.map((entity) =>
          Effect.gen(function* () {
            const parsedKeystore = yield* Effect.try({
              catch: () =>
                new KeystoreManagerError({
                  code: "KeystoreParseError",
                  message: "Unable to parse keystore",
                }),
              try: () => JSON.parse(entity.content) as V3Keystore,
            });

            const wallet: Keystore = {
              alias: entity.alias,
              data: {
                ...parsedKeystore,
                address: `0x${parsedKeystore.address}`,
              },
              path: entity.path,
            };

            return wallet;
          }),
        );

        return yield* Effect.all(effects, { concurrency: "unbounded" });
      });

    const createKeystore = (params: CreateKeystoreParams) =>
      Effect.gen(function* () {
        const entityPath = yield* configManager.getEntityPath({
          alias: params.alias,
          type: "keystore",
        });

        // Check if alias is already taken
        const aliasTaken = yield* configManager.checkEntityExists({
          alias: params.alias,
          type: "keystore",
        });

        if (aliasTaken) {
          return yield* Effect.fail(
            new KeystoreManagerError({
              code: "KeystoreAlreadyExists",
              message: `Keystore with alias ${params.alias} already exists`,
            }),
          );
        }

        const keystoreString = yield* Effect.tryPromise({
          catch: () =>
            new KeystoreManagerError({
              code: "KeystoreCreationFailed",
              message: "Failed to create keystore",
            }),
          try: () => EthereumJSWallet.generate().toV3String(params.password),
        });

        // Store Entity
        yield* configManager.storeEntity({
          alias: params.alias,
          content: keystoreString,
          path: entityPath,
          type: "keystore",
        });

        const keystore = yield* Effect.try({
          catch: () =>
            new KeystoreManagerError({
              code: "KeystoreParseError",
              message: "Unable to parse keystore",
            }),
          try: () => JSON.parse(keystoreString) as V3Keystore,
        });

        const wallet: Keystore = {
          alias: params.alias,
          data: keystore,
          path: entityPath,
        };

        return wallet;
      });

    const decryptKeystore = (params: DecryptKeystoreParams) =>
      Effect.gen(function* () {
        const keystore = yield* getKeystore({
          alias: params.alias,
        });

        const wallet = yield* Effect.tryPromise({
          catch: () =>
            new KeystoreManagerError({
              code: "KeystoreDecryptionFailed",
              message: "Failed to decrypt keystore",
            }),
          try: () => EthereumJSWallet.fromV3(keystore.data, params.password),
        });

        return {
          address: wallet.getChecksumAddressString(),
          alias: params.alias,
          privateKey: Redacted.make(wallet.getPrivateKeyString()),
          publicKey: wallet.getPublicKeyString(),
        };
      });

    const selectKeystore = () =>
      Effect.gen(function* () {
        const keystores = yield* listKeystores();

        const res = yield* promptManager.selectPrompt({
          message: "Select Keystore",
          choices: keystores.map((k) => ({
            title: k.alias,
            value: k,
            description: k.data.address,
          })) satisfies Prompt.SelectChoice<Keystore>[],
        });

        return res;
      });

    return KeystoreManager.of({
      createKeystore,
      decryptKeystore,
      getKeystore,
      listKeystores,
      selectKeystore,
    });
  }),
);
