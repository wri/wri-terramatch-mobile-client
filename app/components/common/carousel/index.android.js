"use strict";

import React, { Component } from "react";
import { View, ScrollView, Dimensions, StyleSheet } from "react-native";
// import PageControl from "./pageControl";
import Styles from "../../../styles";

const DEVICE_WIDTH = Dimensions.get("window").width;

// Utilities
import carouselPropTypes, { carouselDefaultProps } from "./carouselPropTypes";

/**
 * A horizontal scrolling list view whose items snap to the centre of the screen as they are swiped.
 */
export default class Carousel extends Component {
  static propTypes = carouselPropTypes;
  static defaultProps = carouselDefaultProps;

  constructor(props) {
    super(props);
    this.state = {
      contentWidth: null
    };
  }

  onContentSizeChange = (width, height) => {
    this.setState({
      contentWidth: width
    });
  };

  onPageSelected = currentIndex => {
    this.props.onScrolledToIndex?.(currentIndex);
  };

  onScroll = event => {
    const contentWidth = event.nativeEvent?.contentSize?.width;
    const contentOffset = event.nativeEvent?.contentOffset?.x;
    const ratioScrolled = contentOffset / contentWidth;
    const numPages = (this.props.items ?? []).length;
    const page = Math.round(ratioScrolled * numPages);
    this.onPageSelected(page);
  };

  setPage = pageIdx => {
    const numPages = (this.props.items ?? []).length;
    const ratio = pageIdx / numPages;
    const contentOffset = ratio * this.state.contentWidth;
    this.refs.scrollView?.scrollTo({ x: contentOffset, y: 0, animated: true });
    this.onPageSelected(pageIdx);
  };

  renderPage = page => {
    return (
      <View
        key={page.index}
        style={{ paddingHorizontal: this.props.itemMargin + this.props.previewWidth, width: DEVICE_WIDTH }}
      >
        {this.props.renderItem(page.item, page.index)}
      </View>
    );
  };

  render() {
    return (
      <View style={[Styles.Utilities.flexGrow, this.props.style]}>
        <ScrollView
          ref={"scrollView"}
          pagingEnabled={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          persistentScrollbar={false}
          onMomentumScrollEnd={this.onScroll}
          style={styles.carouselScrollView}
          disableIntervalMomentum={true}
          onContentSizeChange={this.onContentSizeChange}
        >
          {(this.props.items ?? []).map((item, idx) =>
            this.renderPage({
              item: item,
              index: idx
            })
          )}
        </ScrollView>
        <View style={styles.paddingView} />
        {/*{this.props.showPageIndicator && (*/}
        {/*  <PageControl*/}
        {/*    {...this.props.pageIndicatorProps}*/}
        {/*    currentPage={this.state.currentPage}*/}
        {/*    hidesForSinglePage={true}*/}
        {/*    numberOfPages={this.props.items.length}*/}
        {/*  />*/}
        {/*)}*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  carouselScrollView: {
    height: "100%"
  },
  paddingView: {
    paddingTop: Styles.Layout.Margins.medium
  }
});
