// @flow

import { DraftDataReadPitch, DraftDataReadOffer, OfferRead, PitchRead } from "wri-api";

/**
 * Most WRI types are defined in the flow-typed folder
 *
 * However in this file we include a few types for payloads that don't have a corresponding model in the generated code
 */

export type ProjectDraftRead =
  | {| type: "pitch_draft", data: DraftDataReadPitch, draftId: number |}
  | {| type: "offer_draft", data: DraftDataReadOffer, draftId: number |};

export type ProjectRead =
  | {| type: "pitch", data: PitchRead |}
  | {| type: "offer", data: OfferRead |}
  | ProjectDraftRead;

export type WriValidationError = {|
  source?: ?string,
  code?: ?string,
  template?: ?string,
  variables?: { [string]: ?string },
  detail?: ?string
|};

export type WriValidationErrors = {|
  errors: ?Array<WriValidationError>
|};
