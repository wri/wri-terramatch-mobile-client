// @flow

import type { OfferRegistrationForm } from "../redux/wri-api/offers";
import type { PitchRegistrationForm } from "../redux/wri-api/pitches";
import type { Dispatch, GetState, Thunk } from "../redux/redux.types";
import { tabComponentIds } from "../screens";
import type { Project } from "../utils/models.types";
import { screens } from "./index";
import { Navigation, type Layout } from "react-native-navigation";
import { fetchDraftOffers, fetchDraftPitches } from "../redux/wri-api/drafts/actions";
import { createPitchRegistrationForm, syncPitchFormAsDraft } from "../redux/wri-api/pitches/actions";
import { logAddProjectEvent, logFundingOfferCreationEvent, logProjectCreationEvent } from "../utils/analytics";
import { createOfferRegistrationForm, syncOfferFormAsDraft } from "../redux/wri-api/offers/actions";
import {
  createProjectRegistrationFormDraft,
  removeProjectRegistrationFormAndDraft
} from "../redux/wri-api/projects/actions";

/**
 * Defines the order screens appear throughout the respective form flows
 */
const FORM_SEQUENCES = {
  offer: [
    {
      screen: screens.PROJECTS_NAME_SCREEN,
      fieldNames: ["name"]
    },
    {
      screen: screens.PROJECTS_LAND_OWNERSHIP_SCREEN,
      fieldNames: ["land_ownerships"]
    },
    {
      screen: screens.PROJECTS_LAND_TYPE_SCREEN,
      fieldNames: ["land_types"]
    },
    {
      screen: screens.PROJECTS_RESTORATION_METHOD_SCREEN,
      fieldNames: ["restoration_methods"]
    },
    {
      screen: screens.PROJECTS_FUNDING_SOURCE_SCREEN,
      fieldNames: ["funding_sources"]
    },
    {
      screen: screens.PROJECTS_RESTORATION_GOAL_SCREEN,
      fieldNames: ["restoration_goals"]
    },
    {
      screen: screens.PROJECTS_FUNDING_BRACKET_SCREEN,
      fieldNames: ["funding_bracket"]
    },
    {
      screen: screens.PROJECTS_LAND_SIZE_SCREEN,
      fieldNames: ["land_size"]
    },
    {
      screen: screens.PROJECTS_REGION_SCREEN,
      fieldNames: ["land_continent", "land_country"]
    },
    {
      screen: screens.PROJECTS_ENGAGEMENT_SCREEN,
      fieldNames: ["long_term_engagement"]
    },
    {
      screen: screens.OFFERS_TOTAL_PRICE_PER_TREE_SCREEN,
      fieldNames: ["price_per_tree"]
    },
    {
      screen: screens.PROJECTS_CAPABILITIES_SCREEN,
      fieldNames: ["reporting_frequency", "reporting_level"]
    },
    {
      screen: screens.PROJECTS_SUSTAINABLE_GOAL_SCREEN,
      fieldNames: ["sustainable_development_goals"]
    },
    {
      screen: screens.PROJECTS_TEAM_SCREEN,
      fieldNames: ["offer_contacts"]
    },
    {
      screen: screens.PROJECTS_DESCRIPTION_SCREEN,
      fieldNames: ["description"]
    },
    {
      screen: screens.PROJECTS_UPLOAD_SCREEN,
      fieldNames: ["cover_photo"]
    },
    {
      screen: screens.OFFER_REVIEW_SCREEN,
      fieldNames: []
    }
  ],
  pitch: [
    {
      screen: screens.PROJECTS_NAME_SCREEN,
      fieldNames: ["name"]
    },
    {
      screen: screens.PROJECTS_LAND_OWNERSHIP_SCREEN,
      fieldNames: ["land_ownerships"]
    },
    {
      screen: screens.PROJECTS_LAND_TYPE_SCREEN,
      fieldNames: ["land_types"]
    },
    {
      screen: screens.PROJECTS_RESTORATION_METHOD_SCREEN,
      fieldNames: ["restoration_methods"]
    },
    {
      screen: screens.PROJECTS_FUNDING_SOURCE_SCREEN,
      fieldNames: ["funding_sources"]
    },
    {
      screen: screens.PROJECTS_RESTORATION_GOAL_SCREEN,
      fieldNames: ["restoration_goals"]
    },
    {
      screen: screens.PROJECTS_FUNDING_BRACKET_SCREEN,
      fieldNames: ["funding_bracket"]
    },
    {
      screen: screens.PROJECTS_LAND_SIZE_SCREEN,
      fieldNames: ["land_size"]
    },
    {
      screen: screens.PROJECTS_REGION_SCREEN,
      fieldNames: ["land_continent", "land_country"]
    },
    {
      screen: screens.PROJECTS_LOCATION_SCREEN,
      fieldNames: ["land_geojson"]
    },
    {
      screen: screens.PROJECTS_CAPABILITIES_SCREEN,
      fieldNames: ["reporting_frequency", "reporting_level"]
    },
    {
      screen: screens.PROJECTS_METRICS_SCREEN,
      // deliberately exclude restoration_method_metrics here, because otherwise the findDeepestScreenWithCompletedField
      // function will incorrectly consider restoration_method_metrics to be completed, due to the array being automatically
      // populated when the user modified restoration_methods
      fieldNames: ["estimated_timespan"]
    },
    {
      screen: screens.PROJECTS_TREE_SPECIES_SCREEN,
      fieldNames: ["tree_species"]
    },
    {
      screen: screens.PROJECTS_CARBON_CERTIFICATE_SCREEN,
      fieldNames: ["carbon_certifications"]
    },
    {
      screen: screens.PROJECTS_REVENUE_DRIVER_SCREEN,
      fieldNames: ["revenue_drivers"]
    },
    {
      screen: screens.PROJECTS_SUSTAINABLE_GOAL_SCREEN,
      fieldNames: ["sustainable_development_goals"]
    },
    {
      screen: screens.PROJECTS_TEAM_SCREEN,
      fieldNames: ["pitch_contacts"]
    },
    {
      screen: screens.PROJECTS_DOCUMENTS_SCREEN,
      fieldNames: ["pitch_documents"]
    },
    {
      screen: screens.PROJECTS_DETAILS_SCREEN,
      fieldNames: [
        "problem",
        "description",
        "anticipated_outcome",
        "who_is_involved",
        "local_community_involvement",
        "training_involved",
        "training_type",
        "training_amount_people",
        "people_working_in",
        "people_amount_nearby",
        "people_amount_abroad",
        "people_amount_employees",
        "people_amount_volunteers",
        "benefited_people",
        "future_maintenance",
        "use_of_resources"
      ]
    },
    {
      screen: screens.PROJECTS_UPLOAD_SCREEN,
      fieldNames: ["cover_photo"]
    },
    {
      screen: screens.PROJECTS_VIDEO_ELEVATOR,
      fieldNames: ["video"]
    },
    {
      screen: screens.PROJECTS_REVIEW_SCREEN,
      fieldNames: []
    }
  ]
};

const SPECIAL_FORMS = [
  "carbon_certifications",
  "pitch_contacts",
  "pitch_documents",
  "tree_species",
  "restoration_method_metrics",
  "offer_contacts"
];

// Prop shared between pitch and offer screens to identify the form and the screen's position within that form
export type ProjectFormProps = {|
  formId: string,
  pushNextScreen: (componentId: string) => Promise<string>,
  sequence: number,
  totalSteps: number,
  type: Project,
  isDraft: ?boolean,
  removeForm: () => Promise<void>,
  saveAndExitForm: () => Promise<void>,
  syncDraft: () => Promise<void>,
  popBackScreen: ?string
|};

/**
 * Single point-of-entry for launching a form, whether that be an entirely new form, or resuming an existing form
 *
 * @param projectType
 *  "offer" or "pitch"
 * @param formId
 *  ID of the form to resume (if any)
 * @param draftId
 *  ID of the draft to edit (if any)
 * @param projectId
 *  ID of the project to edit (if any). Only one of draftId and projectid should be specified
 * @return {Promise<string>}
 */
export function createOrResumeForm(
  projectType: Project,
  formId: ?string,
  draftId: ?number,
  projectId: ?number
): Thunk<Promise<void>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    if (!!draftId && !!projectId) {
      throw new Error("Cannot specify both a draft ID and project ID");
    }

    // If a draft ID was specified, then see if there is an existing form with this draft ID first, and resume thatform if so
    if (draftId && !formId) {
      const appState = getState();
      const allForms =
        projectType === "pitch" ? appState.wri.pitches.registrationForm : appState.wri.offers.registrationForm;
      const existingFormId = Object.keys(allForms).find(formId => allForms[formId].draftState?.data?.id === draftId);
      // If we found an existing form then call this action creator again with the correct formID
      if (existingFormId) {
        await dispatch(createOrResumeForm(projectType, existingFormId, draftId, null));
        return;
      }
    }

    // If formId was specified then we are going to try and resume an existing form, otherwise generate a new ID
    const newFormId = formId ?? (projectId ? "edit" : Date.now().toString());

    // Show a loading overlay while the form is being created (some of the calls below are async)
    const overlayComponentId = await Navigation.showOverlay({
      component: {
        ...screens.SYNC
      }
    });

    try {
      // Log analytics events if this is a completely new form
      if (!formId && !draftId && !projectId) {
        if (projectType === "pitch") {
          logAddProjectEvent("addNewProject");
          logProjectCreationEvent("start");
        } else if (projectType === "offer") {
          logAddProjectEvent("addNewFundingOffer");
          logFundingOfferCreationEvent("start");
        }
      }

      if (projectId) {
        if (projectType === "pitch") {
          await dispatch(createPitchRegistrationForm(newFormId, projectId));
        } else if (projectType === "offer") {
          await dispatch(createOfferRegistrationForm(newFormId, projectId));
        }
      } else {
        await dispatch(createProjectRegistrationFormDraft(projectType, newFormId, draftId));
      }

      const initialScreenStack = createInitialFormScreenStack(newFormId, projectType, dispatch, getState);
      await Navigation.showModal({
        stack: {
          id: tabComponentIds.PROJECT_FORM_MODAL,
          children: initialScreenStack.map(layout => ({
            component: layout.component
          }))
        }
      });
    } finally {
      await Navigation.dismissOverlay(overlayComponentId);
    }
  };
}

function createInitialFormScreenStack(
  formId: string,
  projectType: Project,
  dispatch: Dispatch,
  getState: GetState
): Array<Layout> {
  const appState = getState();
  // Retrieve the existing form with the ID we were supplied with
  const form =
    projectType === "pitch"
      ? appState.wri.pitches.registrationForm[formId]
      : appState.wri.offers.registrationForm[formId];
  const formSequence = FORM_SEQUENCES[projectType];
  const initialMetadata: ProjectFormProps = {
    formId: formId,
    pushNextScreen: componentId => {
      initialMetadata.syncDraft();
      return pushNextProjectFormScreen(componentId, initialMetadata);
    },
    removeForm: async (): Promise<void> => {
      await dispatch(removeProjectRegistrationFormAndDraft(formId, projectType));
    },
    saveAndExitForm: (): Promise<void> => {
      return saveSelectedForm(dispatch, initialMetadata);
    },
    syncDraft: async (): Promise<void> => {
      if (projectType === "pitch") {
        await dispatch(syncPitchFormAsDraft(formId));
      } else {
        await dispatch(syncOfferFormAsDraft(formId));
      }
    },
    sequence: 0,
    totalSteps: FORM_SEQUENCES[projectType].length - 2,
    type: projectType,
    isDraft: !!form.draftState
  };
  const initialScreenStack: Array<Layout> = [
    {
      component: {
        name: formSequence[0].screen.name,
        passProps: {
          formMetadata: initialMetadata
        }
      }
    }
  ];
  const startScreenNumber = findDeepestScreenWithCompletedField(projectType, form);
  for (let screenIdx = 0; screenIdx < startScreenNumber; ++screenIdx) {
    const previousScreen = initialScreenStack[screenIdx];
    const previousMetadata = previousScreen.component?.passProps?.formMetadata;
    if (previousMetadata) {
      const nextScreen = navigationLayoutForNextProjectFormScreen(previousMetadata);
      initialScreenStack.push(nextScreen);
    }
  }

  return initialScreenStack;
}

async function saveSelectedForm(dispatch: Dispatch, formMetadata: ProjectFormProps) {
  await Navigation.dismissModal(tabComponentIds.PROJECT_FORM_MODAL);
  await formMetadata.syncDraft();
  dispatch(fetchDraftOffers());
  dispatch(fetchDraftPitches());
}

function pushNextProjectFormScreen(componentId: string, formMetadata: ProjectFormProps): Promise<string> {
  return Navigation.push(componentId, navigationLayoutForNextProjectFormScreen(formMetadata));
}

/**
 * Returns the index of the deepest screen within the form that contains at least one completed field
 */
function findDeepestScreenWithCompletedField(
  projectType: Project,
  form: PitchRegistrationForm | OfferRegistrationForm
): number {
  const isFieldCompleted = field => {
    let fieldValue = null;
    const draft = form.draftState?.data?.data;
    if (SPECIAL_FORMS.includes(field)) {
      fieldValue = draft?.[field];
    } else {
      if (projectType === "pitch") {
        fieldValue = draft?.pitch?.[field];
      } else {
        fieldValue = draft?.offer?.[field];
      }
    }

    if (typeof fieldValue === "string") {
      return fieldValue.length > 0;
    } else if (Array.isArray(fieldValue)) {
      return fieldValue.length > 0;
    } else {
      return !!fieldValue;
    }
  };

  const screensWithSomeCompletedFields = FORM_SEQUENCES[projectType].map(item =>
    item.fieldNames.some(isFieldCompleted)
  );
  return screensWithSomeCompletedFields.lastIndexOf(true);
}

/**
 * Creates the RNN layout definition for the screen succeeding the one represented by formMetadata
 */
function navigationLayoutForNextProjectFormScreen(formMetadata: ProjectFormProps): Layout {
  const formSequence = FORM_SEQUENCES[formMetadata.type];
  const nextScreen = formSequence[formMetadata.sequence + 1];
  const nextMetadata: ProjectFormProps = {
    ...formMetadata,
    pushNextScreen: componentId => {
      formMetadata.syncDraft();
      return pushNextProjectFormScreen(componentId, nextMetadata);
    },
    sequence: formMetadata.sequence + 1
  };
  return {
    component: {
      name: nextScreen.screen.name,
      passProps: {
        formMetadata: nextMetadata
      }
    }
  };
}
