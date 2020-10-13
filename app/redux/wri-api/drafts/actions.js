// @flow

import type { NamedAsyncAction } from "../../redux.types";
import wriAPI from "../../../api/wri";
import { createAsyncAction } from "../../conditionalActions";
import { DraftCreate, DraftRead, DraftReadAll } from "wri-api";

export type FetchDraftOffersAction = NamedAsyncAction<"wri/drafts/offers/list", DraftReadAll>;
export type FetchDraftPitchesAction = NamedAsyncAction<"wri/drafts/pitches/list", DraftReadAll>;
export type CreateDraftAction = NamedAsyncAction<"wri/drafts/create", DraftRead>;

export function fetchDraftOffers(): FetchDraftOffersAction {
  return createAsyncAction({
    type: "wri/drafts/offers/list",
    payload: wriAPI.drafts.draftsOffersGet()
  });
}

export function fetchDraftPitches(): FetchDraftPitchesAction {
  return createAsyncAction({
    type: "wri/drafts/pitches/list",
    payload: wriAPI.drafts.draftsPitchesGet()
  });
}

export function createDraft(draftDetails: DraftCreate): CreateDraftAction {
  return createAsyncAction({
    type: "wri/drafts/create",
    payload: wriAPI.drafts.draftsPost(draftDetails)
  });
}
