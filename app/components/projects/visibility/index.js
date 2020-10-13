// @flow
import type { AsyncState } from "../../../redux/redux.types";
import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Styles from "../../../styles";
import { Navigation } from "react-native-navigation";
import { screens } from "../../../screens";
import Screen from "../../common/screen";
import RadioButton from "../../common/radio-button";
import ErrorView from "../../common/error";
import translate, { translateVisibility } from "../../../locales";
import { withSafeArea } from "react-native-safe-area";
import LoadingIndicator from "../../common/loading-indicator";
import { OfferRead, OfferVisibility, PitchRead, PitchVisibility, VisibilityReadAll } from "wri-api";
import type { Project } from "../../../utils/models.types";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  +project: OfferRead | PitchRead,
  +projectType: Project,
  +visibilities: AsyncState<VisibilityReadAll>,
  +updateVisibility: (Project, OfferVisibility | PitchVisibility, OfferRead | PitchRead) => Promise<void>
|};

type State = {| visibility: string, hasSubmitted: boolean, error: ?string |};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class ProjectVisibilitiesScreen extends Component<Props, State> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: translate("projects.title"),
          alignment: "fill"
        },
        rightButtons: [
          {
            id: "Cancel",
            text: translate("common.cancel")
          }
        ]
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      visibility: this.props.project.visibility ?? "looking",
      hasSubmitted: false,
      error: null
    };
  }

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _nextStep = async () => {
    this.setState({ hasSubmitted: true });
    try {
      await this.props.updateVisibility(
        this.props.projectType,
        { visibility: this.state.visibility },
        this.props.project
      );
    } catch (err) {
      this.setState({ hasSubmitted: false, error: err });
      return;
    }

    this.setState({ hasSubmitted: false, error: null });

    if (this.state.visibility === "fully_invested_funded") {
      Navigation.push(this.props.componentId, {
        component: {
          ...screens.PROJECTS_FULLY_FUNDED_SCREEN,
          passProps: {
            projectType: this.props.projectType
          }
        }
      });
    } else {
      Navigation.popToRoot(this.props.componentId);
    }
  };

  navigationButtonPressed(event: any) {
    if (event.buttonId === "Cancel") {
      {
        Navigation.popToRoot(this.props.componentId);
      }
    }
  }

  updateVisibility = (selection: string) => {
    this.setState({ visibility: selection });
  };

  render() {
    const visibilitiesData = this.props.visibilities?.data ?? [];
    const radio_options = visibilitiesData.map(visibility => ({
      key: visibility.visibility,
      text: translateVisibility(this.props.projectType, visibility.visibility)
    }));

    const hasOptionsAvailable = visibilitiesData.length >= 0;
    const hasUserSelectedOption = !!this.state.visibility;
    const userHasOptions = hasOptionsAvailable && hasUserSelectedOption;

    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        header={translate("projectStatus.visibility.title")}
        subtext={translate("projectStatus.visibility.subtext")}
        isNextButtonEnabled={userHasOptions && !this.state.hasSubmitted}
        onPreviousButtonPressed={this._previousStep}
        nextTitle={translate("common.submit")}
        onNextButtonPressed={this._nextStep}
      >
        <RadioButton
          style={styles.radioInput}
          options={radio_options}
          onOptionsChanged={selection => this.updateVisibility(selection)}
          selectedOption={this.state.visibility}
        />
        {this.state.error && <ErrorView error={this.state.error} />}
        {this.state.hasSubmitted && <LoadingIndicator />}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  radioInput: {
    marginBottom: Styles.Layout.Margins.small,
    paddingTop: Styles.Layout.Margins.tiny
  }
});
