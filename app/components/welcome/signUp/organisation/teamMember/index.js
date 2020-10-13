import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import { screens } from "../../../../../screens";
import translate from "../../../../../locales";
import PropTypes from "prop-types";
import Screen from "../../../../common/screen";
import RadioButton from "../../../../common/radio-button";
import { organisationCreationNavigation } from "../../../../../utils/navigation";

const options = [
  {
    key: "unavailable",
    text: translate("addTeamMember.details.needsAccount")
  },
  {
    key: "available",
    text: translate("addTeamMember.details.noAccount")
  }
];

export default class OrganisationTeamMemberScreen extends Component {
  static options(passProps) {
    return {
      ...organisationCreationNavigation(passProps.isEdit)
    };
  }

  static propTypes = {
    /**
     * Automatically sent by RNN if mounted in a navigation stack
     */
    componentId: PropTypes.string.isRequired,

    isEdit: PropTypes.bool,

    /**
     * The RNN component ID of the team member list screen
     */
    teamMemberListScreenComponentId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      memberSelected: options[1].key
    };
    this._startOrganisationTeamMember = this._startOrganisationTeamMember.bind(this);
    this._previousStep = this._previousStep.bind(this);
  }

  _startOrganisationTeamMember() {
    switch (this.state.memberSelected) {
      case options[0].key: {
        Navigation.push(this.props.componentId, {
          component: {
            ...screens.SIGNUP_ORGANISATION_INVITETEAMMEMBER,
            passProps: {
              teamMemberListScreenComponentId: this.props.teamMemberListScreenComponentId,
              isEdit: this.props.isEdit
            }
          }
        });
        break;
      }
      case options[1].key: {
        Navigation.push(this.props.componentId, {
          component: {
            ...screens.SIGNUP_ORGANISATION_ADDTEAMMEMBER,
            passProps: {
              teamMemberListScreenComponentId: this.props.teamMemberListScreenComponentId,
              isEdit: this.props.isEdit
            }
          }
        });
        break;
      }
      default:
        break;
    }
  }

  _previousStep() {
    Navigation.pop(this.props.componentId);
  }

  render() {
    return (
      <Screen
        secondary
        keyboard
        header={translate("addTeamMember.details.title")}
        subtext={translate("addTeamMember.details.subtext")}
        isNextButtonEnabled={true}
        nextTitle={translate("common.next")}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._startOrganisationTeamMember}
      >
        <RadioButton options={options} onOptionsChanged={selection => this.setState({ memberSelected: selection })} />
      </Screen>
    );
  }
}
