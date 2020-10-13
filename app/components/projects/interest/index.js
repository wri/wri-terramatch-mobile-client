// @flow
import type { AsyncState } from "../../../redux/redux.types";
import type { ResolvedMatch } from "../../../redux/wri-api/interests";
import React, { Component } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import Styles from "../../../styles";
import { Navigation } from "react-native-navigation";
import { screens } from "../../../screens";
import Screen from "../../common/screen";
import InputLabel from "../../common/forms/input-label";
import RadioButton from "../../common/radio-button";
import Button from "../../common/button";
import ErrorView from "../../common/error";
import translate from "../../../locales";
import { withSafeArea } from "react-native-safe-area";
import LoadingIndicator from "../../common/loading-indicator";
import { InterestCreate, OfferReadAll, PitchReadAll } from "wri-api";
import type { Project } from "../../../utils/models.types";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  +createNewInterest: (interest: InterestCreate) => Promise<any>,
  +createNewForm: () => void,

  +myOffers: AsyncState<OfferReadAll>,
  +myPitches: AsyncState<PitchReadAll>,
  +myInterests: Array<ResolvedMatch>,

  /**
   * The ID of the project the user is wanting to register interest with
   */
  +theirProjectId: number,

  /**
   * The name of the project the user is wanting to register interest with
   */
  +theirProjectName: string,

  /**
   * The type (offer or pitch) of the project the user is wanting to register interest with
   */
  +theirProjectType: Project
|};

type State = {|
  projectSelected: ?number,
  hasSubmitted: boolean,
  error: ?Error
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class ProjectApplyInterestScreen extends Component<Props, State> {
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
      projectSelected: null,
      hasSubmitted: false,
      error: null
    };
  }

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _nextStep = async () => {
    let interest;
    if (this.props.theirProjectType === "pitch") {
      if ((this.props.myOffers.data ? this.props.myOffers.data : []).length > 0) {
        interest = InterestCreate.constructFromObject({
          initiator: "offer",
          offer_id: this.state.projectSelected,
          pitch_id: this.props.theirProjectId
        });
      } else {
        this.props.createNewForm();
        return;
      }
    } else if (this.props.theirProjectType === "offer") {
      if ((this.props.myPitches.data ? this.props.myPitches.data : []).length > 0) {
        interest = InterestCreate.constructFromObject({
          initiator: "pitch",
          offer_id: this.props.theirProjectId,
          pitch_id: this.state.projectSelected
        });
      } else {
        this.props.createNewForm();
        return;
      }
    }

    if (interest && this.props.createNewInterest) {
      this.setState({ hasSubmitted: true });
      try {
        await this.props.createNewInterest(interest);
        this.setState({ hasSubmitted: false, error: null, projectSelected: null });
        Navigation.push(this.props.componentId, {
          component: {
            ...screens.APPLY_INTEREST_SUCCESS_SCREEN
          }
        });
      } catch (err) {
        this.setState({ hasSubmitted: false, error: err });
      }
    }
  };

  navigationButtonPressed(event: any) {
    switch (event.buttonId) {
      case "Cancel": {
        Navigation.popToRoot(this.props.componentId);
        break;
      }
    }
  }

  updateInterest = (selection: any) => {
    this.setState({ projectSelected: selection });
  };

  render() {
    const myProjectData =
      this.props.theirProjectType === "offer" ? this.props.myPitches?.data ?? [] : this.props.myOffers?.data ?? [];
    const myProjectType = this.props.theirProjectType === "offer" ? "Pitch" : "Funding";

    const createButtonTextKey = this.props.theirProjectType === "offer" ? "Pitch" : "Offer";
    const userHasProjects = myProjectData.length > 0;

    const nextButtonText = userHasProjects
      ? translate("match.interest.apply")
      : translate(`create${createButtonTextKey}.create${createButtonTextKey}`);

    const myProjectIdType = this.props.theirProjectType === "offer" ? "pitch_id" : "offer_id";
    const theirProjectIdType = this.props.theirProjectType === "offer" ? "offer_id" : "pitch_id";
    const interestsFilteredById = this.props.myInterests.filter(
      interest => interest[theirProjectIdType] === this.props.theirProjectId
    );

    // set disabled flag if user has already registered interest with this project
    const radio_options = myProjectData.map(project => ({
      key: project.id,
      text: project.name,
      disabled: interestsFilteredById.some(interest => interest[myProjectIdType] === project.id)
    }));

    const hasOptionsAvailable = myProjectData.length >= (interestsFilteredById && interestsFilteredById.length);
    const hasNoOptionsAvailable = (interestsFilteredById ? interestsFilteredById : []).length >= myProjectData.length;

    const hasUserSelectedOption = this.state.projectSelected ? this.state.projectSelected : false;
    const userHasOptions = userHasProjects ? hasOptionsAvailable && hasUserSelectedOption : true;

    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        header={translate(`match.interest.choose${myProjectType}`)}
        subtext={translate(`match.interest.subheading${myProjectType}`, null, { name: this.props.theirProjectName })}
        isNextButtonEnabled={userHasOptions && !this.state.hasSubmitted}
        onPreviousButtonPressed={this._previousStep}
        nextTitle={nextButtonText}
        onNextButtonPressed={this._nextStep}
      >
        {userHasProjects ? (
          <>
            <InputLabel title={translate(`match.interest.choose${myProjectType}Help`)} />
            <RadioButton
              style={styles.radioInput}
              options={radio_options}
              onOptionsChanged={selection => this.updateInterest(selection)}
            />
            {hasNoOptionsAvailable && (
              <>
                <Text style={Styles.Text.body}>{translate("match.interest.alreadyApplied")}</Text>
                <Button
                  style={Styles.Buttons.centeredPrimaryButton}
                  onPress={this._createOfferOrPitch}
                  title={translate(`create${createButtonTextKey}.create${createButtonTextKey}`)}
                />
              </>
            )}
          </>
        ) : (
          <Text style={Styles.Text.body}>{translate(`match.interest.no${myProjectType}`)}</Text>
        )}

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
