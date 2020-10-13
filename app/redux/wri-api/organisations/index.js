// @flow

import type { AsyncState, LogoutAction, ReducerMap } from "../../redux.types";
import type { File } from "../../../utils/models.types";
import type {
  AddOrganisationUploadAction,
  CreateOrganisationAction,
  CreateOrganisationRegistrationFormAction,
  CreateTeamMemberAction,
  CreateUserAction,
  DeleteTeamMemberAction,
  FetchOrganisationAction,
  FetchOrganisationOffersAction,
  FetchOrganisationPitchesAction,
  FetchOrganisationTypesAction,
  InspectOrganisationDocumentsAction,
  InspectOrganisationPitchesAction,
  InspectOrganisationOffersAction,
  InspectOrganisationTeamMembersAction,
  InspectOrganisationUsersAction,
  MarkOrganisationFormDetailsCompleteAction,
  MarkOrganisationFormDocumentCreateCompleteAction,
  MarkOrganisationFormDocumentDeleteCompleteAction,
  MarkOrganisationFormMemberDeleteCompleteAction,
  MarkOrganisationFormMemberUpdateCompleteAction,
  MarkOrganisationFormUserUpdateCompleteAction,
  OrganisationUploadQueues,
  RemoveOrganisationUploadAction,
  UpdateOrganisationFormDetailsAction,
  UpdateOrganisationFormMemberAction,
  UpdateOrganisationFormUserAction
} from "./actions";
import {
  OfferReadAll,
  OrganisationCreate,
  OrganisationDocumentRead,
  OrganisationDocumentReadAll,
  OrganisationDocumentVersionReadAll,
  OrganisationRead,
  OrganisationVersionRead,
  OrganisationVersionReadAll,
  OrganisationTypeReadAll,
  PitchReadAll,
  PitchVersionReadAll,
  TeamMemberCreate,
  TeamMemberRead,
  TeamMemberReadAll,
  TeamMemberUpdate,
  UserInvite,
  UserRead,
  UserReadAll,
  UserUpdate
} from "wri-api";
import { combineReducers } from "redux";
import { asyncActionReducer } from "../../asyncActionReducer";
import { convertDocumentToFile } from "../../../api/wri/helpers";
import { addUploadToForm, completeFormUpload, completeFormUploadDeletion, deleteUploadFromForm } from "../helpers";

/**
 * Complete data for user's organisation
 */
export type OrganisationData = {|
  +details: OrganisationRead,
  +documents: OrganisationDocumentReadAll | Array<OrganisationDocumentRead>,
  +members: TeamMemberReadAll | Array<TeamMemberRead>,
  +users: UserReadAll | Array<UserRead>
|};

// A pending team member who exists only in the app, not yet uploaded to the server
export type PendingCreatedTeamMember = {|
  id: number,
  type: "created_member",
  base?: null,
  data: TeamMemberCreate,
  avatarFile: ?File,
  isDeleted?: false
|};

// A pending user invite, existing only in the app, not yet sent
export type PendingCreatedUser = {|
  id: number,
  type: "created_user",
  base?: null,
  data: UserInvite,
  avatarFile?: null,
  isDeleted?: false
|};

// Object representing modifications to a team member, with those modifications yet to be synced to the server
export type PendingExistingTeamMember = {|
  id: number,
  type: "existing_member",
  base: TeamMemberRead,
  data: $Shape<TeamMemberUpdate>,
  avatarFile: ?File,
  isDeleted: boolean
|};

// Object representing modifications to a user, with those modifications yet to be synced to the server
export type PendingExistingUser = {|
  id: number,
  type: "existing_user",
  base: UserRead,
  data: $Shape<UserUpdate>,
  avatarFile: ?File,
  isDeleted?: false
|};
export type PendingTeamMember =
  | PendingCreatedTeamMember
  | PendingCreatedUser
  | PendingExistingUser
  | PendingExistingTeamMember;

/**
 * The current state of the user's registration form, so that they don't lose their progress
 */
export type OrganisationRegistrationForm = {|
  // If base is specified, then these are the base organisation details which are being edited.
  // These details are used to compute PATCH requests
  +base: ?{|
    +details: OrganisationRead
  |},
  +details: $Shape<OrganisationCreate>,
  +pendingMembers: Array<PendingTeamMember>,
  +uploads: OrganisationUploadQueues
|};

/**
 * Type definition for the state managed by this reducer and its subreducers
 */
export type State = {|
  +create: AsyncState<OrganisationVersionRead>,
  +documents: AsyncState<OrganisationDocumentVersionReadAll>,
  +members: AsyncState<TeamMemberReadAll>,
  +offers: AsyncState<OfferReadAll>,
  +offersInspect: AsyncState<OfferReadAll>,
  +pitches: AsyncState<PitchReadAll>,
  +pitchVersions: AsyncState<PitchVersionReadAll>,
  +read: AsyncState<OrganisationVersionReadAll>,
  +registrationForm: OrganisationRegistrationForm,
  +types: AsyncState<OrganisationTypeReadAll>,
  +users: AsyncState<UserReadAll>
|};

/**
 * Type definition for the actions supported by this reducer and its subreducers
 */
export type Actions =
  | AddOrganisationUploadAction
  | CreateOrganisationAction
  | CreateOrganisationRegistrationFormAction
  | CreateTeamMemberAction
  | CreateUserAction
  | DeleteTeamMemberAction
  | FetchOrganisationAction
  | FetchOrganisationOffersAction
  | FetchOrganisationPitchesAction
  | FetchOrganisationTypesAction
  | InspectOrganisationDocumentsAction
  | InspectOrganisationPitchesAction
  | InspectOrganisationOffersAction
  | InspectOrganisationTeamMembersAction
  | InspectOrganisationUsersAction
  | MarkOrganisationFormDetailsCompleteAction
  | MarkOrganisationFormDocumentCreateCompleteAction
  | MarkOrganisationFormDocumentDeleteCompleteAction
  | MarkOrganisationFormMemberDeleteCompleteAction
  | MarkOrganisationFormMemberUpdateCompleteAction
  | MarkOrganisationFormUserUpdateCompleteAction
  | RemoveOrganisationUploadAction
  | UpdateOrganisationFormDetailsAction
  | UpdateOrganisationFormMemberAction
  | UpdateOrganisationFormUserAction;

export default combineReducers<ReducerMap<State, any>, any>({
  create: asyncActionReducer.bind(this, "wri/organisations/create"),
  documents: asyncActionReducer.bind(this, "wri/organisations/documents/inspect"),
  members: asyncActionReducer.bind(this, "wri/organisations/members/inspect"),
  offers: asyncActionReducer.bind(this, "wri/organisations/offers/list"),
  offersInspect: asyncActionReducer.bind(this, "wri/organisations/offers/inspect"),
  pitches: asyncActionReducer.bind(this, "wri/organisations/pitches/list"),
  pitchVersions: asyncActionReducer.bind(this, "wri/organisations/pitches/inspect"),
  read: asyncActionReducer.bind(this, "wri/organisations/get"),
  registrationForm: registrationFormReducer,
  types: asyncActionReducer.bind(this, "wri/organisation_types"),
  users: asyncActionReducer.bind(this, "wri/organisations/users/inspect")
});

/**
 * Whether or not to autofill the form fields. By default does it when running a development build
 */
const AUTOFILL_FORM = false;

/**
 * Maintains Redux state for the pending organisation that the user creates out on registration.
 */
const initialState: OrganisationRegistrationForm = {
  base: null,
  details: AUTOFILL_FORM
    ? {
        category: "both",
        type: "foundation",
        name: "Trees Corp",
        description:
          "Here is a piece of description text that is at least 100 characters long to fulfill server requirements",
        address_1: "18 Christchurch Road",
        address_2: "",
        city: "Bournemouth",
        state: "Dorset",
        zip_code: "BH1 3NE",
        country: "",
        phone_number: "01202 611612",
        website: "www.3sidedcube.com",
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        founded_at: "10 Oct 2018 00:12:00 GMT",
        avatar: 0,
        cover_photo: 0,
        video: 0
      }
    : Object.freeze({}),
  pendingMembers: [],
  uploads: { avatar: undefined, coverPhoto: undefined, documents: [], awards: [], video: undefined }
};

type RegistrationFormReducerSupportedActions =
  | AddOrganisationUploadAction
  | CreateOrganisationRegistrationFormAction
  | CreateTeamMemberAction
  | CreateUserAction
  | DeleteTeamMemberAction
  | LogoutAction
  | MarkOrganisationFormDetailsCompleteAction
  | MarkOrganisationFormDocumentCreateCompleteAction
  | MarkOrganisationFormDocumentDeleteCompleteAction
  | MarkOrganisationFormMemberDeleteCompleteAction
  | MarkOrganisationFormMemberUpdateCompleteAction
  | MarkOrganisationFormUserUpdateCompleteAction
  | RemoveOrganisationUploadAction
  | UpdateOrganisationFormDetailsAction
  | UpdateOrganisationFormMemberAction
  | UpdateOrganisationFormUserAction;

function registrationFormReducer(
  state: OrganisationRegistrationForm = { ...initialState },
  action: RegistrationFormReducerSupportedActions
): OrganisationRegistrationForm {
  switch (action.type) {
    case "wri/organisations/registration_form/create": {
      return createRegistrationForm(action.payload.base);
    }
    case "wri/organisations/registration_form/details/update": {
      return {
        ...state,
        details: { ...state.details, ...action.payload }
      };
    }
    case "wri/organisations/registration_form/details/complete": {
      return {
        ...state,
        base: {
          details: action.payload
        },
        details: Object.freeze({}),
        uploads: {
          ...state.uploads,
          avatar: undefined,
          coverPhoto: undefined,
          video: undefined
        }
      };
    }
    case "wri/organisations/registration_form/user/create": {
      return {
        ...state,
        pendingMembers: [
          ...state.pendingMembers,
          {
            id: Date.now(),
            type: "created_user",
            data: action.payload
          }
        ]
      };
    }
    case "wri/organisations/registration_form/user/update": {
      const itemToUpdateId = action.payload.pendingMemberId;
      const itemToUpdate = state.pendingMembers.find(item => item.id === itemToUpdateId);
      if (!itemToUpdate) {
        return state;
      }
      return {
        ...state,
        pendingMembers: updateMemberInForm(
          state.pendingMembers,
          itemToUpdate,
          action.payload.data,
          action.payload.avatarFile
        )
      };
    }
    case "wri/organisations/registration_form/user/update/complete": {
      const creationRequest = action.payload.request;
      const createdUser = action.payload.result;
      return {
        ...state,
        pendingMembers: state.pendingMembers.map(pending =>
          pending.id === creationRequest.id
            ? { id: pending.id, type: "existing_user", data: {}, base: createdUser, avatarFile: null, isDeleted: false }
            : pending
        )
      };
    }
    case "wri/organisations/registration_form/member/create": {
      return {
        ...state,
        pendingMembers: [
          ...state.pendingMembers,
          {
            id: Date.now(),
            type: "created_member",
            data: action.payload.data,
            avatarFile: action.payload.avatarFile
          }
        ]
      };
    }
    case "wri/organisations/registration_form/member/update": {
      const itemToUpdateId = action.payload.pendingMemberId;
      const itemToUpdate = state.pendingMembers.find(item => item.id === itemToUpdateId);
      if (!itemToUpdate) {
        return state;
      }
      return {
        ...state,
        pendingMembers: updateMemberInForm(
          state.pendingMembers,
          itemToUpdate,
          action.payload.data,
          action.payload.avatarFile
        )
      };
    }
    case "wri/organisations/registration_form/member/update/complete": {
      const updatedItem = action.payload.request;
      const result = action.payload.result;
      return {
        ...state,
        pendingMembers: state.pendingMembers.map(pending =>
          pending.id === updatedItem.id
            ? {
                id: pending.id,
                type: "existing_member",
                data: {},
                base: result,
                avatarFile: null,
                isDeleted: false
              }
            : pending
        )
      };
    }
    case "wri/organisations/registration_form/member/delete": {
      return {
        ...state,
        pendingMembers: deleteMemberFromForm(state.pendingMembers, action.payload)
      };
    }
    case "wri/organisations/registration_form/member/delete/complete": {
      const deletedItem = action.payload.request;
      return {
        ...state,
        pendingMembers: state.pendingMembers.filter(pending => pending !== deletedItem)
      };
    }
    case "wri/organisations/registration_form/uploads/add": {
      return {
        ...state,
        uploads: addUploadToForm(state.uploads, action.payload.type, action.payload.file)
      };
    }
    case "wri/organisations/registration_form/uploads/add/complete": {
      return {
        ...state,
        uploads: completeFormUpload(state.uploads, action.payload.type, action.payload.request, action.payload.result)
      };
    }
    case "wri/organisations/registration_form/uploads/remove": {
      return {
        ...state,
        uploads: deleteUploadFromForm(state.uploads, action.payload.type, action.payload.item)
      };
    }
    case "wri/organisations/registration_form/uploads/remove/complete": {
      return {
        ...state,
        uploads: completeFormUploadDeletion(state.uploads, action.payload.type, action.payload.request)
      };
    }
    case "logout": {
      return {
        ...initialState
      };
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (action: empty); // flow cast to empty - this will error if we've forgotten to handle an action
      return state;
    }
  }
}

function createRegistrationForm(base: ?OrganisationData): OrganisationRegistrationForm {
  const users = base?.users ?? [];
  const members = base?.members ?? [];
  const allMembers = [
    ...users.map((user, idx) => ({
      id: idx + 1,
      type: "existing_user",
      data: {},
      base: user,
      avatarFile: null,
      isDeleted: false
    })),
    ...members.map((member, idx) => ({
      id: users.length + idx + 1,
      type: "existing_member",
      data: {},
      base: member,
      avatarFile: null,
      isDeleted: false
    }))
  ];

  //Distinguish the awards and the rest of the docs
  const awardDocs = (base?.documents ?? [])
    .filter(doc => doc.type === "award")
    .map(doc => ({
      type: "existing",
      id: doc.id ?? 0,
      file: convertDocumentToFile(doc)
    }));

  const docs = (base?.documents ?? [])
    .filter(doc => doc.type !== "award")
    .map(doc => ({
      type: "existing",
      id: doc.id ?? 0,
      file: convertDocumentToFile(doc)
    }));

  return {
    ...initialState,
    base: base
      ? {
          details: base.details
        }
      : null,
    pendingMembers: allMembers,
    uploads: {
      avatar: undefined,
      awards: awardDocs,
      coverPhoto: undefined,
      documents: docs,
      video: undefined
    }
  };
}

function deleteMemberFromForm(
  currentState: Array<PendingTeamMember>,
  deletedItem: PendingTeamMember
): Array<PendingTeamMember> {
  switch (deletedItem.type) {
    case "created_user": {
      return currentState.filter(pending => pending !== deletedItem);
    }
    case "created_member": {
      return currentState.filter(pending => pending !== deletedItem);
    }
    case "existing_user": {
      console.warn("3SC", "Deleting users from organisations is not yet supported");
      return currentState;
    }
    case "existing_member": {
      const updatedMemberItem: PendingExistingTeamMember = {
        ...deletedItem,
        isDeleted: !deletedItem.isDeleted
      };
      return currentState.map(pending => (pending.id === deletedItem.id ? updatedMemberItem : pending));
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (deletedItem.type: empty);
      return currentState;
    }
  }
}

function updateMemberInForm(
  currentState: Array<PendingTeamMember>,
  updatedItem: PendingTeamMember,
  updatedDetails: $Shape<TeamMemberUpdate> | $Shape<UserUpdate>,
  avatarFile: ?File
): Array<PendingTeamMember> {
  switch (updatedItem.type) {
    case "created_member": {
      const updatedMemberItem: PendingCreatedTeamMember = {
        ...updatedItem,
        data: TeamMemberCreate.constructFromObject({
          ...updatedItem.data,
          ...updatedDetails
        }),
        avatarFile: avatarFile ? avatarFile : updatedItem.avatarFile
      };
      return currentState.map(pending => (pending.id === updatedItem.id ? updatedMemberItem : pending));
    }
    case "existing_member": {
      const updatedMemberItem: PendingExistingTeamMember = {
        ...updatedItem,
        data: {
          ...updatedItem.data,
          ...updatedDetails
        },
        avatarFile: avatarFile ? avatarFile : updatedItem.avatarFile
      };
      return currentState.map(pending => (pending.id === updatedItem.id ? updatedMemberItem : pending));
    }
    case "created_user": {
      return currentState;
    }
    case "existing_user": {
      const updatedMemberItem: PendingExistingUser = {
        ...updatedItem,
        data: {
          ...updatedItem.data,
          ...updatedDetails
        },
        avatarFile: avatarFile ? avatarFile : updatedItem.avatarFile
      };
      return currentState.map(pending => (pending.id === updatedItem.id ? updatedMemberItem : pending));
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (updatedItem.type: empty);
      return currentState;
    }
  }
}
