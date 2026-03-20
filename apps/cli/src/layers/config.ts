import os from "node:os";

import { Data, Effect, FileSystem, Layer, Path, ServiceMap } from "effect";
import type { SystemErrorTag } from "effect/PlatformError";

import { type Entity, type EntityType, entityName } from "@/types";

export type ConfigManager = {
  ensureConfigDirExists: () => Effect.Effect<void, ConfigManagerError>;
  getConfigDirPath: () => Effect.Effect<string>;
  getEntityPath: <TEntityType extends EntityType>(
    entity: GetEntityParams<TEntityType>,
  ) => Effect.Effect<string>;
  checkEntityExists: <TEntityType extends EntityType>(
    entity: GetEntityParams<TEntityType>,
  ) => Effect.Effect<boolean, ConfigManagerError>;
  getEntity: <TEntityType extends EntityType>(
    entity: GetEntityParams<TEntityType>,
  ) => Effect.Effect<Entity<TEntityType>, ConfigManagerError>;
  getEntitiesForType: <TEntityType extends EntityType>(
    type: TEntityType,
  ) => Effect.Effect<Entity<TEntityType>[], ConfigManagerError>;
  storeEntity: <TEntityType extends EntityType>(
    entity: Entity<TEntityType>,
  ) => Effect.Effect<Entity<TEntityType>, ConfigManagerError>;
};

export class ConfigManagerError extends Data.TaggedError(
  "@namera-ai/cli/ConfigManagerError",
)<{
  code:
    | "InitializationError"
    | "BadArgument"
    | "EntityNotFound"
    | "EntityAlreadyExists"
    | SystemErrorTag;
  message: string;
}> {}

type GetEntityParams<TEntityType extends EntityType> = {
  type: TEntityType;
  alias: string;
};

export const ConfigManager = ServiceMap.Service<ConfigManager>(
  "@namera-ai/cli/ConfigManager",
);

export const layer = Layer.effect(
  ConfigManager,
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    const getConfigDirPath = () =>
      Effect.gen(function* () {
        const homeDir = yield* Effect.sync(() => os.homedir());
        const baseDir = path.join(homeDir, ".namera");

        return baseDir;
      });

    const ensureConfigDirExists = () =>
      Effect.gen(function* () {
        const baseDir = yield* getConfigDirPath();

        const subDirs = ["smart-accounts", "session-keys", "keystores"];

        const directoriesToCreate = subDirs.map((dir) =>
          path.join(baseDir, dir),
        );

        yield* Effect.forEach(
          directoriesToCreate,
          (dirPath) =>
            fs.makeDirectory(dirPath, { recursive: true }).pipe(
              Effect.catchTag("PlatformError", (e) =>
                Effect.fail(
                  new ConfigManagerError({
                    code: "InitializationError",
                    message: e.message,
                  }),
                ),
              ),
            ),
          { concurrency: "unbounded" },
        );
      });

    const getEntityPath = <TEntityType extends EntityType>(
      entity: GetEntityParams<TEntityType>,
    ) =>
      Effect.gen(function* () {
        const baseDir = yield* getConfigDirPath();
        const entityPath = path.join(baseDir, `${entity.type}s`, entity.alias);
        return entityPath;
      });

    const checkEntityExists = <TEntityType extends EntityType>(
      entity: GetEntityParams<TEntityType>,
    ) =>
      Effect.gen(function* () {
        const entityPath = yield* getEntityPath(entity);
        const exists = yield* fs.exists(entityPath).pipe(
          Effect.catchTag("PlatformError", (e) =>
            Effect.fail(
              new ConfigManagerError({
                code: e.reason._tag,
                message: e.message,
              }),
            ),
          ),
        );

        return exists;
      });

    const getEntity = <TEntityType extends EntityType>(
      entity: GetEntityParams<TEntityType>,
    ) =>
      Effect.gen(function* () {
        const entityPath = yield* getEntityPath(entity);
        const exists = yield* checkEntityExists(entity);

        if (exists) {
          const content = yield* fs.readFileString(entityPath);

          return {
            alias: entity.alias,
            content,
            path: entityPath,
            type: entity.type,
          } satisfies Entity<TEntityType>;
        }

        return yield* Effect.fail(
          new ConfigManagerError({
            code: "EntityNotFound",
            message: `${entityName[entity.type]} with alias ${entity.alias} does not exist`,
          }),
        );
      }).pipe(
        Effect.catchTag("PlatformError", (e) =>
          Effect.fail(
            new ConfigManagerError({
              code: e.reason._tag,
              message: e.message,
            }),
          ),
        ),
      );

    const getEntitiesForType = <TEntityType extends EntityType>(
      type: TEntityType,
    ) =>
      Effect.gen(function* () {
        const baseDir = yield* getConfigDirPath();

        const entitiesDir = path.join(baseDir, `${type}s`);
        const entities = yield* fs.readDirectory(entitiesDir);

        const effects = entities.map((entityName) =>
          Effect.gen(function* () {
            const entityPath = path.join(entitiesDir, entityName);
            const content = yield* fs.readFileString(entityPath);

            return {
              alias: entityName,
              content,
              path: entityPath,
              type,
            } satisfies Entity<TEntityType>;
          }),
        );

        return yield* Effect.all(effects, { concurrency: "unbounded" });
      }).pipe(
        Effect.catchTag("PlatformError", (e) =>
          Effect.fail(
            new ConfigManagerError({
              code: e.reason._tag,
              message: e.message,
            }),
          ),
        ),
      );

    const storeEntity = <TEntityType extends EntityType>(
      entity: Entity<TEntityType>,
    ) =>
      Effect.gen(function* () {
        const entityPath = yield* getEntityPath(entity);

        const exists = yield* checkEntityExists({
          alias: entity.alias,
          type: entity.type,
        });

        if (exists) {
          return yield* Effect.fail(
            new ConfigManagerError({
              code: "EntityAlreadyExists",
              message: `Entity ${entity.alias} already exists`,
            }),
          );
        }

        yield* fs.writeFileString(entityPath, entity.content);

        return {
          alias: entity.alias,
          content: entity.content,
          path: entityPath,
          type: entity.type,
        } satisfies Entity<TEntityType>;
      }).pipe(
        Effect.catchTag("PlatformError", (e) =>
          Effect.fail(
            new ConfigManagerError({
              code: e.reason._tag,
              message: e.message,
            }),
          ),
        ),
      );

    return ConfigManager.of({
      checkEntityExists,
      ensureConfigDirExists,
      getConfigDirPath,
      getEntitiesForType,
      getEntity,
      getEntityPath,
      storeEntity,
    });
  }),
);
