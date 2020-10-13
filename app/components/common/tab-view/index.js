// @flow

import React, { Component, type ElementProps } from "react";
import { Dimensions, Platform, StyleSheet, Text } from "react-native";
import Styles from "../../../styles";
import { PagerDefault, PagerPan, TabBar, TabView } from "react-native-tab-view";

type Props = {|
  ...ElementProps<typeof TabView>,
  +selectedTab?: number
|};

type State = {|
  +index: number
|};

export type TabViewItem = {|
  key: string,
  title: string
|};

export default class WRITabView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      index: this.props.selectedTab ?? 0
    };
  }

  onSelectedTabChanged = (index: number) => {
    this.setState({ index: index });
    if (this.props.onIndexChange) {
      this.props.onIndexChange(index);
    }
  };

  renderTabBar = (props: any) => {
    const selectedRoute = props.navigationState.routes[props.navigationState.index];
    return (
      <TabBar
        {...props}
        style={styles.tabBar}
        indicatorStyle={styles.tabIndicator}
        renderLabel={labelProps =>
          this.renderLabel({ ...labelProps, isSelectedTab: labelProps.route.key === selectedRoute.key })
        }
        scrollEnabled={true}
        tabStyle={styles.tabBarTab}
        pressOpacity={0.6}
      />
    );
  };

  renderLabel = (props: { isSelectedTab: boolean, route: any }) => {
    return (
      <Text
        key={props.route.key}
        style={[
          Styles.Text.h5,
          Styles.Text.uppercase,
          props.isSelectedTab && Platform.OS === "ios" ? styles.selectedTab : {}
        ]}
      >
        {props.route.title}
      </Text>
    );
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { onIndexChange, navigationState, ...rest } = this.props;

    return (
      <TabView
        initialLayout={{ height: Dimensions.get("window").height, width: Dimensions.get("window").width }}
        navigationState={{
          ...navigationState,
          index: this.state.index
        }}
        onIndexChange={this.onSelectedTabChanged}
        renderPager={props => Platform.select({ android: <PagerPan {...props} />, ios: <PagerDefault {...props} /> })}
        renderTabBar={this.renderTabBar}
        useNativeDriver={true}
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabBarTab: {
    color: "black",
    opacity: 1
  },
  tabBar: {
    color: "black",
    backgroundColor: Styles.Colours.white,
    borderBottomColor: Styles.Colours.lightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: Styles.Layout.Margins.medium,
    opacity: 1
  },
  tabIndicator: {
    borderBottomColor: Styles.Colours.primary,
    borderBottomWidth: 3
  },
  selectedTab: {
    fontWeight: "700",
    borderBottomColor: Styles.Colours.primary,
    borderBottomWidth: 3,
    position: "relative"
  }
});
