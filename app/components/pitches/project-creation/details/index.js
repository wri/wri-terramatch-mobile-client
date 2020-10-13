// @flow

import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Styles from "../../../../styles";
import { Navigation } from "react-native-navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ProjectFlowScreen from "../screen";
import InputLabel from "../../../common/forms/input-label/";
import ValidatedTextInput from "../../../common/validated-input";
import RadioButton from "../../../common/radio-button";
import translate from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import Validation from "../../../../utils/validation";
import textInputProps from "../../../../constants/textInputProps";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * The ID of the project form that is being modified
   */
  +formMetadata: ProjectFormProps,

  /**
   * Updates the saved data so that it can be resumed
   */
  +updateOutcome: string => void,
  +updateProblem: string => void,
  +updateWhoIsInvolved: string => void,
  +updateTrainingType: string => void,
  +updateUseOfResources: string => void,
  +updateFutureMaintenance: string => void,
  +updateDescription: string => void,
  +updateTrainingAmountPeople: number => void,
  +updatePeopleWorkingIn: string => void,
  +updatePeopleAmountNearby: number => void,
  +updatePeopleAmountAbroad: number => void,
  +updatePeopleAmountEmployees: number => void,
  +updatePeopleAmountVolunteers: number => void,
  +updateBenefitedPeople: number => void,
  +updateLocalCommunityOptions: boolean => void,
  +updateTrainingInvolved: boolean => void,

  /**
   * The data being displayed in the form
   */
  +anticipated_outcome: ?string,
  +problem: ?string,
  +who_is_involved: ?string,
  +training_type: ?string,
  +use_of_resources: ?string,
  +future_maintenance: ?string,
  +description: ?string,
  +training_amount_people: ?number,
  +people_working_in: ?string,
  +people_amount_nearby: ?number,
  +people_amount_abroad: ?number,
  +people_amount_employees: ?number,
  +people_amount_volunteers: ?number,
  +benefited_people: ?number,
  +local_community_involvement: ?boolean,
  +training_involved: ?boolean
|};

const SafeAreaView = withSafeArea(KeyboardAwareScrollView, "padding", "bottom");

const radio_options = [
  {
    key: true,
    text: translate("common.yes")
  },
  {
    key: false,
    text: translate("common.no")
  }
];

export default class PitchDetailsScreen extends Component<Props> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  render() {
    const isLocalCommunityValid = Validation.pitchLocalCommunity.validate(this.props.local_community_involvement);
    const isTrainingInvolvedValid = Validation.pitchTrainingInvolved.validate(this.props.training_involved);
    const isAnticipatedOutcomeValid = Validation.pitchAnticipatedOutcome.validate(this.props.anticipated_outcome ?? "");
    const isProblemValid = Validation.pitchProblem.validate(this.props.problem ?? "");
    const isDescriptionValid = Validation.pitchDescription.validate(this.props.description ?? "");
    const isWhoIsInvolvedValid = Validation.pitchWhoIsInvolved.validate(this.props.who_is_involved ?? "");
    const isTrainingTypeValid = Validation.pitchTrainingType.validate(
      this.props.training_type ?? "",
      this.props.training_involved ?? false
    );
    const isUseOfResourcesValid = Validation.pitchUseOfResources.validate(this.props.use_of_resources ?? "");
    const isFutureMaintenanceValid = Validation.pitchFutureMaintenance.validate(this.props.future_maintenance ?? "");
    const isPeopleWorkingInValid = Validation.pitchPeopleWorkingIn.validate(this.props.people_working_in ?? "");
    const isPeopleAmountNearbyValid = Validation.pitchPeopleAmountNearby.validate(this.props.people_amount_nearby);
    const isPeopleAmountAbroadValid = Validation.pitchPeopleAmountAbroad.validate(this.props.people_amount_abroad);
    const isPeopleAmountEmployeesValid = Validation.pitchPeopleAmountEmployees.validate(
      this.props.people_amount_employees
    );
    const isPeopleAmountVolunteersValid = Validation.pitchPeopleAmountVolunteers.validate(
      this.props.people_amount_volunteers
    );
    const isTrainingAmountPeopleValid = Validation.pitchTrainingAmountPeople.validate(
      this.props.training_amount_people,
      this.props.training_involved ?? false
    );
    const isBenefitedPeopleValid = Validation.pitchBenefitedPeople.validate(this.props.benefited_people);
    const allInputsValid =
      isAnticipatedOutcomeValid &&
      isProblemValid &&
      isDescriptionValid &&
      isWhoIsInvolvedValid &&
      isTrainingTypeValid &&
      isUseOfResourcesValid &&
      isFutureMaintenanceValid &&
      isTrainingAmountPeopleValid &&
      isPeopleAmountAbroadValid &&
      isPeopleAmountEmployeesValid &&
      isPeopleAmountVolunteersValid &&
      isBenefitedPeopleValid &&
      isLocalCommunityValid &&
      isTrainingInvolvedValid &&
      isPeopleWorkingInValid;

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        scrollComponent={SafeAreaView}
        header={translate("createPitch.details.details")}
        subtext={translate("createPitch.details.detailsHelp")}
        isNextButtonEnabled={allInputsValid}
        // set scrollReset to false to resolve issue with  keyboard-aware-scroll-view:
        // https://3sidedcube.atlassian.net/browse/WRM-1491
        // https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/313
        enableResetScrollToCoords={false}
      >
        <InputLabel title={translate("createPitch.details.description")} />
        <ValidatedTextInput
          key="organisation-description-input"
          ref="organisation-description-input"
          placeholder={translate("createPitch.details.descriptionHelp")}
          valid={isDescriptionValid}
          value={this.props.description}
          message={Validation.pitchDescription.errorString(this.props.description ?? "")}
          onChangeText={this.props.updateDescription}
          onBlur={this.props.formMetadata.syncDraft}
          style={styles.inputText}
          {...textInputProps.multiLineText}
        />
        <InputLabel title={translate("createPitch.details.problem")} />
        <ValidatedTextInput
          key="organisation-problem-input"
          ref="organisation-problem-input"
          placeholder={translate("createPitch.details.problemHelp")}
          valid={isProblemValid}
          value={this.props.problem}
          message={Validation.pitchProblem.errorString(this.props.problem ?? "")}
          onChangeText={this.props.updateProblem}
          onBlur={this.props.formMetadata.syncDraft}
          style={styles.inputText}
          {...textInputProps.multiLineText}
        />
        <InputLabel title={translate("createPitch.details.anticipatedOutcome")} />
        <ValidatedTextInput
          key="organisation-anticipatedOutcome-input"
          ref="organisation-anticipatedOutcome-input"
          placeholder={translate("createPitch.details.anticipatedOutcomeHelp")}
          valid={isAnticipatedOutcomeValid}
          value={this.props.anticipated_outcome}
          message={Validation.pitchAnticipatedOutcome.errorString(this.props.anticipated_outcome ?? "")}
          onChangeText={this.props.updateOutcome}
          onBlur={this.props.formMetadata.syncDraft}
          style={styles.inputText}
          {...textInputProps.multiLineText}
        />
        <InputLabel title={translate("createPitch.details.whoIsInvolved")} />
        <ValidatedTextInput
          key="organisation-whoIsInvolved-input"
          ref="organisation-whoIsInvolved-input"
          placeholder={translate("createPitch.details.whoIsInvolvedHelp")}
          valid={isWhoIsInvolvedValid}
          value={this.props.who_is_involved}
          message={Validation.pitchWhoIsInvolved.errorString(this.props.who_is_involved ?? "")}
          onChangeText={this.props.updateWhoIsInvolved}
          onBlur={this.props.formMetadata.syncDraft}
          style={styles.inputText}
          {...textInputProps.multiLineText}
        />
        <InputLabel title={translate("createPitch.details.localCommunityInvolvement")} />
        <RadioButton
          style={styles.radioInput}
          options={radio_options}
          selectedOption={this.props.local_community_involvement}
          onOptionsChanged={selection => {
            this.props.updateLocalCommunityOptions(selection);
            this.props.formMetadata.syncDraft();
          }}
        />
        <InputLabel title={translate("createPitch.details.trainingInvolved")} />
        <RadioButton
          style={styles.radioInput}
          options={radio_options}
          selectedOption={this.props.training_involved}
          onOptionsChanged={selection => {
            this.props.updateTrainingInvolved(selection);
            this.props.formMetadata.syncDraft();
          }}
        />

        {!!this.props.training_involved && (
          <>
            <InputLabel title={translate("createPitch.details.trainingType")} />
            <ValidatedTextInput
              key="organisation-trainingType-input"
              ref="organisation-trainingType-input"
              placeholder={translate("createPitch.details.trainingTypeHelp")}
              valid={isTrainingTypeValid}
              value={this.props.training_type}
              message={Validation.pitchTrainingType.errorString(
                this.props.training_type ?? "",
                this.props.training_involved ?? false
              )}
              onChangeText={this.props.updateTrainingType}
              onBlur={this.props.formMetadata.syncDraft}
              style={styles.inputText}
              {...textInputProps.multiLineText}
            />
            <InputLabel title={translate("createPitch.details.trainingAmountPeople")} />
            <ValidatedTextInput
              key="organisation-trainingAmountPeople-input"
              ref="organisation-trainingAmountPeople-input"
              placeholder={translate("createPitch.details.trainingAmountPeople")}
              valid={isTrainingAmountPeopleValid}
              value={this.props.training_amount_people}
              message={Validation.pitchTrainingAmountPeople.errorString(
                this.props.training_amount_people ?? 0,
                this.props.training_involved ?? false
              )}
              onSubmitEditing={() => {
                this.refs["organisation-peopleWorkingIn-input"].focus();
              }}
              onChangeText={this.props.updateTrainingAmountPeople}
              onBlur={this.props.formMetadata.syncDraft}
              returnKeyType="done"
              style={{ marginBottom: Styles.Layout.Margins.small }}
              {...textInputProps.integer}
            />
          </>
        )}
        <InputLabel title={translate("createPitch.details.peopleWorkingIn")} />
        <ValidatedTextInput
          key="organisation-peopleWorkingIn-input"
          ref="organisation-peopleWorkingIn-input"
          placeholder={translate("createPitch.details.peopleWorkingInHelp")}
          valid={isPeopleWorkingInValid}
          value={this.props.people_working_in}
          message={Validation.pitchPeopleWorkingIn.errorString(this.props.people_working_in ?? "")}
          onChangeText={this.props.updatePeopleWorkingIn}
          onBlur={this.props.formMetadata.syncDraft}
          style={styles.inputText}
          {...textInputProps.multiLineText}
        />
        <InputLabel title={translate("createPitch.details.peopleAmountNearby")} />
        <ValidatedTextInput
          key="organisation-peopleAmountNearby-input"
          ref="organisation-peopleAmountNearby-input"
          placeholder={translate("createPitch.details.peopleAmountNearby")}
          valid={isPeopleAmountNearbyValid}
          value={this.props.people_amount_nearby}
          message={Validation.pitchPeopleAmountNearby.errorString(this.props.people_amount_nearby)}
          onSubmitEditing={() => {
            this.refs["organisation-peopleAmountAbroad-input"].focus();
          }}
          onChangeText={this.props.updatePeopleAmountNearby}
          onBlur={this.props.formMetadata.syncDraft}
          returnKeyType="done"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.integer}
        />
        <InputLabel title={translate("createPitch.details.peopleAmountAbroad")} />
        <ValidatedTextInput
          key="organisation-peopleAmountAbroad-input"
          ref="organisation-peopleAmountAbroad-input"
          placeholder={translate("createPitch.details.peopleAmountAbroad")}
          valid={isPeopleAmountAbroadValid}
          value={this.props.people_amount_abroad}
          message={Validation.pitchPeopleAmountAbroad.errorString(this.props.people_amount_abroad)}
          onSubmitEditing={() => {
            this.refs["organisation-peopleAmountEmployees-input"].focus();
          }}
          onChangeText={this.props.updatePeopleAmountAbroad}
          onBlur={this.props.formMetadata.syncDraft}
          returnKeyType="done"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.integer}
        />
        <InputLabel title={translate("createPitch.details.peopleAmountEmployees")} />
        <ValidatedTextInput
          key="organisation-peopleAmountEmployees-input"
          ref="organisation-peopleAmountEmployees-input"
          placeholder={translate("createPitch.details.peopleAmountEmployees")}
          valid={isPeopleAmountEmployeesValid}
          value={this.props.people_amount_employees}
          message={Validation.pitchPeopleAmountEmployees.errorString(this.props.people_amount_employees)}
          onSubmitEditing={() => {
            this.refs["organisation-peopleAmountVolunteers-input"].focus();
          }}
          onChangeText={this.props.updatePeopleAmountEmployees}
          onBlur={this.props.formMetadata.syncDraft}
          returnKeyType="done"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.integer}
        />
        <InputLabel title={translate("createPitch.details.peopleAmountVolunteers")} />
        <ValidatedTextInput
          key="organisation-peopleAmountVolunteers-input"
          ref="organisation-peopleAmountVolunteers-input"
          placeholder={translate("createPitch.details.peopleAmountVolunteers")}
          valid={isPeopleAmountVolunteersValid}
          value={this.props.people_amount_volunteers}
          message={Validation.pitchPeopleAmountVolunteers.errorString(this.props.people_amount_volunteers)}
          onSubmitEditing={() => {
            this.refs["organisation-benefitedPeople-input"].focus();
          }}
          onChangeText={this.props.updatePeopleAmountVolunteers}
          onBlur={this.props.formMetadata.syncDraft}
          returnKeyType="done"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.integer}
        />
        <InputLabel title={translate("createPitch.details.benefitedPeople")} />
        <ValidatedTextInput
          key="organisation-benefitedPeople-input"
          ref="organisation-benefitedPeople-input"
          placeholder={translate("createPitch.details.benefitedPeople")}
          valid={isBenefitedPeopleValid}
          value={this.props.benefited_people}
          message={Validation.pitchBenefitedPeople.errorString(this.props.benefited_people)}
          onSubmitEditing={() => {
            this.refs["organisation-futureMaintenance-input"].focus();
          }}
          onChangeText={this.props.updateBenefitedPeople}
          onBlur={this.props.formMetadata.syncDraft}
          returnKeyType="done"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.integer}
        />
        <InputLabel title={translate("createPitch.details.futureMaintenance")} />
        <ValidatedTextInput
          key="organisation-futureMaintenance-input"
          ref="organisation-futureMaintenance-input"
          placeholder={translate("createPitch.details.futureMaintenanceHelp")}
          valid={isFutureMaintenanceValid}
          value={this.props.future_maintenance}
          message={Validation.pitchFutureMaintenance.errorString(this.props.future_maintenance ?? "")}
          onChangeText={this.props.updateFutureMaintenance}
          onBlur={this.props.formMetadata.syncDraft}
          style={styles.inputText}
          {...textInputProps.multiLineText}
        />
        <InputLabel title={translate("createPitch.details.useOfResources")} />
        <ValidatedTextInput
          key="organisation-useOfResources-input"
          ref="organisation-useOfResources-input"
          placeholder={translate("createPitch.details.useOfResourcesHelp")}
          valid={isUseOfResourcesValid}
          value={this.props.use_of_resources}
          message={Validation.pitchUseOfResources.errorString(this.props.use_of_resources ?? "")}
          onPress={this.props.formMetadata.pushNextScreen.bind(this, this.props.componentId)}
          onChangeText={this.props.updateUseOfResources}
          onBlur={this.props.formMetadata.syncDraft}
          style={styles.inputText}
          {...textInputProps.multiLineText}
        />
      </ProjectFlowScreen>
    );
  }
}

const styles = StyleSheet.create({
  inputText: {
    height: 172,
    borderColor: Styles.Colours.border,
    borderWidth: 1,
    borderRadius: Styles.Layout.BorderRadius.small
  },
  radioInput: {
    marginBottom: Styles.Layout.Margins.small,
    paddingTop: Styles.Layout.Margins.tiny
  }
});
