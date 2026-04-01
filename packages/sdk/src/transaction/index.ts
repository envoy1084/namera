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
  clients: BaseKernelAccountClient[];
};

export type ExecuteTransactionResult = (UserOperationReceipt | null)[];

export const executeTransaction = async (
  params: ExecuteTransactionParams,
): Promise<ExecuteTransactionResult> => {
  const { batches, clients } = params;

  const kernelClientMap = new Map<number, BaseKernelAccountClient>();

  for (const client of clients) {
    if (kernelClientMap.get(client.chain.id) !== undefined) {
      throw new Error(`Duplicate kernel client id ${client.chain.id}`);
    }
    kernelClientMap.set(client.chain.id, client);
  }

  if (params.batches.length === 1) {
    const batch = params.batches[0]!;
    const client = kernelClientMap.get(batch.chainId);
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

  const kernelClients: BaseKernelAccountClient[] = [];
  const signUserOpsParams: PrepareAndSignUserOperationsParameters[] = [];

  for await (const batch of batches) {
    const client = kernelClientMap.get(batch.chainId);
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
    kernelClients.push(client);
    signUserOpsParams.push({
      callData,
      chainId: batch.chainId,
      nonce,
    });
  }

  const signedUserOps = await prepareAndSignUserOperations(
    kernelClients,
    signUserOpsParams,
  );

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
