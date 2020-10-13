// @flow

import React, { Component } from "react";
import { Text, View, Image, Platform, StyleSheet } from "react-native";
import Touchable from "../touchable";
import Styles from "../../../styles";
import ON_ICON from "../../../assets/icons/radio/radio-on.png";
import OFF_ICON from "../../../assets/icons/radio/radio-off.png";

type Props = {|
  +onOptionsChanged: (key: ?string) => void,
  +options: Array<{|
    +disabled: boolean,
    +key: string,
    +text: string,
    +sectionHeading?: string
  |}>,
  +selectedOption: ?string,
  +style: any
|};

type State = {|
  value: ?string
|};

class RadioButtons extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: null
    };
  }

  componentWillMount() {
    if (this.props.selectedOption?.toString?.()) {
      this.setState({
        value: this.props.selectedOption
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    this._checkIfSelectedOptionIsStillAvailable();
  }

  _checkIfSelectedOptionIsStillAvailable = () => {
    if (this.state.value && !this.props.options.find(item => item.key === this.state.value)) {
      this.setState({
        value: null
      });
      this.props.onOptionsChanged(null);
    }
  };

  render() {
    const { options } = this.props;
    const { value } = this.state;

    return (
      <View style={Styles.Utilities.flex}>
        {options.map(item => {
          return (
            <>
              {item.sectionHeading && <Text style={styles.headingText}>{item.sectionHeading}</Text>}

              <Touchable
                accessibilityRole="button"
                disabled={item.disabled}
                key={item.key}
                style={
                  item.disabled
                    ? [styles.buttonContainer, styles.disabled, this.props.style]
                    : [styles.buttonContainer, this.props.style]
                }
                onPress={() => {
                  this.props.onOptionsChanged(item.key);
                  this.setState({
                    value: item.key
                  });
                }}
                background={null}
                disableDebounce={true}
              >
                <View style={styles.button}>
                  <Text style={styles.radioText}>{item.text}</Text>
                  <Image source={value === item.key ? ON_ICON : OFF_ICON} style={styles.circle} />
                </View>
              </Touchable>
            </>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: Styles.Layout.Margins.small
  },
  radioText: {
    ...Styles.Text.body,
    lineHeight: 15
  },
  button: {
    padding: Styles.Layout.Margins.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    height: "100%",
    alignItems: "center",
    alignContent: "center",
    textAlignVertical: "center",
    backgroundColor: Styles.Colours.white,
    ...Styles.Containers.cardShadow,
    ...Platform.select({
      ios: {},
      android: {
        elevation: 2
      }
    }),
    borderRadius: Styles.Layout.BorderRadius.medium
  },
  circle: {
    height: 22,
    width: 22
  },
  disabled: {
    opacity: 0.4
  },
  headingText: {
    ...Styles.Text.h5,
    ...Styles.Text.uppercase,
    color: Styles.Colours.black,
    marginVertical: Styles.Layout.Margins.small
  }
});

export default RadioButtons;
