//@flow
import type { ProjectFormProps } from "../screens/projectForms";

import { Alert } from "react-native";
import { Navigation } from "react-native-navigation";
import translate from "../locales";
import { tabComponentIds } from "../screens";

const CloseIcon = require("../assets/icons/modal/close.png");
const archiveIcon = require("../assets/icons/projects/delete.png");
const homeIcon = require("../assets/icons/welcome/home.png");
const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";
const NAV_BAR_BUTTON_ID_DRAFT_DELETE = "draft_delete";
const NAV_BAR_BUTTON_ID_CANCEL = "Cancel";

/**
 * Shared topBar navigation settings use throughout the pitch and offer creation flows
 */
export function projectCreationNavigation(formMetadata: { type: "pitch" | "offer", isDraft?: ?boolean }) {
  const deleteButton = formMetadata.isDraft
    ? {
        id: NAV_BAR_BUTTON_ID_DRAFT_DELETE,
        icon: archiveIcon,
        showAsAction: "always"
      }
    : [];

  return {
    topBar: {
      title: {
        text: formMetadata.type === "offer" ? translate("offer.title") : translate("projects.title"),
        alignment: "fill"
      },
      leftButtons: [
        {
          icon: CloseIcon,
          id: NAV_BAR_BUTTON_ID_CANCEL,
          text: translate("common.cancel")
        }
      ],
      rightButtons: deleteButton
    },
    animations: {
      push: {
        enabled: false
      }
    }
  };
}

/**
 * Shared topBar navigation settings use throughout the organisation creation flows
 */
export function organisationCreationNavigation(isEdit: boolean) {
  return {
    topBar: {
      title: {
        text: isEdit ? translate("common.edit") : translate("signup.title"),
        alignment: "fill"
      },
      rightButtons: isEdit
        ? [
            {
              id: NAV_BAR_BUTTON_ID_HOME,
              icon: homeIcon
            }
          ]
        : []
    }
  };
}

/**
 * Handle navigation button events for the pitch and offer creation flows
 */
export function projectCreationNavigationEvents(
  buttonId: string,
  formMetadata: ProjectFormProps,
  skipSaving?: boolean = false
) {
  if (formMetadata?.isDraft) {
    switch (buttonId) {
      case NAV_BAR_BUTTON_ID_CANCEL: {
        Alert.alert(
          skipSaving ? translate("drafts.noSaveChanges") : translate("drafts.saveChanges"),
          skipSaving ? translate("drafts.noSaveChangesHelp") : translate("drafts.saveChangesHelp"),
          [
            {
              text: skipSaving ? translate("common.noSaveAndExit") : translate("common.saveAndExit"),
              onPress: () => {
                formMetadata.saveAndExitForm();
              }
            },
            {
              text: translate("common.cancel"),
              style: "cancel"
            }
          ]
        );
        break;
      }
      case NAV_BAR_BUTTON_ID_DRAFT_DELETE: {
        Alert.alert(translate("drafts.delete"), translate("drafts.deleteHelp"), [
          {
            text: translate("common.yes"),
            onPress: () => {
              formMetadata.removeForm();
            }
          },
          {
            text: translate("common.cancel"),
            style: "cancel"
          }
        ]);
        break;
      }
    }
  } else {
    switch (buttonId) {
      case NAV_BAR_BUTTON_ID_CANCEL: {
        Navigation.dismissModal(tabComponentIds.PROJECT_FORM_MODAL);
        break;
      }
    }
  }
}
