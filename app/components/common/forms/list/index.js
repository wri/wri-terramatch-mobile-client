"use strict";
//@flow

import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Styles from "../../../../styles";
import Button from "../../button";
import translate from "../../../../locales";
import ValidatedTextInput from "../../validated-input";
import Validation from "../../../../utils/validation";
import textInputProps from "../../../../constants/textInputProps";
import REMOVE_ICON from "../../../../assets/icons/organisation/ic_remove.png";
import Touchable from "../../touchable";

type State = {|
  +element: ?string
|};

type Props = {|
  list: Array<string>,
  onListChanged: (Array<string>) => void
|};

class DynamicList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      element: null
    };
  }

  _handleTextChange = text => {
    this.setState({
      element: text
    });
  };

  _addItem = () => {
    const valueToAdd = this.state.element ?? "";
    if (valueToAdd.length !== 0) {
      this.props.onListChanged([...this.props.list, valueToAdd]);

      this.setState({
        element: null
      });
    }
  };

  renderListItem = (index: number, body: string) => {
    return (
      <View key={index} style={styles.container}>
        <Text style={styles.speciesText}>{body}</Text>
        <Touchable accessibilityRole="button" onPress={() => this._removeItem(index)}>
          <Image style={styles.icon} source={REMOVE_ICON} />
        </Touchable>
      </View>
    );
  };

  _removeItem = elementIndex => {
    const arr = this.props.list;
    arr.splice(elementIndex, 1);
    this.props.onListChanged(arr);
  };

  render() {
    const isElementValid = Validation.species.validate(this.state.element);
    return (
      <View style={styles.listView}>
        {this.props.list.map((item, index) => this.renderListItem(index, item))}
        <ValidatedTextInput
          placeholder={translate("common.add")}
          valid={isElementValid}
          value={this.state.element}
          message={Validation.species.errorString(this.state.element)}
          onChangeText={this._handleTextChange}
          {...textInputProps.text}
        />
        <Button
          style={[Styles.Buttons.reversePrimary, styles.buttonContainer]}
          onPress={this._addItem}
          title={translate("common.add")}
          enabled={isElementValid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: { marginTop: 10 },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: Styles.Layout.Margins.small,
    paddingBottom: Styles.Layout.Margins.tiny
  },
  icon: { width: 20, height: 20 },
  speciesText: { ...Styles.Text.bodyHero, fontSize: 16, color: Styles.Colours.black },
  listView: { paddingTop: Styles.Layout.Margins.small }
});

export default DynamicList;
