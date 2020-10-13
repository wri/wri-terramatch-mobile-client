// @flow

import type { OfferUploadQueues } from "./offers/actions";
import type { OrganisationUploadQueues } from "./organisations/actions";
import type { PitchUploadQueues } from "./pitches/actions";
import type { File, PendingFile, PendingFileList } from "../../utils/models.types";
import { OrganisationDocumentRead, PitchDocumentRead } from "wri-api";
import { errorCodes } from "../../constants/errorMessaging";
import { Alert } from "react-native";
import translate from "../../locales";
import { removeProjectRegistrationFormAndDraft } from "./projects/actions";
import { displayScreenAsModal, screens } from "../../screens";

type AnyUploadQueue = {|
  +avatar?: ?File,
  +awards?: PendingFileList,
  +coverPhoto?: ?File,
  +documents?: PendingFileList,
  +video?: ?File,
  +videoIntroduction?: ?File,
  +videoGoals?: ?File,
  +videoSignificance?: ?File
|};

export function addUploadToForm<T: AnyUploadQueue>(
  currentState: T,
  key: $Keys<OfferUploadQueues> | $Keys<OrganisationUploadQueues> | $Keys<PitchUploadQueues>,
  createdFile: ?File
): T {
  switch (key) {
    case "avatar":
    case "coverPhoto":
    case "videoIntroduction":
    case "videoGoals":
    case "videoSignificance":
    case "video": {
      return {
        ...currentState,
        [key]: createdFile
      };
    }
    case "awards":
    case "documents": {
      if (!createdFile) {
        console.warn("3SC", "Attempted to add a null file to an upload list");
        return currentState;
      }

      // If a file with the same URI already exists then replace its entry, otherwise append
      // An example of a time that we want to update the item is when it has been uploaded, and so we want to store its uploadId
      const existingItems = currentState[key] ?? [];
      const existingItem = existingItems.find(item => item.file.uri === createdFile.uri);

      if (existingItem) {
        return {
          ...currentState,
          [key]: existingItems.map(item => (item === existingItem ? { ...item, file: createdFile } : item))
        };
      }

      return {
        ...currentState,
        [key]: [...existingItems, { type: "created", file: createdFile }]
      };
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (key: empty);
      return currentState;
    }
  }
}

export function completeFormUpload<T: AnyUploadQueue>(
  currentState: T,
  key: "awards" | "documents",
  createdItem: PendingFile,
  createdDoc: OrganisationDocumentRead | PitchDocumentRead
): T {
  return {
    ...currentState,
    [key]: (currentState[key] ?? []).map(item =>
      item === createdItem ? { type: "existing", file: item.file, id: createdDoc.id ?? 0 } : item
    )
  };
}

export function completeFormUploadDeletion<T: AnyUploadQueue>(
  currentState: T,
  key: "awards" | "documents",
  deletedItem: PendingFile
): T {
  return {
    ...currentState,
    [key]: (currentState[key] ?? []).filter(pending => pending !== deletedItem)
  };
}

export function deleteUploadFromForm<T: AnyUploadQueue>(
  currentState: T,
  key: "awards" | "documents",
  deletedItem: PendingFile
): T {
  switch (deletedItem.type) {
    case "created": {
      return {
        ...currentState,
        [key]: (currentState[key] ?? []).filter(item => item !== deletedItem)
      };
    }
    case "existing": {
      const itemId = deletedItem.id;
      return {
        ...currentState,
        [key]: (currentState[key] ?? []).map(item =>
          item === deletedItem ? { type: "deleted", file: deletedItem.file, id: itemId } : item
        )
      };
    }
    case "deleted": {
      const itemId = deletedItem.id;
      return {
        ...currentState,
        [key]: (currentState[key] ?? []).map(item =>
          item === deletedItem ? { type: "existing", file: deletedItem.file, id: itemId } : item
        )
      };
    }
    default: {
      // eslint-disable-next-line babel/no-unused-expressions
      (deletedItem.type: empty);
      return currentState;
    }
  }
}

/**
 * Helper function that informs the user with an Alert that their draft has been remotely deleted, and then deletes
 * and exits the form
 *
 * @param dispatch
 * @param formId
 * @param projectType
 * @param err
 */
export function handleMissingDraftError(dispatch: Dispatch, formId: string, projectType: "pitch" | "offer", err: any) {
  if (err.code === errorCodes.API_NOT_FOUND) {
    Alert.alert(
      translate("drafts.alreadySubmitted"),
      translate("drafts.alreadySubmittedHelp"),
      [
        {
          text: translate("drafts.delete"),
          onPress: () => {
            dispatch(removeProjectRegistrationFormAndDraft(formId, projectType));
            displayScreenAsModal({
              name: screens.PROFILE_SCREEN.name,
              passProps: {
                selectedTab: "projects"
              }
            });
          }
        }
      ],
      { cancelable: false }
    );
  }
}
