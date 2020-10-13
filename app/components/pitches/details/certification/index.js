//@flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component, type Node } from "react";
import { View, StyleSheet, Text, Linking } from "react-native";
import Styles from "../../../../styles";
import Touchable from "../../../common/touchable";
import { CarbonCertificationVersionReadAll, CarbonCertificationRead } from "wri-api";
import colours from "../../../../styles/colours";
import translate, { translateCarbonCertificationType } from "../../../../locales";

type Props = {|
  +certificationState: AsyncState<CarbonCertificationVersionReadAll>
|};

export default class Certification extends Component<Props> {
  renderCertificate(item: CarbonCertificationRead): Node {
    return (
      <View key={item.link}>
        <Text style={styles.viewTitleText}>{translate("project.certificates.certificate")}</Text>
        <Touchable
          accessibilityRole={"link"}
          onPress={() => Linking.openURL(item.link ?? "").catch(err => console.error("An error occurred", err))}
        >
          <Text style={styles.viewCertificateText}>{translateCarbonCertificationType(item.type)}</Text>
        </Touchable>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.info}>
        {(this.props.certificationState.data ?? []).map((item, index) => {
          const certificate = item.data;

          if (!certificate) {
            return null;
          }

          return this.renderCertificate(certificate);
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewTitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    color: Styles.Colours.brownGrey
  },
  viewCertificateText: {
    ...Styles.Text.h4,
    color: colours.softBlue,
    fontSize: 20,
    paddingBottom: 10
  },
  info: {
    paddingTop: Styles.Layout.Margins.small,
    paddingBottom: Styles.Layout.Margins.medium
  }
});
