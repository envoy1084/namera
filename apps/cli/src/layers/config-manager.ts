import os from "node:os";

import { Data, Effect, FileSystem, Layer, Path, ServiceMap } from "effect";
import type { SystemErrorTag } from "effect/PlatformError";

import type { Entity, EntityType } from "@/types";

/**
 * Public API for CLI configuration and entity storage.
 *
 * The manager centers around the `.namera` directory inside the current OS
 * home directory and exposes helpers to resolve paths, validate existence,
 * and load persisted entities from `.namera/<entity>s`.
 */
type ConfigManagerShape = {
  /**
   * Ensure the base config directory and all entity subfolders exist.
   *
   * Creates `.namera` and known entity folders when missing. Failures are
   * normalized into {@link ConfigManagerError} with `InitializationError`.
   */
  ensureConfigDirExists: () => Effect.Effect<
    void,
    ConfigManagerError,
    FileSystem.FileSystem | Path.Path
  >;
  /**
   * Return the absolute path to the base config directory (`~/.namera`).
   */
  getConfigDirPath: () => Effect.Effect<string, never, Path.Path>;
  /**
   * Resolve the absolute file path for a single entity.
   */
  getEntityPath: <TEntityType extends EntityType>(
    entity: GetEntityParams<TEntityType>,
  ) => Effect.Effect<string, never, Path.Path>;
  /**
   * Check whether a specific entity file exists.
   */
  checkEntityExists: <TEntityType extends EntityType>(
    entity: GetEntityParams<TEntityType>,
  ) => Effect.Effect<
    boolean,
    ConfigManagerError,
    FileSystem.FileSystem | Path.Path
  >;
  /**
   * Load a single entity by type and identifier.
   */
  getEntity: <TEntityType extends EntityType>(
    entity: GetEntityParams<TEntityType>,
  ) => Effect.Effect<
    Entity<TEntityType>,
    ConfigManagerError,
    FileSystem.FileSystem | Path.Path
  >;
  /**
   * Load all entities for a given type from the corresponding directory.
   */
  getEntitiesForType: <TEntityType extends EntityType>(
    type: TEntityType,
  ) => Effect.Effect<
    Entity<TEntityType>[],
    ConfigManagerError,
    FileSystem.FileSystem | Path.Path
  >;
};

/**
 * Standard error shape for config manager failures.
 *
 * `code` is a stable discriminator for callers to branch on, while `message`
 * carries the original error details or a domain-specific explanation.
 */
export class ConfigManagerError extends Data.TaggedError(
  "@namera-ai/cli/ConfigManagerError",
)<{
  code:
    | "InitializationError"
    | "BadArgument"
    | "EntityNotFound"
    | SystemErrorTag;
  message: string;
}> {}

/**
 * Service entrypoint for the config manager.
 */
export const ConfigManager = ServiceMap.Service<ConfigManagerShape>(
  "@namera-ai/cli/ConfigManager",
);

/**
 * Compute the base config directory path (`~/.namera`).
 */
const getConfigDirPath = () =>
  Effect.gen(function* () {
    const path = yield* Path.Path;

    const homeDir = yield* Effect.sync(() => os.homedir());
    const baseDir = path.join(homeDir, ".namera");

    return baseDir;
  });

/**
 * Ensure the config directory and its known subdirectories exist.
 */
const ensureConfigDirExists = () =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    const baseDir = yield* getConfigDirPath();

    const subDirs = ["smart-accounts", "session-keys", "keystores"];

    const directoriesToCreate = subDirs.map((dir) => path.join(baseDir, dir));

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

/**
 * Parameter shape for addressing an entity file on disk.
 */
type GetEntityParams<TEntityType extends EntityType> = {
  type: TEntityType;
  identifier: string;
};

/**
 * Resolve the absolute path for the given entity.
 */
const getEntityPath = <TEntityType extends EntityType>(
  entity: GetEntityParams<TEntityType>,
) =>
  Effect.gen(function* () {
    const path = yield* Path.Path;
    const baseDir = yield* getConfigDirPath();
    const entityPath = path.join(baseDir, `${entity.type}s`, entity.identifier);
    return entityPath;
  });

/**
 * Test whether an entity file exists on disk.
 */
const checkEntityExists = <TEntityType extends EntityType>(
  entity: GetEntityParams<TEntityType>,
) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
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

/**
 * Read and return a single entity from disk.
 */
const getEntity = <TEntityType extends EntityType>(
  entity: GetEntityParams<TEntityType>,
) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const entityPath = yield* getEntityPath(entity);

    const exists = yield* checkEntityExists(entity);

    if (exists) {
      const content = yield* fs.readFileString(entityPath);

      return {
        content,
        name: entity.identifier,
        path: entityPath,
        type: entity.type,
      } satisfies Entity<TEntityType>;
    }

    return yield* Effect.fail(
      new ConfigManagerError({
        code: "EntityNotFound",
        message: `Entity ${entity.identifier} does not exist`,
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

/**
 * Read all entities for a type from its directory.
 */
const getEntitiesForType = <TEntityType extends EntityType>(
  type: TEntityType,
) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    const baseDir = yield* getConfigDirPath();

    const entitiesDir = path.join(baseDir, `${type}s`);
    const entities = yield* fs.readDirectory(entitiesDir);

    const effects = entities.map((entityName) =>
      Effect.gen(function* () {
        const entityPath = path.join(entitiesDir, entityName);
        const content = yield* fs.readFileString(entityPath);

        return {
          content,
          name: entityName,
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

/**
 * Effect layer wiring the {@link ConfigManager} implementation.
 */
export const layer = Layer.effect(
  ConfigManager,
  Effect.gen(function* () {
    return ConfigManager.of({
      checkEntityExists,
      ensureConfigDirExists,
      getConfigDirPath,
      getEntitiesForType,
      getEntity,
      getEntityPath,
    });
  }),
);
