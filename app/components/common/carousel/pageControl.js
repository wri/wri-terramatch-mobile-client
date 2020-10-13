import PropTypes from "prop-types";
import React, { Component } from "react";
import { StyleSheet, TouchableWithoutFeedback, View, ViewPropTypes } from "react-native";

import Styles from "../../../styles";

class PageControl extends Component {
  static propTypes = {
    ...ViewPropTypes,
    currentIndicatorStyle: ViewPropTypes.style,
    currentPage: PropTypes.number,
    currentPageIndicatorTintColor: PropTypes.string,
    hidesForSinglePage: PropTypes.bool,
    indicatorSize: PropTypes.object,
    indicatorStyle: ViewPropTypes.style,
    numberOfPages: PropTypes.number.isRequired,
    onPageIndicatorPress: PropTypes.func,
    pageIndicatorTintColor: PropTypes.string
  };

  static defaultProps = {
    currentIndicatorStyle: {},
    currentPageIndicatorTintColor: Styles.Colours.brownGrey,
    hidesForSinglePage: false,
    indicatorSize: { width: 10, height: 10 },
    indicatorStyle: {},
    onPageIndicatorPress: () => {},
    pageIndicatorTintColor: Styles.Colours.lightGrey
  };

  constructor(props) {
    super(props);
    this.onPageIndicatorPress = this.onPageIndicatorPress.bind(this);
  }

  onPageIndicatorPress(idx) {
    this.props.onPageIndicatorPress(idx);
  }

  render() {
    const { style } = this.props;

    const defaultStyle = {
      height: this.props.indicatorSize.height
    };

    const indicatorItemStyle = {
      width: this.props.indicatorSize.width,
      height: this.props.indicatorSize.height,
      borderRadius: this.props.indicatorSize.height / 2,
      marginLeft: 5,
      marginRight: 5
    };

    const indicatorStyle = {
      ...indicatorItemStyle,
      ...this.props.indicatorStyle,
      ...{
        backgroundColor: this.props.pageIndicatorTintColor
      }
    };

    const currentIndicatorStyle = {
      ...indicatorItemStyle,
      ...this.props.currentIndicatorStyle,
      ...{
        backgroundColor: this.props.currentPageIndicatorTintColor
      }
    };

    const pages = [];
    for (let i = 0; i < this.props.numberOfPages; i++) {
      pages.push(i);
    }

    return this.props.hidesForSinglePage && pages.length <= 1 ? null : (
      <View style={[styles.container, defaultStyle, style]}>
        {pages.map((el, i) => (
          <TouchableWithoutFeedback
            key={i}
            onPress={this.onPageIndicatorPress.bind(this, i)}
            accessibilityRole={"button"}
          >
            <View style={i == this.props.currentPage ? currentIndicatorStyle : indicatorStyle} />
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: Styles.Layout.Margins.medium
  }
});

export default PageControl;
