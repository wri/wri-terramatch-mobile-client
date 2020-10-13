// @flow

import type { ErrorMessaging } from "../../../constants/errorMessaging";
import React, { type ElementConfig } from "react";
import { Text, View } from "react-native";

// Utils
import Styles from "../../../styles";
import TSCError from "../../../utils/tscError";

type ViewProps = ElementConfig<typeof View>;
type TextProps = ElementConfig<typeof Text>;
type Props = {|
  ...ViewProps,

  +error: ?(TSCError | Error | string),
  +errorMessagingOverrides?: ErrorMessaging,
  +textStyle?: $PropertyType<TextProps, "style">
|};

/**
 * Displays errors in a standard way
 */
export default class ErrorView extends React.Component<Props> {
  render() {
    if (!this.props.error) {
      return null;
    }

    return (
      <View style={this.props.style}>
        <Text style={[Styles.Text.error, Styles.Text.centered, this.props.textStyle]}>
          {TSCError.createFromError(this.props.error).format(false, this.props.errorMessagingOverrides)}
        </Text>
        {this.props.children}
      </View>
    );
  }
}
