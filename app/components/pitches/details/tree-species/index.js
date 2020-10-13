//@flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Styles from "../../../../styles";
import TreeCard from "./treeCard";
import { TreeSpeciesVersionReadAll } from "wri-api";

type Props = {|
  treeSpeciesState: AsyncState<TreeSpeciesVersionReadAll>
|};
export default class Index extends Component<Props> {
  render() {
    return (
      <View style={styles.info}>
        {(this.props.treeSpeciesState.data ?? []).map((item, index) => {
          const data = item.data;

          if (!data) {
            return null;
          }

          return <TreeCard key={data.name} treeData={data} />;
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    paddingTop: Styles.Layout.Margins.small,
    paddingBottom: Styles.Layout.Margins.medium
  }
});
