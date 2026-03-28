import { deserializePermissionAccountParams } from "@namera-ai/sdk/session-key";
import { Duration } from "effect";
import { type AbiFunction, formatEther, zeroAddress } from "viem";

export const humanizeDuration = (input: Duration.Input): string => {
  const millis = Duration.toMillis(Duration.fromInputUnsafe(input));
  let seconds = Math.floor(millis / 1000);

  const units = [
    { label: "year", value: 60 * 60 * 24 * 365 },
    { label: "month", value: 60 * 60 * 24 * 30 },
    { label: "day", value: 60 * 60 * 24 },
    { label: "hour", value: 60 * 60 },
    { label: "minute", value: 60 },
    { label: "second", value: 1 },
  ];

  const parts: string[] = [];

  for (const unit of units) {
    if (seconds >= unit.value) {
      const count = Math.floor(seconds / unit.value);
      seconds %= unit.value;

      parts.push(`${count} ${unit.label}${count > 1 ? "s" : ""}`);
    }
  }

  return parts.length > 0 ? parts.join(" ") : "0 seconds";
};

export const humanizeRelativeTime = (target: Date | number): string => {
  const now = Date.now();
  const targetMs = target instanceof Date ? target.getTime() : target * 1000;

  const diff = targetMs - now;
  const abs = Math.abs(diff);

  const seconds = Math.floor(abs / 1000);

  const units = [
    { label: "year", value: 31_536_000 },
    { label: "month", value: 2_592_000 },
    { label: "day", value: 86_400 },
    { label: "hour", value: 3600 },
    { label: "minute", value: 60 },
    { label: "second", value: 1 },
  ];

  for (const unit of units) {
    if (seconds >= unit.value) {
      const count = Math.floor(seconds / unit.value);

      const formatted = `${count} ${unit.label}${count > 1 ? "s" : ""}`;

      return diff > 0 ? `in ${formatted}` : `${formatted} ago`;
    }
  }

  return "just now";
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: safe
export const humanizePolicyParams = (serializedAccount: string) => {
  const params = deserializePermissionAccountParams(serializedAccount);

  // biome-ignore lint/suspicious/noExplicitAny: safe
  const result: Record<string, any> = {};

  // Permission Id
  result.permissionId = params.permissionParams.permissionId;

  for (const policy of params.permissionParams.policies ?? []) {
    const params = policy.policyParams;
    if (params.type === "sudo") {
      result.sudoPolicy = {
        enabled: true,
      };
    } else if (params.type === "gas") {
      const allowed = formatEther(params.allowed ?? 0n);
      result.gasPolicy = {
        enabled: true,
        allowed: `${allowed} ETH`,
        ...(params.enforcePaymaster && {
          enforcePaymaster: params.enforcePaymaster,
        }),
        ...(params.allowedPaymaster !== zeroAddress && {
          allowedPaymaster: params.allowedPaymaster,
        }),
      };
    } else if (params.type === "timestamp") {
      const validAfter = params.validAfter ?? 0;
      const validUntil = params.validUntil ?? 0;

      result.timestampPolicy = {
        enabled: true,
        starts: humanizeRelativeTime(validAfter),
        ends: humanizeRelativeTime(validUntil),
      };
    } else if (params.type === "rate-limit") {
      const formattedInterval = humanizeDuration(params.interval ?? 0);
      result.rateLimitPolicy = {
        enabled: true,
        count: params.count,
        interval: formattedInterval,
        starts: humanizeRelativeTime(params.startAt ?? 0),
      };
    } else if (params.type === "signature-caller") {
      result.signatureCallerPolicy = {
        enabled: true,
        allowedCallers: params.allowedCallers,
      };
    } else if (params.type === "call") {
      result.callPolicy = {
        enabled: true,
        policyVersion: params.policyVersion,
      };

      if (!params.permissions || params.permissions.length === 0) continue;

      for (const permission of params.permissions) {
        result.callPolicy.permissions = result.callPolicy.permissions ?? [];

        if ("abi" in permission) {
          const formattedValue = formatEther(permission.valueLimit ?? 0n);

          const abiFn = permission.abi?.find(
            (f) => f.type === "function" && f.name === permission.functionName,
          ) as AbiFunction | undefined;

          const cyan = "\x1b[36m";
          const yellow = "\x1b[33m";
          const magenta = "\x1b[35m";
          const reset = "\x1b[0m";

          let fnName = `${magenta}${permission.functionName ?? "unknown"}${reset}(`;

          if (abiFn) {
            abiFn.inputs.forEach((input, i) => {
              if (i > 0) fnName += ", ";
              fnName += `${cyan}${input.type}${reset}${input.name ? ` ${yellow}${input.name}${reset}` : ""}`;
            });
          }

          fnName += ")";

          result.callPolicy.permissions.push({
            targetAddress: permission.target,
            valueLimit: `${formattedValue} ETH`,
            functionName: fnName,
          });
        } else {
          const formattedValue = formatEther(permission.valueLimit ?? 0n);
          result.callPolicy.permissions.push({
            targetAddress: permission.target,
            valueLimit: `${formattedValue} ETH`,
          });
        }
      }
    }
  }

  return result;
};
