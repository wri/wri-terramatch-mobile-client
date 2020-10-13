// @flow

import React, { type ElementProps, PureComponent } from "react";
import { Text } from "react-native";

import Styles from "../../../../styles";

type Props = ElementProps<typeof Text>;

export default class ScreenHeader extends PureComponent<Props> {
  render() {
    const { children, style = {}, ...rest } = this.props;
    return (
      <Text
        style={[
          Styles.Text.secondaryH2,
          Styles.Text.centered,
          Styles.Text.uppercase,
          { marginTop: Styles.Layout.Margins.large, marginBottom: Styles.Layout.Margins.medium },
          style
        ]}
        {...rest}
      >
        {children}
      </Text>
    );
  }
}
