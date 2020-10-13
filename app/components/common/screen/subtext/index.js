// @flow

import React, { type ElementProps, PureComponent } from "react";
import { Text } from "react-native";

import Styles from "../../../../styles";

type Props = ElementProps<typeof Text>;

export default class ScreenSubtext extends PureComponent<Props> {
  render() {
    const { children, style = {}, ...rest } = this.props;
    return (
      <Text
        style={[Styles.Text.body, Styles.Text.centered, { marginBottom: Styles.Layout.Margins.medium }, style]}
        {...rest}
      >
        {children}
      </Text>
    );
  }
}
