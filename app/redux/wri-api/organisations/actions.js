// @flow

import type { Dispatch, GetState, NamedAsyncAction, Thunk } from "../../redux.types";
import type { File, PendingFile, PendingFileList } from "../../../utils/models.types";
import type { OrganisationData, OrganisationRegistrationForm, PendingTeamMember } from "./index";
import {
  OfferReadAll,
  OrganisationCreate,
  OrganisationDocumentCreate,
  OrganisationDocumentRead,
  OrganisationDocumentVersionReadAll,
  OrganisationRead,
  OrganisationUpdate,
  OrganisationTypeReadAll,
  OrganisationVersionRead,
  OrganisationVersionReadAll,
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
import wriAPI from "../../../api/wri";
import { createAsyncAction } from "../../conditionalActions";
import TSCError from "../../../utils/tscError";
import { errorCodes, errorDomains } from "../../../constants/errorMessaging";
import {
  convertOrganisationDocumentVersionsToDocuments,
  findMostRecentOrganisationVersion,
  syncOrganisationMediaToApi,
  findMostRecentOrganisationApprovedVersion
} from "../../../api/wri/helpers";
import { logUserData } from "../../../utils/analytics";
import translate from "../../../locales";
import { fetchDraftOffers, fetchDraftPitches } from "../drafts/actions";

export type OrganisationUploadQueues = {|
  +avatar: ?File,
  +awards: PendingFileList,
  +coverPhoto: ?File,
  +documents: PendingFileList,
  +video: ?File
|};
type OrganisationUploadTypes = $Keys<OrganisationUploadQueues>;

export type AddOrganisationUploadAction = {|
  +type: "wri/organisations/registration_form/uploads/add",
  +payload: {
    +type: OrganisationUploadTypes,
    +file: File
  }
|};
export type CreateOrganisationAction = NamedAsyncAction<"wri/organisations/create", OrganisationVersionRead>;
export type CreateOrganisationRegistrationFormAction = {|
  +type: "wri/organisations/registration_form/create",
  +payload: {|
    +base: ?OrganisationData
  |}
|};
export type CreateTeamMemberAction = {|
  +type: "wri/organisations/registration_form/member/create",
  +payload: {|
    +data: TeamMemberCreate,
    +avatarFile: ?File
  |}
|};
export type CreateUserAction = {|
  +type: "wri/organisations/registration_form/user/create",
  +payload: UserInvite
|};
export type DeleteTeamMemberAction = {|
  +type: "wri/organisations/registration_form/member/delete",
  +payload: PendingTeamMember
|};
export type FetchOrganisationAction = NamedAsyncAction<"wri/organisations/get", OrganisationVersionReadAll>;
export type FetchOrganisationOffersAction = NamedAsyncAction<"wri/organisations/offers/list", OfferReadAll>;
export type FetchOrganisationPitchesAction = NamedAsyncAction<"wri/organisations/pitches/list", PitchReadAll>;
export type FetchOrganisationTypesAction = NamedAsyncAction<"wri/organisation_types", OrganisationTypeReadAll>;
export type InspectOrganisationDocumentsAction = NamedAsyncAction<
  "wri/organisations/documents/inspect",
  OrganisationDocumentVersionReadAll
>;
export type InspectOrganisationPitchesAction = NamedAsyncAction<
  "wri/organisations/pitches/inspect",
  PitchVersionReadAll
>;
export type InspectOrganisationOffersAction = NamedAsyncAction<"wri/organisations/offers/inspect", OfferReadAll>;
export type InspectOrganisationTeamMembersAction = NamedAsyncAction<
  "wri/organisations/members/inspect",
  TeamMemberReadAll
>;
export type InspectOrganisationUsersAction = NamedAsyncAction<"wri/organisations/users/inspect", UserReadAll>;
export type MarkOrganisationFormDetailsCompleteAction = {|
  +type: "wri/organisations/registration_form/details/complete",
  +payload: OrganisationRead
|};
export type MarkOrganisationFormDocumentCreateCompleteAction = {|
  +type: "wri/organisations/registration_form/uploads/add/complete",
  +payload: {|
    +type: "awards" | "documents",
    +request: PendingFile,
    +result: OrganisationDocumentRead
  |}
|};
export type MarkOrganisationFormDocumentDeleteCompleteAction = {|
  +type: "wri/organisations/registration_form/uploads/remove/complete",
  +payload: {|
    +type: "awards" | "documents",
    +request: PendingFile
  |}
|};
export type MarkOrganisationFormMemberDeleteCompleteAction = {|
  +type: "wri/organisations/registration_form/member/delete/complete",
  +payload: {|
    +request: PendingTeamMember
  |}
|};
export type MarkOrganisationFormMemberUpdateCompleteAction = {|
  +type: "wri/organisations/registration_form/member/update/complete",
  +payload: {|
    +request: PendingTeamMember,
    +result: TeamMemberRead
  |}
|};
export type MarkOrganisationFormUserUpdateCompleteAction = {|
  +type: "wri/organisations/registration_form/user/update/complete",
  +payload: {|
    +request: PendingTeamMember,
    +result: UserRead
  |}
|};
export type RemoveOrganisationUploadAction = {|
  +type: "wri/organisations/registration_form/uploads/remove",
  +payload: {
    +type: "awards" | "documents",
    +item: PendingFile
  }
|};

export type UpdateOrganisationFormDetailsAction = {|
  +type: "wri/organisations/registration_form/details/update",
  +payload: $Shape<OrganisationCreate>
|};
export type UpdateOrganisationFormMemberAction = {|
  +type: "wri/organisations/registration_form/member/update",
  +payload: {|
    +pendingMemberId: number,
    +data: $Shape<TeamMemberUpdate>,
    +avatarFile: ?File
  |}
|};
export type UpdateOrganisationFormUserAction = {|
  +type: "wri/organisations/registration_form/user/update",
  +payload: {|
    +pendingMemberId: number,
    +data: $Shape<UserUpdate>,
    +avatarFile: ?File
  |}
|};

type SyncOutcome =
  | {|
      +outcome: "success",
      +error: null
    |}
  | {|
      +outcome: "failure",
      +error: TSCError
    |};

export function addOrganisationUpload(type: OrganisationUploadTypes, file: File): AddOrganisationUploadAction {
  return {
    type: "wri/organisations/registration_form/uploads/add",
    payload: {
      type: type,
      file: file
    }
  };
}

export function addTeamMemberToForm(member: TeamMemberCreate, avatarFile: ?File): CreateTeamMemberAction {
  return {
    type: "wri/organisations/registration_form/member/create",
    payload: {
      data: member,
      avatarFile: avatarFile
    }
  };
}

export function addUserInviteToForm(invite: UserInvite): CreateUserAction {
  return {
    type: "wri/organisations/registration_form/user/create",
    payload: invite
  };
}

/**
 * Creates a Redux action that when dispatched will prepare Redux state in order to create or edit an organisation.
 *
 * If an offer is being edited, then this thunk will make sure we are in a state where we have all the necessary data needed
 * to actually edit.
 */
export function createOrganisationRegistrationForm(): Thunk<Promise<OrganisationRegistrationForm>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<OrganisationRegistrationForm> => {
    let base: ?OrganisationData = null;

    const appState = getState();
    const organisationId =
      appState.wri.users.me.data?.organisation_id ?? appState.wri.users.createAccount.data?.organisation_id;

    if (organisationId) {
      // Before we start editing let's make sure we have all the base data we need to edit
      const cachedDocuments = appState.wri.organisations.documents.data;
      const cachedMembers = appState.wri.organisations.members.data;
      const cachedUsers = appState.wri.organisations.users.data;
      const cachedVersions = appState.wri.organisations.read.data;

      const documentsRequest: Promise<OrganisationDocumentVersionReadAll> = cachedDocuments
        ? Promise.resolve(cachedDocuments)
        : wriAPI.organisationDocuments.organisationsIDOrganisationDocumentsInspectGet(organisationId);
      const membersRequest: Promise<TeamMemberReadAll> = cachedMembers
        ? Promise.resolve(cachedMembers)
        : wriAPI.teamMembers.organisationsIDTeamMembersGet(organisationId);
      const usersRequest: Promise<UserReadAll> = cachedUsers
        ? Promise.resolve(cachedUsers)
        : wriAPI.users.organisationsIDUsersGet(organisationId);
      const versionsRequest: Promise<OrganisationVersionReadAll> = cachedVersions
        ? Promise.resolve(cachedVersions)
        : wriAPI.organisationVersions.organisationsIDOrganisationVersionsGet(organisationId);

      const [documents, members, users, versions] = await Promise.all([
        documentsRequest,
        membersRequest,
        usersRequest,
        versionsRequest
      ]);

      const mostRecentVersion = findMostRecentOrganisationVersion(versions);
      base = {
        details: mostRecentVersion?.data ?? new OrganisationRead(),
        documents: convertOrganisationDocumentVersionsToDocuments(documents),
        members: members,
        users: users // exclude the logged in user from being shown in the form
      };
    }

    dispatch({
      type: "wri/organisations/registration_form/create",
      payload: {
        base: base
      }
    });

    const updatedAppState = getState();
    return updatedAppState.wri.organisations.registrationForm;
  };
}

/**
 * Action that when dispatched will fetch all data relating to the user's organisation
 */
export function fetchMyOrganisationData(): Thunk<void> {
  return (dispatch: Dispatch, getState: GetState) => {
    const appState = getState();
    const organisationId =
      appState.wri.users.me.data?.organisation_id ?? appState.wri.users.createAccount.data?.organisation_id;

    if (!organisationId) {
      console.warn("3SC", "Cannot fetch organisation data without user's organisation ID");
      return;
    }

    dispatch(fetchOrganisationOffers(organisationId));
    dispatch(fetchOrganisationPitches(organisationId));
    dispatch(inspectOrganisationTeamMembers(organisationId));
    dispatch(inspectOrganisationUsers(organisationId));
    dispatch(fetchOrganisationVersions(organisationId));
    dispatch(inspectOrganisationDocuments(organisationId));
    dispatch(inspectOrganisationPitches(organisationId));
    dispatch(inspectOrganisationOffers(organisationId));
    dispatch(fetchDraftPitches());
    dispatch(fetchDraftOffers());
  };
}

export function fetchOrganisationOffers(id: number): FetchOrganisationOffersAction {
  return createAsyncAction({
    type: "wri/organisations/offers/list",
    payload: wriAPI.offers.organisationsIDOffersGet(id)
  });
}

export function fetchOrganisationPitches(id: number): FetchOrganisationPitchesAction {
  return createAsyncAction({
    type: "wri/organisations/pitches/list",
    payload: wriAPI.pitches.organisationsIDPitchesGet(id)
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all organisation types
 *
 * @return The created action
 */
export function fetchOrganisationTypes(): FetchOrganisationTypesAction {
  return createAsyncAction({
    type: "wri/organisation_types",
    payload: wriAPI.organisationTypes.organisationTypesGet()
  });
}

export function fetchOrganisationVersions(id: number): FetchOrganisationAction {
  return createAsyncAction({
    type: "wri/organisations/get",
    payload: async () => {
      const organisationVersions = await wriAPI.organisationVersions.organisationsIDOrganisationVersionsGet(id);

      if (organisationVersions) {
        const mostRecentVersion =
          findMostRecentOrganisationApprovedVersion(organisationVersions ?? []) ??
          findMostRecentOrganisationVersion(organisationVersions ?? []);

        logUserData({
          user_type: mostRecentVersion?.data?.category,
          country_code: mostRecentVersion?.data?.country
        });
      }

      return organisationVersions;
    }
  });
}

export function inspectOrganisationDocuments(id: number): InspectOrganisationDocumentsAction {
  return createAsyncAction({
    type: "wri/organisations/documents/inspect",
    payload: wriAPI.organisationDocuments.organisationsIDOrganisationDocumentsInspectGet(id)
  });
}

export function inspectOrganisationPitches(id: number): InspectOrganisationPitchesAction {
  return createAsyncAction({
    type: "wri/organisations/pitches/inspect",
    payload: wriAPI.pitches.organisationsIDPitchesInspectGet(id)
  });
}

export function inspectOrganisationOffers(id: number): InspectOrganisationOffersAction {
  return createAsyncAction({
    type: "wri/organisations/offers/inspect",
    payload: wriAPI.offers.organisationsIDOffersInspectGet(id)
  });
}

export function inspectOrganisationTeamMembers(id: number): InspectOrganisationTeamMembersAction {
  return createAsyncAction({
    type: "wri/organisations/members/inspect",
    payload: wriAPI.teamMembers.organisationsIDTeamMembersInspectGet(id)
  });
}

export function inspectOrganisationUsers(id: number): InspectOrganisationUsersAction {
  return createAsyncAction({
    type: "wri/organisations/users/inspect",
    payload: wriAPI.users.organisationsIDUsersInspectGet(id)
  });
}

export function markOrganisationFormDetailsComplete(
  result: OrganisationRead
): MarkOrganisationFormDetailsCompleteAction {
  return {
    type: "wri/organisations/registration_form/details/complete",
    payload: result
  };
}

/**
 * Action that when dispatched will mark the specified document as having been created successfully, so that it can be
 * removed the form
 */
export function markOrganisationFormDocumentCreateComplete(
  type: "documents" | "awards",
  request: PendingFile,
  result: OrganisationDocumentRead
): MarkOrganisationFormDocumentCreateCompleteAction {
  return {
    type: "wri/organisations/registration_form/uploads/add/complete",
    payload: {
      type: type,
      request: request,
      result: result
    }
  };
}

/**
 * Action that when dispatched will mark the specified document as having been deleted successfully, so that it can be
 * removed the form
 */
export function markOrganisationFormDocumentDeleteComplete(
  type: "documents" | "awards",
  request: PendingFile
): MarkOrganisationFormDocumentDeleteCompleteAction {
  return {
    type: "wri/organisations/registration_form/uploads/remove/complete",
    payload: {
      type: type,
      request: request
    }
  };
}

export function markOrganisationFormMemberDeleteComplete(
  request: PendingTeamMember
): MarkOrganisationFormMemberDeleteCompleteAction {
  return {
    type: "wri/organisations/registration_form/member/delete/complete",
    payload: {
      request: request
    }
  };
}

export function markOrganisationFormMemberUpdateComplete(
  request: PendingTeamMember,
  result: TeamMemberRead
): MarkOrganisationFormMemberUpdateCompleteAction {
  return {
    type: "wri/organisations/registration_form/member/update/complete",
    payload: {
      request,
      result
    }
  };
}

export function markOrganisationFormUserUpdateComplete(
  request: PendingTeamMember,
  result: UserRead
): MarkOrganisationFormUserUpdateCompleteAction {
  return {
    type: "wri/organisations/registration_form/user/update/complete",
    payload: {
      request: request,
      result: result
    }
  };
}

export function removeOrganisationTeamMember(member: PendingTeamMember): DeleteTeamMemberAction {
  return {
    type: "wri/organisations/registration_form/member/delete",
    payload: member
  };
}

export function removeOrganisationUpload(
  type: "awards" | "documents",
  file: PendingFile
): RemoveOrganisationUploadAction {
  return {
    type: "wri/organisations/registration_form/uploads/remove",
    payload: {
      type: type,
      item: file
    }
  };
}

/**
 * Creates an action that when dispatched will make a request to create an organisation and setup its associated data
 * such as team members
 *
 * @return The created action
 */
export function syncOrganisationForm(): Thunk<Promise<OrganisationVersionRead>> {
  return async (dispatch: Dispatch, getState: GetState) => {
    const appState = getState();
    const registrationForm = appState.wri.organisations.registrationForm;

    const action: CreateOrganisationAction = createAsyncAction({
      type: "wri/organisations/create",
      payload: async () => {
        const form = registrationForm.details;

        // Upload avatar, cover photo, and video if necessary before we update the org, as these are needed in the main
        // org body
        const [avatarUpload, coverPhotoUpload, videoUpload] = await syncOrganisationMediaToApi(registrationForm);

        let orgVersion: ?OrganisationVersionRead = null;

        // Either PATCH or POST the organisation depending on whether there is a base org we are modifying
        if (registrationForm.base) {
          const patchPayload = {
            ...form,
            avatar: avatarUpload?.id ?? undefined,
            cover_photo: coverPhotoUpload?.id ?? undefined,
            video: videoUpload?.id ?? undefined
          };
          const hasPatchData = Object.values(patchPayload).some(value => value !== undefined);

          // Only fire off the patch request if there is something to patch
          if (hasPatchData) {
            const existingOrgId = appState.wri.users.me.data?.organisation_id;

            if (!existingOrgId) {
              throw new TSCError({
                domain: errorDomains.WRI,
                code: errorCodes.WRI_UNEXPECTED_STATE,
                message: "Cannot patch organisation without an organisation ID"
              });
            }

            orgVersion = await wriAPI.organisations.organisationsIDPatch(
              existingOrgId,
              OrganisationUpdate.constructFromObject(patchPayload)
            );
          }
        } else {
          orgVersion = await wriAPI.organisations.organisationsPost(
            OrganisationCreate.constructFromObject({
              category: form.category ?? "",
              type: form.type ?? "",
              name: form.name ?? "",
              description: form.description ?? "",
              address_1: form.address_1 ?? "",
              address_2: form.address_2 ?? "",
              city: form.city ?? "",
              state: form.state ?? "",
              zip_code: form.zip_code ?? "",
              country: form.country ?? "",
              phone_number: form.phone_number ?? "",
              website: form.website ?? "",
              facebook: form.facebook ?? "",
              twitter: form.twitter ?? "",
              instagram: form.instagram ?? "",
              linkedin: form.linkedin ?? "",
              avatar: avatarUpload?.id ?? null,
              cover_photo: coverPhotoUpload?.id ?? null,
              founded_at: form.founded_at ?? null,
              video: videoUpload?.id ?? null
            })
          );
        }

        // We've now completed the basic details upload so mark them as complete in the form so we don't try them again
        // if the user has to retry because any subsequent requests failed
        const org = orgVersion?.data;
        if (org) {
          dispatch(markOrganisationFormDetailsComplete(org));
        }

        const memberSyncOutcomes: Array<SyncOutcome> = await dispatch(
          syncOrganisationFormMembers(registrationForm.pendingMembers)
        );

        const documentSyncOutcomes: Array<SyncOutcome> = await dispatch(
          syncOrganisationFormDocuments(registrationForm.uploads)
        );

        const syncErrors = [...memberSyncOutcomes, ...documentSyncOutcomes]
          .filter(result => result.outcome === "failure")
          .map(result => result.error);

        if (syncErrors.length > 0) {
          throw TSCError.combine(syncErrors);
        }

        return orgVersion ?? new OrganisationVersionRead();
      }
    });

    const dispatchResult = await dispatch(action);
    return dispatchResult.value;
  };
}

/**
 * Uses the data in an OrganisationRegistrationForm object to make the required API calls in order to add team members
 * to the user's organisation
 */
export function syncOrganisationFormDocument(
  documentType: "awards" | "documents",
  doc: PendingFile
): Thunk<Promise<SyncOutcome>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<SyncOutcome> => {
    switch (doc.type) {
      case "created": {
        try {
          const upload = await wriAPI.uploads.uploadsPost({
            uri: doc.file.uri,
            name: doc.file.name ?? `${documentType}.pdf`,
            type: doc.file.type || "application/pdf"
          });

          let uploadType: DocumentType;

          switch (documentType) {
            case "awards": {
              uploadType = "award";
              break;
            }
            case "documents": {
              uploadType = "legal";
              break;
            }
            default: {
              // eslint-disable-next-line babel/no-unused-expressions
              (documentType: empty);
              break;
            }
          }

          const createdDocVersion = await wriAPI.organisationDocuments.organisationDocumentsPost(
            OrganisationDocumentCreate.constructFromObject({
              name: doc.file.name,
              type: uploadType,
              document: upload.id
            })
          );
          const createdDoc = createdDocVersion.data;
          if (createdDoc) {
            dispatch(markOrganisationFormDocumentCreateComplete(documentType, doc, createdDoc));
          }
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(
              translate("errors.docs.create_failed", null, { name: doc.file.name ?? doc.file.uri })
            )
          };
        }
        break;
      }
      case "existing": {
        break;
      }
      case "deleted": {
        try {
          await wriAPI.organisationDocuments.organisationDocumentsIDDelete(doc.id);
          dispatch(markOrganisationFormDocumentDeleteComplete(documentType, doc));
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(
              translate("errors.docs.delete_failed", null, { name: doc.file.name ?? doc.file.uri })
            )
          };
        }
        break;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (doc.type: empty);
        break;
      }
    }
    return { outcome: "success", error: null };
  };
}

/**
 * Creates an action that when dispatched will make a request to create an organisation and setup its associated data
 * such as team members
 *
 * @return The created action
 */
export function syncOrganisationFormDocuments(uploads: OrganisationUploadQueues): Thunk<Promise<Array<SyncOutcome>>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<Array<SyncOutcome>> => {
    const syncRequests = [
      ...uploads.awards.map(doc => dispatch(syncOrganisationFormDocument("awards", doc))),
      ...uploads.documents.map(doc => dispatch(syncOrganisationFormDocument("documents", doc)))
    ];
    return await Promise.all(syncRequests);
  };
}

/**
 * Uses the data in an OrganisationRegistrationForm object to make the required API calls in order to add team members
 * to the user's organisation
 */
export function syncOrganisationFormMember(member: PendingTeamMember): Thunk<Promise<SyncOutcome>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<SyncOutcome> => {
    let upload = { id: null };

    // Upload avatar if there is one
    if (member.avatarFile) {
      try {
        upload = await wriAPI.uploads.uploadsPost({
          uri: member.avatarFile.uri,
          name: member.avatarFile.name || `avatar.jpeg`,
          type: member.avatarFile.type || "image/jpeg"
        });
      } catch (err) {
        return {
          outcome: "failure",
          error: TSCError.createFromError(err).withMessagePrefix(translate("errors.media_upload.upload_failed"))
        };
      }
    }

    switch (member.type) {
      case "created_user": {
        try {
          const createdUser = await wriAPI.users.usersInvitePost(member.data);
          dispatch(markOrganisationFormUserUpdateComplete(member, createdUser));
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(
              translate("errors.user.invite_failed", null, { email: member.data.email_address ?? "" })
            )
          };
        }
        break;
      }
      case "created_member": {
        try {
          const createdMember = await wriAPI.teamMembers.teamMembersPost(
            TeamMemberCreate.constructFromObject({
              ...member.data,
              avatar: upload.id
            })
          );
          dispatch(markOrganisationFormMemberUpdateComplete(member, createdMember));
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(translate("errors.team_member.create_failed"))
          };
        }
        break;
      }
      case "existing_member": {
        try {
          const memberId = member.base.id;
          // Existing members might either get deleted or patched (or nothing) - check which
          if (!memberId) {
            console.warn("3SC", "Cannot update existing member without an ID");
          } else if (member.isDeleted) {
            await wriAPI.teamMembers.teamMembersIDDelete(memberId);
            dispatch(markOrganisationFormMemberDeleteComplete(member));
          } else {
            const hasPatchData = Object.values(member.data).some(value => value !== undefined);
            if (hasPatchData || upload.id) {
              const updatedMember = await wriAPI.teamMembers.teamMembersIDPatch(
                memberId,
                TeamMemberUpdate.constructFromObject({
                  ...member.data,
                  avatar: upload.id ? upload.id : undefined
                })
              );
              dispatch(markOrganisationFormMemberUpdateComplete(member, updatedMember));
            }
          }
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(translate("errors.team_member.update_failed"))
          };
        }
        break;
      }
      case "existing_user": {
        try {
          const userId = member.base.id;
          // Existing members might either get deleted or patched (or nothing) - check which
          if (!userId) {
            console.warn("3SC", "Cannot update existing user without an ID");
          } else if (member.isDeleted) {
            // TODO: Cannot yet delete users
            console.warn("3SC", "User deletion yet to be implemented");
          } else {
            const hasPatchData = Object.values(member.data).some(value => value !== undefined);
            if (hasPatchData || upload.id) {
              const updatedUser = await wriAPI.users.usersIDPatch(
                userId,
                UserUpdate.constructFromObject({
                  ...member.data,
                  avatar: upload.id ? upload.id : undefined
                })
              );
              dispatch(markOrganisationFormUserUpdateComplete(member, updatedUser));
            }
          }
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(translate("errors.user.update_failed"))
          };
        }
        break;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (member.type: empty);
        break;
      }
    }
    return { outcome: "success", error: null };
  };
}

/**
 * Creates an action that when dispatched will make a request to create an organisation and setup its associated data
 * such as team members
 *
 * @return The created action
 */
export function syncOrganisationFormMembers(members: Array<PendingTeamMember>): Thunk<Promise<Array<SyncOutcome>>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<Array<SyncOutcome>> => {
    const syncRequests = members.map(member => dispatch(syncOrganisationFormMember(member)));
    return await Promise.all(syncRequests);
  };
}

/**
 * Creates an action that when dispatched will update the registration form stored locally so that the user can resume
 * it
 *
 * @return The created action
 */
export function updateOrganisationFormDetails(
  organisation: $Shape<OrganisationCreate>
): UpdateOrganisationFormDetailsAction {
  return {
    type: "wri/organisations/registration_form/details/update",
    payload: organisation
  };
}

export function updateOrganisationFormTeamMember(
  itemId: number,
  updates: $Shape<TeamMemberUpdate>,
  avatarFile: ?File
): UpdateOrganisationFormMemberAction {
  return {
    type: "wri/organisations/registration_form/member/update",
    payload: {
      pendingMemberId: itemId,
      data: updates,
      avatarFile: avatarFile
    }
  };
}

export function updateOrganisationFormUser(
  itemId: number,
  updates: $Shape<UserUpdate>,
  avatarFile: ?File
): UpdateOrganisationFormUserAction {
  return {
    type: "wri/organisations/registration_form/user/update",
    payload: {
      pendingMemberId: itemId,
      data: updates,
      avatarFile: avatarFile
    }
  };
}
