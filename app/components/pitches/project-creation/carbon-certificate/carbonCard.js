// @flow

import type { PendingCarbonCertification } from "../../../../redux/wri-api/pitches";
import React, { Component } from "react";
import { View, StyleSheet, Text, Platform, Image, Alert } from "react-native";
import Styles from "../../../../styles";
import InputLabel from "../../../../components/common/forms/input-label";
import Touchable from "../../../../components/common/touchable";
import translate, { translateCarbonCertificationType } from "../../../../locales";

type Props = {|
  item: PendingCarbonCertification,
  removeCertificate: PendingCarbonCertification => void,
  sequenceNumber: number
|};

const removeIcon = require("../../../../assets/icons/pitch/remove.png");

class CarbonCard extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  removeCertificate = () => {
    Alert.alert(
      translate("createPitch.details.carbonCerts.remove", "Remove carbon certificate"),
      translate("createPitch.details.carbonCerts.removeDescription", "Do you want to remove this item?"),
      [
        {
          text: translate("common.cancel"),
          style: "cancel"
        },
        {
          text: translate("common.yes"),
          onPress: () => this.props.removeCertificate(this.props.item)
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const certificate = this.props.item.data;

    const formattedSequenceNumber = this.props.sequenceNumber + 1;
    return (
      <View>
        {this.props.item && (
          <View style={styles.previewCard}>
            <Text style={[Styles.Text.h5, Styles.Text.centered]}>
              {translate("createPitch.details.carbonCerts.certificate", null, {
                number: formattedSequenceNumber.toString()
              })}
            </Text>

            <InputLabel title={translate("createPitch.details.carbonCerts.type")} />
            {certificate.type && (
              <Text style={Styles.Text.body}>{translateCarbonCertificationType(certificate.type)}</Text>
            )}

            {certificate.type === "other" && (
              <>
                <InputLabel title={translate("createPitch.details.carbonCerts.other_value", "Other")} />
                <Text style={Styles.Text.body}>{certificate.other_value}</Text>
              </>
            )}

            <InputLabel title={translate("createPitch.details.carbonCerts.link")} />
            <Text style={Styles.Text.body}>{certificate.link}</Text>

            <Touchable accessibilityRole={"button"} onPress={this.removeCertificate}>
              <Image source={removeIcon} style={styles.removeIcon} />
            </Touchable>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  previewCard: {
    backgroundColor: Styles.Colours.white,
    borderRadius: Styles.Layout.BorderRadius.medium,
    padding: Styles.Layout.Margins.medium,
    marginTop: Styles.Layout.Margins.large,
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1
        }
      },
      android: {
        elevation: 7
      }
    })
  },
  removeIcon: {
    width: 36,
    height: 40,
    alignSelf: "center",
    marginTop: Styles.Layout.Margins.medium,
    resizeMode: "contain"
  }
});

export default CarbonCard;
