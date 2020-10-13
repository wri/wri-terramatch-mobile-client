import PropTypes from "prop-types";

/**
 * Shared PropTypes between the separate iOS and Android implementations
 */
export default {
  /**
   * Async state containing status and possible search results
   */
  items: PropTypes.array.isRequired,

  /**
   * Function accepting an item from state.data, and returning a renderable React component to be displayed in each carousel card.
   */
  renderItem: PropTypes.func.isRequired,

  /**
   * The amount of the items to the left and right of the focused item to preview
   */
  previewWidth: PropTypes.number.isRequired,

  /**
   * The horizontal gap between sequential items
   */
  itemMargin: PropTypes.number.isRequired,

  /**
   * Props passed through to the page indicator
   */
  pageIndicatorProps: PropTypes.any,

  /**
   * Action to perform when the user has scrolled to a page.
   */
  onScrolledToIndex: PropTypes.func,

  /**
   * Flag controlling whether or not a page indicator control is displayed
   */
  showPageIndicator: PropTypes.bool.isRequired
};

export const carouselDefaultProps = {
  itemMargin: 5, //Layout.Margins.small
  pageIndicatorProps: {},
  previewWidth: 30,
  showPageIndicator: false
};
