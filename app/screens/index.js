// @flow

import type { AppStore } from "../redux/redux.types";
import type { RnnPassProps as OrgScreenPassProps } from "../containers/organisation/details";
import React, { type ComponentType } from "react";
import { Platform } from "react-native";
import { Navigation, type LayoutComponent, type LayoutStackChildren } from "react-native-navigation";

import translate from "../locales/";
import { NotificationRead } from "wri-api";
import { getInitialNotificationAndDiscard } from "../utils/pushNotifications";
import { getInitialDeepLinkAndDiscard } from "../utils/deepLinks";
import { parse as parseUrl } from "url";

export type RootId = "main" | "login" | "signup_organisation" | "sync" | "verify" | "welcome";

/**
 * Defines the componentIds of the tabs presented within the app, to allow them to be referenced from elsewhere in the app.
 */
export const tabComponentIds = Object.freeze({
  ROOT: "wri-marketplace.root",
  HOME: "wri-marketplace.home",
  FUNDING: "wri-marketplace.funding",
  PROJECTS: "wri-marketplace.projects",
  CONNECTIONS: "wri-marketplace.connections",
  PROFILE: "wri-marketplace.profile",
  MODAL: "wri-marketplace.modal",
  PROJECT_FORM_MODAL: "wri-marketplace.project-form-modal"
});

/**
 * registerScreens - Registers each screen with react-native-navigation.
 *
 * @param  {object} store    The redux store.
 * @param  {object} Provider The provider from react-redux.
 */
export function registerScreens(store: AppStore, Provider: ComponentType<*>) {
  Object.keys(screens).forEach(key => {
    const screen = screens[key];
    Navigation.registerComponent(
      screen.name,
      () => {
        const Component = screen.componentFactory();

        return props => (
          <Provider store={store}>
            <Component {...props} />
          </Provider>
        );
      },
      () => screen.componentFactory()
    );
  });
}

/**
 * getAnalyticsNameFor - Given a screen name, returns the matching analytics screen name.
 *
 * @param  {string} screenName The screen's name that we're finding the analytics name for.
 * @return {string}            The screens's analytics name, or empty string if no analytics event should be sent for the screen
 * @throws If the screen does not have any sort of analytics name defined (not even empty string)
 */
export function getAnalyticsNameFor(screenName: string): ?string {
  const screen = Object.keys(screens)
    .map(key => screens[key])
    .find(value => value.name === screenName);

  if (!screen || screen.analyticsName === undefined) {
    console.warn("No analytics name for screen", screenName, screen);
    throw new Error(`There's no analytics name for this screen! - ${screen?.name ?? ""}`);
  }

  return screen.analyticsName;
}

/**
 * Defines the screens available in the app.
 *
 * NOTE:
 * - We define only the tab ids (instead of using the automatic IDs) so we can reference them later on if required. Any non-specified ones are auto-generated.
 * - We use component factories to ensure that circular dependencies don't occur. (we had these in Medivet and AHEP).
 */
export const screens: any = Object.freeze({
  MODAL_CLOSE_BUTTON: {
    analyticsName: null,
    name: "wri-marketplace.close-modal-button",
    componentFactory: () => require("../components/common/modal-close-button").default
  },
  SIGNUP_START: {
    analyticsName: "SignUpStartScreen",
    name: "wri-marketplace.signUp-start",
    componentFactory: () => require("../containers/welcome/signUp").default
  },
  SIGNUP_INVITATION: {
    analyticsName: "SignUpInvitationScreen",
    name: "wri-marketplace.signUp-invitation",
    componentFactory: () => require("../containers/welcome/signUp/invitation").default
  },
  SIGNUP_ORGANISATION_START: {
    analyticsName: "SignUpOrganisationStartScreen",
    name: "wri-marketplace.signUp-Organisation-start",
    componentFactory: () => require("../components/welcome/signUp/organisation/start").default
  },
  SIGNUP_ORGANISATION_DETAILS: {
    analyticsName: "SignUpOrganisationDetailsScreen",
    name: "wri-marketplace.signUp-Organisation-details",
    componentFactory: () => require("../containers/welcome/signUp/organisation/details").default
  },
  SIGNUP_ORGANISATION_DESCRIPTION: {
    analyticsName: "SignUpOrganisationDescriptionScreen",
    name: "wri-marketplace.signUp-Organisation-description",
    componentFactory: () => require("../containers/welcome/signUp/organisation/description").default
  },
  SIGNUP_ORGANISATION_DOCUMENTS: {
    analyticsName: "SignUpOrganisationDocumentsScreen",
    name: "wri-marketplace.signUp-Organisation-documents",
    componentFactory: () => require("../containers/welcome/signUp/organisation/documents").default
  },
  SIGNUP_ORGANISATION_AWARDS: {
    analyticsName: "SignUpOrganisationAwardsScreen",
    name: "wri-marketplace.signUp-Organisation-awards",
    componentFactory: () => require("../containers/welcome/signUp/organisation/awards").default
  },
  SIGNUP_ORGANISATION_TEAMMEMBER: {
    analyticsName: "SignUpOrganisationTeamMemberScreen",
    name: "wri-marketplace.signUp-Organisation-teamMember",
    componentFactory: () => require("../components/welcome/signUp/organisation/teamMember").default
  },
  SIGNUP_ORGANISATION_ADDTEAMMEMBER: {
    analyticsName: "SignUpOrganisationAddTeamMemberScreen",
    name: "wri-marketplace.signUp-Organisation-addTeamMember",
    componentFactory: () => require("../containers/welcome/signUp/organisation/teamMember/addMember").default
  },
  SIGNUP_ORGANISATION_INVITETEAMMEMBER: {
    analyticsName: "SignUpOrganisationInviteTeamMemberScreen",
    name: "wri-marketplace.signUp-Organisation-InviteTeamMember",
    componentFactory: () => require("../containers/welcome/signUp/organisation/teamMember/inviteMember").default
  },
  SIGNUP_ORGANISATION_LISTTEAMMEMBER: {
    analyticsName: "SignUpOrganisationListTeamMemberScreen",
    name: "wri-marketplace.signUp-Organisation-ListTeamMember",
    componentFactory: () => require("../containers/welcome/signUp/organisation/teamMember/listMember").default
  },
  SIGNUP_ORGANISATION_PHOTOS: {
    analyticsName: "SignUpOrganisationUploadPhotosScreen",
    name: "wri-marketplace.signUp-Organisation-upload-photos",
    componentFactory: () => require("../containers/welcome/signUp/organisation/uploadPhotos").default
  },
  SIGNUP_ORGANISATION_REVIEW: {
    analyticsName: "SignupOrganisationReviewScreen",
    name: "wri-marketplace.signUp-Organisation-review",
    componentFactory: () => require("../containers/welcome/signUp/organisation/review").default
  },
  CONNECTIONS_SCREEN: {
    analyticsName: "ConnectionScreen",
    name: tabComponentIds.CONNECTIONS,
    componentFactory: () => require("../containers/connections").default
  },
  FUNDING_SCREEN: {
    analyticsName: "FundingScreen",
    name: tabComponentIds.FUNDING,
    componentFactory: () => require("../containers/funding").default
  },
  HOME_SCREEN: {
    analyticsName: "HomeScreen",
    name: tabComponentIds.HOME,
    componentFactory: () => require("../containers/home").default
  },
  LOGIN: {
    analyticsName: "LoginScreen",
    name: "wri-marketplace.login",
    componentFactory: () => require("../containers/welcome/login").default
  },
  RESET_PASSWORD: {
    analyticsName: "ResetPasswordScreen",
    name: "wri-marketplace.reset",
    componentFactory: () => require("../containers/welcome/login/resetPassword").default
  },
  UPDATE_PASSWORD: {
    analyticsName: "UpdatePasswordScreen",
    name: "wri-marketplace.update-password",
    componentFactory: () => require("../containers/welcome/login/updatePassword").default
  },
  ORGANISATION_DETAILS_SCREEN: {
    analyticsName: "OrganisationProfileScreen",
    name: "wri-marketplace.organisation-profile-screen",
    componentFactory: () => require("../containers/organisation/details").default
  },
  PROFILE_SCREEN: {
    analyticsName: "ProfileScreen",
    name: tabComponentIds.PROFILE,
    componentFactory: () => require("../containers/organisation/details/mine").default
  },
  PROJECTS_SCREEN: {
    analyticsName: "ProjectsScreen",
    name: tabComponentIds.PROJECTS,
    componentFactory: () => require("../containers/projects").default
  },
  PROJECTS_START_SCREEN: {
    analyticsName: "PitchStartScreen",
    name: "wri-marketplace.project-start",
    componentFactory: () => require("../containers/pitches/project-creation/start").default
  },
  PROJECTS_NAME_SCREEN: {
    analyticsName: "PitchNameScreen",
    name: "wri-marketplace.project-name",
    componentFactory: () => require("../containers/pitches/project-creation/name").default
  },
  PROJECTS_SUCCESS_SCREEN: {
    analyticsName: "PitchNameScreen",
    name: "wri-marketplace.project-success",
    componentFactory: () => require("../components/pitches/project-creation/success").default
  },
  PROJECTS_VIDEO_ELEVATOR: {
    analyticsName: "PitchVideoElevatorScreen",
    name: "wri-marketplace.project-video-elevator",
    componentFactory: () => require("../containers/pitches/project-creation/video").default
  },
  PROJECTS_VIDEO_RECORD: {
    analyticsName: "PitchVideoIntroScreen",
    name: "wri-marketplace.project-video-introduction",
    componentFactory: () => require("../containers/pitches/project-creation/video/record").default
  },
  PROJECTS_VIDEO_RECORD_REVIEW: {
    analyticsName: "PitchVideoIntroReviewScreen",
    name: "wri-marketplace.project-video-introduction-review",
    componentFactory: () => require("../containers/pitches/project-creation/video/record-review").default
  },
  PROJECTS_VIDEO_UPLOAD: {
    analyticsName: "PitchUploadVideoScreen",
    name: "wri-marketplace.project-video-upload",
    componentFactory: () => require("../containers/pitches/project-creation/video/upload").default
  },
  PROJECTS_VISIBILITIES_SCREEN: {
    analyticsName: "ProjectVisibilitiesScreen",
    name: "wri-marketplace.project-visibilities",
    componentFactory: () => require("../containers/projects/visibility").default
  },
  PROJECTS_FULLY_FUNDED_SCREEN: {
    analyticsName: "ProjectFullyFundedScreen",
    name: "wri-marketplace.project-funded",
    componentFactory: () => require("../components/projects/visibility/funded").default
  },
  PROJECTS_TEAM_SCREEN: {
    analyticsName: "PitchTeamScreen",
    name: "wri-marketplace.project-team",
    componentFactory: () => require("../containers/pitches/project-creation/team").default
  },
  PROJECTS_LOCATION_SCREEN: {
    analyticsName: "PitchLocationScreen",
    name: "wri-marketplace.project-location",
    componentFactory: () => require("../containers/pitches/project-creation/location").default
  },
  PROJECTS_LAND_SIZE_SCREEN: {
    analyticsName: "PitchLandSizeScreen",
    name: "wri-marketplace.project-land-size",
    componentFactory: () => require("../containers/pitches/project-creation/land-size").default
  },
  PROJECTS_CAPABILITIES_SCREEN: {
    analyticsName: "PitchCapabilitiesScreen",
    name: "wri-marketplace.project-capabilities",
    componentFactory: () => require("../containers/pitches/project-creation/reporting-capabilities").default
  },
  PROJECTS_LAND_OWNERSHIP_SCREEN: {
    analyticsName: "ProjectsLandOwnershipScreen",
    name: "wri-marketplace.projects-ownership",
    componentFactory: () => require("../containers/pitches/project-creation/land-ownership").default
  },
  PROJECTS_LAND_TYPE_SCREEN: {
    analyticsName: "ProjectsLandTypeScreen",
    name: "wri-marketplace.projects-type",
    componentFactory: () => require("../containers/pitches/project-creation/land-type").default
  },
  PROJECTS_RESTORATION_METHOD_SCREEN: {
    analyticsName: "ProjectsRestorationMethodScreen",
    name: "wri-marketplace.projects-restoration-method",
    componentFactory: () => require("../containers/pitches/project-creation/restoration-method").default
  },
  PROJECTS_FUNDING_SOURCE_SCREEN: {
    analyticsName: "ProjectsFundingSourceScreen",
    name: "wri-marketplace.projects-funding-source",
    componentFactory: () => require("../containers/pitches/project-creation/funding-source").default
  },
  PROJECTS_REGION_SCREEN: {
    analyticsName: "PitchRegionScreen",
    name: "wri-marketplace.project-region",
    componentFactory: () => require("../containers/pitches/project-creation/region").default
  },
  PROJECTS_RESTORATION_GOAL_SCREEN: {
    analyticsName: "ProjectsRestorationGoalScreen",
    name: "wri-marketplace.projects-restoration-goal",
    componentFactory: () => require("../containers/pitches/project-creation/restoration-goal").default
  },
  PROJECTS_REVENUE_DRIVER_SCREEN: {
    analyticsName: "ProjectsRevenueDriverScreen",
    name: "wri-marketplace.projects-revenue-driver",
    componentFactory: () => require("../containers/pitches/project-creation/revenue-driver").default
  },
  PROJECTS_SUSTAINABLE_GOAL_SCREEN: {
    analyticsName: "ProjectsSustainableGoalScreen",
    name: "wri-marketplace.projects-sustainable-goal",
    componentFactory: () => require("../containers/pitches/project-creation/sustainable-goal").default
  },
  PROJECTS_METRICS_SCREEN: {
    analyticsName: "PitchMetricsScreen",
    name: "wri-marketplace.project-metrics",
    componentFactory: () => require("../containers/pitches/project-creation/metrics").default
  },
  PROJECTS_TREE_SPECIES_SCREEN: {
    analyticsName: "PitchTreeSpeciesScreen",
    name: "wri-marketplace.project-tree-species",
    componentFactory: () => require("../containers/pitches/project-creation/tree-species").default
  },
  PROJECTS_CARBON_CERTIFICATE_SCREEN: {
    analyticsName: "PitchCarbonCertificateScreen",
    name: "wri-marketplace.project-carbon-certificate",
    componentFactory: () => require("../containers/pitches/project-creation/carbon-certificate").default
  },
  PROJECTS_DOCUMENTS_SCREEN: {
    analyticsName: "PitchDocumentsScreen",
    name: "wri-marketplace.project-documents",
    componentFactory: () => require("../containers/pitches/project-creation/documents").default
  },
  PROJECTS_FUNDING_BRACKET_SCREEN: {
    analyticsName: "FundingBracketScreen",
    name: "wri-marketplace.funding-brackets",
    componentFactory: () => require("../containers/pitches/project-creation/funding-bracket").default
  },
  PROJECTS_DETAILS_SCREEN: {
    analyticsName: "PitchDetailsScreen",
    name: "wri-marketplace.project-details",
    componentFactory: () => require("../containers/pitches/project-creation/details").default
  },
  PROJECTS_DESCRIPTION_SCREEN: {
    analyticsName: "PitchDescriptionScreen",
    name: "wri-marketplace.project-description",
    componentFactory: () => require("../containers/pitches/project-creation/description").default
  },
  PROJECTS_ENGAGEMENT_SCREEN: {
    analyticsName: "PitchEngagementScreen",
    name: "wri-marketplace.project-engagement",
    componentFactory: () => require("../containers/pitches/project-creation/long-term-engagement").default
  },
  PROJECTS_UPLOAD_SCREEN: {
    analyticsName: "PitchUploadScreen",
    name: "wri-marketplace.project-upload",
    componentFactory: () => require("../containers/pitches/project-creation/upload").default
  },
  PROJECTS_PATCH_UPLOAD_SCREEN: {
    analyticsName: "PitchPatchVideoUploadScreen",
    name: "wri-marketplace.project-patch-upload",
    componentFactory: () => require("../containers/pitches/project-creation/video/patch-upload").default
  },
  PROJECTS_VIDEO_REVIEW_SCREEN: {
    analyticsName: "PitchVideoReviewScreen",
    name: "wri-marketplace.project-video-review",
    componentFactory: () => require("../containers/pitches/project-creation/video/review").default
  },
  PITCH_SCREEN: {
    analyticsName: "PitchScreen",
    name: "wri-marketplace.pitch-screen",
    componentFactory: () => require("../containers/pitches/details").default
  },
  MY_PITCH_SCREEN: {
    analyticsName: "UserPitchScreen",
    name: "wri-marketplace.my-pitch-screen",
    componentFactory: () => require("../containers/pitches/details/mine").default
  },
  PROJECTS_REVIEW_SCREEN: {
    analyticsName: "PitchReviewScreen",
    name: "wri-marketplace.project-review",
    componentFactory: () => require("../containers/pitches/project-creation/review").default
  },
  PROJECTS_GUIDE_VIDEO_ELEVATOR_SCREEN: {
    analyticsName: "PitchGuideVideoElevatorScreen",
    name: "wri-marketplace.project-video-guide",
    componentFactory: () => require("../components/pitches/project-creation/video/guide").default
  },
  SEARCH_FILTER_SCREEN: {
    analyticsName: "SearchFilterScreen",
    name: "wri-marketplace.searchFilter",
    componentFactory: () => require("../components/projects/filter").default
  },
  APPLY_INTEREST_SCREEN: {
    analyticsName: "ApplyInterestScreen",
    name: "wri-marketplace.applyInterest",
    componentFactory: () => require("../containers/projects/interest").default
  },
  APPLY_INTEREST_SUCCESS_SCREEN: {
    analyticsName: "ApplyInterestSuccessScreen",
    name: "wri-marketplace.applyInterestSuccess",
    componentFactory: () => require("../components/projects/interest/success").default
  },
  PROJECT_SEARCH_FILTER_SCREEN: {
    analyticsName: "ProjectSearchFilterScreen",
    name: "wri-marketplace.projectSearchFilter",
    componentFactory: () => require("../containers/projects/filter").default
  },
  FUNDING_SEARCH_FILTER_SCREEN: {
    analyticsName: "FundingSearchFilterScreen",
    name: "wri-marketplace.fundingSearchFilter",
    componentFactory: () => require("../containers/funding/filter").default
  },
  FULL_VIDEO_SCREEN: {
    analyticsName: "VideoFullScreen",
    name: "wri-marketplace.fullscreen-video",
    componentFactory: () => require("../components/common/video-player/fullscreen").default
  },
  OFFER_SCREEN: {
    analyticsName: "OfferScreen",
    name: "wri-marketplace.offer-screen",
    componentFactory: () => require("../containers/offers/details").default
  },
  OFFER_REVIEW_SCREEN: {
    analyticsName: "OfferReviewScreen",
    name: "wri-marketplace.offer-review",
    componentFactory: () => require("../containers/offers/details/review").default
  },
  OFFERS_TOTAL_PRICE_PER_TREE_SCREEN: {
    analyticsName: "OfferTotalPricePerTreeScreen",
    name: "wri-marketplace.offers-total-price-per-tree",
    componentFactory: () => require("../containers/pitches/project-creation/tree-price").default
  },
  MY_OFFER_SCREEN: {
    analyticsName: "UserOfferScreen",
    name: "wri-marketplace.my-offer-screen",
    componentFactory: () => require("../containers/offers/details/mine").default
  },
  SETTINGS: {
    analyticsName: "SettingsScreen",
    name: "wri-marketplace.settings",
    componentFactory: () => require("../containers/home/settings").default
  },
  SYNC: {
    analyticsName: "SyncScreen",
    name: "wri-marketplace.sync",
    componentFactory: () => require("../components/welcome/sync").default
  },
  VERIFY: {
    analyticsName: "VerifyScreen",
    name: "wri-marketplace.verify",
    componentFactory: () => require("../containers/welcome/signUp/verify").default
  },
  WELCOME_SCREEN: {
    analyticsName: "WelcomeScreen",
    name: "wri-marketplace.welcome",
    componentFactory: () => require("../containers/welcome").default
  },
  NOTIFICATION_SCREEN: {
    analyticsName: "NotificationScreen",
    name: "wri-marketplace.notifications",
    componentFactory: () => require("../containers/home/notifications").default
  },
  NEWS_SCREEN: {
    analyticsName: "NewsScreen",
    name: "wri-marketplace.news",
    componentFactory: () => require("../components/news").default
  }
});

/**
 * Returns a RNN layout component appropriate for handling the given notification payload
 */
export function createDestinationScreenForNotification(notification: $Shape<NotificationRead>): ?LayoutComponent {
  switch (notification.action) {
    case "interest_shown":
    case "match":
    case "unmatch": {
      return {
        name: screens.CONNECTIONS_SCREEN.name,
        passProps: {
          notification: notification
        }
      };
    }
    case "version_rejected":
    case "version_approved": {
      switch (notification.referenced_model) {
        case "Organisation": {
          return {
            name: screens.PROFILE_SCREEN.name
          };
        }
        case "Pitch": {
          return {
            name: screens.MY_PITCH_SCREEN.name,
            passProps: {
              isOwnedByUser: true,
              pitchId: notification.referenced_model_id
            }
          };
        }
        default: {
          console.warn("3SC", "No push handler for model", notification);
          return null;
        }
      }
    }
    case "project_changed": {
      switch (notification.referenced_model) {
        case "Offer": {
          return {
            name: screens.OFFER_SCREEN.name,
            passProps: {
              isOwnedByUser: false,
              offerId: notification.referenced_model_id
            }
          };
        }
        case "Pitch": {
          return {
            name: screens.PITCH_SCREEN.name,
            passProps: {
              isOwnedByUser: false,
              pitchId: notification.referenced_model_id
            }
          };
        }
        default: {
          console.warn("3SC", "No push handler for model", notification);
          return null;
        }
      }
    }
    case "update_visibility": {
      switch (notification.referenced_model) {
        case "Offer": {
          return {
            name: screens.MY_OFFER_SCREEN.name,
            passProps: {
              offerId: notification.referenced_model_id
            }
          };
        }
        case "Pitch": {
          return {
            name: screens.MY_PITCH_SCREEN.name,
            passProps: {
              pitchId: notification.referenced_model_id
            }
          };
        }
        default: {
          console.warn("3SC", "No push handler for model", notification);
          return null;
        }
      }
    }
    case "version_created": {
      // Admin-only
      return null;
    }
    default: {
      console.warn("3SC", "No push handler for type", notification.action);
      return null;
    }
  }
}

/**
 * Returns a RNN layout component appropriate for handling the given deep link
 */
export function createDestinationScreenForDeepLink(url: string, isLoggedIn: boolean): ?LayoutComponent {
  const parsedUrl = parseUrl(url, true);
  const pathParts = parsedUrl.pathname.split("/");
  if (!isLoggedIn && (pathParts[1] !== "invite" && pathParts[1] !== "passwordReset")) {
    console.warn("3SC", "Cannot handle deep link unless logged in", parsedUrl.pathname);
    return null;
  }
  switch (pathParts[1]) {
    case "connections": {
      return {
        name: screens.CONNECTIONS_SCREEN.name
      };
    }
    case "funding": {
      const offerId = pathParts[2];

      if (!offerId) {
        return {
          name: screens.FUNDING_SCREEN.name
        };
      }

      return {
        name: screens.OFFER_SCREEN.name,
        passProps: {
          isOwnedByUser: false, // TODO: we don't know at this point if the link was one of the user's funding offers
          offerId: offerId
        }
      };
    }
    case "organization": {
      const orgId = pathParts[2];

      if (!orgId) {
        return {
          name: screens.PROFILE_SCREEN.name
        };
      }

      return {
        name: screens.ORGANISATION_DETAILS_SCREEN.name,
        passProps: ({
          isOwnedByUser: false, // TODO: we don't know at this point if the link was one of the user's funding offers
          organisationId: orgId
        }: OrgScreenPassProps)
      };
    }
    case "projects": {
      const pitchId = pathParts[2];

      if (!pitchId) {
        return {
          name: screens.PROJECTS_SCREEN.name
        };
      }

      return {
        name: screens.PITCH_SCREEN.name,
        passProps: {
          isOwnedByUser: false, // TODO: we don't know at this point if the link was one of the user's funding offers
          pitchId: pitchId
        }
      };
    }
    case "profile": {
      const isPitchOrOffer = pathParts[2];

      if (!isPitchOrOffer) {
        return {
          name: screens.PROFILE_SCREEN.name
        };
      } else {
        const pitchOrOfferId = pathParts[3];
        if (pitchOrOfferId) {
          switch (isPitchOrOffer) {
            case "projects": {
              return {
                name: screens.MY_PITCH_SCREEN.name,
                passProps: {
                  isOwnedByUser: true,
                  pitchId: pitchOrOfferId
                }
              };
            }
            case "funding": {
              return {
                name: screens.MY_OFFER_SCREEN.name,
                passProps: {
                  isOwnedByUser: true,
                  offerId: pitchOrOfferId
                }
              };
            }
          }
        }
      }
      return null;
    }
    case "passwordReset": {
      if (isLoggedIn) {
        console.warn("3SC", "Cannot handle updatePassword link when already logged in");
        return null;
      }
      return {
        name: screens.UPDATE_PASSWORD.name,
        passProps: {
          token: parsedUrl.query?.token
        }
      };
    }
    case "invite": {
      if (isLoggedIn) {
        console.warn("3SC", "Cannot handle invite link when already logged in");
        return null;
      }
      return {
        name: screens.SIGNUP_INVITATION.name,
        passProps: {
          email: parsedUrl.query?.emailAddress
        }
      };
    }
    case "verify": {
      return null; // No need to display a screen to handle verify links - will be handled by the above
    }
    default: {
      console.warn("3SC", "No deep link handler for URL", url, pathParts);
      return null;
    }
  }
}

/**
 * Returns the RNN component stack needed to fulfill any deep link or push the user (possibly) clicked on in order to launch the app
 *
 * If the user did not click on a push or a deep link then this will be empty
 */
async function createInitialScreenStack(isLoggedIn: boolean): Promise<Array<LayoutStackChildren>> {
  // Check if we have either a push or deep link to handle
  const pushStack = await createScreenStackForInitialPush(isLoggedIn);
  const deepLinkStack = await createScreenStackForInitialDeepLink(isLoggedIn);

  if (pushStack.length > 0 && deepLinkStack.length > 0) {
    console.warn(
      "3SC",
      "There is both a push stack and deep link stack - only one can be handled",
      pushStack,
      deepLinkStack
    );
  }

  return pushStack.length > 0 ? pushStack : deepLinkStack;
}

/**
 * Returns the RNN component stack needed to fulfill any deep link the user (possibly) clicked on in order to launch the app
 *
 * If the user did not click on a deep link then this will be empty
 */
async function createScreenStackForInitialDeepLink(isLoggedIn: boolean): Promise<Array<LayoutStackChildren>> {
  const initialDeepLink = await getInitialDeepLinkAndDiscard();
  const destinationScreen = initialDeepLink ? createDestinationScreenForDeepLink(initialDeepLink, isLoggedIn) : null;
  return destinationScreen ? [{ component: destinationScreen }] : [];
}

/**
 * Returns the RNN component stack needed to fulfill any push the user (possibly) clicked on in order to launch the app
 *
 * If the user did not click on a push then this will be empty
 */
async function createScreenStackForInitialPush(isLoggedIn: boolean): Promise<Array<LayoutStackChildren>> {
  if (!isLoggedIn) {
    return [];
  }
  const initialPush = await getInitialNotificationAndDiscard();
  const initialPushPayload = initialPush?.notification?._data;
  const destinationScreen = initialPushPayload ? createDestinationScreenForNotification(initialPushPayload) : null;
  return destinationScreen ? [{ component: destinationScreen }] : [];
}

/**
 * Displays the specified screen layout as a model
 */
export function displayScreenAsModal(screen: LayoutComponent) {
  Navigation.dismissModal(tabComponentIds.MODAL);
  Navigation.showModal({
    stack: {
      id: tabComponentIds.MODAL,
      children: [
        {
          component: {
            ...screen,
            options: {
              ...(screen.options ?? {}),
              // Automatically add in a close button or iOS users get stuck
              topBar: {
                ...(screen.options?.topBar ?? {}),
                leftButtons: Platform.select({
                  ios: [
                    {
                      id: "close-modal-button",
                      component: { name: screens.MODAL_CLOSE_BUTTON.name }
                    }
                  ],
                  android: undefined
                })
              }
            }
          }
        }
      ]
    }
  });
}

export async function launchRoot(rootId: RootId, isLoggedIn: boolean, passProps: any): Promise<any> {
  switch (rootId) {
    case "welcome": {
      // If the user launched the app through clicking on a push, then show the push destination at the top of
      // the stack
      const initialPushStack = await createInitialScreenStack(isLoggedIn);
      Navigation.setRoot({
        root: {
          stack: {
            id: tabComponentIds.ROOT,
            children: [
              {
                component: screens.WELCOME_SCREEN
              },
              ...initialPushStack
            ]
          }
        }
      });
      break;
    }
    case "login": {
      Navigation.setRoot({
        root: {
          stack: {
            id: tabComponentIds.ROOT,
            children: [
              {
                component: screens.LOGIN
              }
            ]
          }
        }
      });
      break;
    }
    case "sync": {
      Navigation.setRoot({
        root: {
          stack: {
            id: tabComponentIds.ROOT,
            children: [
              {
                component: screens.SYNC
              }
            ]
          }
        }
      });
      break;
    }
    case "verify": {
      Navigation.setRoot({
        root: {
          stack: {
            id: tabComponentIds.ROOT,
            children: [
              {
                component: screens.WELCOME_SCREEN
              },
              {
                component: screens.VERIFY
              }
            ]
          }
        }
      });
      break;
    }
    case "signup_organisation": {
      Navigation.setRoot({
        root: {
          stack: {
            id: tabComponentIds.ROOT,
            children: [
              {
                component: screens.WELCOME_SCREEN
              },
              {
                component: screens.SIGNUP_ORGANISATION_START
              }
            ]
          }
        }
      });
      break;
    }
    case "main": {
      // If the user launched the app through clicking on a push, then show the push destination at the top of
      // the stack
      const initialPushStack = await createInitialScreenStack(isLoggedIn);
      // To workaround a crash on Android we have to add bottom tab icon to each automatically pushed screen
      const initialPushStackWithBottomTabOptions = initialPushStack.map(item => ({
        component: {
          ...(item.component ?? {}),
          options: {
            ...(item.component?.options ?? {}),
            bottomTab: {
              icon: require("../assets/tab-icons/home.png")
            }
          }
        }
      }));
      Navigation.setRoot({
        root: {
          bottomTabs: {
            id: tabComponentIds.ROOT,
            children: [
              {
                stack: {
                  children: [
                    {
                      component: {
                        ...screens.HOME_SCREEN,
                        id: tabComponentIds.HOME,
                        options: {
                          bottomTab: {
                            icon: require("../assets/tab-icons/home.png"),
                            text: translate("home.title")
                          },
                          bottomTabs: {
                            drawBehind: false,
                            visible: true
                          }
                        }
                      }
                    },
                    ...initialPushStackWithBottomTabOptions
                  ]
                }
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        ...screens.FUNDING_SCREEN,
                        id: tabComponentIds.FUNDING,
                        options: {
                          bottomTab: {
                            icon: require("../assets/tab-icons/funding.png"),
                            text: translate("funding.title")
                          },
                          bottomTabs: {
                            drawBehind: false,
                            visible: true
                          }
                        }
                      }
                    }
                  ]
                }
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        ...screens.PROJECTS_SCREEN,
                        id: tabComponentIds.PROJECTS,
                        options: {
                          bottomTab: {
                            icon: require("../assets/tab-icons/projects.png"),
                            text: translate("projects.title")
                          },
                          bottomTabs: {
                            drawBehind: false,
                            visible: true
                          }
                        }
                      }
                    }
                  ]
                }
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        ...screens.CONNECTIONS_SCREEN,
                        id: tabComponentIds.CONNECTIONS,
                        options: {
                          bottomTab: {
                            icon: require("../assets/tab-icons/connections.png"),
                            text: translate("connections.title")
                          },
                          bottomTabs: {
                            drawBehind: false,
                            visible: true
                          }
                        }
                      }
                    }
                  ]
                }
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        ...screens.PROFILE_SCREEN,
                        id: tabComponentIds.PROFILE,
                        options: {
                          bottomTab: {
                            icon: require("../assets/tab-icons/profile.png"),
                            text: translate("profile.title")
                          },
                          bottomTabs: {
                            drawBehind: false,
                            visible: true
                          }
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      });
      break;
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (rootId: empty);
      break;
    }
  }
}
