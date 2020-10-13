// @flow

import {
  ACTION_TYPE_CLEAR_TRANSIENT_STATE,
  type AsyncErrorAction,
  type AsyncPendingAction,
  type AsyncState,
  type AsyncSuccessAction,
  type ClearTransientStateAction,
  type LogoutAction,
  type ReducerMap
} from "../../redux.types";
import type {
  CreatePitchAction,
  CreatePitchCarbonCertificateAction,
  CreatePitchContactAction,
  CreatePitchRegistrationFormAction,
  CreatePitchTreeSpeciesAction,
  CreatePitchUploadAction,
  DeletePitchRegistrationFormAction,
  MarkPitchFormCertificationCreateCompleteAction,
  MarkPitchFormCertificationDeleteCompleteAction,
  MarkPitchFormContactCreateCompleteAction,
  MarkPitchFormContactDeleteCompleteAction,
  MarkPitchFormDetailsCompleteAction,
  MarkPitchFormDocumentCreateCompleteAction,
  MarkPitchFormDocumentDeleteCompleteAction,
  MarkPitchFormMetricUpdateCompleteAction,
  MarkPitchFormSpeciesCreateCompleteAction,
  MarkPitchFormSpeciesDeleteCompleteAction,
  PitchUploadQueues,
  RemovePitchCarbonCertificateAction,
  RemovePitchContactAction,
  RemovePitchTreeSpeciesAction,
  RemovePitchUploadAction,
  SavePitchFormAsDraftAction,
  SearchPitchesAction,
  UpdateFilterSearchAction,
  UpdateFilteredOfferSearchAction,
  UpdatePitchFormDetailsAction,
  UpdatePitchRestorationMethodMetricsAction,
  UpdateSortOptionsAction
} from "./actions";
import {
  CarbonCertificationCreate,
  CarbonCertificationRead,
  CarbonCertificationReadAll,
  DraftRead,
  FilterCondition,
  PitchCreate,
  PitchContactCreate,
  PitchContactRead,
  PitchContactReadAll,
  PitchDocumentRead,
  PitchDocumentReadAll,
  PitchRead,
  PitchReadAll,
  RestorationMethodMetricCreate,
  RestorationMethodMetricReadAll,
  RestorationMethodMetricRead,
  RestorationMethodMetricUpdate,
  TreeSpeciesCreate,
  TreeSpeciesReadAll,
  TreeSpeciesRead
} from "wri-api";
import _ from "lodash";
import { combineReducers } from "redux";
import { asyncActionReducer, initialAsyncState, successState } from "../../asyncActionReducer";
import { addUploadToForm, completeFormUpload, completeFormUploadDeletion, deleteUploadFromForm } from "../helpers";
import { calculateFiltersOfProject, convertDocumentToFile } from "../../../api/wri/helpers";

/**
 * Complete data for a pitch
 */
export type PitchData = {|
  +certificate: CarbonCertificationReadAll | Array<CarbonCertificationRead>,
  +contacts: PitchContactReadAll | Array<PitchContactRead>,
  +details: PitchRead,
  +documents: PitchDocumentReadAll | Array<PitchDocumentRead>,
  +metrics: RestorationMethodMetricReadAll | Array<RestorationMethodMetricRead>,
  +species: TreeSpeciesReadAll | Array<TreeSpeciesRead>
|};

/**
 * Type definitions describing modifications to a base array of tree species.
 *
 * These modifications included "created" if an item has been added or
 * in some situations "existing" if an item has been unmodified
 */
export type PendingTreeSpecies =
  | {| type: "created", data: TreeSpeciesCreate |}
  | {| type: "existing", data: TreeSpeciesRead |}
  | {| type: "deleted", data: TreeSpeciesRead |};

export type PendingCarbonCertification =
  | {| type: "created", data: CarbonCertificationCreate |}
  | {| type: "existing", data: CarbonCertificationRead |}
  | {| type: "deleted", data: CarbonCertificationRead |};

/**
 * A pending action for a restoration method metric
 *
 * For "created" metrics the entire data object should be populated
 */
export type PendingRestorationMethodMetric =
  | {|
      type: "created",
      data: RestorationMethodMetricCreate
    |}
  | {| type: "existing", data: $Shape<RestorationMethodMetricUpdate>, id: number |};

export type PendingPitchContact =
  | {| type: "created", data: PitchContactCreate |}
  | {| type: "existing", data: PitchContactRead |}
  | {| type: "deleted", data: PitchContactRead |};

/**
 * The current state of the user's registration form, so that they don't lose their progress
 *
 * This form optionally includes a "base" pitch data. If this is present then the form represents modifications to this
 * base data, such as deletions, creations etc.
 */
export type PitchRegistrationForm = {|
  // If base is specified, then these are the base pitch details which are being edited.
  // These details are used to compute PATCH requests
  +base: ?{|
    +details: PitchRead,
    +metrics: RestorationMethodMetricReadAll | Array<RestorationMethodMetricRead>
  |},
  +certificate: Array<PendingCarbonCertification>,
  +contacts: Array<PendingPitchContact>,
  +details: $Shape<PitchCreate>, // only contains modifications the user has made, not the complete data structure

  // Holds info about the remote draft copy of this pitch
  // A draft is created if this form represents a brand new pitch (i.e. not edit mode, so base is null)
  // The draft is then intermittently synced
  // Added in v1.1, so the prop may be missing for migrating users
  +draftState: ?AsyncState<DraftRead>,

  +metrics: { [string]: PendingRestorationMethodMetric },
  +species: Array<PendingTreeSpecies>,
  +uploads: PitchUploadQueues
|};

/**
 * A mapping from form ID to their associated form
 */
type PitchRegistrationFormMap = {|
  [string]: PitchRegistrationForm
|};

type FiltersAndSorting = {|
  +sortOption: SortAttributeEnum,
  +filter: Array<FilterCondition>,
  +filteredOfferId: ?number
|};

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +create: AsyncState<number>,
  +filtersAndSorting: FiltersAndSorting,
  +registrationForm: PitchRegistrationFormMap,
  +searchResults: AsyncState<PitchReadAll>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions =
  | CreatePitchAction
  | CreatePitchCarbonCertificateAction
  | CreatePitchContactAction
  | CreatePitchRegistrationFormAction
  | CreatePitchTreeSpeciesAction
  | CreatePitchUploadAction
  | DeletePitchRegistrationFormAction
  | MarkPitchFormCertificationCreateCompleteAction
  | MarkPitchFormCertificationDeleteCompleteAction
  | MarkPitchFormContactCreateCompleteAction
  | MarkPitchFormContactDeleteCompleteAction
  | MarkPitchFormDetailsCompleteAction
  | MarkPitchFormDocumentCreateCompleteAction
  | MarkPitchFormDocumentDeleteCompleteAction
  | MarkPitchFormMetricUpdateCompleteAction
  | MarkPitchFormSpeciesCreateCompleteAction
  | MarkPitchFormSpeciesDeleteCompleteAction
  | RemovePitchCarbonCertificateAction
  | RemovePitchContactAction
  | RemovePitchTreeSpeciesAction
  | RemovePitchUploadAction
  | SavePitchFormAsDraftAction
  | SearchPitchesAction
  | UpdateFilterSearchAction
  | UpdateFilteredOfferSearchAction
  | UpdatePitchFormDetailsAction
  | UpdatePitchRestorationMethodMetricsAction
  | UpdateSortOptionsAction;

export default combineReducers<ReducerMap<State, any>, any>({
  create: asyncActionReducer.bind(this, "wri/pitches/create"),
  filtersAndSorting: filtersAndSortingReducer,
  registrationForm: registrationFormMapReducer,
  searchResults: asyncActionReducer.bind(this, "wri/pitches/search")
});

type RegistrationFormActions =
  | AsyncPendingAction<"wri/pitches/registration_form/draft/save_pending", DraftRead>
  | AsyncSuccessAction<"wri/pitches/registration_form/draft/save_succ", DraftRead>
  | AsyncErrorAction<"wri/pitches/registration_form/draft/save_fail">
  | ClearTransientStateAction
  | CreatePitchCarbonCertificateAction
  | CreatePitchContactAction
  | CreatePitchRegistrationFormAction
  | CreatePitchTreeSpeciesAction
  | CreatePitchUploadAction
  | MarkPitchFormCertificationCreateCompleteAction
  | MarkPitchFormCertificationDeleteCompleteAction
  | MarkPitchFormContactCreateCompleteAction
  | MarkPitchFormContactDeleteCompleteAction
  | MarkPitchFormDetailsCompleteAction
  | MarkPitchFormDocumentCreateCompleteAction
  | MarkPitchFormDocumentDeleteCompleteAction
  | MarkPitchFormMetricUpdateCompleteAction
  | MarkPitchFormSpeciesCreateCompleteAction
  | MarkPitchFormSpeciesDeleteCompleteAction
  | RemovePitchCarbonCertificateAction
  | RemovePitchContactAction
  | RemovePitchTreeSpeciesAction
  | RemovePitchUploadAction
  | UpdatePitchFormDetailsAction
  | UpdatePitchRestorationMethodMetricsAction;

function registrationFormMapReducer(
  state: PitchRegistrationFormMap = Object.freeze({}),
  action: RegistrationFormActions | LogoutAction | DeletePitchRegistrationFormAction
): PitchRegistrationFormMap {
  switch (action.type) {
    case "wri/pitches/registration_form/create":
    case "wri/pitches/registration_form/details/update":
    case "wri/pitches/registration_form/details/update/complete":
    case "wri/pitches/registration_form/metrics/update":
    case "wri/pitches/registration_form/metrics/update/complete":
    case "wri/pitches/registration_form/species/create":
    case "wri/pitches/registration_form/species/create/complete":
    case "wri/pitches/registration_form/species/remove":
    case "wri/pitches/registration_form/species/remove/complete":
    case "wri/pitches/registration_form/carbon/create":
    case "wri/pitches/registration_form/carbon/create/complete":
    case "wri/pitches/registration_form/carbon/remove":
    case "wri/pitches/registration_form/carbon/remove/complete":
    case "wri/pitches/registration_form/contacts/create":
    case "wri/pitches/registration_form/contacts/create/complete":
    case "wri/pitches/registration_form/contacts/remove":
    case "wri/pitches/registration_form/contacts/remove/complete":
    case "wri/pitches/registration_form/uploads/create":
    case "wri/pitches/registration_form/uploads/create/complete":
    case "wri/pitches/registration_form/uploads/remove":
    case "wri/pitches/registration_form/uploads/remove/complete": {
      const formId = action.meta.formId;
      const form = state[formId] ?? undefined;
      return {
        ...state,
        [formId]: registrationFormReducer(form, action)
      };
    }
    case "wri/pitches/registration_form/draft/save_pending":
    case "wri/pitches/registration_form/draft/save_succ":
    case "wri/pitches/registration_form/draft/save_fail": {
      const formId = action.meta.cacheKey;
      const form = formId ? state["" + formId] ?? undefined : undefined;
      return {
        ...state,
        [formId]: registrationFormReducer(form, action)
      };
    }
    case "wri/pitches/registration_form/delete": {
      const formId = action.meta.formId;
      const nextState = { ...state };
      delete nextState[formId];
      return nextState;
    }
    case ACTION_TYPE_CLEAR_TRANSIENT_STATE: {
      return _.mapValues(state, form => registrationFormReducer(form, action));
    }
    case "logout": {
      return Object.freeze({});
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (action: empty); // flow cast to empty - this will error if we've forgotten to handle an action
      return state;
    }
  }
}

/**
 * Whether or not to autofill the form fields. By default does it when running a development build
 */
const AUTOFILL_FORM = false;

export const INITIAL_PITCH_FORM: PitchRegistrationForm = {
  base: null,
  certificate: [],
  contacts: [],
  details: AUTOFILL_FORM
    ? {
        name: "Save forest of Seychelles"
      }
    : Object.freeze({}),
  draftState: null,
  metrics: Object.freeze({}),
  species: [],
  uploads: {
    coverPhoto: null,
    documents: [],
    video: null,
    videoIntroduction: null,
    videoGoals: null,
    videoSignificance: null
  }
};

function registrationFormReducer(
  state: PitchRegistrationForm = { ...INITIAL_PITCH_FORM },
  action: RegistrationFormActions
): PitchRegistrationForm {
  switch (action.type) {
    case "wri/pitches/registration_form/create": {
      if (action.payload.isDraft) {
        return createRegistrationFormDraft(action.payload.draft, action.meta.formId);
      } else {
        return createRegistrationForm(action.payload.base);
      }
    }
    case "wri/pitches/registration_form/details/update": {
      const updatedDetails = { ...state.details, ...action.payload };
      const updatedMetrics = ensureAllRestorationMetricsArePresent(
        updatedDetails.restoration_methods ?? [],
        state.metrics
      );
      return {
        ...state,
        details: updatedDetails,
        metrics: updatedMetrics
      };
    }
    case "wri/pitches/registration_form/details/update/complete": {
      return {
        ...state,
        base: state.base
          ? {
              ...state.base,
              details: action.payload
            }
          : {
              details: action.payload,
              metrics: []
            },
        details: Object.freeze({}),
        uploads: {
          ...state.uploads,
          coverPhoto: null,
          video: null,
          videoIntroduction: null,
          videoGoals: null,
          videoSignificance: null
        }
      };
    }
    case "wri/pitches/registration_form/uploads/create": {
      return {
        ...state,
        uploads: addUploadToForm(state.uploads, action.payload.type, action.payload.file)
      };
    }
    case "wri/pitches/registration_form/uploads/create/complete": {
      return {
        ...state,
        uploads: completeFormUpload(state.uploads, action.payload.type, action.payload.request, action.payload.result)
      };
    }
    case "wri/pitches/registration_form/uploads/remove": {
      return {
        ...state,
        uploads: deleteUploadFromForm(state.uploads, action.payload.type, action.payload.item)
      };
    }
    case "wri/pitches/registration_form/uploads/remove/complete": {
      return {
        ...state,
        uploads: completeFormUploadDeletion(state.uploads, action.payload.type, action.payload.request)
      };
    }
    case "wri/pitches/registration_form/metrics/update": {
      const method = action.payload.method;
      const updatedMetric = action.payload.data;
      return {
        ...state,
        metrics: {
          ...state.metrics,
          [method]: {
            ...state.metrics[method],
            data: {
              ...state.metrics[method].data,
              ...updatedMetric
            }
          }
        }
      };
    }
    case "wri/pitches/registration_form/metrics/update/complete": {
      const updatedMetric = action.payload.result;

      return {
        ...state,
        base: {
          ...(state.base ?? {}),
          // Remove the previous copy of the metric and add the new one
          metrics: [
            ...(state.base?.metrics ?? []).filter(
              metric => metric.restoration_method !== updatedMetric.restoration_method
            ),
            updatedMetric
          ]
        },
        metrics: {
          ...state.metrics,
          [updatedMetric.restoration_method]: {
            type: "existing",
            id: updatedMetric.id,
            data: Object.freeze({})
          }
        }
      };
    }
    case "wri/pitches/registration_form/species/create": {
      return {
        ...state,
        species: [...state.species, { type: "created", data: action.payload }]
      };
    }
    case "wri/pitches/registration_form/species/create/complete": {
      const creationRequest = action.payload.request;
      const createdSpecies = action.payload.result;
      return {
        ...state,
        species: state.species.map(pending =>
          pending === creationRequest ? { type: "existing", data: createdSpecies } : pending
        )
      };
    }
    case "wri/pitches/registration_form/species/remove": {
      return {
        ...state,
        species: deleteSpeciesFromForm(state.species, action.payload.item)
      };
    }
    case "wri/pitches/registration_form/species/remove/complete": {
      const deletedItem = action.payload.request;
      return {
        ...state,
        species: state.species.filter(pending => pending !== deletedItem)
      };
    }
    case "wri/pitches/registration_form/carbon/create": {
      return {
        ...state,
        certificate: [...state.certificate, { type: "created", data: action.payload }]
      };
    }
    case "wri/pitches/registration_form/carbon/create/complete": {
      const creationRequest = action.payload.request;
      const createdCertificate = action.payload.result;
      return {
        ...state,
        certificate: state.certificate.map(pending =>
          pending === creationRequest ? { type: "existing", data: createdCertificate } : pending
        )
      };
    }
    case "wri/pitches/registration_form/carbon/remove": {
      return {
        ...state,
        certificate: deleteCertificateFromForm(state.certificate, action.payload.item)
      };
    }
    case "wri/pitches/registration_form/carbon/remove/complete": {
      const deletedItem = action.payload.request;
      return {
        ...state,
        certificate: state.certificate.filter(pending => pending !== deletedItem)
      };
    }
    case "wri/pitches/registration_form/contacts/create": {
      return {
        ...state,
        contacts: [...state.contacts, { type: "created", data: action.payload }]
      };
    }
    case "wri/pitches/registration_form/contacts/create/complete": {
      const creationRequest = action.payload.request;
      const createdMember = action.payload.result;
      return {
        ...state,
        contacts: state.contacts.map(pending =>
          pending === creationRequest ? { type: "existing", data: createdMember } : pending
        )
      };
    }
    case "wri/pitches/registration_form/contacts/remove": {
      return {
        ...state,
        contacts: deleteContactFromForm(state.contacts, action.payload.item)
      };
    }
    case "wri/pitches/registration_form/contacts/remove/complete": {
      const deletedItem = action.payload.request;
      return {
        ...state,
        contacts: state.contacts.filter(pending => pending !== deletedItem)
      };
    }
    case "wri/pitches/registration_form/draft/save_pending":
    case "wri/pitches/registration_form/draft/save_succ":
    case "wri/pitches/registration_form/draft/save_fail":
    case ACTION_TYPE_CLEAR_TRANSIENT_STATE: {
      /*
       * When we successfully save the form, we receive the updated form back
       *
       * In theory, this updated form could have been updated by other devices, and contain information that the local
       * form does not
       *
       * Likewise, the local form could have data that the remote form does not, if the user has modified fields since
       * the request to save the form was made
       *
       * Properly handling this involves merging the two data sources together, but this is complex, would involve a
       * number of code changes, and is beyond the scope of this work
       */
      return {
        ...state,
        draftState: asyncActionReducer(
          "wri/pitches/registration_form/draft/save",
          state.draftState ?? initialAsyncState,
          action
        )
      };
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (action: empty); // flow cast to empty - this will error if we've forgotten to handle an action
      return state;
    }
  }
}

function filtersAndSortingReducer(
  state: FiltersAndSorting = {
    sortOption: "compatibility_score",
    filteredOfferId: null,
    filter: []
  },
  action: UpdateSortOptionsAction | UpdateFilteredOfferSearchAction | UpdateFilterSearchAction | LogoutAction
): FiltersAndSorting {
  switch (action.type) {
    case "wri/pitches/options/update": {
      return {
        ...state,
        sortOption: action.payload
      };
    }
    case "wri/pitches/filter/update": {
      return {
        ...state,
        filter: action.payload,
        filteredOfferId: null
      };
    }
    case "wri/pitches/filteredOffer/update": {
      return {
        ...state,
        filter: calculateFiltersOfProject(action.payload, "pitch"),
        filteredOfferId: action.payload.id
      };
    }
    case "logout": {
      return {
        ...state,
        sortOption: "compatibility_score",
        filteredOfferId: null,
        filter: []
      };
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (action: empty); // flow cast to empty - this will error if we've forgotten to handle an action
      return state;
    }
  }
}

function createRegistrationFormDraft(draft: DraftRead, formId: string): PitchRegistrationForm {
  const certificates = (draft?.data?.carbon_certifications ?? []).map(cert => ({
    type: "created",
    data: cert
  }));
  const contacts = (draft?.data?.pitch_contacts ?? []).map(contact => ({
    type: "created",
    data: contact
  }));
  const docs = (draft?.data?.pitch_documents ?? []).map(doc => ({
    type: "created",
    file: convertDocumentToFile(doc)
  }));
  const species = (draft?.data?.tree_species ?? []).map(specie => ({
    type: "created",
    data: specie
  }));

  let metrics = {};

  (draft?.data?.restoration_method_metrics ?? []).forEach(metric => {
    // const metricId = metric.id;
    const method = metric.restoration_method;
    if (method) {
      metrics[method] = { type: "created", data: metric };
    }
  });
  metrics = ensureAllRestorationMetricsArePresent(draft?.data?.pitch?.restoration_methods ?? [], metrics);

  const { cover_photo: coverPhotoUri, video: videoUri, ...draftDetails } = draft?.data?.pitch ?? {};

  return {
    ...INITIAL_PITCH_FORM,
    base: null,
    certificate: certificates,
    contacts: contacts,
    details: draftDetails,
    // Forms which don't have a base (i.e. aren't editing an existing item) are always saved to draft.
    draftState: draft ? successState(draft, formId) : initialAsyncState,
    metrics: metrics,
    species: species,
    uploads: {
      coverPhoto: coverPhotoUri
        ? {
            name: "",
            size: null,
            type: "image/jpeg",
            uri: coverPhotoUri
          }
        : null,
      documents: docs,
      video: videoUri ? { name: "", size: null, type: "video/mp4", uri: videoUri } : null,
      videoIntroduction: null,
      videoGoals: null,
      videoSignificance: null
    }
  };
}

function createRegistrationForm(base: ?PitchData): PitchRegistrationForm {
  const certificates = (base?.certificate ?? []).map(cert => ({
    type: "existing",
    data: cert
  }));
  const contacts = (base?.contacts ?? []).map(contact => ({
    type: "existing",
    data: contact
  }));
  const docs = (base?.documents ?? []).map(doc => ({
    type: "existing",
    id: doc.id ?? 0,
    file: convertDocumentToFile(doc)
  }));
  const species = (base?.species ?? []).map(specie => ({
    type: "existing",
    data: specie
  }));

  let metrics = {};

  (base?.metrics ?? []).forEach(metric => {
    const metricId = metric.id;
    const method = metric.restoration_method;
    if (method && metricId) {
      metrics[method] = { type: "existing", data: Object.freeze({}), id: metricId };
    }
  });

  metrics = ensureAllRestorationMetricsArePresent(base?.details?.restoration_methods ?? [], metrics);

  const coverPhotoUri = base?.details?.cover_photo;
  const videoUri = base?.details?.video;

  return {
    ...INITIAL_PITCH_FORM,
    base: base
      ? {
          details: base.details,
          metrics: base.metrics
        }
      : null,
    certificate: certificates,
    contacts: contacts,
    // Forms which don't have a base (i.e. aren't editing an existing item) are always saved to draft.
    draftState: null,
    metrics: metrics,
    species: species,
    uploads: {
      coverPhoto: coverPhotoUri
        ? {
            name: "",
            size: null,
            type: "image/jpeg",
            uri: coverPhotoUri
          }
        : null,
      documents: docs,
      video: videoUri ? { name: "", size: null, type: "video/mp4", uri: videoUri } : null,
      videoIntroduction: null,
      videoGoals: null,
      videoSignificance: null
    }
  };
}

function deleteCertificateFromForm(
  currentState: Array<PendingCarbonCertification>,
  deletedItem: PendingCarbonCertification
): Array<PendingCarbonCertification> {
  switch (deletedItem.type) {
    case "created": {
      return currentState.filter(pending => pending !== deletedItem);
    }
    case "existing": {
      const certification: CarbonCertificationRead = deletedItem.data;
      return currentState.map(pending =>
        pending === deletedItem ? { type: "deleted", data: certification } : pending
      );
    }
    case "deleted": {
      // "Undelete" the deletion
      const certification: CarbonCertificationRead = deletedItem.data;
      return currentState.map(pending =>
        pending === deletedItem ? { type: "existing", data: certification } : pending
      );
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (deletedItem.type: empty);
      return currentState;
    }
  }
}

function deleteContactFromForm(
  currentState: Array<PendingPitchContact>,
  deletedItem: PendingPitchContact
): Array<PendingPitchContact> {
  switch (deletedItem.type) {
    case "created": {
      return currentState.filter(pending => pending !== deletedItem);
    }
    case "existing": {
      const contact: PitchContactRead = deletedItem.data;
      return currentState.map(pending => (pending === deletedItem ? { type: "deleted", data: contact } : pending));
    }
    case "deleted": {
      // "Undelete" the deletion
      const contact: PitchContactRead = deletedItem.data;
      return currentState.map(pending => (pending === deletedItem ? { type: "existing", data: contact } : pending));
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (deletedItem.type: empty);
      return currentState;
    }
  }
}

function deleteSpeciesFromForm(
  currentState: Array<PendingTreeSpecies>,
  deletedItem: PendingTreeSpecies
): Array<PendingTreeSpecies> {
  switch (deletedItem.type) {
    case "created": {
      return currentState.filter(pending => pending !== deletedItem);
    }
    case "existing": {
      const contact: TreeSpeciesRead = deletedItem.data;
      return currentState.map(pending => (pending === deletedItem ? { type: "deleted", data: contact } : pending));
    }
    case "deleted": {
      // "Undelete" the deletion
      const contact: TreeSpeciesRead = deletedItem.data;
      return currentState.map(pending => (pending === deletedItem ? { type: "existing", data: contact } : pending));
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (deletedItem.type: empty);
      return currentState;
    }
  }
}

function ensureAllRestorationMetricsArePresent(
  methods: Array<string>,
  metrics: {
    [string]: PendingRestorationMethodMetric
  }
): { [string]: PendingRestorationMethodMetric } {
  const restorationMethodsWithoutMetrics = methods.filter(method => !metrics[method]);

  // Make sure we have a restoration method metric ready for each selected resotration method
  if (restorationMethodsWithoutMetrics.length === 0) {
    return metrics;
  }

  const updatedMetrics = {
    ...metrics
  };

  restorationMethodsWithoutMetrics.forEach(method => {
    updatedMetrics[method] = {
      type: "created",
      data: RestorationMethodMetricCreate.constructFromObject({
        pitch_id: null,
        restoration_method: method,
        experience: null,
        land_size: null,
        price_per_hectare: null,
        biomass_per_hectare: null,
        carbon_impact: null,
        species_impacted: []
      })
    };
  });

  return updatedMetrics;
}
