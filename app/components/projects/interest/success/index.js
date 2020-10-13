// @flow
import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import { tabComponentIds } from "../../../../screens";
import Screen from "../../../common/screen";
import translate from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class ProjectApplyInterestSuccessScreen extends Component<Props> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: translate("projects.title"),
          alignment: "fill"
        },
        rightButtons: []
      }
    };
  }

  constructor(props: Props) {
    super(props);
  }

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _nextStep = () => {
    Navigation.popToRoot(this.props.componentId);
    Navigation.mergeOptions(tabComponentIds.ROOT, {
      bottomTabs: {
        currentTabId: tabComponentIds.CONNECTIONS
      }
    });
  };

  render() {
    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        header={translate("match.interest.success")}
        subtext={translate("match.interest.successMessage")}
        isNextButtonEnabled={true}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._nextStep}
      />
    );
  }
}
