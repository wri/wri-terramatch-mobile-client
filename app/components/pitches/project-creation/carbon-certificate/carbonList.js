// @flow

import type { PendingCarbonCertification } from "../../../../redux/wri-api/pitches";
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import CarbonCard from "./carbonCard";
import AddCarbonCertificateForm from "./addCarbonCertificateForm";
import { CarbonCertificationCreate } from "wri-api";

type Props = {|
  items: Array<PendingCarbonCertification>,
  addItem: CarbonCertificationCreate,
  onItemUpdated: CarbonCertificationCreate => void,
  style?: any,
  carbonTypes: Array<{ label: ?string, value: ?string }>,
  removeCertificate: PendingCarbonCertification => void,
  newCertificatedAdded: () => void
|};

export default class CarbonList extends Component<Props> {
  renderCertificationPreviewCards = (items: Array<PendingCarbonCertification>): any => {
    if (items.length > 0) {
      return items
        .filter(item => item.type !== "deleted")
        .map((item, index) => (
          <CarbonCard key={index} sequenceNumber={index} item={item} removeCertificate={this.props.removeCertificate} />
        ));
    } else {
      return false;
    }
  };

  render() {
    const { items, style } = this.props;
    return (
      <View style={[styles.viewWrapper, style]}>
        {this.props.addItem && (
          <AddCarbonCertificateForm
            key={0}
            addItem={this.props.addItem}
            newCertificatedAdded={this.props.newCertificatedAdded}
            onItemUpdated={this.props.onItemUpdated}
            carbonTypes={this.props.carbonTypes}
          />
        )}
        {this.renderCertificationPreviewCards(items)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    flexDirection: "column"
  }
});
