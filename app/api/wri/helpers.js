// @flow

import type { AppState } from "../../redux/redux.types";
import {
  CarbonCertificationRead,
  CarbonCertificationReadAll,
  CarbonCertificationVersionRead,
  CarbonCertificationVersionReadAll,
  DraftDataRead,
  DraftDataReadOffer,
  DraftDataReadPitch,
  DraftDataReadCarbonCertifications,
  DraftDataReadOfferContacts,
  DraftDataReadOfferDocuments,
  DraftDataReadRestorationMethodMetrics,
  DraftDataReadTreeSpecies,
  FilterCondition,
  OfferCreate,
  OfferRead,
  OrganisationCreate,
  OrganisationDocumentRead,
  OrganisationDocumentReadAll,
  OrganisationDocumentVersionRead,
  OrganisationDocumentVersionReadAll,
  OrganisationRead,
  OrganisationVersionRead,
  OrganisationVersionReadAll,
  PitchCreate,
  PitchDocumentRead,
  PitchDocumentReadAll,
  PitchDocumentVersionRead,
  PitchDocumentVersionReadAll,
  PitchRead,
  PitchReadAll,
  PitchVersionRead,
  PitchVersionReadAll,
  RestorationMethodMetricCreate,
  RestorationMethodMetricRead,
  RestorationMethodMetricReadAll,
  RestorationMethodMetricVersionRead,
  RestorationMethodMetricVersionReadAll,
  TreeSpeciesCreate,
  TreeSpeciesRead,
  TreeSpeciesReadAll,
  TreeSpeciesVersionRead,
  TreeSpeciesVersionReadAll,
  UploadCreate
} from "wri-api";
import _ from "lodash";
import type { OrganisationRegistrationForm } from "../../redux/wri-api/organisations";
import {
  INITIAL_PITCH_FORM,
  type PendingCarbonCertification,
  type PendingRestorationMethodMetric,
  type PendingTreeSpecies,
  type PitchRegistrationForm
} from "../../redux/wri-api/pitches";
import { INITIAL_OFFER_FORM, type OfferRegistrationForm } from "../../redux/wri-api/offers";
import type { ProjectFormProps } from "../../screens/projectForms";
import type { File, Project } from "../../utils/models.types";
import wriAPI from "./index";
import TSCError from "../../utils/tscError";
import translate from "../../locales";

/**
 * Helper function to convert CarbonCertificationRead instances to an equivalent CarbonCertificationVersionRead
 *
 * This allows us to easily re-use CarbonCertificationVersionRead-based components with CarbonCertificationRead models
 */
export function convertCertificationsToVersions(
  certifications: Array<CarbonCertificationRead> | CarbonCertificationReadAll
): CarbonCertificationVersionReadAll {
  const versions = certifications.map(certification =>
    CarbonCertificationVersionRead.constructFromObject({
      id: null,
      data: certification,
      status: "approved",
      rejected_reason_body: null,
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason: null
    })
  );
  return CarbonCertificationVersionReadAll.constructFromObject(versions);
}

/**
 * Convert a WRI document to a generic type describing a file
 */
export function convertDocumentToFile(doc: ?OrganisationDocumentRead | ?PitchDocumentRead): File {
  return {
    type: doc?.type ?? "",
    uri: doc?.document ?? "",
    name: doc?.name ?? "",
    size: null
  };
}

/**
 * Helper function to convert PendingCarbonCertification instances to an equivalent CarbonCertificationVersionRead
 *
 * This allows us to easily re-use CarbonCertificationVersionRead-based components with CarbonCertificationRead models
 */
export function convertPendingCertificationsToVersions(
  certifications: Array<PendingCarbonCertification>
): CarbonCertificationVersionReadAll {
  const versions = certifications.map(certification =>
    CarbonCertificationVersionRead.constructFromObject({
      id: null,
      data: CarbonCertificationRead.constructFromObject(certification.data),
      status: "approved",
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason_body: null,
      rejected_reason: null
    })
  );
  return CarbonCertificationVersionReadAll.constructFromObject(versions);
}

/**
 * Helper function to convert OrganisationRead instances to an equivalent OrganisationVersionRead
 *
 * This allows us to easily re-use OrganisationVersionRead-based components with OrganisationRead models
 */
export function convertOrganisationsToVersions(orgs: Array<OrganisationRead>): OrganisationVersionReadAll {
  const versions = orgs.map(org =>
    OrganisationVersionRead.constructFromObject({
      id: null,
      data: org,
      status: "approved",
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason_body: null,
      rejected_reason: null
    })
  );
  return OrganisationVersionReadAll.constructFromObject(versions);
}

/**
 * Helper function to convert OrganisationDocumentRead instances to an equivalent OrganisationDocumentVersionRead
 *
 * This allows us to easily re-use OrganisationDocumentVersionRead-based components with OrganisationDocumentRead models
 */
export function convertOrganisationDocumentsToVersions(
  docs: Array<OrganisationDocumentRead> | OrganisationDocumentReadAll
): OrganisationDocumentVersionReadAll {
  const versions = docs.map(doc =>
    OrganisationDocumentVersionRead.constructFromObject({
      id: null,
      data: doc,
      status: "approved",
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason_body: null,
      rejected_reason: null
    })
  );
  return OrganisationDocumentVersionReadAll.constructFromObject(versions);
}

/**
 * Helper function to convert PitchVersionRead instances to an equivalent PitchRead
 *
 * This allows us to easily re-use PitchRead-based components with PitchVersionRead models
 */
export function convertOrganisationDocumentVersionsToDocuments(
  versions: Array<OrganisationDocumentVersionRead> | OrganisationDocumentVersionReadAll
): OrganisationDocumentReadAll {
  const array = new OrganisationDocumentReadAll();
  versions.forEach((item, index) => {
    if (item.data) {
      array.push(item.data);
    }
  });
  return array;
}

/**
 * Helper function to convert PitchDocumentRead instances to an equivalent PitchDocumentVersionRead
 *
 * This allows us to easily re-use PitchDocumentVersionRead-based components with PitchDocumentRead models
 */
export function convertPitchDocumentsToVersions(
  docs: Array<PitchDocumentRead> | PitchDocumentReadAll
): PitchDocumentVersionReadAll {
  const versions = docs.map(doc =>
    PitchDocumentVersionRead.constructFromObject({
      id: null,
      data: doc,
      status: "approved",
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason_body: null,
      rejected_reason: null
    })
  );
  return PitchDocumentVersionReadAll.constructFromObject(versions);
}

/**
 * Helper function to convert PitchRead instances to an equivalent PitchVersionRead
 *
 * This allows us to easily re-use PitchVersionRead-based components with PitchRead models
 */
export function convertPitchesToVersions(pitches: Array<PitchRead> | PitchReadAll): PitchVersionReadAll {
  const versions = pitches.map(pitch =>
    PitchVersionRead.constructFromObject({
      id: null,
      data: pitch,
      status: "approved",
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason_body: null,
      rejected_reason: null
    })
  );
  return PitchVersionReadAll.constructFromObject(versions);
}

/**
 * Helper function to convert PitchVersionRead instances to an equivalent PitchRead
 *
 * This allows us to easily re-use PitchRead-based components with PitchVersionRead models
 */
export function convertPitchVersionsToPitches(versions: Array<PitchVersionRead> | PitchVersionReadAll): PitchReadAll {
  const array = new PitchReadAll();
  versions.forEach((item, index) => {
    if (item.data) {
      array.push(item.data);
    }
  });
  return array;
}

/**
 * Helper function to convert RestorationMethodMetricRead instances to an equivalent RestorationMethodMetricVersionRead
 *
 * This allows us to easily re-use RestorationMethodMetricVersionRead-based components with RestorationMethodMetricRead models
 */
export function convertRestorationMetricsToVersions(
  metrics: Array<RestorationMethodMetricRead> | RestorationMethodMetricReadAll
): RestorationMethodMetricVersionReadAll {
  const versions = metrics.map(metric =>
    RestorationMethodMetricVersionRead.constructFromObject({
      id: null,
      data: metric,
      status: "approved",
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason_body: null,
      rejected_reason: null
    })
  );
  return RestorationMethodMetricVersionReadAll.constructFromObject(versions);
}

/**
 * Helper function to convert RestorationMethodMetricRead instances to an equivalent RestorationMethodMetricVersionRead
 *
 * This allows us to easily re-use RestorationMethodMetricVersionRead-based components with RestorationMethodMetricRead models
 */
export function convertPendingRestorationMethodMetricToVersion(
  metrics: Array<PendingRestorationMethodMetric>
): RestorationMethodMetricVersionReadAll {
  const versions = metrics.map(metric =>
    RestorationMethodMetricVersionRead.constructFromObject({
      id: null,
      data: RestorationMethodMetricRead.constructFromObject(metric.data),
      status: "approved",
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason_body: null,
      rejected_reason: null
    })
  );
  return RestorationMethodMetricVersionReadAll.constructFromObject(versions);
}

/**
 * Helper function to convert TreeSpeciesRead instances to an equivalent TreeSpeciesVersionRead
 *
 * This allows us to easily re-use TreeSpeciesVersionRead-based components with TreeSpeciesRead models
 */
export function convertTreeSpeciesToVersions(
  species: Array<TreeSpeciesRead> | TreeSpeciesReadAll
): TreeSpeciesVersionReadAll {
  const versions = species.map(species =>
    TreeSpeciesVersionRead.constructFromObject({
      id: null,
      data: species,
      status: "approved",
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason_body: null,
      rejected_reason: null
    })
  );
  return TreeSpeciesVersionReadAll.constructFromObject(versions);
}

/**
 * Helper function to convert PendingTreeSpecies instances to an equivalent TreeSpeciesVersionRead
 *
 * This allows us to easily re-use TreeSpeciesVersionRead-based components with TreeSpeciesRead models
 */
export function convertPendingTreeSpeciesToVersions(species: Array<PendingTreeSpecies>): TreeSpeciesVersionReadAll {
  const versions = species.map(species =>
    TreeSpeciesVersionRead.constructFromObject({
      id: null,
      data: TreeSpeciesRead.constructFromObject(species.data),
      status: "approved",
      approved_rejected_at: null,
      approved_rejected_by: null,
      rejected_reason_body: null,
      rejected_reason: null
    })
  );
  return TreeSpeciesVersionReadAll.constructFromObject(versions);
}

/**
 * Creates an instance of OfferCreate with all the model's fields present (but not necessarily initialised)
 */
export function createCompleteOfferModel(details: $Shape<OfferCreate>): OfferCreate {
  return OfferCreate.constructFromObject({
    name: details.name ?? "",
    description: details.description ?? null,
    land_types: details.land_types ?? [],
    land_ownerships: details.land_ownerships ?? [],
    land_size: details.land_size ?? null,
    land_continent: details.land_continent ?? null,
    land_country: details.land_country ?? null,
    restoration_methods: details.restoration_methods ?? [],
    restoration_goals: details.restoration_goals ?? [],
    funding_sources: details.funding_sources ?? [],
    funding_amount: details.funding_amount ?? null,
    funding_bracket: details.funding_bracket ?? null,
    price_per_tree: details.price_per_tree ?? null,
    long_term_engagement: details.long_term_engagement ?? null,
    reporting_frequency: details.reporting_frequency ?? null,
    reporting_level: details.reporting_level ?? null,
    sustainable_development_goals: details.sustainable_development_goals ?? [],
    cover_photo: details.cover_photo ?? null,
    video: details.video ?? null
  });
}

/**
 * Creates a DraftDataOfferRead model corresponding to the data the user has entered in the form
 *
 * This helps us sync it up to the API
 */
export function createOfferDraftFromForm(form: OfferRegistrationForm): DraftDataRead {
  const offer = createCompleteOfferModel(form.details);

  const {
    cover_photo, // eslint-disable-line no-unused-vars
    video, // eslint-disable-line no-unused-vars
    ...draftOfferDetails
  } = offer;

  const draftData = DraftDataRead.constructFromObject({
    offer: DraftDataReadOffer.constructFromObject({
      ...draftOfferDetails,
      cover_photo: null,
      video: null
    }),
    offer_documents: [],
    offer_contacts: form.contacts
      .map(pendingItem => (pendingItem.type === "created" ? pendingItem.data : null))
      .filter(Boolean)
      .map(({ offer_id, ...rest }) => DraftDataReadOfferContacts.constructFromObject(rest))
  });

  // Attach any files to the draft. This will either be a numeric upload ID, or if already uploaded then a string
  // representing the remote file URI. We manually set these values here instead of in constructFromObject, as otherwise
  // constructFromObject will coerce cover_photo and video to always be strings, even if we supplied a numeric upload id!
  // This leads to string IDs being stored against the draft on the server, leading to validation errors
  draftData.offer.cover_photo = findProjectFileUrlOrUploadId(form.uploads.coverPhoto);
  draftData.offer.video = findProjectFileUrlOrUploadId(form.uploads.video);

  return draftData;
}

/**
 * Creates an instance of PitchCreate with all the model's fields present (but not necessarily initialised)
 */
export function createCompletePitchModel(details: $Shape<PitchCreate>): PitchCreate {
  return PitchCreate.constructFromObject({
    name: details.name ?? "",
    description: details.description ?? null,
    land_types: details.land_types ?? [],
    land_ownerships: details.land_ownerships ?? [],
    land_size: details.land_size ?? null,
    land_continent: details.land_continent ?? null,
    land_country: details.land_country ?? null,
    land_geojson: details.land_geojson ?? null,
    restoration_methods: details.restoration_methods ?? [],
    restoration_goals: details.restoration_goals ?? [],
    funding_sources: details.funding_sources ?? [],
    funding_amount: details.funding_amount ?? null,
    funding_bracket: details.funding_bracket ?? null,
    revenue_drivers: details.revenue_drivers ?? [],
    estimated_timespan: details.estimated_timespan ?? null,
    long_term_engagement: details.long_term_engagement ?? null,
    reporting_frequency: details.reporting_frequency ?? null,
    reporting_level: details.reporting_level ?? null,
    sustainable_development_goals: details.sustainable_development_goals ?? [],
    cover_photo: details.cover_photo ?? null,
    video: details.video ?? null,
    problem: details.problem ?? null,
    anticipated_outcome: details.anticipated_outcome ?? null,
    who_is_involved: details.who_is_involved ?? null,
    local_community_involvement: details.local_community_involvement ?? null,
    training_involved: details.training_involved ?? null,
    training_type: details.training_type ?? null,
    training_amount_people: details.training_amount_people ?? null,
    people_working_in: details.people_working_in ?? null,
    people_amount_nearby: details.people_amount_nearby ?? null,
    people_amount_abroad: details.people_amount_abroad ?? null,
    people_amount_employees: details.people_amount_employees ?? null,
    people_amount_volunteers: details.people_amount_volunteers ?? null,
    benefited_people: details.benefited_people ?? null,
    future_maintenance: details.future_maintenance ?? null,
    use_of_resources: details.use_of_resources ?? null
  });
}

/**
 * Creates a DraftDataPitchRead model corresponding to the data the user has entered in the form
 *
 * This helps us sync it up to the API
 */
export function createPitchDraftFromForm(form: PitchRegistrationForm): DraftDataRead {
  const pitch = createCompletePitchModel(form.details);

  const {
    cover_photo, // eslint-disable-line no-unused-vars
    video, // eslint-disable-line no-unused-vars
    ...draftPitchDetails
  } = pitch;

  const draftData = DraftDataRead.constructFromObject({
    pitch: DraftDataReadPitch.constructFromObject({
      ...draftPitchDetails,
      cover_photo: null,
      video: null
    }),
    pitch_documents: form.uploads.documents
      .map(pendingItem => (pendingItem.type === "created" ? pendingItem.file : null))
      .filter(Boolean)
      .filter(file => !!file.uploadId || (file.uri && file.uri.startsWith("http")))
      .map(file =>
        DraftDataReadOfferDocuments.constructFromObject({
          name: file.name,
          type: "legal",
          document: findProjectFileUrlOrUploadId(file)
        })
      ),
    pitch_contacts: form.contacts
      .map(pendingItem => (pendingItem.type === "created" ? pendingItem.data : null))
      .filter(Boolean)
      .map(({ pitch_id, ...rest }) => DraftDataReadOfferContacts.constructFromObject(rest)),
    carbon_certifications: form.certificate
      .map(pendingItem => (pendingItem.type === "created" ? pendingItem.data : null))
      .filter(Boolean)
      .map(({ pitch_id, ...rest }) => DraftDataReadCarbonCertifications.constructFromObject(rest)),
    restoration_method_metrics: Object.keys(form.metrics)
      .map(key => form.metrics[key])
      .map(pendingItem => (pendingItem.type === "created" ? pendingItem.data : null))
      .filter(Boolean)
      .map(({ pitch_id, ...rest }) => DraftDataReadRestorationMethodMetrics.constructFromObject(rest)),
    tree_species: form.species
      .map(pendingItem => (pendingItem.type === "created" ? pendingItem.data : null))
      .filter(Boolean)
      .map(({ pitch_id, ...rest }) => DraftDataReadTreeSpecies.constructFromObject(rest))
  });

  // Attach any files to the draft. This will either be a numeric upload ID, or if already uploaded then a string
  // representing the remote file URI. We manually set these values here instead of in constructFromObject, as otherwise
  // constructFromObject will coerce cover_photo and video to always be strings, even if we supplied a numeric upload id!
  // This leads to string IDs being stored against the draft on the server, leading to validation errors
  draftData.pitch.cover_photo = findProjectFileUrlOrUploadId(form.uploads.coverPhoto);
  draftData.pitch.video = findProjectFileUrlOrUploadId(form.uploads.video);
  draftData.pitch_documents.forEach(doc => {
    doc.document = doc.document ? (doc.document.startsWith("http") ? doc.document : parseInt(doc.document)) : null;
  });

  return draftData;
}

export function findMostRecentOrganisationApprovedVersion(
  versions: Array<OrganisationVersionRead> | OrganisationVersionReadAll
): ?OrganisationVersionRead {
  return versions.find(version => version.status === "approved");
}

export function findMostRecentOrganisationVersion(
  versions: Array<OrganisationVersionRead> | OrganisationVersionReadAll
): ?OrganisationVersionRead {
  // The most recent version is at the start of the array, not the end
  return versions.length > 0 ? versions[0] : null;
}

export function findMostRecentPitchApprovedVersion(
  versions: Array<PitchVersionRead> | PitchVersionReadAll
): ?PitchVersionRead {
  return versions.find(version => version.status === "approved");
}

export function findMostRecentPitchVersion(versions: Array<PitchVersionRead> | PitchVersionReadAll): ?PitchVersionRead {
  // The most recent version is at the start of the array, not the end
  return versions.length > 0 ? versions[0] : null;
}

/**
 * Returns either the remote URL a project file was uploaded to, or if the server has not given it a url yet, the upload
 * ID that we have for that file.
 *
 * @param upload
 * @return {string|null}
 */
function findProjectFileUrlOrUploadId(upload: ?File): ?(string | number) {
  if (!upload) {
    return null;
  }

  if (upload.uploadId) {
    return upload.uploadId;
  }

  if (upload.uri && upload.uri.startsWith("http")) {
    return upload.uri;
  }

  return null;
}

export type FormOverview = {|
  formId: ?string,
  draftId: ?number,
  name: string
|};

/**
 * This is a helper function created to facilitate editing drafts
 */
export function reconcileDraftForms(state: AppState, draftType: "pitch" | "offer"): Array<FormOverview> {
  switch (draftType) {
    case "offer": {
      // combine all drafts saved to the api and only on the device
      // remove any locally saved drafts that have been saved to the drafts api
      const offersSavedOnlyToDevice = Object.entries(state.wri.offers.registrationForm)
        .map(([formId, form]) => ({
          formId: formId,
          name: ((form: any): OfferRegistrationForm).details.name ?? "",
          draftId: ((form: any): OfferRegistrationForm).draftState?.data?.id ?? null
        }))
        .filter(item => item.formId !== "edit");

      const draftOffers = (state.wri.drafts.offers.data ?? []).map(draft => ({
        formId: null,
        name: draft.data?.offer?.name ?? "",
        draftId: draft.id
      }));

      // We have an array of all the forms and drafts, but some of them will be duplicated
      const allFormsAndDrafts = [...offersSavedOnlyToDevice, ...draftOffers];
      // To deduplicate, for each unique draft ID, choose the first item in the array
      return _.uniqBy<FormOverview>(allFormsAndDrafts, item => item.draftId);
    }
    case "pitch": {
      // combine all drafts saved to the api and only on the device
      // remove any locally saved drafts that have been saved to the drafts api
      const pitchesSavedOnlyToDevice = Object.entries(state.wri.pitches.registrationForm)
        .map(([formId, form]) => ({
          formId: formId,
          name: ((form: any): PitchRegistrationForm).details.name ?? "",
          draftId: ((form: any): PitchRegistrationForm).draftState?.data?.id ?? null
        }))
        .filter(item => item.formId !== "edit");

      const draftPitches = (state.wri.drafts.pitches.data ?? []).map(draft => ({
        formId: null,
        name: draft.data?.pitch?.name ?? "",
        draftId: draft.id
      }));

      // We have an array of all the forms and drafts, but some of them will be duplicated
      const allFormsAndDrafts = [...pitchesSavedOnlyToDevice, ...draftPitches];
      // To deduplicate, for each unique draft ID, choose the first item in the array
      return _.uniqBy<FormOverview>(allFormsAndDrafts, item => item.draftId);
    }
    default: {
      throw new Error();
    }
  }
}

/**
 * This is a helper function created to facilitate editing offers, by optionally pre-populating the registration
 * form with the details of the user's existing offer
 */
export function reconcileOfferRegistrationForm(form: ?OfferRegistrationForm): OfferRegistrationForm {
  if (!form) {
    return INITIAL_OFFER_FORM;
  }

  const base = form?.base;

  // If not in edit mode, then simply continue as normal
  if (!base) {
    return form;
  }

  // Filter out fields from the base OfferRead that are not needed in OfferCreate
  const {
    avatar: avatarUri, // eslint-disable-line no-unused-vars
    compatibility_score, // eslint-disable-line no-unused-vars
    completed, // eslint-disable-line no-unused-vars
    cover_photo: coverPhotoUri, // eslint-disable-line no-unused-vars
    created_at, // eslint-disable-line no-unused-vars
    id, // eslint-disable-line no-unused-vars
    organisation_id, // eslint-disable-line no-unused-vars
    successful, // eslint-disable-line no-unused-vars
    video: videoUri, // eslint-disable-line no-unused-vars
    visibility, // eslint-disable-line no-unused-vars
    ...remainingDetails
  } = base.details;

  const baseDetails = OfferCreate.constructFromObject({
    ...remainingDetails,
    cover_photo: undefined,
    video: undefined
  });

  // Merge the modified fields from the form, with the base offer
  const reconciledOffer = OfferCreate.constructFromObject(form.details, baseDetails);

  // Return a new OfferRegistrationForm structure which reflects both the user's modifications made in the form,
  // and the original offer data they are modifying.
  return {
    base: base,
    contacts: form.contacts,
    details: reconciledOffer,
    draftState: form.draftState,
    uploads: form.uploads
  };
}

/**
 * This is a helper function created to facilitate editing organisations, by optionally pre-populating the registration
 * form with the details of the user's existing organisation
 */
export function reconcileOrganisationRegistrationForm(
  form: OrganisationRegistrationForm
): OrganisationRegistrationForm {
  const base = form?.base;
  // If not in edit mode, then simply continue as normal
  if (!base) {
    return form;
  }

  // Extract useful fields from the user's existing org
  const {
    avatar: avatarUri,
    cover_photo: coverPhotoUri,
    created_at, // eslint-disable-line no-unused-vars
    id, // eslint-disable-line no-unused-vars
    video: videoUri, // eslint-disable-line no-unused-vars
    ...remainingDetails
  } = base.details;

  const baseDetails = OrganisationCreate.constructFromObject({
    ...remainingDetails,
    avatar: undefined,
    cover_photo: undefined,
    video: undefined
  });

  // Merge the modified fields from the form, with the base organisation
  const reconciledOrg = OrganisationCreate.constructFromObject(form.details, baseDetails);

  // Return a new OrganisationRegistrationForm structure which reflects both the user's modifications made in the form,
  // and the original organisation data they are modifying.
  return {
    ...form,
    details: reconciledOrg,
    uploads: {
      ...form.uploads,
      avatar:
        avatarUri && !form.uploads.avatar
          ? {
              name: "",
              size: null,
              type: "image/jpeg",
              uri: avatarUri
            }
          : form.uploads.avatar,
      coverPhoto:
        coverPhotoUri && !form.uploads.coverPhoto
          ? {
              name: "",
              size: null,
              type: "image/jpeg",
              uri: coverPhotoUri
            }
          : form.uploads.coverPhoto
    }
  };
}

/**
 * This is a helper function created to facilitate editing pitches. It will combine the modifications made by the user
 * in the pitch edit form, with the base pitch that they are editing, to give a "reconciled" view of the pitch.
 *
 * The idea is that this reconciliation occurs once, before the data is passed through to presentation components, thus
 * avoiding them having to merge the data sources together themselves.
 */
export function reconcilePitchRegistrationForm(form: ?PitchRegistrationForm): PitchRegistrationForm {
  if (!form) {
    return INITIAL_PITCH_FORM;
  }

  const base = form?.base;
  // If not in edit mode, then simply continue as normal
  if (!base) {
    return form;
  }

  // Filter out fields from the base PitchRead that are not needed in PitchCreate
  const {
    avatar, // eslint-disable-line no-unused-vars
    compatibility_score, // eslint-disable-line no-unused-vars
    completed, // eslint-disable-line no-unused-vars
    cover_photo, // eslint-disable-line no-unused-vars
    created_at, // eslint-disable-line no-unused-vars
    id, // eslint-disable-line no-unused-vars
    organisation_id, // eslint-disable-line no-unused-vars
    price_per_tree, // eslint-disable-line no-unused-vars
    successful, // eslint-disable-line no-unused-vars
    video, // eslint-disable-line no-unused-vars
    visibility, // eslint-disable-line no-unused-vars
    ...remainingDetails
  } = base.details;

  const baseDetails = PitchCreate.constructFromObject({
    ...remainingDetails,
    cover_photo: undefined,
    video: undefined
  });

  // Merge the modified fields from the form, with the base pitch
  const reconciledPitch = PitchCreate.constructFromObject(form.details, baseDetails);

  // Combine the original metrics with their updates
  const reconciledMetrics: { [string]: PendingRestorationMethodMetric } = {};
  (reconciledPitch.restoration_methods ?? []).forEach(method => {
    const originalMetric = base.metrics.find(metric => metric.restoration_method === method);
    const pendingMetricItem = form.metrics[method];
    const reconciledMetric = {
      type: "created",
      data: RestorationMethodMetricCreate.constructFromObject({
        ...originalMetric,
        ...pendingMetricItem.data
      })
    };
    reconciledMetrics[method] = reconciledMetric;
  });
  // Return a new PitchRegistrationForm structure which reflects both the user's modifications made in the form,
  // and the original pitch data they are modifying.
  return {
    base: base,
    certificate: form.certificate,
    contacts: form.contacts,
    details: reconciledPitch,
    draftState: form.draftState,
    metrics: reconciledMetrics,
    species: form.species,
    uploads: form.uploads
  };
}

export function reconcileProjectRegistrationForm(
  state: AppState,
  formProps: ProjectFormProps
): PitchRegistrationForm | OfferRegistrationForm {
  switch (formProps.type) {
    case "offer": {
      return reconcileOfferRegistrationForm(state.wri.offers.registrationForm[formProps.formId]);
    }
    case "pitch": {
      return reconcilePitchRegistrationForm(state.wri.pitches.registrationForm[formProps.formId]);
    }
    default: {
      throw new Error();
    }
  }
}

/**
 * Uses the data in an OrganisationRegistrationForm object to upload organisation video, avatar, and cover photo.
 *
 * If any of the requests fail, this method will reject. Otherwise, it will resolve with an array of UploadCreate.
 */
export async function syncOrganisationMediaToApi(
  registrationForm: OrganisationRegistrationForm
): Promise<Array<?UploadCreate>> {
  const avatarUri = registrationForm.uploads.avatar?.uri;
  const coverPhotoUri = registrationForm.uploads.coverPhoto?.uri;
  const videoUri = registrationForm.uploads.video?.uri;

  // Upload avatar, cover photo, video, and any documents
  // Once uploaded these will give us an upload ID, which will be attached to the organisation request
  const avatarUploadRequest: Promise<?UploadCreate> = avatarUri
    ? wriAPI.uploads.uploadsPost({
        uri: avatarUri,
        name: "avatar.jpg",
        type: registrationForm.uploads.avatar?.type || "image/jpeg"
      })
    : Promise.resolve(null);
  const coverPhotoUploadRequest: Promise<?UploadCreate> = coverPhotoUri
    ? wriAPI.uploads.uploadsPost({
        uri: coverPhotoUri,
        name: "photo.jpg",
        type: registrationForm.uploads.coverPhoto?.type || "image/jpeg"
      })
    : Promise.resolve(null);
  const videoUploadRequest: Promise<?UploadCreate> = videoUri
    ? wriAPI.uploads.uploadsPost({
        uri: videoUri,
        name: "video.mp4",
        type: registrationForm.uploads.video?.type || "video/mp4"
      })
    : Promise.resolve(null);

  try {
    return await Promise.all([avatarUploadRequest, coverPhotoUploadRequest, videoUploadRequest]);
  } catch (err) {
    throw TSCError.createFromError(err).withMessagePrefix(translate("errors.media_upload.upload_failed"));
  }
}

/**
 * Uses the data in an PitchRegistrationForm or OfferRegistrationForm object to upload project video, and cover photo.
 *
 * If any of the requests fail, this method will reject. Otherwise, it will resolve with an array of UploadCreate.
 */
export async function syncProjectMediaToApi(
  registrationForm: PitchRegistrationForm | OfferRegistrationForm
): Promise<Array<?UploadCreate>> {
  const coverPhotoUri = registrationForm.uploads.coverPhoto?.uri;
  const videoUri = registrationForm.uploads.video?.uri;

  // Upload cover photo, video, and any documents
  // Once uploaded these will give us an upload ID, which will be attached to the pitch request
  const coverPhotoUploadRequest: Promise<?UploadCreate> = coverPhotoUri
    ? wriAPI.uploads.uploadsPost({
        uri: coverPhotoUri,
        name: "photo.jpg",
        type: registrationForm.uploads.coverPhoto?.type || "image/jpeg"
      })
    : Promise.resolve(null);
  const videoUploadRequest: Promise<?UploadCreate> =
    videoUri && !videoUri.startsWith("http")
      ? wriAPI.uploads.uploadsPost({
          uri: videoUri,
          name: "video.mp4",
          type: registrationForm.uploads.video?.type || "video/mp4"
        })
      : Promise.resolve(null);

  return await Promise.all([coverPhotoUploadRequest, videoUploadRequest]);
}

/**
 * Uses the data in an PitchRegistrationForm  object to upload elevator patch video .
 *
 * If any of the requests fail, this method will reject. Otherwise, it will resolve with an array of UploadCreate.
 */
export async function syncProjectElevatorVideosToApi(
  registrationForm: PitchRegistrationForm | OfferRegistrationForm
): Promise<Array<?UploadCreate>> {
  const videoIntroUri = registrationForm.uploads.videoIntroduction?.uri;
  const videoGoalsUri = registrationForm.uploads.videoGoals?.uri;
  const videoSignificanceUri = registrationForm.uploads.videoSignificance?.uri;

  // Upload  cover photo, video, and any documents
  // Once uploaded these will give us an upload ID, which will be attached to the pitch request
  const videoIntroUploadRequest: Promise<?UploadCreate> = videoIntroUri
    ? wriAPI.uploads.uploadsPost({
        uri: videoIntroUri,
        name: "videoIntro.mp4",
        type: registrationForm.uploads.videoIntroduction?.type || "video/mp4"
      })
    : Promise.resolve(null);
  const videoGoalsUploadRequest: Promise<?UploadCreate> = videoGoalsUri
    ? wriAPI.uploads.uploadsPost({
        uri: videoGoalsUri,
        name: "videoGoals.mp4",
        type: registrationForm.uploads.videoGoals?.type || "video/mp4"
      })
    : Promise.resolve(null);
  const videoSignificanceUploadRequest: Promise<?UploadCreate> = videoSignificanceUri
    ? wriAPI.uploads.uploadsPost({
        uri: videoSignificanceUri,
        name: "videoSignificance.mp4",
        type: registrationForm.uploads.videoSignificance?.type || "video/mp4"
      })
    : Promise.resolve(null);

  try {
    return await Promise.all([videoIntroUploadRequest, videoGoalsUploadRequest, videoSignificanceUploadRequest]);
  } catch (err) {
    throw TSCError.createFromError(err).withMessagePrefix(translate("errors.media_upload.upload_failed"));
  }
}

export function getTotalCost(tree: TreeSpeciesCreate | TreeSpeciesRead): number {
  // check if the values are numbers
  // due to an issue with iOS keyboards, it's possible for users to enter punctuation in these fields.
  const price_to_maintain = isNaN(tree.price_to_maintain) ? 0 : tree.price_to_maintain;
  const price_to_plant = isNaN(tree.price_to_plant) ? 0 : tree.price_to_plant;
  const site_prep = isNaN(tree.site_prep) ? 0 : tree.site_prep;
  const saplings = isNaN(tree.saplings) ? 0 : tree.saplings;
  let totalCost = price_to_maintain + price_to_plant + site_prep + saplings;
  // round up total cost to avoid issues like this: 0.1 + 0.2 = 0.30000000000000004
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript#Numbers
  totalCost = parseFloat(totalCost.toFixed(2));
  return totalCost;
}

export function calculateFiltersOfProject(project: PitchRead | OfferRead, type: Project) {
  const filters = [];

  if (project.restoration_methods) {
    const restorationMethod = new FilterCondition();
    restorationMethod.attribute = "restoration_methods";
    restorationMethod.operator = "contains";
    restorationMethod.value = project.restoration_methods;
    filters.push(restorationMethod);
  }

  if (project.land_continent) {
    const continentArray: Array<string> = project.land_continent ? [project.land_continent] : [];
    const continent = new FilterCondition();
    continent.attribute = "land_continent";
    continent.operator = "in";
    continent.value = continentArray;
    filters.push(continent);
  }
  if (project.land_ownerships) {
    const ownerships = new FilterCondition();
    ownerships.attribute = "land_ownerships";
    ownerships.operator = "contains";
    ownerships.value = project.land_ownerships;
    filters.push(ownerships);
  }
  if (project.restoration_goals) {
    const restorationGoals = new FilterCondition();
    restorationGoals.attribute = "restoration_goals";
    restorationGoals.operator = "contains";
    restorationGoals.value = project.restoration_goals;
    filters.push(restorationGoals);
  }

  // For SDGs only, we avoid sending an empty list as a filter. This is for parity with FED so that both platforms
  // are showing the same compatibility scores.
  if (project.sustainable_development_goals && project.sustainable_development_goals.length > 0) {
    const sustainableDevelopmentGoals = new FilterCondition();
    sustainableDevelopmentGoals.attribute = "sustainable_development_goals";
    sustainableDevelopmentGoals.operator = "contains";
    sustainableDevelopmentGoals.value = project.sustainable_development_goals;
    filters.push(sustainableDevelopmentGoals);
  }
  if (project.land_types) {
    const landTypes = new FilterCondition();
    landTypes.attribute = "land_types";
    landTypes.operator = "contains";
    landTypes.value = project.land_types;
    filters.push(landTypes);
  }
  if (project.land_size) {
    const landArray: Array<string> = project.land_size ? [project.land_size] : [];
    const landSize = new FilterCondition();
    landSize.attribute = "land_size";
    landSize.operator = "in";
    landSize.value = landArray;
    filters.push(landSize);
  }
  if (project.funding_sources) {
    const fundingSources = new FilterCondition();
    fundingSources.attribute = "funding_sources";
    fundingSources.operator = "contains";
    fundingSources.value = project.funding_sources;
    filters.push(fundingSources);
  }

  if (project.funding_bracket) {
    const bracketArray: Array<string> = project.funding_bracket ? [project.funding_bracket] : [];
    const fundingSources = new FilterCondition();
    fundingSources.attribute = "funding_bracket";
    fundingSources.operator = "in";
    fundingSources.value = bracketArray;
    filters.push(fundingSources);
  }

  if (project.reporting_frequency) {
    const bracketArray: Array<string> = project.reporting_frequency ? [project.reporting_frequency] : [];
    const reportingFrequency = new FilterCondition();
    reportingFrequency.attribute = "reporting_frequency";
    reportingFrequency.operator = "in";
    reportingFrequency.value = bracketArray;
    filters.push(reportingFrequency);
  }

  if (project.reporting_level) {
    const bracketArray: Array<string> = project.reporting_level ? [project.reporting_level] : [];
    const reportingLevel = new FilterCondition();
    reportingLevel.attribute = "reporting_level";
    reportingLevel.operator = "in";
    reportingLevel.value = bracketArray;
    filters.push(reportingLevel);
  }

  if (project.price_per_tree) {
    let treePriceArray = [];
    if (type === "pitch") {
      treePriceArray = project.price_per_tree ? [0, Number(project.price_per_tree)] : [];
    } else {
      // 2147483647 is the max number that server accepts
      treePriceArray = project.price_per_tree ? [Number(project.price_per_tree), 2147483647] : [];
    }
    const treePrice = new FilterCondition();
    treePrice.attribute = "price_per_tree";
    treePrice.operator = "between";
    treePrice.value = treePriceArray;
    filters.push(treePrice);
  }

  return filters;
}

export function removeAttributeFromFilters(arr: Array<FilterCondition>, attribute: string): Array<FilterCondition> {
  return arr.filter(function(element: FilterCondition) {
    return element.attribute !== attribute;
  });
}
