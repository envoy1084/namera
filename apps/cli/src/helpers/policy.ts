/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: safe */
import {
  CallPolicyVersion,
  CallType,
  ParamCondition as ParamConditionCore,
  type Policy,
  toCallPolicy,
  toGasPolicy,
  toRateLimitPolicy,
  toSignatureCallerPolicy,
  toSudoPolicy,
  toTimestampPolicy,
} from "@namera-ai/sdk/policy";

import type { CallPolicyParams, PolicyParams } from "@/schema";
import type { ParamCondition } from "@/schema/policy";

const toCallPolicyVersion = (
  version: CallPolicyParams["policyVersion"],
): CallPolicyVersion => {
  switch (version) {
    case "0.0.1":
      return CallPolicyVersion.V0_0_1;
    case "0.0.2":
      return CallPolicyVersion.V0_0_2;
    case "0.0.3":
      return CallPolicyVersion.V0_0_3;
    case "0.0.4":
      return CallPolicyVersion.V0_0_4;
    case "0.0.5":
      return CallPolicyVersion.V0_0_5;
    default:
      throw new Error("Invalid call policy version");
  }
};

const conditionToParamCondition = (
  condition: ParamCondition,
): ParamConditionCore => {
  if (condition === "EQUAL") return ParamConditionCore.EQUAL;
  if (condition === "GREATER_THAN") return ParamConditionCore.GREATER_THAN;
  if (condition === "LESS_THAN") return ParamConditionCore.LESS_THAN;
  if (condition === "GREATER_THAN_OR_EQUAL")
    return ParamConditionCore.GREATER_THAN_OR_EQUAL;
  if (condition === "LESS_THAN_OR_EQUAL")
    return ParamConditionCore.LESS_THAN_OR_EQUAL;
  if (condition === "NOT_EQUAL") return ParamConditionCore.NOT_EQUAL;
  if (condition === "ONE_OF") return ParamConditionCore.ONE_OF;
  if (condition === "SLICE_EQUAL") return ParamConditionCore.SLICE_EQUAL;
  return ParamConditionCore.EQUAL;
};

export const policyParamsToPolicies = (params: PolicyParams[]) => {
  const policies: Policy[] = [];

  for (const param of params) {
    if (param.type === "sudo") {
      policies.push(toSudoPolicy({}));
    } else if (param.type === "timestamp") {
      policies.push(toTimestampPolicy(param));
    } else if (param.type === "gas") {
      policies.push(toGasPolicy(param));
    } else if (param.type === "rate-limit") {
      policies.push(toRateLimitPolicy(param));
    } else if (param.type === "signature-caller") {
      policies.push(toSignatureCallerPolicy(param));
    } else if (param.type === "call") {
      policies.push(
        toCallPolicy({
          policyVersion: toCallPolicyVersion(param.policyVersion),
          permissions: !param.permissions
            ? undefined
            : param.permissions.map((p) => {
                const callType = (() => {
                  if (!p.callType) return CallType.CALL;
                  if (p.callType === "call") return CallType.CALL;
                  if (p.callType === "delegatecall")
                    return CallType.DELEGATE_CALL;
                  return CallType.BATCH_CALL;
                })();

                if ("abi" in p) {
                  return {
                    callType,
                    target: p.target,
                    valueLimit: p.valueLimit,
                    abi: p.abi,
                    functionName: p.functionName,
                    selector: p.selector,
                    args: !p.args
                      ? undefined
                      : p.args.map((a) => {
                          if (a === null) return null;
                          const c = a.condition;
                          if (c === "ONE_OF") {
                            return {
                              condition: ParamConditionCore.ONE_OF,
                              value: a.value,
                            };
                          }

                          if (c === "SLICE_EQUAL" && "start" in a) {
                            return {
                              condition: ParamConditionCore.SLICE_EQUAL,
                              value: a.value,
                              start: a.start,
                              length: a.length,
                            };
                          }

                          return {
                            condition: conditionToParamCondition(c) as Exclude<
                              ParamConditionCore,
                              ParamConditionCore.ONE_OF
                            >,
                            value: a.value,
                          };
                        }),
                  };
                }

                return {
                  callType,
                  target: p.target,
                  selector: p.selector,
                  valueLimit: p.valueLimit,
                  rules: p.rules
                    ? p.rules.map((r) => {
                        return {
                          offset: r.offset,
                          params: r.params,
                          condition: conditionToParamCondition(r.condition),
                        };
                      })
                    : undefined,
                };
              }),
        }),
      );
    } else {
      throw new Error("Invalid policy type");
    }
  }

  return policies;
};
