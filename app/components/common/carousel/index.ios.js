"use strict";

import React, { Component } from "react";
import { Dimensions, FlatList, Platform, StyleSheet, View } from "react-native";
import PageControl from "./pageControl";

// Utilities
import carouselPropTypes, { carouselDefaultProps } from "./carouselPropTypes";

import Styles from "../../../styles";

/**
 * A horizontal scrolling list view whose items snap to the centre of the screen as they are swiped.
 */
class Carousel extends Component {
  static propTypes = carouselPropTypes;
  static defaultProps = carouselDefaultProps;

  constructor(props) {
    super(props);

    this.setPage = this.setPage.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onScrollEndDrag = this.onScrollEndDrag.bind(this);

    this.state = {
      currentPage: 0,
      screenDimensions: Dimensions.get("window")
    };
  }

  setPage(index) {
    this.refs?.list?.scrollToIndex({ index: index });
    this.props.onScrolledToIndex(index);
  }

  /**
   * onScrollEndDrag - Handles the scroll event ending. Determines the currently presented card, and informs the parent component.
   *
   * @param  {object} event The event that the scroll has sent.
   * @return {type}
   */
  onScrollEndDrag(event) {
    const cardTotal = this.props.items?.length ?? 1;
    const scrollViewWidth = event.nativeEvent.contentSize.width;
    // Determines the width of cards.
    const cardWidth = this.state.screenDimensions.width - (this.props.itemMargin + this.props.previewWidth) * 2;

    // Determines the card's position, based on the targetContentOffset, adding the previewWidth, and the total item margin.
    const targetOffsetWidth =
      event.nativeEvent.targetContentOffset?.x + this.props.previewWidth + this.props.itemMargin * 2 * cardTotal;

    // Determine the target percentage.
    const offsetPercentage = targetOffsetWidth / scrollViewWidth;

    let currentIndex = 0;
    let steppedPercentage = 0.0;

    // While we're stepping from 0 -> 1, see if the target value is on the current card.
    // If it is, then break out of the loop.
    // Otherwise, check the next card.
    while (steppedPercentage <= 1) {
      const startingPercentage = (cardWidth / scrollViewWidth) * currentIndex;
      const endingPercentage = (cardWidth / scrollViewWidth) * (currentIndex + 1);

      // If the target percentage is within the start and ending percentage, break out of the loop.
      if (offsetPercentage >= startingPercentage && offsetPercentage < endingPercentage) {
        break;
      }

      // This isn't the card we were looking for. Increment the steppedPercentage and currentIndex.
      steppedPercentage += endingPercentage - startingPercentage;
      currentIndex += 1;
    }

    this.setState({
      currentPage: currentIndex
    });

    if (this.props.onScrolledToIndex) {
      this.props.onScrolledToIndex(currentIndex);
    }
  }

  render() {
    const cardWidth = this.state.screenDimensions.width - (this.props.itemMargin + this.props.previewWidth) * 2;

    return (
      <View style={[Styles.Utilities.flexGrow, this.props.style]}>
        <FlatList
          ref={"list"}
          automaticallyAdjustInsets={false}
          contentContainerStyle={[styles.content, { paddingHorizontal: this.props.previewWidth }]}
          data={this.props.items}
          decelerationRate={0}
          horizontal={true}
          keyExtractor={(item, index) => `${index}`}
          onEndReachedThreshold={this.state.screenDimensions.width * 4}
          //onEndReached={this.onReachedEnd}
          onLayout={event => {
            this.setState({ screenDimensions: event.nativeEvent.layout });
          }}
          onScrollEndDrag={this.onScrollEndDrag}
          pagingEnabled={Platform.OS === "android"}
          renderItem={this.renderItem}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={parseInt(cardWidth + this.props.itemMargin * 2, 10)}
          style={Styles.Utilities.overflowVisible}
        />
        {this.props.showPageIndicator && (
          <PageControl
            {...this.props.pageIndicatorProps}
            currentPage={this.state.currentPage}
            hidesForSinglePage={true}
            numberOfPages={this.props.items.length}
          />
        )}
      </View>
    );
  }

  renderItem(item) {
    const cardWidth = this.state.screenDimensions.width - (this.props.itemMargin + this.props.previewWidth) * 2;

    return (
      <View style={{ width: cardWidth, marginHorizontal: this.props.itemMargin }}>
        {this.props.renderItem(item.item, item.index)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: "stretch",
    overflow: "visible",
    paddingVertical: Styles.Layout.Margins.tiny
  }
});

export default Carousel;
