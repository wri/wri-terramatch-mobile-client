// @flow

/**
 * Provides validation for fields sent to the WRI API.
 */

import type { File, PendingFileList } from "../utils/models.types";
import type { PendingRestorationMethodMetric } from "../redux/wri-api/pitches";
import type { WriValidationErrors } from "../api/wri/wri.types";

import translate from "../locales/";

/**
 * Regular expression accepting e-mail addresses in a format acceptable to the API
 *
 * @type {RegExp}
 */
const EMAIL_REGEX = /\S+@\S+\.\S+/;

const ORGANISATION_DESCRIPTION_LENGTH_MIN = 8;
const PASSWORD_LENGTH_MIN = 10;
const LAND_OWNERSHIP_LENGTH_MIN = 1;
const LAND_TYPE_LENGTH_MIN = 1;
const RESTORATION_METHOD_LENGTH_MIN = 1;
const FUNDING_SOURCE_LENGTH_MIN = 1;
const RESTORATION_GOAL_LENGTH_MIN = 1;
const ORG_COVER_PHOTO_MAX_BYTES = 1024 * 1024 * 2; // 2 MB
const ORG_AVATAR_MAX_BYTES = 1024 * 1024 * 2; // 2 MB
const ORG_VIDEO_MAX_BYTES = 1024 * 1024 * 8; // 8 MB
const MEDIA_MAX_BYTES = 1024 * 1024 * 4; // 4 MB
const ORGANISATION_DOCUMENT_LENGTH_MIN = 1;
const PITCH_DOCUMENT_LENGTH_MIN = 1;
const PITCH_ANTICIPATED_OUTCOME_LENGTH_MIN = 1;
const PITCH_PROBLEM_LENGTH_MIN = 1;
const PITCH_DESCRIPTION_LENGTH_MIN = 1;
const PITCH_WHO_LENGTH_MIN = 1;
const PITCH_TRAINING_TYPE_LENGTH_MIN = 1;
const PITCH_RESOURCES_LENGTH_MIN = 1;
const PITCH_FUTURE_MAINTENANCE_LENGTH_MIN = 1;
const PITCH_WORKING_IN_LENGTH_MIN = 0;
const OFFER_DESCRIPTION_LENGTH_MIN = 1;
const DEFAULT_STRING_MAX = 255;
const DEFAULT_TEXT_MAX = 65535;
const DEFAULT_INTEGER_MAX = 2147483647;
const DEFAULT_SMALL_INT_MAX = 999999;
const MAX_SURVIVAL_RATE = 100;
const URL_REGEX = /((https|http)?:\/\/)?(www.)?[-a-zA-Z0-9@:%_\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/; // eslint-disable-line

/**
 * Immutable object holding fields, their validation criteria, and associated error strings.
 *
 * - validate is a function accepting the field input, and returning a boolean
 * - errorString is a function returning a readable sentence describing any validation errors, or null if there are no errors.
 */
const Validation = Object.freeze({
  firstName: {
    errorString: (name: ?string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.firstName.validate(name)) {
        return translate("errors.first_name.REQUIRED", "Please enter your first name");
      }
      return Validation.wriApi.errorString(apiValidation, "first_name");
    },
    validate: (name: ?string, apiValidation: ?WriValidationErrors): boolean =>
      !!name && name.length <= DEFAULT_STRING_MAX && Validation.wriApi.validate(apiValidation, "first_name")
  },
  lastName: {
    errorString: (name: ?string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.lastName.validate(name)) {
        return translate("errors.last_name.REQUIRED", "Please enter your last name");
      }
      return Validation.wriApi.errorString(apiValidation, "last_name");
    },
    validate: (name: ?string, apiValidation: ?WriValidationErrors): boolean =>
      !!name && name.length <= DEFAULT_STRING_MAX && Validation.wriApi.validate(apiValidation, "last_name")
  },
  email: {
    errorString: (
      email: ?string,
      apiValidation: ?WriValidationErrors,
      forbiddenEmails: ?Array<string>
    ): string | null => {
      if (forbiddenEmails && forbiddenEmails.includes(email?.toLowerCase?.())) {
        return translate("errors.email_address.UNIQUE", "Please enter a unique e-mail address");
      }
      if (!Validation.email.validate(email)) {
        return translate("errors.email_address.REQUIRED", "Please enter your e-mail address");
      }
      return Validation.wriApi.errorString(apiValidation, "email_address");
    },
    validate: (email: ?string, apiValidation: ?WriValidationErrors, forbiddenEmails: ?Array<string>): boolean => {
      if (forbiddenEmails && forbiddenEmails.includes(email?.toLowerCase?.())) {
        return false;
      }
      return !!email && EMAIL_REGEX.test(email) && Validation.wriApi.validate(apiValidation, "email_address");
    }
  },
  jobTitle: {
    errorString: (jobTitle: ?string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.jobTitle.validate(jobTitle)) {
        return translate("errors.job_role.REQUIRED", "Please enter your job role");
      }
      return Validation.wriApi.errorString(apiValidation, "job_role");
    },
    validate: (jobTitle: ?string, apiValidation: ?WriValidationErrors): boolean =>
      !!jobTitle && jobTitle.length <= DEFAULT_STRING_MAX && Validation.wriApi.validate(apiValidation, "job_role")
  },
  password: {
    errorString: (password: string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.password.validate(password)) {
        if (!password) {
          return translate("errors.password.REQUIRED", "Please enter a password");
        } else if (password.length < PASSWORD_LENGTH_MIN) {
          return translate("errors.password.MIN", null, { min: PASSWORD_LENGTH_MIN.toString() });
        } else if (!/\d/.test(password)) {
          return translate("errors.password.CONTAIN_NUMBER");
        } else if (!/[A-Z]/.test(password)) {
          return translate("errors.password.CONTAIN_UPPER");
        } else if (!/[a-z]/.test(password)) {
          return translate("errors.password.CONTAIN_LOWER");
        }
      }
      return Validation.wriApi.errorString(apiValidation, "password");
    },
    validate: (password: string, apiValidation: ?WriValidationErrors): boolean =>
      password.length >= PASSWORD_LENGTH_MIN &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      Validation.wriApi.validate(apiValidation, "password")
  },
  instagram: {
    errorString: (link: string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.instagram.validate(link)) {
        return translate("errors.instagram.REQUIRED", "Please enter a valid Instagram link");
      }
      return Validation.wriApi.errorString(apiValidation, "instagram");
    },
    validate: (link: string, apiValidation: ?WriValidationErrors): boolean =>
      (link === "" || (URL_REGEX.test(link) && link.length <= DEFAULT_STRING_MAX)) &&
      Validation.wriApi.validate(apiValidation, "instagram")
  },
  facebook: {
    errorString: (link: string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.facebook.validate(link)) {
        return translate("errors.facebook.REQUIRED", "Please enter a valid Facebook link");
      }
      return Validation.wriApi.errorString(apiValidation, "facebook");
    },
    validate: (link: string, apiValidation: ?WriValidationErrors): boolean =>
      (link === "" || (URL_REGEX.test(link) && link.length <= DEFAULT_STRING_MAX)) &&
      Validation.wriApi.validate(apiValidation, "facebook")
  },
  linkedin: {
    errorString: (link: string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.linkedin.validate(link)) {
        return translate("errors.linkedin.REQUIRED", "Please enter a valid LinkedIn link");
      }
      return Validation.wriApi.errorString(apiValidation, "linkedin");
    },
    validate: (link: string, apiValidation: ?WriValidationErrors): boolean =>
      (link === "" || (URL_REGEX.test(link) && link.length <= DEFAULT_STRING_MAX)) &&
      Validation.wriApi.validate(apiValidation, "linkedin")
  },
  twitter: {
    errorString: (link: string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.twitter.validate(link)) {
        return translate("errors.twitter.REQUIRED", "Please enter a valid Twitter link");
      }
      return Validation.wriApi.errorString(apiValidation, "twitter");
    },
    validate: (link: string, apiValidation: ?WriValidationErrors): boolean =>
      (link === "" || (URL_REGEX.test(link) && link.length <= DEFAULT_STRING_MAX)) &&
      Validation.wriApi.validate(apiValidation, "twitter")
  },

  /**
   * When logging in the password validation rules are looser, to account for users who registered when different rules
   * were in place
   */
  passwordLogin: {
    errorString: (password: string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.password.validate(password)) {
        if (!password) {
          return translate("errors.password.REQUIRED", "Please enter a password");
        } else if (password.length < PASSWORD_LENGTH_MIN) {
          return translate("errors.password.MIN", null, { min: PASSWORD_LENGTH_MIN.toString() });
        }
      }
      return Validation.wriApi.errorString(apiValidation, "password");
    },
    validate: (password: string, apiValidation: ?WriValidationErrors): boolean => password.length >= PASSWORD_LENGTH_MIN
  },
  accountType: {
    errorString: (text: string): string | null => {
      if (!Validation.accountType.validate(text)) {
        if (!text) {
          return translate("errors.account_type.REQUIRED", "Please select an account type");
        }
      }
      return null;
    },
    validate: (text: string): boolean => {
      return text.trim().length > 0;
    }
  },
  organisationType: {
    errorString: (text: string): string | null => {
      if (!Validation.organisationType.validate(text)) {
        if (!text) {
          return translate("errors.type.REQUIRED", "Please select an organisation type");
        }
      }
      return null;
    },
    validate: (text: string): boolean => {
      return text.trim().length > 0;
    }
  },
  organisation: {
    errorString: (name: string): string | null => {
      if (!Validation.organisation.validate(name)) {
        return translate("errors.organisation_name.REQUIRED", "Please enter your organisation");
      }
      return null;
    },
    validate: (name: string): boolean => !!name && name.length > 0 && name.length <= DEFAULT_STRING_MAX
  },
  foundedAt: {
    errorString: (name: ?string): string | null => {
      if (!Validation.foundedAt.validate(name)) {
        return translate("errors.organisation_founded_at.REQUIRED", "Please select a founded date");
      }
      return null;
    },
    validate: (name: ?string): boolean => !!name
  },
  addressLine: {
    errorString: (text: string): string | null => {
      if (!Validation.addressLine.validate(text)) {
        return translate("errors.address_1.REQUIRED", "Please enter your address");
      }
      return null;
    },
    validate: (text: string): boolean => {
      return !!text && text.trim().length > 0 && text.trim().length <= DEFAULT_STRING_MAX;
    }
  },
  city: {
    errorString: (text: string): string | null => {
      if (!Validation.city.validate(text)) {
        return translate("errors.city.REQUIRED", "Please enter your city");
      }
      return null;
    },
    validate: (text: string): boolean => {
      return !!text && text.trim().length > 0 && text.trim().length <= DEFAULT_STRING_MAX;
    }
  },
  stateProvince: {
    errorString: (text: string): string | null => {
      if (!Validation.stateProvince.validate(text)) {
        return translate("errors.state.REQUIRED", "Please enter your state");
      }
      return null;
    },
    validate: (text: string): boolean => {
      return !!text && text.trim().length > 0 && text.trim().length <= DEFAULT_STRING_MAX;
    }
  },
  zipCode: {
    errorString: (text: string): string | null => {
      if (!Validation.zipCode.validate(text)) {
        return translate("errors.zip_code.REQUIRED", "Please enter your zipCode");
      }
      return null;
    },
    validate: (text: string): boolean => {
      return !!text && text.trim().length > 0 && text.trim().length <= DEFAULT_STRING_MAX;
    }
  },
  mobileNumber: {
    errorString: (mobNo: ?string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.mobileNumber.validate(mobNo)) {
        return translate("errors.phone_number.INVALID", "Please enter a valid phone number");
      }
      return Validation.wriApi.errorString(apiValidation, "phone_number");
    },
    validate: (text: ?string, apiValidation: ?WriValidationErrors): boolean => {
      return !!text && text.trim().length > 0 && Validation.wriApi.validate(apiValidation, "phone_number");
    }
  },
  website: {
    errorString: (name: string): string | null => {
      if (!Validation.website.validate(name)) {
        return translate("errors.website.REQUIRED", "Please enter your website");
      }
      return null;
    },

    validate: (name: string): boolean => !!name && URL_REGEX.test(name) && name.length <= DEFAULT_STRING_MAX
  },
  organsationDocuments: {
    errorString: (documents: PendingFileList): string | null => {
      return null;
    },
    validate: (documents: PendingFileList) =>
      documents.filter(item => item.type !== "deleted").length >= ORGANISATION_DOCUMENT_LENGTH_MIN
  },
  organisationAvatar: {
    errorString: (file: ?File): string | null => {
      if (!Validation.organisationAvatar.validate(file)) {
        if (!file) {
          return translate("errors.avatar.REQUIRED", "Please select an avatar");
        } else if (file.size && file.size && file.size > ORG_AVATAR_MAX_BYTES) {
          return translate("errors.avatar.BETWEEN", null, {
            max: (ORG_AVATAR_MAX_BYTES / 1024 / 1024).toString()
          });
        }
      }
      return null;
    },
    validate: (file: ?File): boolean => !!file && (!file.size || file.size < ORG_AVATAR_MAX_BYTES)
  },
  acceptedTerms: {
    errorString: (hasAcceptedTerms: boolean): string | null => {
      return null;
    },
    validate: (hasAcceptedTerms: boolean): boolean => {
      return !!hasAcceptedTerms;
    }
  },
  agreedConsent: {
    errorString: (hasAgreedConsent: boolean): string | null => {
      return null;
    },
    validate: (hasAgreedConsent: boolean): boolean => {
      return !!hasAgreedConsent;
    }
  },
  organisationCoverPhoto: {
    errorString: (file: ?File): string | null => {
      if (!Validation.organisationCoverPhoto.validate(file)) {
        if (!file) {
          return translate("errors.cover_photo.REQUIRED", "Please select a cover photo");
        } else if (file.size && file.size > ORG_COVER_PHOTO_MAX_BYTES) {
          return translate("errors.cover_photo.BETWEEN", null, {
            max: (ORG_COVER_PHOTO_MAX_BYTES / 1024 / 1024).toString()
          });
        }
      }
      return null;
    },
    validate: (file: ?File): boolean => !!file && (!file.size || file.size < ORG_COVER_PHOTO_MAX_BYTES)
  },
  organisationVideo: {
    errorString: (file: ?File): string | null => {
      if (!Validation.organisationVideo.validate(file)) {
        if (!!file && file.size && file.size > ORG_VIDEO_MAX_BYTES) {
          return translate("errors.video.BETWEEN", null, {
            max: (ORG_VIDEO_MAX_BYTES / 1024 / 1024).toString()
          });
        }
      }
      return null;
    },
    validate: (file: ?File): boolean => !file || !file.size || file.size < ORG_VIDEO_MAX_BYTES
  },
  mediaUpload: {
    errorString: (file: ?File): string | null => {
      if (!Validation.mediaUpload.validate(file)) {
        if (!file) {
          return translate("errors.media_upload.REQUIRED", "Please select media");
        } else if (file.size && file.size > MEDIA_MAX_BYTES) {
          return translate("errors.media_upload.BETWEEN", null, {
            max: (MEDIA_MAX_BYTES / 1024 / 1024).toString()
          });
        }
      }
      return null;
    },
    validate: (file: ?File): boolean => !!file && (!file.size || file.size < MEDIA_MAX_BYTES)
  },
  continent: {
    errorString: (text: ?string): string | null => {
      if (!Validation.continent.validate(text)) {
        if (!text) {
          return translate("errors.continent.REQUIRED", "Please select a continent");
        }
      }
      return null;
    },
    validate: (text: ?string): boolean => {
      return !!text && text.trim().length > 0;
    }
  },
  country: {
    errorString: (text: ?string): string | null => {
      if (!Validation.country.validate(text)) {
        if (!text) {
          return translate("errors.country.REQUIRED", "Please select a country");
        }
      }
      return null;
    },
    validate: (text: ?string): boolean => {
      return !!text && text.trim().length > 0;
    }
  },
  organisationDescription: {
    errorString: (name: string): string | null => {
      if (!Validation.organisationDescription.validate(name)) {
        if (!name) {
          return translate("errors.description.REQUIRED", "Please enter a description");
        } else if (name.length < ORGANISATION_DESCRIPTION_LENGTH_MIN) {
          return translate("errors.description.MIN", null, { min: ORGANISATION_DESCRIPTION_LENGTH_MIN.toString() });
        }
      }
      return null;
    },
    validate: (name: string): boolean =>
      name.length >= ORGANISATION_DESCRIPTION_LENGTH_MIN && name.length < DEFAULT_TEXT_MAX
  },
  awardName: {
    errorString: (name: string): string | null => {
      return null;
    },
    validate: (name: string): boolean => !!name && name.trim().length > 0 && name.trim().length <= DEFAULT_STRING_MAX
  },
  landOwnership: {
    errorString: (name: string): string | null => {
      if (!Validation.landOwnership.validate(name)) {
        return translate("errors.land_ownerships.REQUIRED", "Please select a type of land ownership");
      }
      return null;
    },
    validate: (name: any): boolean => !!name.length >= LAND_OWNERSHIP_LENGTH_MIN
  },
  landType: {
    errorString: (name: string): string | null => {
      if (!Validation.landType.validate(name)) {
        return translate("errors.land_types.REQUIRED", "Please select a type of land");
      }
      return null;
    },
    validate: (name: any): boolean => !!name.length >= LAND_TYPE_LENGTH_MIN
  },
  landSize: {
    errorString: (size: string): string | null => {
      if (!Validation.landSize.validate(size)) {
        return translate("errors.land_size.REQUIRED", "Please select the size of land");
      }
      return null;
    },
    validate: (size: ?string): boolean => !!size
  },
  restorationMethod: {
    errorString: (name: string): string | null => {
      if (!Validation.restorationMethod.validate(name)) {
        return translate("errors.restoration_methods.REQUIRED", "Please select a restoration method");
      }
      return null;
    },
    validate: (name: any): boolean => !!name.length >= RESTORATION_METHOD_LENGTH_MIN
  },
  fundingSource: {
    errorString: (name: string): string | null => {
      if (!Validation.fundingSource.validate(name)) {
        return translate("errors.funding_sources.REQUIRED", "Please select a funding source");
      }
      return null;
    },
    validate: (name: any): boolean => !!name.length >= FUNDING_SOURCE_LENGTH_MIN
  },
  fundingBracket: {
    errorString: (name: string): string | null => {
      if (!Validation.fundingSource.validate(name)) {
        return translate("errors.funding_bracket.REQUIRED", "Please select a funding bracket");
      }
      return null;
    },
    validate: (name: any): boolean => !!name
  },
  restorationGoal: {
    errorString: (name: string): string | null => {
      if (!Validation.restorationGoal.validate(name)) {
        return translate("errors.restoration_goals.REQUIRED", "Please select a restoration goal");
      }
      return null;
    },
    validate: (name: any): boolean => !!name.length >= RESTORATION_GOAL_LENGTH_MIN
  },
  treeName: {
    errorString: (name: ?string): string | null => {
      if (!Validation.treeName.validate(name)) {
        return translate("errors.tree_name.REQUIRED");
      }
      return null;
    },
    validate: (name: ?string): boolean => !!name && name.trim().length > 0 && name.trim().length <= DEFAULT_STRING_MAX
  },
  treeSeason: {
    errorString: (name: ?string): string | null => {
      if (!Validation.treeSeason.validate(name)) {
        return translate("errors.tree_season.REQUIRED");
      }
      return null;
    },
    validate: (name: ?string): boolean => !!name && name.trim().length > 0 && name.trim().length <= DEFAULT_STRING_MAX
  },
  treeCount: {
    errorString: (value: ?number): string | null => {
      if (!Validation.treeCount.validate(value)) {
        return translate("errors.tree_count.REQUIRED", "Please enter a number of trees");
      }
      return null;
    },
    validate: (value: ?number): boolean => {
      return !!value && value > 0.0 && value <= DEFAULT_INTEGER_MAX;
    }
  },
  treePrice: {
    errorString: (value: ?number): string | null => {
      if (!Validation.treePrice.validate(value)) {
        return translate("errors.tree_price.REQUIRED", "Please enter a price");
      }
      return null;
    },
    validate: (value: ?number): boolean => {
      return !!value && value > 0.0 && value <= DEFAULT_INTEGER_MAX;
    }
  },
  survivalRate: {
    errorString: (value: ?number): string | null => {
      if (!Validation.survivalRate.validate(value)) {
        return translate("errors.survival_rate.BETWEEN", null, { max: 100, min: 0 });
      }
      return null;
    },
    validate: (value: ?number): boolean => {
      if (value === null || value === undefined) {
        return true;
      } else {
        return value >= 0 && value <= MAX_SURVIVAL_RATE;
      }
    }
  },
  filterTreePrice: {
    errorString: (value: ?number): string | null => {
      if (!Validation.treePrice.validate(value)) {
        return translate("errors.treePrice.REQUIRED", "Please enter a price");
      }
      return null;
    },
    validate: (value: ?number): boolean => {
      return value == null || (value >= 0.0 && value <= DEFAULT_INTEGER_MAX);
    }
  },
  treeOwner: {
    errorString: (name: ?string, treeCanProduceProducts: boolean): string | null => {
      if (!Validation.treeOwner.validate(name, treeCanProduceProducts)) {
        return translate("validation.tree_owner.REQUIRED", "Please enter who has rights to the product");
      }
      return null;
    },
    validate: (name: ?string, treeCanProduceProducts: boolean): boolean => {
      if (treeCanProduceProducts) {
        return !!name;
      } else {
        return true;
      }
    }
  },
  /**
   * Deals with validation errors returned by the WRI API.
   *
   * These are returned using a standard payload
   */
  wriApi: {
    errorString: (validationErrors: ?WriValidationErrors, fieldName: string) => {
      if (!validationErrors || !validationErrors.errors) {
        return null;
      }

      return validationErrors.errors
        .filter(error => error?.source === fieldName)
        .map(error => translate(`errors.${fieldName}.${error.code ?? "UNKNOWN"}`, error.detail))
        .join("\n");
    },
    validate: (validationErrors: ?WriValidationErrors, fieldName: string): boolean => {
      if (!validationErrors || !validationErrors.errors) {
        return true;
      }
      return !validationErrors.errors.some(error => error?.source === fieldName);
    }
  },
  projectName: {
    errorString: (name: ?string): string | null => {
      if (!Validation.projectName.validate(name)) {
        return translate("errors.project_name.REQUIRED", "Please enter your project's name");
      }
      return null;
    },
    validate: (name: ?string): boolean => {
      return !!name && name.trim().length > 0 && name.trim().length <= DEFAULT_STRING_MAX;
    }
  },
  funding: {
    errorString: (funding: ?number): string | null => {
      if (!Validation.funding.validate(funding)) {
        return translate("errors.funding_amount.REQUIRED", "Please enter your funding amount");
      }
      return null;
    },
    validate: (funding: ?number): boolean => {
      return !!funding && funding > 0.0 && funding <= DEFAULT_INTEGER_MAX;
    }
  },
  reportingLevel: {
    errorString: (text: ?string): string | null => {
      if (!Validation.reportingLevel.validate(text)) {
        if (!text) {
          return translate("errors.reporting_level.REQUIRED", "Please select a reporting level");
        }
      }
      return null;
    },
    validate: (text: ?string): boolean => {
      return !!text && text.trim().length > 0;
    }
  },
  reportingFrequency: {
    errorString: (text: ?string): string | null => {
      if (!Validation.reportingFrequency.validate(text)) {
        if (!text) {
          return translate("errors.reporting_frequency.REQUIRED", "Please select a reporting frequency");
        }
      }
      return null;
    },
    validate: (text: ?string): boolean => {
      return !!text && text.trim().length > 0;
    }
  },
  timeSpan: {
    errorString: (time: ?number): string | null => {
      if (!Validation.timeSpan.validate(time)) {
        return translate("errors.time_span.REQUIRED", "Please enter your time span");
      }
      return null;
    },
    validate: (time: ?number): boolean => {
      return !!time && time > 0.0 && time <= DEFAULT_INTEGER_MAX;
    }
  },
  yearExperience: {
    errorString: (value: ?number): string | null => {
      if (!Validation.yearExperience.validate(value)) {
        return translate("errors.year_experience.REQUIRED", "Please enter your years of experience");
      }
      return null;
    },
    validate: (value: ?number): boolean => {
      return !!value && value > 0.0 && value <= DEFAULT_INTEGER_MAX;
    }
  },
  hectareLand: {
    errorString: (value: ?number): string | null => {
      if (!Validation.hectareLand.validate(value)) {
        return translate("errors.hectare_land.REQUIRED", "Please enter your land's hectare");
      }
      return null;
    },
    validate: (value: ?number): boolean => {
      return !!value && value > 0.0 && value <= DEFAULT_SMALL_INT_MAX;
    }
  },
  hectarePrice: {
    errorString: (value: ?number): string | null => {
      if (!Validation.hectarePrice.validate(value)) {
        return translate("errors.hectare_price.REQUIRED", "Please enter your hectare price");
      }
      return null;
    },
    validate: (value: ?number): boolean => {
      return !!value && value > 0.0 && value <= DEFAULT_SMALL_INT_MAX;
    }
  },
  allMetricsValid: {
    errorString: (value: { [string]: PendingRestorationMethodMetric }, method_names: Array<string>): string | null => {
      if (!Validation.allMetricsValid.validate(value, method_names)) {
        return translate("errors.metrics.REQUIRED", "Please fill in the details above");
      }
      return null;
    },
    validate: (value: { [string]: PendingRestorationMethodMetric }, method_names: Array<string>): boolean => {
      let allInputsValid = false;

      for (const method of method_names) {
        const isYearExperienceValid = Validation.yearExperience.validate(value[method].data.experience);
        const isHectaresValid = Validation.hectareLand.validate(value[method].data.land_size);
        const isPriceValid = Validation.hectarePrice.validate(value[method].data.price_per_hectare);
        allInputsValid = isYearExperienceValid && isHectaresValid && isPriceValid;
        if (!allInputsValid) {
          break;
        }
      }
      return allInputsValid;
    }
  },
  biomass: {
    errorString: (value: ?number): string | null => {
      if (!Validation.biomass.validate(value)) {
        return translate("errors.biomass.REQUIRED", "Please enter your biomass per hectare");
      }
      return null;
    },
    validate: (value: ?number): boolean => {
      return value || typeof value === "number" ? value > 0.0 && value <= DEFAULT_SMALL_INT_MAX : true;
    }
  },
  carbon: {
    errorString: (value: ?number): string | null => {
      if (!Validation.carbon.validate(value)) {
        return translate("errors.carbon.REQUIRED", "Please enter your carbon impact");
      }
      return null;
    },
    validate: (value: ?number): boolean => {
      return value || typeof value === "number" ? value > 0.0 && value <= DEFAULT_SMALL_INT_MAX : true;
    }
  },
  species: {
    errorString: (name: ?string): string | null => {
      if (!Validation.species.validate(name)) {
        return translate("errors.species_impacted.REQUIRED");
      }
      return null;
    },
    validate: (name: ?string): boolean => {
      return name ? name.trim().length > 0 && name.trim().length <= DEFAULT_STRING_MAX : true;
    }
  },
  carbonType: {
    errorString: (name: string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.carbonType.validate(name)) {
        return translate("errors.carbon_type.REQUIRED", "Please select a certificate type");
      }
      return Validation.wriApi.errorString(apiValidation, "carbon_type");
    },
    validate: (name: ?string, apiValidation: ?WriValidationErrors): boolean =>
      !!name && Validation.wriApi.validate(apiValidation, "carbon_type")
  },
  carbonOtherType: {
    errorString: (name: string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.carbonOtherType.validate(name)) {
        return translate("errors.carbon_other_value.REQUIRED", "Please enter the certificate type");
      }
      return Validation.wriApi.errorString(apiValidation, "other_value");
    },
    validate: (name: ?string, apiValidation: ?WriValidationErrors): boolean =>
      !!name && Validation.wriApi.validate(apiValidation, "other_value")
  },
  carbonLink: {
    errorString: (name: string, apiValidation: ?WriValidationErrors): string | null => {
      if (!Validation.carbonLink.validate(name)) {
        return translate("errors.carbon_link.REQUIRED", "Please enter a certificate link");
      }
      return Validation.wriApi.errorString(apiValidation, "carbon_link");
    },
    validate: (name: ?string, apiValidation: ?WriValidationErrors): boolean =>
      !!name &&
      URL_REGEX.test(name) &&
      name.length <= DEFAULT_STRING_MAX &&
      Validation.wriApi.validate(apiValidation, "carbon_link")
  },
  pitchDocuments: {
    errorString: (documents: PendingFileList): string | null => {
      return null;
    },
    validate: (documents: PendingFileList) =>
      documents.filter(item => item.type !== "deleted").length >= PITCH_DOCUMENT_LENGTH_MIN
  },
  pitchAnticipatedOutcome: {
    errorString: (name: string): string | null => {
      if (!Validation.pitchAnticipatedOutcome.validate(name)) {
        if (!name) {
          return translate("errors.anticipated_outcome.REQUIRED");
        } else if (name.length < PITCH_ANTICIPATED_OUTCOME_LENGTH_MIN) {
          return translate("errors.anticipated_outcome.MIN", null, {
            min: PITCH_ANTICIPATED_OUTCOME_LENGTH_MIN.toString()
          });
        }
      }
      return null;
    },
    validate: (name: string): boolean =>
      name.length >= PITCH_ANTICIPATED_OUTCOME_LENGTH_MIN && name.length <= DEFAULT_TEXT_MAX
  },
  pitchProblem: {
    errorString: (name: string): string | null => {
      if (!Validation.pitchProblem.validate(name)) {
        if (!name) {
          return translate("errors.problem.REQUIRED");
        } else if (name.length < PITCH_PROBLEM_LENGTH_MIN) {
          return translate("errors.problem.MIN", null, {
            min: PITCH_PROBLEM_LENGTH_MIN.toString()
          });
        }
      }
      return null;
    },
    validate: (name: string): boolean => name.length >= PITCH_PROBLEM_LENGTH_MIN && name.length <= DEFAULT_TEXT_MAX
  },
  pitchDescription: {
    errorString: (name: string): string | null => {
      if (!Validation.pitchDescription.validate(name)) {
        if (!name) {
          return translate("errors.description.REQUIRED");
        } else if (name.length < PITCH_DESCRIPTION_LENGTH_MIN) {
          return translate("errors.description.MIN", null, {
            min: PITCH_DESCRIPTION_LENGTH_MIN.toString()
          });
        }
      }
      return null;
    },
    validate: (name: string): boolean => name.length >= PITCH_DESCRIPTION_LENGTH_MIN && name.length <= DEFAULT_TEXT_MAX
  },
  pitchWhoIsInvolved: {
    errorString: (name: string): string | null => {
      if (!Validation.pitchWhoIsInvolved.validate(name)) {
        if (!name) {
          return translate("errors.who_is_involved.REQUIRED");
        } else if (name.length < PITCH_WHO_LENGTH_MIN) {
          return translate("errors.who_is_involved.MIN", null, {
            min: PITCH_WHO_LENGTH_MIN.toString()
          });
        }
      }
      return null;
    },
    validate: (name: string): boolean => name.length >= PITCH_WHO_LENGTH_MIN && name.length <= DEFAULT_TEXT_MAX
  },
  pitchTrainingType: {
    errorString: (name: string, isTrainingInvolved: boolean): string | null => {
      if (isTrainingInvolved) {
        if (!name) {
          return translate("errors.training_type.REQUIRED");
        } else if (name.length < PITCH_TRAINING_TYPE_LENGTH_MIN) {
          return translate("errors.training_type.MIN", null, {
            min: PITCH_TRAINING_TYPE_LENGTH_MIN.toString()
          });
        }
      }
      return null;
    },
    validate: (name: ?string, isTrainingInvolved: boolean): boolean => {
      if (isTrainingInvolved) {
        return !!name && name.length >= PITCH_TRAINING_TYPE_LENGTH_MIN && name.length <= DEFAULT_STRING_MAX;
      } else {
        return true;
      }
    }
  },
  pitchUseOfResources: {
    errorString: (name: string): string | null => {
      if (!Validation.pitchUseOfResources.validate(name)) {
        if (!name) {
          return translate("errors.use_of_resources.REQUIRED");
        } else if (name.length < PITCH_RESOURCES_LENGTH_MIN) {
          return translate("errors.use_of_resources.MIN", null, {
            min: PITCH_RESOURCES_LENGTH_MIN.toString()
          });
        }
      }
      return null;
    },
    validate: (name: string): boolean => name.length >= PITCH_RESOURCES_LENGTH_MIN && name.length <= DEFAULT_TEXT_MAX
  },
  pitchFutureMaintenance: {
    errorString: (name: string): string | null => {
      if (!Validation.pitchFutureMaintenance.validate(name)) {
        if (!name) {
          return translate("errors.future_maintenance.REQUIRED");
        } else if (name.length < PITCH_FUTURE_MAINTENANCE_LENGTH_MIN) {
          return translate("errors.future_maintenance.MIN", null, {
            min: PITCH_FUTURE_MAINTENANCE_LENGTH_MIN.toString()
          });
        }
      }
      return null;
    },
    validate: (name: string): boolean =>
      name.length >= PITCH_FUTURE_MAINTENANCE_LENGTH_MIN && name.length <= DEFAULT_TEXT_MAX
  },
  pitchTrainingAmountPeople: {
    errorString: (amount: ?number, isTrainingInvolved: boolean): string | null => {
      if (isTrainingInvolved) {
        if (!!amount && amount >= 0) {
          return null;
        } else {
          return translate("errors.training_amount_people.REQUIRED", "Please enter the number of people");
        }
      }
      return null;
    },
    validate: (amount: ?number, isTrainingInvolved: boolean): boolean => {
      if (isTrainingInvolved) {
        return !!amount && amount >= 0 && amount <= DEFAULT_INTEGER_MAX;
      } else {
        return true;
      }
    }
  },
  pitchPeopleWorkingIn: {
    errorString: (name: string): string | null => {
      if (!Validation.pitchPeopleWorkingIn.validate(name)) {
        if (!name) {
          return translate("errors.people_working_in.REQUIRED");
        } else if (name.length < PITCH_WORKING_IN_LENGTH_MIN) {
          return translate("errors.people_working_in.MIN", null, {
            min: PITCH_WORKING_IN_LENGTH_MIN.toString()
          });
        }
      }
      return null;
    },
    validate: (name: string): boolean => name.length >= PITCH_WORKING_IN_LENGTH_MIN && name.length <= DEFAULT_STRING_MAX
  },
  pitchPeopleAmountNearby: {
    errorString: (amount: ?number): string | null => {
      if (!Validation.pitchPeopleAmountNearby.validate(amount)) {
        return translate("errors.people_amount_nearby.REQUIRED", "Please enter the number of people");
      }
      return null;
    },
    validate: (amount: ?number): boolean => {
      return typeof amount === "number" ? amount >= 0 && amount <= DEFAULT_INTEGER_MAX : false;
    }
  },
  pitchPeopleAmountAbroad: {
    errorString: (amount: ?number): string | null => {
      if (!Validation.pitchPeopleAmountAbroad.validate(amount)) {
        return translate("errors.people_amount_abroad.REQUIRED", "Please enter the number of people");
      }
      return null;
    },
    validate: (amount: ?number): boolean => {
      return typeof amount === "number" ? amount >= 0 && amount <= DEFAULT_INTEGER_MAX : false;
    }
  },
  pitchPeopleAmountEmployees: {
    errorString: (amount: ?number): string | null => {
      if (!Validation.pitchPeopleAmountEmployees.validate(amount)) {
        return translate("errors.people_amount_employees.REQUIRED", "Please enter the number of people");
      }
      return null;
    },
    validate: (amount: ?number): boolean => {
      return typeof amount === "number" ? amount >= 0 && amount <= DEFAULT_INTEGER_MAX : false;
    }
  },
  pitchPeopleAmountVolunteers: {
    errorString: (amount: ?number): string | null => {
      if (!Validation.pitchPeopleAmountVolunteers.validate(amount)) {
        return translate("errors.people_amount_volunteers.REQUIRED", "Please enter the number of people");
      }
      return null;
    },
    validate: (amount: ?number): boolean => {
      return typeof amount === "number" ? amount >= 0 && amount <= DEFAULT_INTEGER_MAX : false;
    }
  },
  pitchBenefitedPeople: {
    errorString: (amount: ?number): string | null => {
      if (!Validation.pitchBenefitedPeople.validate(amount)) {
        return translate("errors.benefited_people.REQUIRED", "Please enter the number of people");
      }
      return null;
    },
    validate: (amount: ?number): boolean => {
      return typeof amount === "number" ? amount >= 0 && amount <= DEFAULT_INTEGER_MAX : false;
    }
  },
  pitchLocalCommunity: {
    errorString: (value: ?boolean): string | null => {
      if (!Validation.pitchLocalCommunity.validate(value)) {
        return translate("errors.local_community_involvement.REQUIRED", "Please select an option");
      }
      return null;
    },
    validate: (value: ?boolean): boolean => {
      return typeof value === "boolean";
    }
  },
  pitchTrainingInvolved: {
    errorString: (value: ?boolean): string | null => {
      if (!Validation.pitchTrainingInvolved.validate(value)) {
        return translate("errors.training_involved.REQUIRED", "Please select an option");
      }
      return null;
    },
    validate: (value: ?boolean): boolean => {
      return typeof value === "boolean";
    }
  },
  offerDescription: {
    errorString: (name: string): string | null => {
      if (!Validation.offerDescription.validate(name)) {
        if (!name) {
          return translate("errors.description.REQUIRED", "Please enter a description");
        } else if (name.length < ORGANISATION_DESCRIPTION_LENGTH_MIN) {
          return translate("errors.description.MIN", null, { min: OFFER_DESCRIPTION_LENGTH_MIN.toString() });
        }
      }
      return null;
    },
    validate: (name: string): boolean => name.length >= OFFER_DESCRIPTION_LENGTH_MIN && name.length <= DEFAULT_TEXT_MAX
  }
});

export default Validation;
