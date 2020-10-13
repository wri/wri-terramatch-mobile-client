// @flow

import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import { ScrollView, StyleSheet } from "react-native";
import Styles from "../../../../styles";
import Screen from "../../../common/screen";
import Button from "../../../common/button";
import translate from "../../../../locales";
import { withSafeArea } from "react-native-safe-area";
import type { ProjectFormProps } from "../../../../screens/projectForms";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * The ID of the project form that is being modified
   */
  +formMetadata: ProjectFormProps
|};

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class PitchSuccessScreen extends Component<Props> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      topBar: {
        title: {
          text: passProps.formMetadata.type === "offer" ? translate("offer.title") : translate("projects.title"),
          alignment: "fill"
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
  }

  _onFinish = () => {
    Navigation.dismissModal(this.props.componentId);
  };

  render() {
    const projectTypeKey = this.props.formMetadata.type === "offer" ? "createOffer" : "createPitch";
    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        header={translate(`${projectTypeKey}.successTitle`)}
        subtext={translate(`${projectTypeKey}.success`)}
      >
        <Button
          style={[styles.createButton, Styles.Buttons.quaternary]}
          onPress={this._onFinish}
          title={translate(`${projectTypeKey}.successLinkText`)}
        />
      </Screen>
    );
  }
}
const styles = StyleSheet.create({
  createButton: {
    marginTop: 100
  }
});
