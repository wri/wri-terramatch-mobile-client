// @flow

import type { Dispatch, GetState, NamedAsyncAction, Thunk } from "../../redux.types";
import type { ResolvedMatch } from "./index";
import wriAPI from "../../../api/wri";
import { createAsyncAction } from "../../conditionalActions";
import { InterestRead, InterestReadAll, MatchRead, MatchReadAll } from "wri-api";
import TSCError from "../../../utils/tscError";
import { errorCodes, errorDomains } from "../../../constants/errorMessaging";

export type FetchReceivedInterestsAction = NamedAsyncAction<"wri/interests/received", Array<ResolvedMatch>>;
export type FetchInitiatedInterestsAction = NamedAsyncAction<"wri/interests/initiated", Array<ResolvedMatch>>;
export type FetchAllMatchesAction = NamedAsyncAction<"wri/interests/matches/all", Array<ResolvedMatch>>;

/**
 * Fetch InterestRead objects where the initiator was not the user
 */
export function fetchReceivedInterests(): Thunk<Promise<void>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    // Get the organisation_id from state so we can easily work out which of the projects belongs to the user
    const appState = getState();
    const organisationId = appState.wri.users.me.data?.organisation_id;

    if (!organisationId) {
      throw new TSCError({
        domain: errorDomains.WRI,
        code: errorCodes.WRI_UNEXPECTED_STATE,
        message: "Fetching received interests without an organisation ID"
      });
    }

    const action: FetchReceivedInterestsAction = createAsyncAction({
      type: "wri/interests/received",
      payload: async () => {
        const receivedInterests = await wriAPI.interests.interestsReceivedGet();
        return await getAllMatchesOrInterestsData(organisationId, receivedInterests);
      }
    });
    await dispatch(action);
  };
}

/**
 * Fetch InterestRead objects where the initiator was the user
 */
export function fetchInitiatedInterests(): Thunk<Promise<void>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    // Get the organisation_id from state so we can easily work out which of the projects belongs to the user
    const appState = getState();
    const organisationId = appState.wri.users.me.data?.organisation_id;

    if (!organisationId) {
      throw new TSCError({
        domain: errorDomains.WRI,
        code: errorCodes.WRI_UNEXPECTED_STATE,
        message: "Fetching initiated interests without an organisation ID"
      });
    }

    const action: FetchInitiatedInterestsAction = createAsyncAction({
      type: "wri/interests/initiated",
      payload: async () => {
        const initiatedInterests = await wriAPI.interests.interestsInitiatedGet();
        return await getAllMatchesOrInterestsData(organisationId, initiatedInterests);
      }
    });
    await dispatch(action);
  };
}

/**
 * Fetch MatchRead objects where the interest was reciprocated
 */
export function fetchAllMatches(): Thunk<Promise<void>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    // Get the organisation_id from state so we can easily work out which of the projects belongs to the user
    const appState = getState();
    const organisationId = appState.wri.users.me.data?.organisation_id;

    if (!organisationId) {
      throw new TSCError({
        domain: errorDomains.WRI,
        code: errorCodes.WRI_UNEXPECTED_STATE,
        message: "Fetching matches without an organisation ID"
      });
    }

    const action: FetchAllMatchesAction = createAsyncAction({
      type: "wri/interests/matches/all",
      payload: async () => {
        const matches = await wriAPI.matches.matchesGet();
        return await getAllMatchesOrInterestsData(organisationId, matches);
      }
    });
    await dispatch(action);
  };
}

const getAllMatchesOrInterestsData = (
  organisationId: number,
  matches: MatchReadAll | InterestReadAll
): Promise<Array<ResolvedMatch>> => {
  return Promise.all(matches.map(match => getMatchOrInterestData(organisationId, match)));
};

const getMatchOrInterestData = async (
  organisation_id: number,
  match: MatchRead | InterestRead
): Promise<ResolvedMatch> => {
  const offerId = match.offer_id;
  const pitchId = match.pitch_id;

  if (!offerId || !pitchId) {
    throw new Error("Cannot resolve offer or pitch for MatchRead without IDs");
  }

  const [offer, pitch] = await Promise.all([wriAPI.offers.offersIDGet(offerId), wriAPI.pitches.pitchesIDGet(pitchId)]);
  const myProject = offer.organisation_id === organisation_id ? "offer" : "pitch";
  const theirProject = myProject === "pitch" ? "offer" : "pitch";

  return { ...match, offer, pitch, mine: myProject, theirs: theirProject };
};
