// @flow

import type { OfferData, OfferRegistrationForm, PendingOfferContact } from "./index";
import type { File, PendingFileList } from "../../../utils/models.types";
import type { Dispatch, GetState, NamedAsyncAction, Thunk } from "../../redux.types";
import diff from "deep-diff";
import {
  DraftCreate,
  DraftRead,
  DraftUpdate,
  DraftUpdateInner,
  FilterCondition,
  OfferContactCreate,
  OfferContactRead,
  OfferContactReadAll,
  OfferCreate,
  OfferRead,
  OfferReadAll,
  OfferUpdate,
  PitchRead
} from "wri-api";
import wriAPI from "../../../api/wri";
import { createAsyncAction } from "../../conditionalActions";
import TSCError from "../../../utils/tscError";
import { errorCodes, errorDomains } from "../../../constants/errorMessaging";
import { fetchMyOrganisationData } from "../organisations/actions";
import { fetchOfferData } from "../cache/actions";
import { createCompleteOfferModel, createOfferDraftFromForm, syncProjectMediaToApi } from "../../../api/wri/helpers";
import translate from "../../../locales";
import convertDeepDiffToJsonPatch from "../../../utils/convertDeepDiffToJsonPatch";
import { handleMissingDraftError } from "../helpers";

export type CreateOfferRegistrationFormAction = {|
  +type: "wri/offers/registration_form/create",
  +payload: {|
    +base: ?OfferData
  |},
  +meta: {|
    +formId: string
  |}
|};
export type CreateOfferAction = NamedAsyncAction<"wri/offers/create", number>;
export type DeleteOfferRegistrationFormAction = {|
  +type: "wri/offers/registration_form/delete",
  +payload: null,
  +meta: {|
    +formId: string
  |}
|};
export type FetchOfferContactsAction = NamedAsyncAction<"wri/offers/contacts/list", OfferContactReadAll>;

export type MarkOfferFormDetailsCompleteAction = {|
  +type: "wri/offers/registration_form/details/complete",
  +payload: OfferRead,
  +meta: {|
    +formId: string
  |}
|};
export type MarkOfferFormContactCreateCompleteAction = {|
  +type: "wri/offers/registration_form/contacts/create/complete",
  +payload: {|
    +request: PendingOfferContact,
    +result: OfferContactRead
  |},
  +meta: {|
    +formId: string
  |}
|};
export type MarkOfferFormContactDeleteCompleteAction = {|
  +type: "wri/offers/registration_form/contacts/remove/complete",
  +payload: {|
    +request: PendingOfferContact
  |},
  +meta: {|
    +formId: string
  |}
|};
export type RemoveOfferContactAction = {|
  +type: "wri/offers/registration_form/contacts/remove",
  +payload: {|
    +item: PendingOfferContact
  |},
  +meta: {|
    +formId: string
  |}
|};
export type SaveOfferFormAsDraftAction = NamedAsyncAction<"wri/offers/registration_form/draft/save", DraftRead>;
export type SearchOffersAction = NamedAsyncAction<"wri/offers/search", OfferReadAll>;
export type UpdateFilterSearchAction = {|
  +type: "wri/offers/filter/update",
  +payload: Array<FilterCondition>
|};

export type UpdateFilteredPitchSearchAction = {|
  +type: "wri/offers/filteredPitch/update",
  +payload: PitchRead
|};

export type UpdateOfferContactsAction = {|
  +type: "wri/offers/registration_form/contacts/create",
  +payload: OfferContactCreate,
  +meta: {|
    +formId: string
  |}
|};

export type UpdateOfferRegistrationFormAction = {|
  +type: "wri/offers/registration_form/details/update",
  +payload: $Shape<OfferCreate>,
  +meta: {|
    +formId: string
  |}
|};
export type UpdateSortOptionsAction = {|
  +type: "wri/offers/options/update",
  +payload: SortAttributeEnum
|};

export type OfferUploadQueues = {|
  +coverPhoto: ?File,
  +documents: PendingFileList,
  +video: ?File,
  +videoIntroduction: ?File,
  +videoGoals: ?File,
  +videoSignificance: ?File
|};

export type OfferUploadTypes = $Keys<OfferUploadQueues>;
export type AddOfferUploadAction = {|
  +type: "wri/offers/registration_form/uploads/add",
  +payload: {
    +type: OfferUploadTypes,
    +file: ?File
  },
  +meta: {|
    +formId: string
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

/**
 * Creates a Redux action that when dispatched will prepare Redux state in order to create or edit an offer.
 *
 * If an offer is being edited, then this thunk will make sure we are in a state where we have all the necessary data needed
 * to actually edit.
 */
export function createOfferRegistrationForm(formId: string, offerIdToEdit: ?number): Thunk<Promise<void>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    let base: ?OfferData = null;

    if (offerIdToEdit) {
      const appState = getState();

      // Before we start editing let's make sure we have all the base data we need to edit
      const cachedContacts = appState.wriCache.offerContacts.data;
      const cachedDetails = appState.wriCache.offerDetails.data;

      const contactsRequest: Promise<OfferContactReadAll> = cachedContacts
        ? Promise.resolve(cachedContacts)
        : wriAPI.offerContacts.offersIDOfferContactsGet(offerIdToEdit);
      const detailsRequest: Promise<OfferRead> = cachedDetails
        ? Promise.resolve(cachedDetails)
        : wriAPI.offers.offersIDGet(offerIdToEdit);

      const [contacts, details] = await Promise.all([contactsRequest, detailsRequest]);

      base = {
        contacts: contacts,
        details: details
      };
    }

    dispatch({
      type: "wri/offers/registration_form/create",
      payload: {
        base: base
      },
      meta: {
        formId: formId
      }
    });
  };
}

export function deleteOfferRegistrationForm(formId: string): DeleteOfferRegistrationFormAction {
  return {
    type: "wri/offers/registration_form/delete",
    payload: null,
    meta: {
      formId: formId
    }
  };
}

/**
 * Creates an action that when dispatched will retrieve a list of contacts for the specified offer
 *
 * @return The created action
 */
export function fetchOfferContacts(offerId: number): FetchOfferContactsAction {
  return createAsyncAction({
    type: "wri/offers/contacts/list",
    payload: wriAPI.offerContacts.offersIDOfferContactsGet(offerId)
  });
}

export function markOfferFormDetailsComplete(formId: string, result: OfferRead): MarkOfferFormDetailsCompleteAction {
  return {
    type: "wri/offers/registration_form/details/complete",
    payload: result,
    meta: {
      formId: formId
    }
  };
}

export function markOfferFormContactCreateComplete(
  formId: string,
  request: PendingOfferContact,
  result: OfferContactRead
): MarkOfferFormContactCreateCompleteAction {
  return {
    type: "wri/offers/registration_form/contacts/create/complete",
    payload: {
      request: request,
      result: result
    },
    meta: {
      formId: formId
    }
  };
}

export function markOfferFormContactDeleteComplete(
  formId: string,
  request: PendingOfferContact
): MarkOfferFormContactDeleteCompleteAction {
  return {
    type: "wri/offers/registration_form/contacts/remove/complete",
    payload: {
      request: request
    },
    meta: {
      formId: formId
    }
  };
}

export function removeOfferContact(formId: string, item: PendingOfferContact): RemoveOfferContactAction {
  return {
    type: "wri/offers/registration_form/contacts/remove",
    payload: {
      item: item
    },
    meta: {
      formId: formId
    }
  };
}

/**
 * Sync pending media and documents the user has selected while completing the offer form, so that they are stored on
 * the server (with an associated upload ID). Update Redux state with the upload ID once completed.
 */
function syncOfferFormUploads(formId: string): Thunk<Promise<OfferRegistrationForm>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<OfferRegistrationForm> => {
    const appState = getState();
    const registrationForm = appState.wri.offers.registrationForm[formId];

    const coverPhotoFile = registrationForm.uploads.coverPhoto;
    if (coverPhotoFile?.uri && !coverPhotoFile.uri.startsWith("http") && !coverPhotoFile.uploadId) {
      const { id: uploadId } = await wriAPI.uploads.uploadsPost(coverPhotoFile);
      dispatch(
        createOfferUpload(formId, "coverPhoto", {
          ...coverPhotoFile,
          uploadId: uploadId
        })
      );
      dispatch(
        updateOfferFormDetails(formId, {
          cover_photo: uploadId
        })
      );
    }

    const updatedState = getState();
    return updatedState.wri.offers.registrationForm[formId];
  };
}

/**
 * Syncs offer data held locally to a draft stored in the API, so it can be shared with others
 */
export function syncOfferFormAsDraft(formId: string): Thunk<Promise<?DraftRead>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<?DraftRead> => {
    const appState = getState();
    let registrationForm = appState.wri.offers.registrationForm[formId];
    const isEdit = !!registrationForm.base;
    const draftAsyncState = registrationForm.draftState;
    const draftName = registrationForm.details.name;

    if (isEdit || !draftAsyncState || draftAsyncState.isFetching || !draftName) {
      return null;
    }

    const action: SaveOfferFormAsDraftAction = createAsyncAction({
      type: "wri/offers/registration_form/draft/save",
      meta: {
        cacheKey: formId
      },
      payload: async (): Promise<DraftRead> => {
        // Get the existing draft, or create one if none exists
        let existingDraft: ?DraftRead = draftAsyncState.data;

        if (!existingDraft) {
          existingDraft = await wriAPI.drafts.draftsPost(
            DraftCreate.constructFromObject({
              type: "offer",
              name: draftName
            })
          );
        }

        const existingDraftId = existingDraft?.id;
        if (!existingDraftId) {
          throw new TSCError({
            domain: errorDomains.WRI,
            code: errorCodes.WRI_UNEXPECTED_STATE,
            message: "Cannot patch draft without an ID"
          });
        }

        // If we previously failed for some reason... let's fetch a fresh copy of the draft so we're sure we are up to date
        existingDraft = await wriAPI.drafts.draftsIDGet(existingDraftId);

        registrationForm = await dispatch(syncOfferFormUploads(formId));

        // Output the existing form state as a DraftRead object
        const updatedDraftData = createOfferDraftFromForm(registrationForm);

        // Find the differences between the two DraftRead objects as an array of JSON Patch modifications
        const draftDiff = diff(existingDraft.data ?? {}, updatedDraftData);
        const modifications = convertDeepDiffToJsonPatch(draftDiff ?? []);

        if (modifications.length === 0) {
          return existingDraft;
        }

        const draftUpdates = modifications.map(jsonPatchOp =>
          DraftUpdateInner.constructFromObject({
            op: jsonPatchOp.op,
            path: jsonPatchOp.path,
            value: jsonPatchOp.value
          })
        );

        return await wriAPI.drafts.draftsIDPatch(existingDraftId, DraftUpdate.constructFromObject(draftUpdates));
      }
    });

    try {
      const dispatchResult = await dispatch(action);
      return dispatchResult.value;
    } catch (err) {
      handleMissingDraftError(dispatch, formId, "offer", err);
      throw err;
    }
  };
}

/**
 * Creates an action that when dispatched will make a request to create a offer and setup its associated data
 *
 * @return The created action
 */
export function syncOfferForm(formId: string): Thunk<Promise<number>> {
  return async (dispatch: Dispatch, getState: GetState) => {
    const appState = getState();
    const registrationForm = appState.wri.offers.registrationForm[formId];

    const action: CreateOfferAction = createAsyncAction({
      type: "wri/offers/create",
      payload: async () => {
        if (registrationForm.draftState) {
          const draft = await dispatch(syncOfferFormAsDraft(formId));
          const draftId = draft?.id;
          if (!draftId) {
            throw new TSCError({
              domain: errorDomains.WRI,
              code: errorCodes.WRI_UNEXPECTED_STATE,
              message: "Cannot publish offer draft without an ID"
            });
          }
          const publishedDraft = await wriAPI.drafts.draftsIDPublishPatch(draftId);
          dispatch(fetchMyOrganisationData());
          return publishedDraft.offer_id ?? 0;
        }

        const form = registrationForm.details;

        // eslint-disable-next-line no-unused-vars
        const [coverPhotoUpload, videoUpload] = await syncProjectMediaToApi(registrationForm);

        let offerId: ?number = registrationForm.base?.details?.id;
        let updatedOffer: ?OfferRead = null;

        if (registrationForm.base) {
          const patchPayload = {
            ...form,
            cover_photo: coverPhotoUpload?.id ?? undefined,
            video: videoUpload?.id ?? undefined
          };
          const hasPatchData = Object.values(patchPayload).some(value => value !== undefined);

          // Only fire off the patch request if there is something to patch
          if (hasPatchData) {
            const existingOfferId = registrationForm.base?.details.id;

            if (!existingOfferId) {
              throw new TSCError({
                domain: errorDomains.WRI,
                code: errorCodes.WRI_UNEXPECTED_STATE,
                message: "Cannot patch offer without an ID"
              });
            }

            updatedOffer = await wriAPI.offers.offersIDPatch(
              existingOfferId,
              OfferUpdate.constructFromObject(patchPayload)
            );
          }
        } else {
          updatedOffer = await wriAPI.offers.offersPost(
            createCompleteOfferModel({
              ...form,
              cover_photo: coverPhotoUpload?.id,
              video: videoUpload?.id
            })
          );
          offerId = updatedOffer.id;
        }

        // We've now completed the basic details upload so mark them as complete in the form so we don't try them again
        // if the user has to retry because any subsequent requests failed
        if (updatedOffer) {
          dispatch(fetchMyOrganisationData());
          dispatch(markOfferFormDetailsComplete(formId, updatedOffer));
        }

        if (offerId) {
          const contactSyncOutcomes: Array<SyncOutcome> = await dispatch(
            syncOfferFormContacts(formId, offerId, registrationForm.contacts)
          );

          const syncErrors = [...contactSyncOutcomes]
            .filter(result => result.outcome === "failure")
            .map(result => result.error);

          if (syncErrors.length > 0) {
            throw TSCError.combine(syncErrors);
          }

          dispatch(fetchOfferData(offerId, null));
        }

        return offerId ?? 0;
      }
    });

    const dispatchResult = await dispatch(action);
    return dispatchResult.value;
  };
}

/**
 * Make the required API calls in order to attach and remove contacts from offers
 */
export function syncOfferFormContact(
  formId: string,
  offerId: number,
  contact: PendingOfferContact
): Thunk<Promise<SyncOutcome>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<SyncOutcome> => {
    switch (contact.type) {
      case "created": {
        try {
          const createdContact = await wriAPI.offerContacts.offerContactsPost(
            OfferContactCreate.constructFromObject({
              ...contact.data,
              offer_id: offerId
            })
          );
          dispatch(markOfferFormContactCreateComplete(formId, contact, createdContact));
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(translate("errors.contacts.create_failed"))
          };
        }
        break;
      }
      case "existing": {
        break;
      }
      case "deleted": {
        try {
          const contactId = contact.data.id;
          if (contactId) {
            await wriAPI.offerContacts.offerContactsIDDelete(contactId);
          }
          dispatch(markOfferFormContactDeleteComplete(formId, contact));
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(translate("errors.contacts.delete_failed"))
          };
        }
        break;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (contact.type: empty);
        break;
      }
    }
    return { outcome: "success", error: null };
  };
}

/**
 * Creates an action that when dispatched will make a request to upload and attach all the offer's pending contacts
 *
 * @return The created action
 */
export function syncOfferFormContacts(
  formId: string,
  offerId: number,
  contacts: Array<PendingOfferContact>
): Thunk<Promise<Array<SyncOutcome>>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<Array<SyncOutcome>> => {
    const syncRequests = contacts.map(contact => dispatch(syncOfferFormContact(formId, offerId, contact)));
    return await Promise.all(syncRequests);
  };
}

export function createOfferContacts(formId: string, contact: OfferContactCreate): UpdateOfferContactsAction {
  return {
    type: "wri/offers/registration_form/contacts/create",
    payload: contact,
    meta: {
      formId: formId
    }
  };
}

/**
 * Creates an action that when dispatched will update the registration form stored locally so that the project can resume
 * it
 *
 * @return The created action
 */
export function updateOfferFormDetails(
  formId: string,
  project: $Shape<OfferCreate>
): UpdateOfferRegistrationFormAction {
  return {
    type: "wri/offers/registration_form/details/update",
    payload: project,
    meta: {
      formId: formId
    }
  };
}

/**
 * Creates an action that when dispatched will update the sort by option
 * it
 *
 * @return The created action
 */
export function updateSortOption(option: SortAttributeEnum): UpdateSortOptionsAction {
  return {
    type: "wri/offers/options/update",
    payload: option
  };
}

export function createOfferUpload(formId: string, type: OfferUploadTypes, file: ?File): AddOfferUploadAction {
  return {
    type: "wri/offers/registration_form/uploads/add",
    payload: {
      type: type,
      file: file
    },
    meta: {
      formId: formId
    }
  };
}

/**
 * Creates an action that when dispatched will update the sort by option
 * it
 *
 * @return The created action
 */
export function updateSearchFilter(filter: Array<FilterCondition>): UpdateFilterSearchAction {
  return {
    type: "wri/offers/filter/update",
    payload: filter
  };
}
/**
 * Creates an action that when dispatched will update the sort by option
 * it
 *
 * @return The created action
 */
export function updateFilteredPitchSearch(pitch: PitchRead): UpdateFilteredPitchSearchAction {
  return {
    type: "wri/offers/filteredPitch/update",
    payload: pitch
  };
}
