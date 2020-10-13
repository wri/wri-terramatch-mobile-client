// @flow

import type {
  PendingCarbonCertification,
  PendingPitchContact,
  PendingRestorationMethodMetric,
  PendingTreeSpecies,
  PitchData,
  PitchRegistrationForm
} from "./index";
import type { File, PendingFile, PendingFileList } from "../../../utils/models.types";
import type { Dispatch, GetState, NamedAsyncAction, Thunk } from "../../redux.types";
import diff from "deep-diff";
import {
  CarbonCertificationCreate,
  CarbonCertificationRead,
  CarbonCertificationVersionReadAll,
  DraftCreate,
  DraftRead,
  DraftUpdate,
  DraftUpdateInner,
  FilterCondition,
  OfferRead,
  PitchContactCreate,
  PitchContactRead,
  PitchContactReadAll,
  PitchDocumentCreate,
  PitchDocumentRead,
  PitchDocumentVersionReadAll,
  PitchVersionRead,
  PitchVersionReadAll,
  PitchCreate,
  PitchRead,
  PitchReadAll,
  PitchUpdate,
  RestorationMethodMetricRead,
  RestorationMethodMetricCreate,
  RestorationMethodMetricUpdate,
  RestorationMethodMetricVersionReadAll,
  TreeSpeciesCreate,
  TreeSpeciesRead,
  TreeSpeciesVersionReadAll
} from "wri-api";
import wriAPI from "../../../api/wri";
import { createAsyncAction } from "../../conditionalActions";
import TSCError from "../../../utils/tscError";
import { errorCodes, errorDomains } from "../../../constants/errorMessaging";
import {
  createCompletePitchModel,
  createPitchDraftFromForm,
  findMostRecentPitchVersion,
  syncProjectMediaToApi
} from "../../../api/wri/helpers";
import { fetchMyOrganisationData } from "../organisations/actions";
import { inspectPitchData } from "../cache/actions";
import translate, { translateRestorationMethod } from "../../../locales";
import convertDeepDiffToJsonPatch from "../../../utils/convertDeepDiffToJsonPatch";
import { handleMissingDraftError } from "../helpers";

export type CreatePitchRegistrationFormAction = {|
  +type: "wri/pitches/registration_form/create",
  +payload: {|
    +base?: ?PitchData,
    +draft?: ?DraftRead,
    +isDraft?: ?boolean
  |},
  +meta: {|
    +formId: string
  |}
|};
export type CreatePitchAction = NamedAsyncAction<"wri/pitches/create", number>;

export type CreatePitchCarbonCertificateAction = {|
  +type: "wri/pitches/registration_form/carbon/create",
  +payload: CarbonCertificationCreate,
  +meta: {|
    +formId: string
  |}
|};
export type CreatePitchContactAction = {|
  +type: "wri/pitches/registration_form/contacts/create",
  +payload: PitchContactCreate,
  +meta: {|
    +formId: string
  |}
|};

export type CreatePitchTreeSpeciesAction = {|
  +type: "wri/pitches/registration_form/species/create",
  +payload: TreeSpeciesCreate,
  +meta: {|
    +formId: string
  |}
|};
export type CreatePitchUploadAction = {|
  +type: "wri/pitches/registration_form/uploads/create",
  +payload: {
    +type: PitchUploadTypes,
    +file: ?File
  },
  +meta: {|
    +formId: string
  |}
|};
export type DeletePitchRegistrationFormAction = {|
  +type: "wri/pitches/registration_form/delete",
  +payload: null,
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormCertificationCreateCompleteAction = {|
  +type: "wri/pitches/registration_form/carbon/create/complete",
  +payload: {|
    +request: PendingCarbonCertification,
    +result: CarbonCertificationRead
  |},
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormCertificationDeleteCompleteAction = {|
  +type: "wri/pitches/registration_form/carbon/remove/complete",
  +payload: {|
    +request: PendingCarbonCertification
  |},
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormDetailsCompleteAction = {|
  +type: "wri/pitches/registration_form/details/update/complete",
  +payload: PitchRead,
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormContactCreateCompleteAction = {|
  +type: "wri/pitches/registration_form/contacts/create/complete",
  +payload: {|
    +request: PendingPitchContact,
    +result: PitchContactRead
  |},
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormContactDeleteCompleteAction = {|
  +type: "wri/pitches/registration_form/contacts/remove/complete",
  +payload: {|
    +request: PendingPitchContact
  |},
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormDocumentCreateCompleteAction = {|
  +type: "wri/pitches/registration_form/uploads/create/complete",
  +payload: {|
    +type: "documents",
    +request: PendingFile,
    +result: PitchDocumentRead
  |},
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormDocumentDeleteCompleteAction = {|
  +type: "wri/pitches/registration_form/uploads/remove/complete",
  +payload: {|
    +type: "documents",
    +request: PendingFile
  |},
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormMetricUpdateCompleteAction = {|
  +type: "wri/pitches/registration_form/metrics/update/complete",
  +payload: {|
    +result: RestorationMethodMetricRead
  |},
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormSpeciesCreateCompleteAction = {|
  +type: "wri/pitches/registration_form/species/create/complete",
  +payload: {|
    +request: PendingTreeSpecies,
    +result: TreeSpeciesRead
  |},
  +meta: {|
    +formId: string
  |}
|};
export type MarkPitchFormSpeciesDeleteCompleteAction = {|
  +type: "wri/pitches/registration_form/species/remove/complete",
  +payload: {|
    +request: PendingTreeSpecies
  |},
  +meta: {|
    +formId: string
  |}
|};
export type RemovePitchCarbonCertificateAction = {|
  +type: "wri/pitches/registration_form/carbon/remove",
  +payload: {|
    +item: PendingCarbonCertification
  |},
  +meta: {|
    +formId: string
  |}
|};
export type RemovePitchContactAction = {|
  +type: "wri/pitches/registration_form/contacts/remove",
  +payload: {|
    +item: PendingPitchContact
  |},
  +meta: {|
    +formId: string
  |}
|};
export type RemovePitchUploadAction = {|
  +type: "wri/pitches/registration_form/uploads/remove",
  +payload: {
    +type: "documents",
    +item: PendingFile
  },
  +meta: {|
    +formId: string
  |}
|};
export type RemovePitchTreeSpeciesAction = {|
  +type: "wri/pitches/registration_form/species/remove",
  +payload: {|
    +item: PendingTreeSpecies
  |},
  +meta: {|
    +formId: string
  |}
|};
export type SavePitchFormAsDraftAction = NamedAsyncAction<"wri/pitches/registration_form/draft/save", DraftRead>;
export type SearchPitchesAction = NamedAsyncAction<"wri/pitches/search", PitchReadAll>;
export type UpdatePitchFormDetailsAction = {|
  +type: "wri/pitches/registration_form/details/update",
  +payload: $Shape<PitchCreate>,
  +meta: {|
    +formId: string
  |}
|};
export type UpdatePitchRestorationMethodMetricsAction = {|
  +type: "wri/pitches/registration_form/metrics/update",
  +payload: {|
    method: string,
    data: $Shape<RestorationMethodMetricUpdate>
  |},
  +meta: {|
    +formId: string
  |}
|};
export type UpdateSortOptionsAction = {|
  +type: "wri/pitches/options/update",
  +payload: SortAttributeEnum
|};
export type UpdateFilteredOfferSearchAction = {|
  +type: "wri/pitches/filteredOffer/update",
  +payload: OfferRead
|};
export type UpdateFilterSearchAction = {|
  +type: "wri/pitches/filter/update",
  +payload: Array<FilterCondition>
|};

export type PitchUploadQueues = {|
  +coverPhoto: ?File,
  +documents: PendingFileList,
  +video: ?File,
  +videoIntroduction: ?File,
  +videoGoals: ?File,
  +videoSignificance: ?File
|};

export type PitchUploadTypes = $Keys<PitchUploadQueues>;

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
 * Creates a Redux action that when dispatched will prepare Redux state in order to create or edit a pitch.
 *
 * If a pitch is being edited, then this thunk will make sure we are in a state where we have all the necessary data needed
 * to actually edit.
 */
export function createPitchRegistrationForm(formId: string, pitchIdToEdit: ?number): Thunk<Promise<void>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<void> => {
    let base: ?PitchData = null;

    if (pitchIdToEdit) {
      const appState = getState();

      // Before we start editing let's make sure we have all the base data we need to edit
      const cachedCertifications = appState.wriCache.pitchCertificationVersions.data;
      const cachedContacts = appState.wriCache.pitchContacts.data;
      const cachedDocuments = appState.wriCache.pitchDocumentVersions.data;
      const cachedMetrics = appState.wriCache.pitchMetricVersions.data;
      const cachedTreeSpecies = appState.wriCache.pitchTreeSpeciesVersions.data;
      const cachedVersions = appState.wriCache.pitchVersions.data;

      const certificationsRequest: Promise<CarbonCertificationVersionReadAll> = cachedCertifications
        ? Promise.resolve(cachedCertifications)
        : wriAPI.carbonCertifications.pitchesIDCarbonCertificationsInspectGet(pitchIdToEdit);
      const contactsRequest: Promise<PitchContactReadAll> = cachedContacts
        ? Promise.resolve(cachedContacts)
        : wriAPI.pitchContacts.pitchesIDPitchContactsGet(pitchIdToEdit);
      const documentsRequest: Promise<PitchDocumentVersionReadAll> = cachedDocuments
        ? Promise.resolve(cachedDocuments)
        : wriAPI.pitchDocuments.pitchesIDPitchDocumentsInspectGet(pitchIdToEdit);
      const metricsRequest: Promise<RestorationMethodMetricVersionReadAll> = cachedMetrics
        ? Promise.resolve(cachedMetrics)
        : wriAPI.restorationMethodMetrics.pitchesIDRestorationMethodMetricsInspectGet(pitchIdToEdit);
      const treeSpeciesRequest: Promise<TreeSpeciesVersionReadAll> = cachedTreeSpecies
        ? Promise.resolve(cachedTreeSpecies)
        : wriAPI.treeSpecies.pitchesIDTreeSpeciesInspectGet(pitchIdToEdit);
      const versionsRequest: Promise<PitchVersionReadAll> = cachedVersions
        ? Promise.resolve(cachedVersions)
        : wriAPI.pitchVersions.pitchesIDPitchVersionsGet(pitchIdToEdit);

      const [certifications, contacts, documents, metrics, treeSpecies, versions] = await Promise.all([
        certificationsRequest,
        contactsRequest,
        documentsRequest,
        metricsRequest,
        treeSpeciesRequest,
        versionsRequest
      ]);

      const mostRecentVersion = findMostRecentPitchVersion(versions);
      base = {
        certificate: certifications.map(version => version.data ?? new CarbonCertificationRead()),
        contacts: contacts,
        details: mostRecentVersion?.data ?? new PitchRead(),
        documents: documents.map(version => version.data ?? new PitchDocumentRead()),
        metrics: metrics.map(version => version.data ?? new RestorationMethodMetricRead()),
        species: treeSpecies.map(version => version.data ?? new TreeSpeciesRead())
      };
    }

    dispatch({
      type: "wri/pitches/registration_form/create",
      payload: {
        base: base
      },
      meta: {
        formId: formId
      }
    });
  };
}

/**
 * Creates an action that when dispatched will update the registration form stored locally so that the project can resume
 *
 * @return The created action
 */
export function createCarbonCertificate(
  formId: string,
  certificate: CarbonCertificationCreate
): CreatePitchCarbonCertificateAction {
  return {
    type: "wri/pitches/registration_form/carbon/create",
    payload: certificate,
    meta: {
      formId: formId
    }
  };
}

export function createPitchContacts(formId: string, contact: PitchContactCreate): CreatePitchContactAction {
  return {
    type: "wri/pitches/registration_form/contacts/create",
    payload: contact,
    meta: {
      formId: formId
    }
  };
}

export function createPitchUpload(formId: string, type: PitchUploadTypes, file: ?File): CreatePitchUploadAction {
  return {
    type: "wri/pitches/registration_form/uploads/create",
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
 * Creates an action that when dispatched will update the registration form stored locally so that the project can resume
 * it
 *
 * @return The created action
 */
export function createTreeSpecies(formId: string, specie: TreeSpeciesCreate): CreatePitchTreeSpeciesAction {
  return {
    type: "wri/pitches/registration_form/species/create",
    payload: specie,
    meta: {
      formId: formId
    }
  };
}

export function deletePitchRegistrationForm(formId: string): DeletePitchRegistrationFormAction {
  return {
    type: "wri/pitches/registration_form/delete",
    payload: null,
    meta: {
      formId: formId
    }
  };
}

export function markPitchFormDetailsComplete(formId: string, result: PitchRead): MarkPitchFormDetailsCompleteAction {
  return {
    type: "wri/pitches/registration_form/details/update/complete",
    payload: result,
    meta: {
      formId: formId
    }
  };
}

export function markPitchFormCertificateCreateComplete(
  formId: string,
  request: PendingCarbonCertification,
  result: CarbonCertificationRead
): MarkPitchFormCertificationCreateCompleteAction {
  return {
    type: "wri/pitches/registration_form/carbon/create/complete",
    payload: {
      request: request,
      result: result
    },
    meta: {
      formId: formId
    }
  };
}

export function markPitchFormCertificateDeleteComplete(
  formId: string,
  request: PendingCarbonCertification
): MarkPitchFormCertificationDeleteCompleteAction {
  return {
    type: "wri/pitches/registration_form/carbon/remove/complete",
    payload: {
      request: request
    },
    meta: {
      formId: formId
    }
  };
}

export function markPitchFormContactCreateComplete(
  formId: string,
  request: PendingPitchContact,
  result: PitchContactRead
): MarkPitchFormContactCreateCompleteAction {
  return {
    type: "wri/pitches/registration_form/contacts/create/complete",
    payload: {
      request: request,
      result: result
    },
    meta: {
      formId: formId
    }
  };
}

export function markPitchFormContactDeleteComplete(
  formId: string,
  request: PendingPitchContact
): MarkPitchFormContactDeleteCompleteAction {
  return {
    type: "wri/pitches/registration_form/contacts/remove/complete",
    payload: {
      request: request
    },
    meta: {
      formId: formId
    }
  };
}

/**
 * Action that when dispatched will mark the specified document as having been created successfully, so that it can be
 * removed the form
 */
export function markPitchFormDocumentCreateComplete(
  formId: string,
  request: PendingFile,
  result: PitchDocumentRead
): MarkPitchFormDocumentCreateCompleteAction {
  return {
    type: "wri/pitches/registration_form/uploads/create/complete",
    payload: {
      type: "documents",
      request: request,
      result: result
    },
    meta: {
      formId: formId
    }
  };
}

/**
 * Action that when dispatched will mark the specified document as having been deleted successfully, so that it can be
 * removed the form
 */
export function markPitchFormDocumentDeleteComplete(
  formId: string,
  request: PendingFile
): MarkPitchFormDocumentDeleteCompleteAction {
  return {
    type: "wri/pitches/registration_form/uploads/remove/complete",
    payload: {
      type: "documents",
      request: request
    },
    meta: {
      formId: formId
    }
  };
}

export function markPitchFormMetricUpdateComplete(
  formId: string,
  result: RestorationMethodMetricRead
): MarkPitchFormMetricUpdateCompleteAction {
  return {
    type: "wri/pitches/registration_form/metrics/update/complete",
    payload: {
      result: result
    },
    meta: {
      formId: formId
    }
  };
}

export function markPitchFormSpeciesCreateComplete(
  formId: string,
  request: PendingTreeSpecies,
  result: TreeSpeciesRead
): MarkPitchFormSpeciesCreateCompleteAction {
  return {
    type: "wri/pitches/registration_form/species/create/complete",
    payload: {
      request: request,
      result: result
    },
    meta: {
      formId: formId
    }
  };
}

export function markPitchFormSpeciesDeleteComplete(
  formId: string,
  request: PendingTreeSpecies
): MarkPitchFormSpeciesDeleteCompleteAction {
  return {
    type: "wri/pitches/registration_form/species/remove/complete",
    payload: {
      request: request
    },
    meta: {
      formId: formId
    }
  };
}

export function removeCarbonCertificate(
  formId: string,
  item: PendingCarbonCertification
): RemovePitchCarbonCertificateAction {
  return {
    type: "wri/pitches/registration_form/carbon/remove",
    payload: {
      item: item
    },
    meta: {
      formId: formId
    }
  };
}

export function removeTreeSpecie(formId: string, item: PendingTreeSpecies): RemovePitchTreeSpeciesAction {
  return {
    type: "wri/pitches/registration_form/species/remove",
    payload: {
      item: item
    },
    meta: {
      formId: formId
    }
  };
}

export function removePitchContact(formId: string, item: PendingPitchContact): RemovePitchContactAction {
  return {
    type: "wri/pitches/registration_form/contacts/remove",
    payload: {
      item: item
    },
    meta: {
      formId: formId
    }
  };
}

export function removePitchUpload(formId: string, type: "documents", file: PendingFile): RemovePitchUploadAction {
  return {
    type: "wri/pitches/registration_form/uploads/remove",
    payload: {
      type: type,
      item: file
    },
    meta: {
      formId: formId
    }
  };
}

/**
 * Sync pending media and documents the user has selected while completing the pitch form, so that they are stored on
 * the server (with an associated upload ID). Update Redux state with the upload ID once completed.
 */
function syncPitchFormUploads(formId: string): Thunk<Promise<PitchRegistrationForm>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<PitchRegistrationForm> => {
    const appState = getState();
    const registrationForm = appState.wri.pitches.registrationForm[formId];

    const uploadDefinitions = [
      {
        uploadType: "coverPhoto",
        file:
          registrationForm.uploads.coverPhoto?.uri &&
          !registrationForm.uploads.coverPhoto.uri.startsWith("http") &&
          !registrationForm.uploads.coverPhoto.uploadId
            ? {
                uri: registrationForm.uploads.coverPhoto?.uri,
                name: "photo.jpg",
                type: registrationForm.uploads.coverPhoto?.type || "image/jpeg"
              }
            : null,
        modelKey: "cover_photo"
      },
      {
        uploadType: "video",
        file:
          registrationForm.uploads.video?.uri &&
          !registrationForm.uploads.video.uri.startsWith("http") &&
          !registrationForm.uploads.video.uploadId
            ? {
                uri: registrationForm.uploads.video?.uri,
                name: "video.mp4",
                type: registrationForm.uploads.video?.type || "video/mp4"
              }
            : null,
        modelKey: "video"
      },
      ...registrationForm.uploads.documents
        .filter(pendingItem => pendingItem.type === "created")
        .map(pendingItem => ({
          uploadType: "documents",
          file:
            pendingItem.file?.uri && !pendingItem.file.uri.startsWith("http") && !pendingItem.file.uploadId
              ? {
                  uri: pendingItem.file.uri,
                  name: pendingItem.file.name ?? `doc.pdf`,
                  type: pendingItem.file.type || "application/pdf"
                }
              : null
        }))
    ];

    const uploadRequests = uploadDefinitions.map(upload =>
      upload.file ? wriAPI.uploads.uploadsPost(upload.file) : Promise.resolve(null)
    );
    const uploadResponses = await Promise.all(uploadRequests);

    uploadDefinitions.forEach((upload, idx) => {
      const response = uploadResponses[idx];
      if (response) {
        const uploadId = response.id;
        dispatch(
          createPitchUpload(formId, upload.uploadType, {
            ...upload.file,
            uploadId: uploadId
          })
        );
        if (upload.modelKey) {
          dispatch(
            updatePitchFormDetails(formId, {
              [upload.modelKey]: uploadId
            })
          );
        }
      }
    });

    const updatedState = getState();
    return updatedState.wri.pitches.registrationForm[formId];
  };
}

/**
 * Syncs pitch data held locally to a draft stored in the API, so it can be shared with others
 */
export function syncPitchFormAsDraft(formId: string): Thunk<Promise<?DraftRead>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<?DraftRead> => {
    const appState = getState();
    let registrationForm = appState.wri.pitches.registrationForm[formId];
    const isEdit = !!registrationForm.base;
    const draftAsyncState = registrationForm.draftState;
    const draftName = registrationForm.details.name;

    if (isEdit || !draftAsyncState || draftAsyncState.isFetching || !draftName) {
      return null;
    }

    const action: SavePitchFormAsDraftAction = createAsyncAction({
      type: "wri/pitches/registration_form/draft/save",
      meta: {
        cacheKey: formId
      },
      payload: async (): Promise<DraftRead> => {
        // Get the existing draft, or create one if none exists
        let existingDraft: ?DraftRead = draftAsyncState.data;

        if (!existingDraft) {
          existingDraft = await wriAPI.drafts.draftsPost(
            DraftCreate.constructFromObject({
              type: "pitch",
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

        registrationForm = await dispatch(syncPitchFormUploads(formId));

        // Output the existing form state as a DraftRead object
        const updatedDraftData = createPitchDraftFromForm(registrationForm);

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
      handleMissingDraftError(dispatch, formId, "pitch", err);
      throw err;
    }
  };
}

/**
 * Creates an action that when dispatched will make a request to create a pitch and setup its associated data
 * such as tree species etc.
 *
 * @return The created action
 */
export function syncPitchForm(formId: string): Thunk<Promise<number>> {
  return async (dispatch: Dispatch, getState: GetState) => {
    const appState = getState();
    const registrationForm = appState.wri.pitches.registrationForm[formId];

    const action: CreatePitchAction = createAsyncAction({
      type: "wri/pitches/create",
      payload: async () => {
        if (registrationForm.draftState) {
          const draft = await dispatch(syncPitchFormAsDraft(formId));
          const draftId = draft?.id;
          if (!draftId) {
            throw new TSCError({
              domain: errorDomains.WRI,
              code: errorCodes.WRI_UNEXPECTED_STATE,
              message: "Cannot publish pitch draft without an ID"
            });
          }
          const publishedDraft = await wriAPI.drafts.draftsIDPublishPatch(draftId);
          dispatch(fetchMyOrganisationData());
          return publishedDraft.pitch_id ?? 0;
        }

        const form = registrationForm.details;

        // eslint-disable-next-line no-unused-vars
        const [coverPhotoUpload, videoUpload] = await syncProjectMediaToApi(registrationForm);

        let pitchId: ?number = registrationForm.base?.details?.id;
        let updatedPitchVersion: ?PitchVersionRead = null;

        if (registrationForm.base) {
          const patchPayload = {
            ...form,
            cover_photo: coverPhotoUpload?.id ?? undefined,
            video: form.video ?? videoUpload?.id ?? undefined
          };
          const hasPatchData = Object.values(patchPayload).some(value => value !== undefined);

          // Only fire off the patch request if there is something to patch
          if (hasPatchData) {
            const existingPitchId = registrationForm.base?.details.id;

            if (!existingPitchId) {
              throw new TSCError({
                domain: errorDomains.WRI,
                code: errorCodes.WRI_UNEXPECTED_STATE,
                message: "Cannot patch pitch without an ID"
              });
            }

            updatedPitchVersion = await wriAPI.pitches.pitchesIDPatch(
              existingPitchId,
              PitchUpdate.constructFromObject(patchPayload)
            );
          }
        } else {
          updatedPitchVersion = await wriAPI.pitches.pitchesPost(
            createCompletePitchModel({
              ...form,
              video: form.video ?? videoUpload?.id
            })
          );
          pitchId = updatedPitchVersion.data?.id;
        }

        // We've now completed the basic details upload so mark them as complete in the form so we don't try them again
        // if the user has to retry because any subsequent requests failed
        if (updatedPitchVersion) {
          dispatch(fetchMyOrganisationData());
          const pitch = updatedPitchVersion.data;
          if (pitch) {
            dispatch(markPitchFormDetailsComplete(formId, pitch));
          }
        }

        if (pitchId) {
          const certificateSyncOutcomes: Array<SyncOutcome> = await dispatch(
            syncPitchFormCertificates(formId, pitchId, registrationForm.certificate)
          );
          const contactSyncOutcomes: Array<SyncOutcome> = await dispatch(
            syncPitchFormContacts(formId, pitchId, registrationForm.contacts)
          );
          const documentSyncOutcomes: Array<SyncOutcome> = await dispatch(
            syncPitchFormDocuments(formId, pitchId, registrationForm.uploads)
          );

          const restorationMethods =
            updatedPitchVersion?.data?.restoration_methods ?? registrationForm.base?.details?.restoration_methods ?? [];
          const metricsOutcomes: Array<SyncOutcome> = await dispatch(
            syncPitchFormMetrics(formId, pitchId, restorationMethods, registrationForm.metrics)
          );
          const treeSpeciesOutcomes: Array<SyncOutcome> = await dispatch(
            syncPitchFormTreeSpecies(formId, pitchId, registrationForm.species)
          );

          const syncErrors = [
            ...certificateSyncOutcomes,
            ...contactSyncOutcomes,
            ...documentSyncOutcomes,
            ...metricsOutcomes,
            ...treeSpeciesOutcomes
          ]
            .filter(result => result.outcome === "failure")
            .map(result => result.error);

          if (syncErrors.length > 0) {
            throw TSCError.combine(syncErrors);
          }

          dispatch(inspectPitchData(pitchId));
        }

        return pitchId ?? 0;
      }
    });

    const dispatchResult = await dispatch(action);
    return dispatchResult.value;
  };
}

/**
 * Make the required API calls in order to attach and remove certificates from pitches
 */
export function syncPitchFormCertificate(
  formId: string,
  pitchId: number,
  certificate: PendingCarbonCertification
): Thunk<Promise<SyncOutcome>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<SyncOutcome> => {
    switch (certificate.type) {
      case "created": {
        try {
          const createdCertificate = await wriAPI.carbonCertifications.carbonCertificationsPost(
            CarbonCertificationCreate.constructFromObject({
              ...certificate.data,
              pitch_id: pitchId
            })
          );
          dispatch(markPitchFormCertificateCreateComplete(formId, certificate, createdCertificate));
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(
              translate("errors.carbon.create_failed", null, { name: certificate.data.link ?? "" })
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
          const certificateId = certificate.data.id;
          if (certificateId) {
            await wriAPI.carbonCertifications.carbonCertificationsIDDelete(certificateId);
          }
          dispatch(markPitchFormCertificateDeleteComplete(formId, certificate));
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(
              translate("errors.carbon.delete_failed", null, { name: certificate.data.link ?? "" })
            )
          };
        }
        break;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (certificate.type: empty);
        break;
      }
    }
    return { outcome: "success", error: null };
  };
}

/**
 * Creates an action that when dispatched will make a request to upload and attach all the pitch's pending certificates
 *
 * @return The created action
 */
export function syncPitchFormCertificates(
  formId: string,
  pitchId: number,
  contacts: Array<PendingCarbonCertification>
): Thunk<Promise<Array<SyncOutcome>>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<Array<SyncOutcome>> => {
    const syncRequests = contacts.map(contact => dispatch(syncPitchFormCertificate(formId, pitchId, contact)));
    return await Promise.all(syncRequests);
  };
}

/**
 * Make the required API calls in order to attach and remove contacts from pitchs
 */
export function syncPitchFormContact(
  formId: string,
  pitchId: number,
  contact: PendingPitchContact
): Thunk<Promise<SyncOutcome>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<SyncOutcome> => {
    switch (contact.type) {
      case "created": {
        try {
          const createdContact = await wriAPI.pitchContacts.pitchContactsPost(
            PitchContactCreate.constructFromObject({
              ...contact.data,
              pitch_id: pitchId
            })
          );
          dispatch(markPitchFormContactCreateComplete(formId, contact, createdContact));
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
            await wriAPI.pitchContacts.pitchContactsIDDelete(contactId);
          }
          dispatch(markPitchFormContactDeleteComplete(formId, contact));
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
 * Creates an action that when dispatched will make a request to upload and attach all the pitch's pending contacts
 *
 * @return The created action
 */
export function syncPitchFormContacts(
  formId: string,
  pitchId: number,
  contacts: Array<PendingPitchContact>
): Thunk<Promise<Array<SyncOutcome>>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<Array<SyncOutcome>> => {
    const syncRequests = contacts.map(contact => dispatch(syncPitchFormContact(formId, pitchId, contact)));
    return await Promise.all(syncRequests);
  };
}

/**
 * Make the required API calls in order to attach and remove documents from pitches
 */
export function syncPitchFormDocument(formId: string, pitchId: number, doc: PendingFile): Thunk<Promise<SyncOutcome>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<SyncOutcome> => {
    switch (doc.type) {
      case "created": {
        try {
          const upload = await wriAPI.uploads.uploadsPost({
            uri: doc.file.uri,
            name: doc.file.name ?? `doc.pdf`,
            type: doc.file.type || "application/pdf"
          });

          const createdDocVersion = await wriAPI.pitchDocuments.pitchDocumentsPost(
            PitchDocumentCreate.constructFromObject({
              pitch_id: pitchId,
              name: doc.file.name,
              type: "legal",
              document: upload.id
            })
          );
          const createdDoc = createdDocVersion.data;
          if (createdDoc) {
            dispatch(markPitchFormDocumentCreateComplete(formId, doc, createdDoc));
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
          await wriAPI.pitchDocuments.pitchDocumentsIDDelete(doc.id);
          dispatch(markPitchFormDocumentDeleteComplete(formId, doc));
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
 * Creates an action that when dispatched will make a request to upload and attach all the pitch's pending documents
 *
 * @return The created action
 */
export function syncPitchFormDocuments(
  formId: string,
  pitchId: number,
  uploads: PitchUploadQueues
): Thunk<Promise<Array<SyncOutcome>>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<Array<SyncOutcome>> => {
    const syncRequests = uploads.documents.map(doc => dispatch(syncPitchFormDocument(formId, pitchId, doc)));
    return await Promise.all(syncRequests);
  };
}

/**
 * Make the required API calls in order to attach and remove metrics from pitches
 */
export function syncPitchFormMetric(
  formId: string,
  pitchId: number,
  metric: PendingRestorationMethodMetric
): Thunk<Promise<SyncOutcome>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<SyncOutcome> => {
    switch (metric.type) {
      case "created": {
        try {
          const createdMetricVersion = await wriAPI.restorationMethodMetrics.restorationMethodMetricsPost(
            RestorationMethodMetricCreate.constructFromObject({
              ...metric.data,
              pitch_id: pitchId
            })
          );
          const createdMetric = createdMetricVersion.data;
          if (createdMetric) {
            dispatch(markPitchFormMetricUpdateComplete(formId, createdMetric));
          }
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(
              translate("errors.restoration_metrics.create_failed", null, {
                name: translateRestorationMethod(metric.data.restoration_method)
              })
            )
          };
        }
        break;
      }
      case "existing": {
        try {
          const hasPatchData = Object.values(metric.data).some(value => value !== undefined);
          if (hasPatchData) {
            const updatedMetricVersion = await wriAPI.restorationMethodMetrics.restorationMethodMetricsIDPatch(
              metric.id,
              metric.data
            );
            const updatedMetric = updatedMetricVersion.data;
            if (updatedMetric) {
              dispatch(markPitchFormMetricUpdateComplete(formId, updatedMetric));
            }
          }
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(
              translate("errors.restoration_metrics.update_failed", null, {
                name: translateRestorationMethod(metric.data.restoration_method)
              })
            )
          };
        }
        break;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (metric.type: empty);
        break;
      }
    }
    return { outcome: "success", error: null };
  };
}

/**
 * Creates an action that when dispatched will make a request to upload and attach all the pitch's pending documents
 *
 * @return The created action
 */
export function syncPitchFormMetrics(
  formId: string,
  pitchId: number,
  methods: Array<string>,
  metrics: { [string]: PendingRestorationMethodMetric }
): Thunk<Promise<Array<SyncOutcome>>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<Array<SyncOutcome>> => {
    const syncRequests: Array<Promise<SyncOutcome>> = methods.map(method => {
      const metric = metrics[method];
      if (metric) {
        return dispatch(syncPitchFormMetric(formId, pitchId, metric));
      }
      // If we get here we've messed something up, and there's no metric for the user's chosen method
      return Promise.resolve({
        outcome: "failure",
        error: new TSCError({
          domain: errorDomains.WRI,
          code: errorCodes.WRI_UNEXPECTED_STATE,
          message: `No metrics found for ${translateRestorationMethod(metric.data.restoration_method)}.`
        })
      });
    });
    return await Promise.all(syncRequests);
  };
}

/**
 * Make the required API calls in order to attach and remove tree species from pitches
 */
export function syncPitchFormTreeSpecie(
  formId: string,
  pitchId: number,
  species: PendingTreeSpecies
): Thunk<Promise<SyncOutcome>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<SyncOutcome> => {
    switch (species.type) {
      case "created": {
        try {
          const createdSpeciesVersion = await wriAPI.treeSpecies.treeSpeciesPost(
            TreeSpeciesCreate.constructFromObject({ ...species.data, pitch_id: pitchId })
          );
          const createdSpecies = createdSpeciesVersion.data;
          if (createdSpecies) {
            dispatch(markPitchFormSpeciesCreateComplete(formId, species, createdSpecies));
          }
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(
              translate("errors.tree_species.create_failed", null, {
                name: species.data.name ?? ""
              })
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
          const speciesId = species.data.id;
          if (speciesId) {
            await wriAPI.treeSpecies.treeSpeciesIDDelete(speciesId);
          }
          dispatch(markPitchFormSpeciesDeleteComplete(formId, species));
        } catch (err) {
          return {
            outcome: "failure",
            error: TSCError.createFromError(err).withMessagePrefix(
              translate("errors.tree_species.delete_failed", null, {
                name: species.data.name ?? ""
              })
            )
          };
        }
        break;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (species.type: empty);
        break;
      }
    }
    return { outcome: "success", error: null };
  };
}

/**
 * Creates an action that when dispatched will make a request to upload and attach all the pitch's pending documents
 *
 * @return The created action
 */
export function syncPitchFormTreeSpecies(
  formId: string,
  pitchId: number,
  species: Array<PendingTreeSpecies>
): Thunk<Promise<Array<SyncOutcome>>> {
  return async (dispatch: Dispatch, getState: GetState): Promise<Array<SyncOutcome>> => {
    const syncRequests = species.map(specie => dispatch(syncPitchFormTreeSpecie(formId, pitchId, specie)));
    return await Promise.all(syncRequests);
  };
}

/**
 * Creates an action that when dispatched will update the sort by option
 *
 * @return The created action
 */
export function updateSortOption(option: SortAttributeEnum): UpdateSortOptionsAction {
  return {
    type: "wri/pitches/options/update",
    payload: option
  };
}
/**
 * Creates an action that when dispatched will update the filtered offer
 *
 * @return The created action
 */
export function updateFilteredOfferSearch(offer: OfferRead): UpdateFilteredOfferSearchAction {
  return {
    type: "wri/pitches/filteredOffer/update",
    payload: offer
  };
}

/**
 * Creates an action that when dispatched will update the registration form stored locally so that the project can resume
 * it
 *
 * @return The created action
 */
export function updatePitchFormDetails(formId: string, project: $Shape<PitchCreate>): UpdatePitchFormDetailsAction {
  return {
    type: "wri/pitches/registration_form/details/update",
    payload: project,
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
export function updateRestorationMethodMetric(
  formId: string,
  method: string,
  metric: $Shape<RestorationMethodMetricUpdate>
): UpdatePitchRestorationMethodMetricsAction {
  return {
    type: "wri/pitches/registration_form/metrics/update",
    payload: {
      method: method,
      data: metric
    },
    meta: {
      formId: formId
    }
  };
}

export function updateSearchFilter(option: Array<FilterCondition>): UpdateFilterSearchAction {
  return {
    type: "wri/pitches/filter/update",
    payload: option
  };
}
