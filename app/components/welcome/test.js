import React from "react";
import TestRenderer from "react-test-renderer";
import Screen from ".";

const initialProps = {
  componentId: "dummy"
};

describe("Welcome screen", () => {
  // Variable used in all the tests
  let screen;

  /**
   * Functions that access views from the screen
   */
  const views = {
    text: () => screen.root.findAllByType("Text", { deep: true })
  };

  /**
   * Setup and teardown helpers - make sure screen is cleared and unmounted
   */
  beforeEach(() => {
    screen = null;
  });

  afterEach(() => {
    screen.unmount();
  });

  const setup = (overrides = {}) => {
    const props = {
      ...initialProps,
      ...overrides
    };
    screen = TestRenderer.create(<Screen {...props} />);
    return props;
  };

  /**
   * Asserts that all text nodes in the screen are passed through i18next
   */
  test("localisation keys are used for all text nodes", () => {
    const MOCK_TRANSLATION = "mock_translation";
    setup();
    views
      .text()
      .map(textNode => textNode.children[0])
      .forEach(text => expect(text).toEqual(MOCK_TRANSLATION));
  });
});
