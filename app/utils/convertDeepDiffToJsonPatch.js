// @flow

type JsonNode = string | number | boolean | null | {};

type JsonPatchAddOp = {| op: "add", path: string, value: JsonNode |};
type JsonPatchReplaceOp = {| op: "replace", path: string, value: JsonNode |};
type JsonPatchRemoveOp = {| op: "remove", path: string, value: null |};
export type JsonPatchOp = JsonPatchAddOp | JsonPatchReplaceOp | JsonPatchRemoveOp;

type DeepDiffNewProp = {| kind: "N", path: Array<string>, rhs: JsonNode |};
type DeepDiffDeleteProp = {| kind: "D", path: Array<string>, lhs: JsonNode |};
type DeepDiffReplaceProp = {| kind: "E", path: Array<string>, lhs: JsonNode, rhs: JsonNode |};
type DeepDiffArrayUpdateProp = {| kind: "A", path: Array<string>, index: number, item: DeepDiffModification |};
export type DeepDiffModification = DeepDiffNewProp | DeepDiffDeleteProp | DeepDiffReplaceProp | DeepDiffArrayUpdateProp;

/**
 * Converts output produced by the deep-diff lib to JSON Patch format
 *
 * Deep-diff: https://github.com/flitbit/diff
 * Json Patch: https://en.wikipedia.org/wiki/JSON_Patch
 */
export default function convertDeepDiffToJsonPatch(modifications: Array<DeepDiffModification>): Array<JsonPatchOp> {
  /**
   * We need to reverse the array otherwise the backend will return a 422 error if there are mulitple items in the array.
   * "the deep-diff does a pre-order traversal of the object graph,
   * however, when it encounters an array, the array is processed from the end towards the front,
   * with each element recursively processed in-order during further descent."
   * There is more information here: https://github.com/flitbit/diff
   */

  const reversedModifications = modifications.reverse();
  return reversedModifications
    .map(modification => convertDeepDiffModificationToJsonPatch(modification))
    .filter(Boolean);
}

function convertDeepDiffModificationToJsonPatch(modification: DeepDiffModification): ?JsonPatchOp {
  switch (modification.kind) {
    case "N": {
      if (modification.rhs === undefined) {
        // Don't allow "add" ops with a value of undefined. Requests of this type are invalid in JSON patch and are
        // equivalent to a no-op
        return null;
      }

      return {
        op: "add",
        path: `/${modification.path.join("/")}`,
        value: modification.rhs
      };
    }
    case "E": {
      if (modification.rhs === undefined) {
        // Don't allow "replace" ops with a value of undefined. Requests of this type are invalid in JSON patch and are
        // equivalent to simply removing the value
        return {
          op: "remove",
          path: `/${modification.path.join("/")}`,
          value: null
        };
      }

      return {
        op: "replace",
        path: `/${modification.path.join("/")}`,
        value: modification.rhs
      };
    }
    case "D": {
      return {
        op: "remove",
        path: `/${modification.path.join("/")}`,
        value: null
      };
    }
    case "A": {
      // Recursively create the JSON Patch for the array modification's item prop
      return convertDeepDiffModificationToJsonPatch(
        ({
          ...modification.item,
          path: [...modification.path, modification.index]
        }: any)
      );
    }
    default: {
      throw new Error("Unrecognised modification");
    }
  }
}
