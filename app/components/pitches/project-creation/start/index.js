// @flow

import React, { Component } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import Styles from "../../../../styles";
import { Navigation } from "react-native-navigation";
import Screen from "../../../common/screen";
import RadioButton from "../../../common/radio-button";
import translate from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import { projectCreationNavigation } from "../../../../utils/navigation";
import type { FormOverview } from "../../../../api/wri/helpers";
import LoadingIndicator from "../../../common/loading-indicator";
import Banner from "../../../common/banner";
const draftBannerIcon = require("../../../../assets/icons/projects/draft.png");

/**
 * The items in the radio button list on this screen can have a form ID (an identifier local to the app), a draft ID
 * (provided by the server if the form has been successfully synced), or both.
 *
 * For that reason, we need access to both those IDs in order to determine how to handle the radio option. However, because
 * radio buttons only accept a single string as an option key, we concatenate the two IDs together and decode them when
 * needed. This type represents the decoded key.
 */
type DecodedRadioOptionKey = {
  formId: ?string,
  draftId: ?number
};

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  +createOrResumeDraft: (formId: ?string, draftId: ?number) => void,
  +type: string,
  /**
   * A map of form IDs to the name of the draft they relate to, so that those forms can be resumed
   */
  +drafts: Array<FormOverview>,
  +updateDrafts: () => Promise<void>
|};

type State = {|
  +selectedOptionKey: ?string,
  +isFetchingDrafts: boolean
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

const new_draft_options = [
  {
    key: "new",
    text: translate("drafts.startNew")
  }
];

export default class PitchStartScreen extends Component<Props, State> {
  static options(passProps: { type: "pitch" | "offer" }) {
    return {
      ...projectCreationNavigation({
        type: passProps.type,
        isDraft: false
      })
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      selectedOptionKey: null,
      isFetchingDrafts: true
    };
    this.updateProjectSelection = this.updateProjectSelection.bind(this);
  }

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  async componentDidMount(): void {
    await this.fetchDraftData();
  }

  fetchDraftData = async () => {
    try {
      await this.props.updateDrafts();
    } finally {
      this.setState({ isFetchingDrafts: false });
    }
  };

  navigationButtonPressed(event: any) {
    if (event.buttonId === "Cancel") {
      {
        Navigation.popToRoot(this.props.componentId);
      }
    }
  }

  updateProjectSelection = (selection: string) => {
    this.setState({ selectedOptionKey: selection });
  };

  _continueDraft = () => {
    const { selectedOptionKey } = this.state;
    if (selectedOptionKey === "new") {
      this.props.createOrResumeDraft(null, null);
    } else if (selectedOptionKey) {
      const { formId, draftId } = this._decodeRadioOptionKey(selectedOptionKey);
      this.props.createOrResumeDraft(formId, draftId);
    } else {
      console.warn("3SC", "_continueDraft invoked without a selectedOptionKey value");
    }
    Navigation.pop(this.props.componentId);
  };

  /**
   * Encode both the optional form ID and the optional draft ID into a single string, so it can be passed to a radio
   * button as an identifier
   */
  _encodeRadioOptionKey = (item: DecodedRadioOptionKey): string => {
    return `${item.formId ?? ""}|${item.draftId ?? ""}`;
  };

  /**
   * Decode the composite key passed to the radio button, so we have access to the original draft and form IDs
   */
  _decodeRadioOptionKey = (key: string): DecodedRadioOptionKey => {
    const [formId, draftId] = key.split("|");
    return {
      formId: formId || null,
      draftId: draftId ? parseInt(draftId) : null
    };
  };

  render() {
    const draft_options = (this.props.drafts ?? [])
      .map((item, index) => ({
        key: this._encodeRadioOptionKey(item),
        text: item.name ? item.name : translate("mobile.common.unnamed"),
        sectionHeading: index === 0 ? translate("drafts.drafts") : null
      }))
      .sort((a, b) => a.text.localeCompare(b.text))
      .map((item, index) => ({
        ...item,
        sectionHeading: index === 0 ? translate("drafts.drafts") : null
      }));
    const allOptions = [...new_draft_options, ...draft_options];
    const projectTypeKey = this.props.type === "offer" ? "createOffer" : "createPitch";
    const isOptionSelected = this.state.selectedOptionKey !== null;
    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        header={translate(`${projectTypeKey}.details.start`)}
        subtext={translate(`${projectTypeKey}.details.startHelp`)}
        onNextButtonPressed={this._continueDraft}
        nextTitle={translate("common.continue")}
        isNextButtonEnabled={isOptionSelected}
        isBackButtonHidden={true}
      >
        <RadioButton
          style={styles.radioInput}
          options={allOptions}
          selectedOption={this.state.selectedOptionKey}
          onOptionsChanged={this.updateProjectSelection}
        />
        {!this.state.isFetchingDrafts && draft_options.length === 0 && (
          <>
            <Text style={styles.headingText}>{translate("drafts.drafts")}</Text>
            <Banner imageSource={draftBannerIcon} header={translate("drafts.empty", "No drafts found")} />
          </>
        )}
        {this.state.isFetchingDrafts && <LoadingIndicator size={"large"} />}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  radioInput: {
    marginBottom: Styles.Layout.Margins.small,
    paddingTop: Styles.Layout.Margins.tiny
  },
  headingText: {
    ...Styles.Text.h5,
    ...Styles.Text.uppercase,
    color: Styles.Colours.black,
    marginVertical: Styles.Layout.Margins.small
  }
});
