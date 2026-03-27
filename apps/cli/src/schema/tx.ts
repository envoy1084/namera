import { Schema } from "effect";

import { BigIntFromString, EthereumAddress, Hex } from "./common";

export const Call = Schema.Struct({
  target: EthereumAddress,
  data: Hex,
  value: Schema.optional(BigIntFromString),
});

export const Batch = Schema.Struct({
  chainId: Schema.Int,
  nonceKey: Schema.optional(Schema.String),
  atomic: Schema.optional(Schema.Boolean),
  calls: Schema.mutable(Schema.Array(Call)),
});

export const ExecuteTransactionParams = Schema.Struct({
  batches: Schema.mutable(Schema.Array(Batch)),
});

export type Call = typeof Call.Type;
export type Batch = typeof Batch.Type;
export type ExecuteTransactionParams = typeof ExecuteTransactionParams.Type;
