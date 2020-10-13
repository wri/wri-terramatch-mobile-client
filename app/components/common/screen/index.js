// @flow

import React, { Component, type ComponentType, type ElementProps, type ElementRef, type Node } from "react";
import { Keyboard, Platform, ScrollView, StyleSheet, View } from "react-native";

import KeyboardSpacer from "react-native-keyboard-spacer";
import Styles from "../../../styles";
import Layout from "../../../styles/layout";
import ScreenHeader from "./header";
import ScreenSubtext from "./subtext";
import ButtonRow from "../button-row";

type ViewProps = ElementProps<typeof View>;
type ScrollViewProps = ElementProps<typeof ScrollView>;
type Props = {|
  ...ScrollViewProps,
  +containerComponent: ComponentType<ViewProps>,
  +header?: string,
  +headingStyle?: any,
  +isBackButtonHidden?: boolean,
  +isNextButtonEnabled?: boolean,
  +keyboard: boolean,
  +nextTitle?: ?string,
  +onNextButtonPressed?: () => any,
  +onPreviousButtonPressed?: () => any,
  +renderProgress?: () => Node,
  +scrollComponent: ComponentType<ScrollViewProps>,
  +secondary?: boolean,
  +subtext?: string,

  /*
   * set scrollReset to false to resolve issue with  keyboard-aware-scroll-view:
   * https://3sidedcube.atlassian.net/browse/WRM-1491
   * https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/313
   * TODO: This could probably be removed and we can apply the fix automatically by checking the keyboard prop
   */
  +enableResetScrollToCoords?: boolean
|};

type State = {|
  +keyboardVisible: boolean
|};

export default class Screen extends Component<Props, State> {
  static defaultProps: $Shape<Props> = {
    containerComponent: View,
    isNextButtonEnabled: true,
    keyboard: false,
    scrollComponent: ScrollView,
    secondary: false
  };

  scrollRef: { current: null | ElementRef<typeof ScrollView> };

  constructor(props: Props) {
    super(props);
    this.state = {
      keyboardVisible: false
    };
    this.scrollRef = React.createRef();
  }

  onKeyboardToggled(toggleState: boolean) {
    this.setState({
      keyboardVisible: toggleState
    });
  }

  scrollToTop() {
    let scrollView = this.scrollRef.current;
    if (scrollView) {
      // If the ScrollComponent is wrapped in a SafeAreaView then we have to take extra steps to get the scroller
      const possibleSafeAreaView = (scrollView: any);
      if (possibleSafeAreaView.wrappedRef) {
        scrollView = possibleSafeAreaView.wrappedRef;
      }

      let scrollFn = scrollView.scrollTo;
      if (scrollFn) {
        scrollFn = scrollFn.bind(scrollView);
        scrollFn({
          x: 0,
          y: 0,
          animated: true
        });
      } else {
        console.warn("3SC", "Could not find a scrollTo function on ScrollComponent");
      }
    }
  }

  render(): Node {
    const {
      keyboard,
      style,
      secondary,
      containerComponent: ContainerComponent,
      scrollComponent: ScrollComponent,
      children,
      header,
      subtext,
      headingStyle,
      isBackButtonHidden,
      isNextButtonEnabled,
      onNextButtonPressed,
      onPreviousButtonPressed,
      nextTitle,
      renderProgress,
      ...rest
    } = this.props;
    return (
      <ContainerComponent
        style={[secondary ? Styles.Containers.secondaryScreen : Styles.Containers.screen, styles.container]}
      >
        <ScrollComponent
          ref={this.scrollRef}
          {...rest}
          alwaysBounceVertical={false}
          contentContainerStyle={[styles.contentContainer, style]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={
            // Needed because keyboardDismissMode isn't working on Android: https://github.com/facebook/react-native/issues/23364
            Platform.select({ android: Keyboard.dismiss, ios: undefined })
          }
        >
          {(header || subtext) && (
            <View style={headingStyle}>
              {header && <ScreenHeader>{header}</ScreenHeader>}
              {subtext && <ScreenSubtext>{subtext}</ScreenSubtext>}
            </View>
          )}
          {children}
        </ScrollComponent>
        {keyboard && Platform.OS === "ios" && <KeyboardSpacer onToggle={this.onKeyboardToggled.bind(this)} />}
        {(onNextButtonPressed || onPreviousButtonPressed) && !this.state.keyboardVisible && (
          <ButtonRow
            isBackButtonHidden={isBackButtonHidden}
            isFloating={true}
            backButton={onPreviousButtonPressed}
            nextButton={onNextButtonPressed}
            enabled={isNextButtonEnabled}
            nextTitle={nextTitle}
            style={renderProgress ? styles.buttonRow : null}
          >
            {renderProgress ? renderProgress() : null}
          </ButtonRow>
        )}
      </ContainerComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  contentContainer: {
    flexGrow: 1,
    padding: Layout.Margins.medium
  },
  buttonRow: {
    marginTop: 0,
    paddingTop: 0
  }
});
