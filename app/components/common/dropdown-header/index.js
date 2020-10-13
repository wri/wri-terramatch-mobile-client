import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Styles from "../../../styles";
import ARROW_UP from "../../../assets/icons/projects/arrowUp/ic_keyboard_arrow_up_black_24dp.png";
import ARROW_DOWN from "../../../assets/icons/projects/arrowDown/ic_keyboard_arrow_down_black_24dp.png";
import Touchable from "../../common/touchable";
import PropTypes from "prop-types";

export default class HeaderDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: true
    };
  }

  showDropdown = () => {
    this.setState({
      isExpanded: true
    });
  };

  hideDropdown = () => {
    this.setState({
      isExpanded: false
    });
  };

  renderArrowDown = () => {
    return <Image style={styles.dropImg} source={ARROW_DOWN} />;
  };

  renderArrowUp = () => {
    return <Image style={styles.dropImg} source={ARROW_UP} />;
  };

  render() {
    return (
      <View>
        <View style={styles.borderLine} />
        <Touchable
          accessibilityRole={"button"}
          disableDebounce={true}
          onPress={this.state.isExpanded ? this.hideDropdown.bind(this) : this.showDropdown.bind(this)}
        >
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerText}>{this.props.header}</Text>
            </View>
            <View style={styles.iconContainer}>
              <View style={styles.dropIcon}>
                {this.state.isExpanded ? this.renderArrowDown() : this.renderArrowUp()}
              </View>
            </View>
          </View>
        </Touchable>
        {this.state.isExpanded ? null : this.props.children}
      </View>
    );
  }
}

HeaderDropdown.propTypes = {
  children: PropTypes.any,
  header: PropTypes.any
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingVertical: Styles.Layout.Margins.small
  },
  headerTitleContainer: {
    width: "90%",
    justifyContent: "center"
  },
  iconContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center"
  },
  dropIcon: {
    width: 25,
    height: 25
  },
  headerText: {
    ...Styles.Text.h1,
    ...Styles.Text.uppercase,
    fontSize: 20
  },
  dropImg: {
    height: 25,
    width: 25
  },
  borderLine: {
    borderColor: Styles.Colours.lightGrey,
    width: "100%",
    borderWidth: 0.5,
    alignSelf: "center"
  }
});
