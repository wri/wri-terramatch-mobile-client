// @flow

import type { Dispatch, GetState, NamedAsyncAction, Thunk } from "../../redux.types";
import type { ProjectFormProps } from "../../../screens/projectForms";
import {
  CarbonCertificationTypeReadAll,
  DraftRead,
  FundingBracketReadAll,
  FundingSourceReadAll,
  LandOwnershipReadAll,
  LandSizeReadAll,
  OfferCreate,
  PitchCreate,
  ReportingFrequencyReadAll,
  ReportingLevelReadAll,
  RestorationGoalReadAll,
  RestorationMethodReadAll,
  RevenueDriverReadAll,
  SustainableDevelopmentGoalReadAll,
  VisibilityReadAll
} from "wri-api";
import { deleteOfferRegistrationForm, updateOfferFormDetails } from "../offers/actions";
import { deletePitchRegistrationForm, updatePitchFormDetails } from "../pitches/actions";
import { createAsyncAction } from "../../conditionalActions";
import wriAPI from "../../../api/wri";
import { Navigation } from "react-native-navigation";
import { tabComponentIds } from "../../../screens";
import { fetchDraftOffers, fetchDraftPitches } from "../drafts/actions";
import type { Project } from "../../../utils/models.types";

export type FetchCarbonTypesAction = NamedAsyncAction<
  "wri/projects/carbon_certification_types",
  CarbonCertificationTypeReadAll
>;
export type FetchFundingSourcesAction = NamedAsyncAction<"wri/projects/funding_sources", FundingSourceReadAll>;
export type FetchFundingBracketsAction = NamedAsyncAction<"wri/projects/funding_brackets", FundingBracketReadAll>;
export type FetchLandOwnershipTypesAction = NamedAsyncAction<"wri/projects/land_ownership_types", LandOwnershipReadAll>;
export type FetchLandSizesAction = NamedAsyncAction<"wri/projects/land_sizes", LandSizeReadAll>;
export type FetchLandTypesAction = NamedAsyncAction<"wri/projects/land_types", CarbonCertificationTypeReadAll>;
export type FetchReportingFrequenciesAction = NamedAsyncAction<
  "wri/projects/reporting_frequency",
  ReportingFrequencyReadAll
>;
export type FetchReportingLevelsAction = NamedAsyncAction<"wri/projects/reporting_level", ReportingLevelReadAll>;
export type FetchRestorationGoalAction = NamedAsyncAction<"wri/projects/restoration_goals", RestorationGoalReadAll>;
export type FetchRestorationMethodsAction = NamedAsyncAction<
  "wri/projects/restoration_methods",
  RestorationMethodReadAll
>;
export type FetchRevenueDriversAction = NamedAsyncAction<"wri/projects/revenue_drivers", RevenueDriverReadAll>;
export type FetchSustainableDevelopmentGoalsAction = NamedAsyncAction<
  "wri/projects/sustainable_development_goals",
  SustainableDevelopmentGoalReadAll
>;
export type FetchVisibilitesAction = NamedAsyncAction<"wri/projects/visibilities", VisibilityReadAll>;

/**
 * Creates a Redux action that when dispatched will prepare Redux state in order to create a draft project.
 *
 * If a draft project is being edited, then this thunk will make sure we are in a state where we have all the necessary data needed
 * to actually edit.
 */
export function createProjectRegistrationFormDraft(
  projectType: Project,
  formId: string,
  draftId: ?number
): Thunk<Promise<void>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    const appState = getState();
    const form =
      projectType === "pitch"
        ? appState.wri.pitches.registrationForm[formId]
        : appState.wri.offers.registrationForm[formId];

    // First check if the form already exists locally so that the user doesn't lose unsynced local changes
    if (form) {
      if (!draftId) {
        // No remote data to reconcile, just return so the existing form can be resumed
        return;
      }

      // The first thing to check is whether the form was successfully synced last time it was edited.
      const wasFormSuccessfullySynced = !form.draftState?.error;

      // If the form was NOT successfully synced then it contains changes that do not exist in the remote draft.
      // BUT, the draft may also contain changes that do not exist in the form (if the draft has been modified elsewhere)
      // This represents a conflict that we should try and resolve, but for v1.1 it is fine to just choose the local copy
      if (!wasFormSuccessfullySynced) {
        return;
      }
    }

    // If we get here then all the local data is synced and we can just create a new form
    // If a draftId was specified then the new form should be pre-initialised with the data from the draft
    let draft: ?DraftRead = null;
    if (draftId) {
      // Before we start editing let's make sure we have all the base data we need to edit
      try {
        draft = await wriAPI.drafts.draftsIDGet(draftId);
      } catch (err) {
        // Resort to using the cached copy if we couldn't get a fresh copy
        const cachedDraftList =
          projectType === "pitch" ? appState.wri.drafts.pitches.data : appState.wri.drafts.offers.data;
        const cachedDraft = (cachedDraftList ?? []).find(item => item.id === draftId);
        draft = cachedDraft;
      }

      if (!draft) {
        console.warn(
          "3SC",
          "A draft ID was specified when creating a project form, but no draft could be retrieved or found matching that ID"
        );
      }
    }

    dispatch({
      type: projectType === "pitch" ? "wri/pitches/registration_form/create" : "wri/offers/registration_form/create",
      payload: {
        draft: draft,
        isDraft: true
      },
      meta: {
        formId: formId
      }
    });
  };
}

/**
 * Creates an action that when dispatched will make a request to fetch all carbon certificate types
 *
 * @return The created action
 */
export function fetchCarbonTypes(): FetchCarbonTypesAction {
  return createAsyncAction({
    type: "wri/projects/carbon_certification_types",
    payload: wriAPI.carbonCertificationTypes.carbonCertificationTypesGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all funding sources
 *
 * @return The created action
 */
export function fetchFundingSources(): FetchFundingSourcesAction {
  return createAsyncAction({
    type: "wri/projects/funding_sources",
    payload: wriAPI.fundingSources.fundingSourcesGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all funding brackets
 *
 * @return The created action
 */
export function fetchFundingBrackets(): FetchFundingBracketsAction {
  return createAsyncAction({
    type: "wri/projects/funding_brackets",
    payload: wriAPI.fundingBracket.fundingBracketsGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all land ownership types
 *
 * @return The created action
 */
export function fetchLandOwnershipTypes(): FetchLandOwnershipTypesAction {
  return createAsyncAction({
    type: "wri/projects/land_ownership_types",
    payload: wriAPI.landOwnerships.landOwnershipsGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all land size options
 *
 * @return The created action
 */
export function fetchLandSizes(): FetchLandSizesAction {
  return createAsyncAction({
    type: "wri/projects/land_sizes",
    payload: wriAPI.landSizes.landSizesGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all land types
 *
 * @return The created action
 */
export function fetchLandTypes(): FetchLandTypesAction {
  return createAsyncAction({
    type: "wri/projects/land_types",
    payload: wriAPI.landTypes.landTypesGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all reporting frequencies
 *
 * @return The created action
 */
export function fetchReportingFrequencies(): FetchReportingFrequenciesAction {
  return createAsyncAction({
    type: "wri/projects/reporting_frequency",
    payload: wriAPI.reportingFrequencies.reportingFrequenciesGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all reporting levels
 *
 * @return The created action
 */
export function fetchReportingLevels(): FetchReportingLevelsAction {
  return createAsyncAction({
    type: "wri/projects/reporting_level",
    payload: wriAPI.reportingLevels.reportingLevelsGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all restoration methods
 *
 * @return The created action
 */
export function fetchRestorationMethods(): FetchRestorationMethodsAction {
  return createAsyncAction({
    type: "wri/projects/restoration_methods",
    payload: wriAPI.restorationMethods.restorationMethodsGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all restoration goals
 *
 * @return The created action
 */
export function fetchRestorationGoal(): FetchRestorationGoalAction {
  return createAsyncAction({
    type: "wri/projects/restoration_goals",
    payload: wriAPI.restorationGoals.restorationGoalsGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all restoration goals
 *
 * @return The created action
 */
export function fetchRevenueDrivers(): FetchRevenueDriversAction {
  return createAsyncAction({
    type: "wri/projects/revenue_drivers",
    payload: wriAPI.revenueDrivers.revenueDriversGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all sustainable development goals
 *
 * @return The created action
 */
export function fetchSustainableDevelopmentGoals(): FetchSustainableDevelopmentGoalsAction {
  return createAsyncAction({
    type: "wri/projects/sustainable_development_goals",
    payload: wriAPI.sustainableDevelopmentGoals.sustainableDevelopmentGoalsGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all sustainable development goals
 *
 * @return The created action
 */
export function fetchVisibilities(): FetchVisibilitesAction {
  return createAsyncAction({
    type: "wri/projects/visibilities",
    payload: wriAPI.visibilities.visibilitiesGet()
  });
}

/**
 * Creates a thunk that when dispatched will delete the form with the specified ID, and also delete the draft associated
 * with it.
 */
export function removeProjectRegistrationFormAndDraft(formId: string, projectType: "pitch" | "offer"): Thunk {
  return async (dispatch: Dispatch, getState: GetState) => {
    const latestAppState = getState();
    const latestForm =
      projectType === "pitch"
        ? latestAppState.wri.pitches.registrationForm[formId]
        : latestAppState.wri.offers.registrationForm[formId];
    const draftId = latestForm?.draftState?.data?.id;

    // Wait for the stack to pop so we don't cause any uninteded weirdness from deleting the form while it is still active
    await Navigation.dismissModal(tabComponentIds.PROJECT_FORM_MODAL);

    if (projectType === "pitch") {
      dispatch(deletePitchRegistrationForm(formId));
    } else {
      dispatch(deleteOfferRegistrationForm(formId));
    }

    if (draftId) {
      try {
        await wriAPI.drafts.draftsIDDelete(draftId);
      } finally {
        if (projectType === "pitch") {
          dispatch(fetchDraftPitches());
        } else {
          dispatch(fetchDraftOffers());
        }
      }
    }
  };
}

/**
 * Creates an action that when dispatched will update the registration form stored locally so that the project can resume
 * it
 *
 * This is a helper thunk to help generalise over the many similarities between offers and pitches.
 *
 * @return The created action
 */
export function updateProjectFormDetails(
  formMetadata: ProjectFormProps,
  data: $Shape<OfferCreate> & $Shape<PitchCreate>
): Thunk<void> {
  return (dispatch: Dispatch) => {
    switch (formMetadata.type) {
      case "offer": {
        dispatch(updateOfferFormDetails(formMetadata.formId, data));
        break;
      }
      case "pitch": {
        dispatch(updatePitchFormDetails(formMetadata.formId, data));
        break;
      }
      default: {
        throw new Error();
      }
    }
  };
}
