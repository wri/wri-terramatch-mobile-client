import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import Styles from "../../../../styles";
import { screens } from "../../../../screens/";
import Screen from "../../../common/screen";
import Button from "../../../common/button/";
import translate from "../../../../locales/";
import PropTypes from "prop-types";
import { logAddProjectEvent } from "../../../../utils/analytics";

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";

const homeIcon = require("../../../../assets/icons/welcome/home.png");

export default class OrganisationStartScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate("signup.title"),
          alignment: "fill"
        },
        rightButtons: [
          {
            id: NAV_BAR_BUTTON_ID_HOME,
            icon: homeIcon
          }
        ]
      }
    };
  }

  static propTypes = {
    /**
     * Automatically sent by RNN if mounted in a navigation stack
     */
    componentId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this._startSignUpFlow = this._startSignUpFlow.bind(this);
  }

  navigationButtonPressed(event) {
    switch (event.buttonId) {
      case NAV_BAR_BUTTON_ID_HOME: {
        Navigation.popToRoot(this.props.componentId);
        break;
      }
    }
  }

  _startSignUpFlow() {
    logAddProjectEvent("start");
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_DETAILS
      }
    });
  }

  render() {
    return (
      <Screen secondary header={translate("welcome.title")} subtext={translate("welcome.subtext")}>
        <Button
          style={Styles.Buttons.centeredPrimaryButton}
          onPress={this._startSignUpFlow}
          title={translate("welcome.button")}
        />
      </Screen>
    );
  }
}
