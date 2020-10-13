//@flow

import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Styles from "../../../styles";
import Layout from "../../../styles/layout";
import Button from "../button";

import { FilterCondition } from "wri-api";
import { removeAttributeFromFilters } from "../../../api/wri/helpers";

type Props = {|
  content: string,
  category: AttributesEnum,
  filters: Array<FilterCondition>,
  onValueChange: Function,
  operator: OperatorEnum,
  singleSelection: boolean,
  value: string
|};

export default class FilterButton extends Component<Props> {
  _isSelected = () => {
    const item = this.props.filters.filter(item => item.attribute === this.props.category);
    const object = item[0] ? item[0].value : [];
    if (this.props.singleSelection) {
      return JSON.stringify(object) === JSON.stringify(this.props.value);
    } else {
      return (object ? object : []).includes(this.props.value);
    }
  };

  selected = () => {
    const item = this.props.filters.filter(item => item.attribute === this.props.category);
    const object = item[0] ? item[0].value : null;
    const modifiedFilter = [...this.props.filters];
    if (object) {
      if (this.props.singleSelection) {
        item[0].value = this.props.value;
      } else {
        object.push(this.props.value);
      }
    } else {
      const filter = new FilterCondition();
      filter.attribute = this.props.category;
      filter.operator = this.props.operator;
      if (this.props.singleSelection) {
        filter.value = this.props.value;
      } else {
        filter.value = [this.props.value];
      }
      modifiedFilter.push(filter);
    }
    this.props.onValueChange(modifiedFilter);
  };

  deselected = () => {
    const item = this.props.filters.filter(item => item.attribute === this.props.category);
    const object = item[0] ? item[0].value : null;
    let modifiedFilter = [...this.props.filters];
    if (object) {
      if (this.props.singleSelection) {
        item[0].value = [];
      } else {
        object.splice(object.indexOf(this.props.value), 1);
      }
      if (object.length === 0) {
        modifiedFilter = removeAttributeFromFilters(modifiedFilter, this.props.category);
      }
      this.props.onValueChange(modifiedFilter);
    }
  };

  render() {
    return (
      <Button
        key={this.props.value}
        title={this.props.content}
        style={this._isSelected() ? styles.sectionListButtonSelected : styles.sectionListButtonUnselected}
        onPress={this._isSelected() ? this.deselected : this.selected}
      />
    );
  }
}

const styles = StyleSheet.create({
  sectionListButtonUnselected: {
    ...Styles.Buttons.tertiary,
    margin: Layout.Margins.tiny,
    backgroundColor: "rgba(0,0,0,0.05)",
    color: Styles.Colours.black
  },
  sectionListButtonSelected: {
    ...Styles.Buttons.tertiary,
    margin: Layout.Margins.tiny,
    backgroundColor: Styles.Colours.primary,
    color: Styles.Colours.black
  }
});
