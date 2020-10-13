// @flow

import type { AppState, Dispatch, ComponentProps } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";

import PitchDetailsScreen from "../../../../components/pitches/project-creation/details";
import { connect } from "react-redux";
import { reconcilePitchRegistrationForm } from "../../../../api/wri/helpers";
import { updatePitchFormDetails } from "../../../../redux/wri-api/pitches/actions";

type OwnProps = {|
  componentId: string,
  formMetadata: ProjectFormProps
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const form = reconcilePitchRegistrationForm(state.wri.pitches.registrationForm[props.formMetadata.formId]);
  return {
    anticipated_outcome: form.details.anticipated_outcome,
    problem: form.details.problem,
    description: form.details.description,
    who_is_involved: form.details.who_is_involved,
    training_type: form.details.training_type,
    use_of_resources: form.details.use_of_resources,
    future_maintenance: form.details.future_maintenance,
    training_amount_people: form.details.training_amount_people,
    people_working_in: form.details.people_working_in,
    people_amount_nearby: form.details.people_amount_nearby,
    people_amount_abroad: form.details.people_amount_abroad,
    people_amount_employees: form.details.people_amount_employees,
    people_amount_volunteers: form.details.people_amount_volunteers,
    benefited_people: form.details.benefited_people,
    local_community_involvement: form.details.local_community_involvement,
    training_involved: form.details.training_involved
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    updateOutcome: (anticipated_outcome: string) => {
      dispatch(
        updatePitchFormDetails(props.formMetadata.formId, {
          anticipated_outcome
        })
      );
    },
    updateProblem: (problem: string) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { problem }));
    },
    updateDescription: (description: string) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { description }));
    },
    updateWhoIsInvolved: (who_is_involved: string) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { who_is_involved }));
    },
    updateTrainingType: (training_type: string) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { training_type }));
    },
    updateUseOfResources: (use_of_resources: string) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { use_of_resources }));
    },
    updateFutureMaintenance: (future_maintenance: string) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { future_maintenance }));
    },
    updateTrainingAmountPeople: (training_amount_people: number) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { training_amount_people }));
    },
    updatePeopleWorkingIn: (people_working_in: string) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { people_working_in }));
    },
    updatePeopleAmountNearby: (people_amount_nearby: number) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { people_amount_nearby }));
    },
    updatePeopleAmountAbroad: (people_amount_abroad: number) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { people_amount_abroad }));
    },
    updatePeopleAmountEmployees: (people_amount_employees: number) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { people_amount_employees }));
    },
    updatePeopleAmountVolunteers: (people_amount_volunteers: number) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { people_amount_volunteers }));
    },
    updateBenefitedPeople: (benefited_people: number) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { benefited_people }));
    },
    updateLocalCommunityOptions: (local_community_involvement: boolean) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { local_community_involvement }));
    },
    updateTrainingInvolved: (training_involved: boolean) => {
      dispatch(updatePitchFormDetails(props.formMetadata.formId, { training_involved }));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(PitchDetailsScreen);
