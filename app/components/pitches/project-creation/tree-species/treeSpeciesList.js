// @flow

import type { PendingTreeSpecies } from "../../../../redux/wri-api/pitches";
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import AddTreeSpeciesForm from "./addTreeSpeciesForm";
import TreeSpeciesPreviewCard from "./treeSpeciesPreviewCard";
import { TreeSpeciesCreate } from "wri-api";

type Props = {|
  items: Array<PendingTreeSpecies>,
  addItem: TreeSpeciesCreate,
  newSpecieAdded: () => void,
  onItemChanged: TreeSpeciesCreate => void,
  removeSpecie: PendingTreeSpecies => void,
  style?: any
|};

export default class TreeSpeciesCardList extends Component<Props> {
  render() {
    const { items, addItem, onItemChanged, removeSpecie, style } = this.props;
    return (
      <View style={[styles.viewWrapper, style]}>
        <AddTreeSpeciesForm item={addItem} onItemChanged={onItemChanged} newSpecieAdded={this.props.newSpecieAdded} />
        {items
          .filter(item => item.type !== "deleted")
          .map((item, index) => (
            <TreeSpeciesPreviewCard key={index} item={item} removeSpecie={removeSpecie} />
          ))}
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
