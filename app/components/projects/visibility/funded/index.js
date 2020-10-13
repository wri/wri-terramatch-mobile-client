// @flow
import React, { Component } from "react";
import { View, ScrollView, Image, Text, StyleSheet, BackHandler } from "react-native";
import { Navigation } from "react-native-navigation";
import type { Project } from "../../../../utils/models.types";
import translate from "../../../../locales";
import CONGRATS_ICON from "../../../../assets/icons/projects/visibility/congratulation_ic.png";
import Layout from "../../../../styles/layout";
import Styles from "../../../../styles";
import Button from "../../../common/button";
type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  +projectType: Project
|};

const CloseIcon = require("../../../../assets/icons/bubble/close.png");
const NAV_BAR_BUTTON_ID_CLOSE = "Cancel";

export default class ProjectFullyFundedScreen extends Component<Props> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: translate("projects.title"),
          alignment: "fill"
        },
        leftButtons: [
          {
            icon: CloseIcon,
            id: NAV_BAR_BUTTON_ID_CLOSE,
            text: translate("common.cancel")
          }
        ],
        rightButtons: []
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed(event: { buttonId: string }) {
    if (event.buttonId === NAV_BAR_BUTTON_ID_CLOSE) {
      this.close();
    }
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.close);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.close);
  }
  close = () => {
    Navigation.popToRoot(this.props.componentId);
    return true;
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.header}>{translate("projectStatus.visibility.title")}</Text>
          <Image resizeMode="contain" style={styles.image} source={CONGRATS_ICON} />
          <Text style={styles.subtext}>{translate(`projectStatus.congratulations.${this.props.projectType}`)}</Text>
          <Text style={[Styles.Text.body, { marginHorizontal: Layout.Margins.medium }, Styles.Text.centered]}>
            {translate(`projectStatus.congratulationsHelp.${this.props.projectType}`)}
          </Text>
          <Button
            style={[Styles.Buttons.quaternary, styles.closeButton]}
            onPress={this.close}
            title={translate("common.close")}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    padding: Layout.Margins.medium,
    justifyContent: "center",
    alignItems: "center"
  },
  image: { width: 120, height: 140 },
  header: {
    ...Styles.Text.secondaryH2,
    ...Styles.Text.centered,
    ...Styles.Text.uppercase,
    marginTop: Styles.Layout.Margins.large,
    marginBottom: Styles.Layout.Margins.medium
  },
  subtext: {
    ...Styles.Text.h3,
    ...Styles.Text.centered,
    ...Styles.Text.uppercase,
    marginTop: Styles.Layout.Margins.large,
    marginBottom: Styles.Layout.Margins.medium
  },
  closeButton: {
    marginTop: 60,
    width: "50%",
    alignSelf: "center"
  }
});
