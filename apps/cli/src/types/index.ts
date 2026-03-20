export type EntityType = "smart-account" | "session-key" | "keystore";

export type Entity<TEntityType extends EntityType> = {
  path: string;
  content: string;
  name: string;
  type: TEntityType;
};
