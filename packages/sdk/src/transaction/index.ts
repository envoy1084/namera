/** biome-ignore-all lint/style/noNonNullAssertion: safe */
import {
  type PrepareAndSignUserOperationsParameters,
  prepareAndSignUserOperations,
} from "@zerodev/multi-chain-ecdsa-validator";
import { getCustomNonceKeyFromString } from "@zerodev/sdk";
import type { Address, Hex, UserOperationReceipt } from "viem";

import type { BaseKernelAccountClient } from "@/types";

export type Call = {
  to: Address;
  data: Hex;
  value?: bigint;
};

export type Batch = {
  chainId: number;
  calls: Call[];
  nonceKey?: string;
  atomic?: boolean;
};

export type ExecuteTransactionParams = {
  batches: Batch[];
};

export const executeTransaction = async (
  _clients: BaseKernelAccountClient[],
  _params: ExecuteTransactionParams,
): Promise<(UserOperationReceipt | null)[]> => {
  // Case 1: One batch, use normal client.sendTransaction()
  const clientMap = new Map<number, BaseKernelAccountClient>();
  for (const accountClient of _clients) {
    if (clientMap.get(accountClient.chain.id) !== undefined) {
      throw new Error(`Duplicate account client id ${accountClient.chain.id}`);
    }
    clientMap.set(accountClient.chain.id, accountClient);
  }

  if (_params.batches.length === 1) {
    const batch = _params.batches[0]!;
    const client = clientMap.get(batch.chainId);
    if (!client) {
      throw new Error(`Account client for chain ${batch.chainId} not found`);
    }

    const callData = await client.account.encodeCalls(batch.calls);
    let nonce: bigint | undefined;
    if (batch.nonceKey) {
      const nonceKey = getCustomNonceKeyFromString(batch.nonceKey, "0.7");
      nonce = await client.account.getNonce({ key: nonceKey });
    }

    const userOpHash = await client.sendUserOperation({
      callData,
      nonce,
    });

    const receipt = await client.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    return [receipt];
  }

  // Case 2: Multiple batches, one chain/multiple chains, use prepareAndSignUserOperations()

  const clients: BaseKernelAccountClient[] = [];
  const params: PrepareAndSignUserOperationsParameters[] = [];

  for await (const batch of _params.batches) {
    const client = clientMap.get(batch.chainId);
    if (!client) {
      throw new Error(`Account client for chain ${batch.chainId} not found`);
    }

    let nonce: bigint | undefined;

    if (batch.nonceKey) {
      const nonceKey = getCustomNonceKeyFromString(batch.nonceKey, "0.7");
      nonce = await client.account.getNonce({ key: nonceKey });
    }

    const callData = await client.account.encodeCalls(batch.calls);

    // Push to clients and params
    clients.push(client);
    params.push({
      callData,
      chainId: batch.chainId,
      nonce,
    });
  }

  const signedUserOps = await prepareAndSignUserOperations(clients, params);

  const promises = signedUserOps.map((signerUserOp, i) => {
    const client = clients[i]!;

    const fn = async () => {
      const userOpHash = await client.sendUserOperation(signerUserOp);
      const receipt = await client.waitForUserOperationReceipt({
        hash: userOpHash,
      });
      return receipt;
    };

    return fn;
  });

  const receipts: (UserOperationReceipt | null)[] = await Promise.all(
    promises.map((p) => p().catch(() => null)),
  );

  return receipts;
};
