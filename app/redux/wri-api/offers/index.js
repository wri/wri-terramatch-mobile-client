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
  AddOfferUploadAction,
  CreateOfferAction,
  CreateOfferRegistrationFormAction,
  DeleteOfferRegistrationFormAction,
  FetchOfferContactsAction,
  MarkOfferFormContactCreateCompleteAction,
  MarkOfferFormContactDeleteCompleteAction,
  MarkOfferFormDetailsCompleteAction,
  OfferUploadQueues,
  RemoveOfferContactAction,
  SaveOfferFormAsDraftAction,
  SearchOffersAction,
  UpdateOfferContactsAction,
  UpdateOfferRegistrationFormAction,
  UpdateFilterSearchAction,
  UpdateSortOptionsAction,
  UpdateFilteredPitchSearchAction
} from "./actions";

import {
  DraftRead,
  FilterCondition,
  OfferReadAll,
  OfferContactReadAll,
  OfferCreate,
  OfferContactCreate,
  OfferContactRead,
  OfferRead
} from "wri-api";
import _ from "lodash";

import { combineReducers } from "redux";
import { asyncActionReducer, initialAsyncState, successState } from "../../asyncActionReducer";
import { addUploadToForm } from "../helpers";
import { calculateFiltersOfProject } from "../../../api/wri/helpers";

/**
 * Complete data for an offer
 */
export type OfferData = {|
  +contacts: OfferContactReadAll | Array<OfferContactRead>,
  +details: OfferRead
|};

/**
 * Type definitions describing modifications to a base array of contacts
 *
 * These modifications included "created" if an item has been added or
 * in some situations "existing" if an item has been unmodified
 */
export type PendingOfferContact =
  | {| type: "created", data: OfferContactCreate |}
  | {| type: "existing", data: OfferContactRead |}
  | {| type: "deleted", data: OfferContactRead |};

/**
 * The current state of the user's registration form, so that they don't lose their progress
 */
export type OfferRegistrationForm = {|
  // If base is specified, then these are the base offer details which are being edited.
  // These details are used to compute PATCH requests
  +base: ?{|
    +details: OfferRead
  |},
  +contacts: Array<PendingOfferContact>,
  +details: $Shape<OfferCreate>, // only contains modifications the user has made, not the complete data structure

  // Holds info about the remote draft copy of this offer
  // A draft is created if this form represents a brand new offer (i.e. not edit mode, so base is null)
  // The draft is then intermittently synced
  // Added in v1.1, so the prop may be missing for migrating users
  +draftState: ?AsyncState<DraftRead>,

  +uploads: OfferUploadQueues
|};

/**
 * A mapping from form ID to their associated form
 */
type OfferRegistrationFormMap = {|
  [string]: OfferRegistrationForm
|};

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +create: AsyncState<number>,
  +filtersAndSorting: FiltersAndSorting,
  +registrationForm: OfferRegistrationFormMap,
  +searchResults: AsyncState<OfferReadAll>
|};

type FiltersAndSorting = {|
  +sortOption: SortAttributeEnum,
  +filteredPitchId: ?number,
  +filter: Array<FilterCondition>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */

export type Actions =
  | AddOfferUploadAction
  | CreateOfferAction
  | CreateOfferRegistrationFormAction
  | DeleteOfferRegistrationFormAction
  | FetchOfferContactsAction
  | MarkOfferFormContactCreateCompleteAction
  | MarkOfferFormContactDeleteCompleteAction
  | MarkOfferFormDetailsCompleteAction
  | RemoveOfferContactAction
  | SaveOfferFormAsDraftAction
  | SearchOffersAction
  | UpdateOfferContactsAction
  | UpdateOfferRegistrationFormAction
  | UpdateSortOptionsAction
  | UpdateFilterSearchAction
  | UpdateFilteredPitchSearchAction;

export default combineReducers<ReducerMap<State, any>, any>({
  create: asyncActionReducer.bind(this, "wri/offers/create"),
  filtersAndSorting: filtersAndSortingReducer,
  registrationForm: registrationFormMapReducer,
  searchResults: asyncActionReducer.bind(this, "wri/offers/search")
});

type RegistrationFormActions =
  | AsyncPendingAction<"wri/offers/registration_form/draft/save_pending", DraftRead>
  | AsyncSuccessAction<"wri/offers/registration_form/draft/save_succ", DraftRead>
  | AsyncErrorAction<"wri/offers/registration_form/draft/save_fail">
  | AddOfferUploadAction
  | ClearTransientStateAction
  | CreateOfferRegistrationFormAction
  | MarkOfferFormContactCreateCompleteAction
  | MarkOfferFormContactDeleteCompleteAction
  | MarkOfferFormDetailsCompleteAction
  | RemoveOfferContactAction
  | UpdateOfferContactsAction
  | UpdateOfferRegistrationFormAction;

function registrationFormMapReducer(
  state: OfferRegistrationFormMap = Object.freeze({}),
  action: RegistrationFormActions | LogoutAction | DeleteOfferRegistrationFormAction
): OfferRegistrationFormMap {
  switch (action.type) {
    case "wri/offers/registration_form/create":
    case "wri/offers/registration_form/details/update":
    case "wri/offers/registration_form/details/complete":
    case "wri/offers/registration_form/contacts/create":
    case "wri/offers/registration_form/contacts/create/complete":
    case "wri/offers/registration_form/contacts/remove":
    case "wri/offers/registration_form/contacts/remove/complete":
    case "wri/offers/registration_form/uploads/add": {
      const formId = action.meta.formId;
      const form = state[formId] ?? undefined;
      return {
        ...state,
        [formId]: registrationFormReducer(form, action)
      };
    }
    case "wri/offers/registration_form/draft/save_pending":
    case "wri/offers/registration_form/draft/save_succ":
    case "wri/offers/registration_form/draft/save_fail": {
      const formId = action.meta.cacheKey;
      const form = formId ? state["" + formId] ?? undefined : undefined;
      return {
        ...state,
        [formId]: registrationFormReducer(form, action)
      };
    }
    case "wri/offers/registration_form/delete": {
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

export const INITIAL_OFFER_FORM: OfferRegistrationForm = {
  base: null,
  contacts: [],
  details: AUTOFILL_FORM
    ? {
        name: "Save forest of Seychelles"
      }
    : Object.freeze({}),
  draftState: null,
  uploads: {
    coverPhoto: null,
    documents: [],
    video: null,
    videoGoals: null,
    videoIntroduction: null,
    videoSignificance: null
  }
};

function registrationFormReducer(
  state: OfferRegistrationForm = { ...INITIAL_OFFER_FORM },
  action: RegistrationFormActions
): OfferRegistrationForm {
  switch (action.type) {
    case "wri/offers/registration_form/create": {
      if (action.payload.isDraft) {
        return createRegistrationFormDraft(action.payload.draft, action.meta.formId);
      } else {
        return createRegistrationForm(action.payload.base);
      }
    }
    case "wri/offers/registration_form/uploads/add": {
      return {
        ...state,
        uploads: addUploadToForm(state.uploads, action.payload.type, action.payload.file)
      };
    }
    case "wri/offers/registration_form/details/update": {
      return {
        ...state,
        details: { ...state.details, ...action.payload }
      };
    }
    case "wri/offers/registration_form/details/complete": {
      return {
        ...state,
        base: {
          details: action.payload
        },
        details: Object.freeze({}),
        uploads: {
          ...state.uploads,
          coverPhoto: null,
          video: null
        }
      };
    }
    case "wri/offers/registration_form/contacts/create": {
      return {
        ...state,
        contacts: [...state.contacts, { type: "created", data: action.payload }]
      };
    }
    case "wri/offers/registration_form/contacts/create/complete": {
      const creationRequest = action.payload.request;
      const createdMember = action.payload.result;
      return {
        ...state,
        contacts: state.contacts.map(pending =>
          pending === creationRequest ? { type: "existing", data: createdMember } : pending
        )
      };
    }
    case "wri/offers/registration_form/contacts/remove": {
      return {
        ...state,
        contacts: deleteContactFromForm(state.contacts, action.payload.item)
      };
    }
    case "wri/offers/registration_form/contacts/remove/complete": {
      const deletedItem = action.payload.request;
      return {
        ...state,
        contacts: state.contacts.filter(pending => pending !== deletedItem)
      };
    }
    case "wri/offers/registration_form/draft/save_pending":
    case "wri/offers/registration_form/draft/save_succ":
    case "wri/offers/registration_form/draft/save_fail":
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
          "wri/offers/registration_form/draft/save",
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
    filteredPitchId: null,
    filter: []
  },
  action: UpdateSortOptionsAction | UpdateFilterSearchAction | UpdateFilteredPitchSearchAction | LogoutAction
): FiltersAndSorting {
  switch (action.type) {
    case "wri/offers/options/update": {
      return {
        ...state,
        sortOption: action.payload
      };
    }
    case "wri/offers/filter/update": {
      return {
        ...state,
        filter: action.payload,
        filteredPitchId: null
      };
    }
    case "wri/offers/filteredPitch/update": {
      return {
        ...state,
        filter: calculateFiltersOfProject(action.payload, "offer"),
        filteredPitchId: action.payload.id
      };
    }
    case "logout": {
      return {
        ...state,
        sortOption: "compatibility_score",
        filteredPitchId: null,
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

function createRegistrationFormDraft(draft: ?DraftRead, formId: string): OfferRegistrationForm {
  const contacts = (draft?.data?.offer_contacts ?? []).map(contact => ({
    type: "created",
    data: contact
  }));

  const {
    cover_photo: coverPhotoUri,
    video: videoUri, // eslint-disable-line no-unused-vars
    ...draftDetails
  } = draft?.data?.offer ?? {};

  return {
    ...INITIAL_OFFER_FORM,
    base: null,
    details: draftDetails,
    contacts: contacts,
    // Forms which don't have a base (i.e. aren't editing an existing item) are always saved to draft.
    draftState: draft ? successState(draft, formId) : initialAsyncState,
    uploads: {
      coverPhoto: coverPhotoUri
        ? {
            name: "",
            size: null,
            type: "image/jpeg",
            uri: coverPhotoUri
          }
        : null,
      documents: [],
      video: null,
      videoIntroduction: null,
      videoGoals: null,
      videoSignificance: null
    }
  };
}

function createRegistrationForm(base: ?OfferData): OfferRegistrationForm {
  const contacts = (base?.contacts ?? []).map(contact => ({
    type: "existing",
    data: contact
  }));

  const coverPhotoUri = base?.details?.cover_photo;

  return {
    ...INITIAL_OFFER_FORM,
    base: base
      ? {
          details: base.details
        }
      : null,
    contacts: contacts,
    // Forms which don't have a base (i.e. aren't editing an existing item) are always saved to draft.
    draftState: null,
    uploads: {
      coverPhoto: coverPhotoUri
        ? {
            name: "",
            size: null,
            type: "image/jpeg",
            uri: coverPhotoUri
          }
        : null,
      documents: [],
      video: null,
      videoIntroduction: null,
      videoGoals: null,
      videoSignificance: null
    }
  };
}

function deleteContactFromForm(
  currentState: Array<PendingOfferContact>,
  deletedItem: PendingOfferContact
): Array<PendingOfferContact> {
  switch (deletedItem.type) {
    case "created": {
      return currentState.filter(pending => pending !== deletedItem);
    }
    case "existing": {
      const contact: OfferContactRead = deletedItem.data;
      return currentState.map(pending => (pending === deletedItem ? { type: "deleted", data: contact } : pending));
    }
    case "deleted": {
      // "Undelete" the deletion
      const contact: OfferContactRead = deletedItem.data;
      return currentState.map(pending => (pending === deletedItem ? { type: "existing", data: contact } : pending));
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (deletedItem.type: empty);
      return currentState;
    }
  }
}
