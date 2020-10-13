"use strict";

import React, { Component } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity, Linking, ViewPropTypes, Platform } from "react-native";
import Carousel from "../../common/carousel";
import PageControl from "../../common/carousel/pageControl";
import debounceFunc from "../../../utils/debounceFunc";
import Styles from "../../../styles/";
import translate from "../../../locales/";
import PropTypes from "prop-types";
// import colours from "../../../styles/colours";

const nextIcon = require("../../../assets/icons/carousel/next.png");
const prevIcon = require("../../../assets/icons/carousel/prev.png");

class CarouselWithControls extends Component {
  constructor(props) {
    super(props);

    const self = this;
    self.onScrolledToIndex = this.onScrolledToIndex.bind(this);
    self.renderOnboardingCard = this.renderOnboardingCard.bind(this);
    self.transitionToNextPage = this.transitionToNextPage.bind(this);
    self.transitionToPrevPage = this.transitionToPrevPage.bind(this);
    self.renderCarouselControl = this.renderCarouselControl.bind(this);
    self.goToUrl = this.goToUrl.bind(this);

    this.state = {
      selectedPageIdx: 0
    };
  }

  /**
   * transitionToNextPage - Handles the 'next' button being tapped, navigating to the next card.
   */
  transitionToNextPage() {
    this.refs?.carousel?.setPage?.(this.state.selectedPageIdx + 1);
  }

  /**
   * transitionToNextPage - Handles the 'previous' button being tapped, navigating to the next card.
   */
  transitionToPrevPage() {
    this.refs?.carousel?.setPage?.(this.state.selectedPageIdx - 1);
  }

  renderCarouselControl(direction, state) {
    const isDisabled = state === "disabled";
    const arrowStyles = direction === "next" ? styles.carouselButtonContainerRight : styles.carouselButtonContainerLeft;
    const icon = direction === "next" ? nextIcon : prevIcon;
    const accessibilityLabel =
      direction === "next" ? translate("common.next", "Next item") : translate("common.previous", "Previous item");

    return (
      <>
        {isDisabled ? (
          <View style={[styles.carouselButtonContainer, arrowStyles]}>
            <Image source={icon} style={styles.disabledCarouselIcon} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={direction === "next" ? this.transitionToNextPage : this.transitionToPrevPage}
            style={[styles.carouselButtonContainer, arrowStyles]}
            accessibilityRole={"button"}
            accessible={true}
            accessibilityLabel={accessibilityLabel}
          >
            <Image source={icon} />
          </TouchableOpacity>
        )}
      </>
    );
  }

  goToUrl = debounceFunc(url => {
    Linking.openURL(url);
  });

  renderOnboardingCard = (card, index) => {
    if (this.props.onPress) {
      return (
        <TouchableOpacity
          style={this.props.secondary ? [styles.onboardingCard, styles.secondaryOnboardingCard] : styles.onboardingCard}
          onPress={() => this.props.onPress(card)}
          accessibilityRole={"link"}
        >
          {this.props.renderItem(card)}
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={this.props.secondary ? [styles.onboardingCard, styles.secondaryOnboardingCard] : styles.onboardingCard}
        >
          {this.props.renderItem(card)}
        </View>
      );
    }
  };

  /**
   * onScrolledToIndex - Called upon the carousel scrolling to a new item.
   *
   * @param  {type} idx The index the carousel has scrolled to.
   */
  onScrolledToIndex(idx) {
    // Here, we need to handle potential invalid index values being returned from the carousel.
    // If the index is out of bounds, set it to be the nearest in-bounds value.
    let actualIndex = idx;
    if (idx < 0) {
      actualIndex = 0;
    }

    if (idx > this.props.content?.length - 1) {
      actualIndex = this.props.content?.length - 1;
    }

    this.setState({
      selectedPageIdx: actualIndex
    });
  }

  render() {
    const isOnLastCard = this.state.selectedPageIdx === this.props.content?.length - 1;
    const isOnFirstCard = this.state.selectedPageIdx === 0;
    return (
      <View style={this.props.secondary ? styles.secondaryCarouselSection : styles.carouselSection}>
        <View style={styles.carouselWrapper}>
          {this.props.title && <Text style={styles.carouselHeading}>{this.props.title}</Text>}
          <Carousel
            ref="carousel"
            items={this.props.content}
            style={styles.carousel}
            itemMargin={0}
            onScrolledToIndex={this.onScrolledToIndex}
            previewWidth={0}
            renderItem={this.renderOnboardingCard}
            showPageIndicator={false}
          />

          {isOnFirstCard ? this.renderCarouselControl("prev", "disabled") : this.renderCarouselControl("prev")}
          {isOnLastCard ? this.renderCarouselControl("next", "disabled") : this.renderCarouselControl("next")}
        </View>

        <PageControl
          currentPage={this.state.selectedPageIdx}
          hidesForSinglePage={true}
          numberOfPages={this.props.content?.length}
          currentPageIndicatorTintColor={this.props.secondary ? Styles.Colours.brownGrey : Styles.Colours.white}
          pageIndicatorTintColor={this.props.secondary ? Styles.Colours.lightGrey : Styles.Colours.brownGrey}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  carousel: Platform.select({
    android: {},
    ios: {}
  }),
  carouselWrapper: {
    position: "relative"
  },
  carouselButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 17,
    position: "absolute",
    top: "50%",
    marginTop: -15,
    paddingHorizontal: Styles.Layout.Margins.medium
  },
  carouselButtonContainerLeft: {
    left: 0
  },
  carouselButtonContainerRight: {
    right: 0
  },
  onboardingCard: {
    backgroundColor: Styles.Colours.black,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Styles.Layout.Margins.small,
    paddingHorizontal: Styles.Layout.Margins.large
  },
  secondaryOnboardingCard: {
    backgroundColor: "transparent"
  },
  disabledCarouselIcon: {
    opacity: 0.5
  },
  carouselSection: {
    backgroundColor: Styles.Colours.black,
    marginHorizontal: -Styles.Layout.Margins.medium,
    paddingTop: Styles.Layout.Margins.medium
  },
  secondaryCarouselSection: {
    backgroundColor: Styles.Colours.black8,
    marginHorizontal: -Styles.Layout.Margins.medium,
    paddingTop: Styles.Layout.Margins.medium
  },
  carouselHeading: {
    ...Styles.Text.secondaryH2,
    ...Styles.Text.uppercase,
    ...Styles.Text.centered,
    color: Styles.Colours.brownGrey
  }
});

CarouselWithControls.propTypes = {
  ...ViewPropTypes,

  /**
   * The news item information
   */
  content: PropTypes.any,
  onPress: PropTypes.func,
  secondary: PropTypes.bool,
  title: PropTypes.string
};

CarouselWithControls.defaultProps = {
  secondary: false,
  title: null
};

export default CarouselWithControls;
