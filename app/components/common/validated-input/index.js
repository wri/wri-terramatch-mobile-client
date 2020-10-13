// @flow
import type { SyntheticEvent } from "react-native/Libraries/Types/CoreEventTypes";
import React, { Component, type ElementConfig } from "react";
import { LayoutAnimation, StyleSheet, Text, TextInput, View, Image } from "react-native";
import Styles from "../../../styles";
import colours from "../../../styles/colours";
import { getDecimalSeparator, getLocale } from "../../../locales/";
const errorIcon = require("../../../assets/icons/forms/input-error-icon.png");

type TextInputProps = ElementConfig<typeof TextInput>;
type TextInputPropsWithoutValue = $Rest<
  TextInputProps,
  {|
    +onChangeText: any,
    +value: any
  |}
>;
type ViewProps = ElementConfig<typeof View>;

type TextInputStyleProp = $PropertyType<TextInputProps, "style">;
type ViewStyleProp = $PropertyType<ViewProps, "style">;
type Props = {
  ...TextInputPropsWithoutValue,
  +containerStyle?: ViewStyleProp,
  +disabledStyle?: TextInputStyleProp,
  +focusedStyle?: TextInputStyleProp,
  +invalidStyle?: TextInputStyleProp,
  +isMessageAlwaysVisible?: boolean,
  +message?: ?string,

  /**
   * If specified this will treat the inputted value as a number, and validate and format it according to these rules
   */
  +numberFormat?: ?{|
    // This gets passed directly through to Intl lib for formatting.
    // In future this lib will allow i18n and supports other formatting options.
    +maximumFractionDigits?: number
  |},
  +onChangeText: (?(string | number)) => any,
  +valid: boolean,
  +validStyle?: TextInputStyleProp,
  +value: ?(string | number)
};

type State = {|
  /**
   * How many decimal places the user has filled in so far.
   *
   * We keep track of this to stop values like "0.0" getting turned back into "0" due to this being a controlled component
   */
  +decimalPlaces: number,

  /**
   * Whether the input as a trailing decimal point
   *
   * We keep track of this to allow values like "1." as intermediate values, without trying (and failing) to parse them as
   * a number right away
   */
  +hasTrailingDecimalPoint: boolean,
  +isFocused: boolean,
  +isSubmitted: boolean
|};

export default class ValidatedTextInput extends Component<Props, State> {
  static defaultProps: $Shape<Props> = {
    disabledStyle: {
      color: Styles.Colours.lightGrey
    },
    invalidStyle: {
      borderBottomColor: "#ff0000",
      borderBottomWidth: 2
    },
    isMessageAlwaysVisible: false,
    message: "",
    validStyle: {}
  };

  decimalSeparator: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      decimalPlaces: 0,
      hasTrailingDecimalPoint: false,
      isFocused: false,
      isSubmitted: props.value !== null && props.value !== undefined && props.value !== ""
    };

    this.decimalSeparator = getDecimalSeparator(getLocale());
  }

  // https://medium.com/@benadamstyles/react-native-layoutanimation-in-the-post-componentwillupdate-age-9146b3af0243
  componentDidUpdate(prevProps: Props) {
    if (!!prevProps.valid !== !!this.props.valid) {
      LayoutAnimation.easeInEaseOut();
    }

    // If the input value is cleared programatically (e.g. because a form was submitted),
    // then reset the submission state, so that we don't show validation errors
    const wasDefined = prevProps.value !== null && prevProps.value !== undefined;
    const isNowUndefined = this.props.value === null || this.props.value === undefined;
    if (wasDefined && isNowUndefined && !this.state.isFocused) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isSubmitted: false });
    }
  }

  onBlur = (evt: SyntheticEvent<*>) => {
    this.setState({ isFocused: false, isSubmitted: true });
    if (this.props.onBlur) {
      this.props.onBlur(evt);
    }
  };

  onFocus = (evt: SyntheticEvent<*>) => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(evt);
    }
  };

  focus() {
    this.refs["textInput"].focus();
  }

  _formatValue = (value: ?(string | number)): ?string => {
    const numberFormat = this.props.numberFormat;
    if (!numberFormat) {
      if (typeof value === "number") {
        return value.toString();
      }
      return value;
    }

    if (value === null || value === undefined || isNaN(value) || typeof value === "string") {
      return null;
    }
    const formatter = new Intl.NumberFormat(getLocale(), {
      maximumFractionDigits: numberFormat.maximumFractionDigits,
      minimumFractionDigits: this.state.decimalPlaces,
      style: "decimal",
      useGrouping: false
    });
    return formatter.format(value) + (this.state.hasTrailingDecimalPoint ? this.decimalSeparator : "");
  };

  /**
   * Listens for text changes and possibly parses them back into their numeric representation
   */
  _onChangeText = (value: string) => {
    if (this.props.onChangeText) {
      try {
        const parsedValue = this._parseValue(value);
        this.props.onChangeText(parsedValue);
      } catch (err) {
        // An error is thrown by parseValue if value is not valid - this will suppress the text change
      }
    }
  };

  /**
   * For numeric values, turns their string representation back into the number itself
   *
   * Return null for invalid string forms. e.g. "123." or "12.96.4"
   *
   * This is a heavily modified version of: https://github.com/wwdrew/react-native-numeric-textinput/blob/master/src/NumericTextInput.js
   */
  _parseValue = (value: string): string | number | null => {
    if (!this.props.numberFormat) {
      return value;
    }

    const maxDecimalPlaces = this.props.numberFormat?.maximumFractionDigits ?? 100;
    const shouldBeInteger = maxDecimalPlaces === 0;
    // Some special handling for integer values
    if (shouldBeInteger) {
      if (value === this.decimalSeparator) {
        // WRM-1214 - detect this special case early where the user starts entering a . in an integer field
        return 0;
      }
      // Remove everything that isn't a digit from integer values
      value = value.replace(/[^\d]/g, "");
    }

    const lastDecimalPointIdx = value.lastIndexOf(this.decimalSeparator);
    const firstDecimalPointIdx = value.indexOf(this.decimalSeparator);
    const hasDecimalPoint = lastDecimalPointIdx >= 0;

    // If there is more than one decimal point then the input is invalid
    if (firstDecimalPointIdx !== lastDecimalPointIdx) {
      throw new Error("Too many decimal points");
    }

    const decimalPlaces = hasDecimalPoint ? value.length - lastDecimalPointIdx - 1 : 0;

    // Trailing decimal places are (temporarily) fine. Flag that there is one, or the rest of the function will strip it
    // and it won't get re-added by _formatValue
    const hasTrailingDecimalPoint = hasDecimalPoint && !shouldBeInteger && lastDecimalPointIdx === value.length - 1;
    this.setState({
      decimalPlaces: Math.min(decimalPlaces, maxDecimalPlaces),
      hasTrailingDecimalPoint: hasTrailingDecimalPoint
    });

    if (value.length === 0) {
      return null;
    } else if (value === this.decimalSeparator) {
      return 0.0;
    } else if (decimalPlaces > maxDecimalPlaces) {
      // Make sure we limit the user to the maximum allowed decimal places
      throw new Error("Too many decimal places");
    }

    value = value.replace(this.decimalSeparator, ".");
    const parsedNumber = shouldBeInteger ? parseInt(value) : parseFloat(value);
    if (isNaN(parsedNumber)) {
      return 0.0;
    }
    // Avoid the inputted value getting too large or small, or it overruns the precision of the number it is stored in
    // and leads to weird values in the TextInput
    const maxSafe = Number.MAX_SAFE_INTEGER / Math.pow(10, maxDecimalPlaces);
    const minSafe = Number.MIN_SAFE_INTEGER / Math.pow(10, maxDecimalPlaces);
    if (parsedNumber > maxSafe) {
      throw new Error("Integer too large");
    } else if (parsedNumber < minSafe) {
      throw new Error("Integer too small");
    }

    return parsedNumber;
  };

  render() {
    const {
      containerStyle,
      disabledStyle,
      editable = true,
      focusedStyle,
      invalidStyle,
      isMessageAlwaysVisible,
      message,
      numberFormat, // eslint-disable-line no-unused-vars
      style,
      valid,
      validStyle,
      children,
      value,
      ...rest
    } = this.props;
    const informUserOfValidationErrors = this.state.isSubmitted && !valid;

    // Value might be numeric, so format it into a string
    const formattedValue = this._formatValue(value);

    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          {...rest}
          ref="textInput"
          style={[
            Styles.Containers.textInput,
            (formattedValue?.length ?? 0) > 0 ? Styles.Text.input : Styles.Text.inputPlaceholder,
            style,
            this.state.isFocused ? styles.focused : {},
            this.state.isFocused ? focusedStyle : {},
            informUserOfValidationErrors ? invalidStyle : validStyle,
            editable !== false ? {} : disabledStyle
          ]}
          editable={editable}
          value={formattedValue}
          onChangeText={this._onChangeText}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {!!message && (isMessageAlwaysVisible || informUserOfValidationErrors) && (
          <View style={styles.errorWrapper}>
            <Text style={[Styles.Text.error, !informUserOfValidationErrors ? styles.informationText : {}]}>
              {message}
            </Text>
            <Image resizeMode="contain" source={errorIcon} style={styles.errorIcon} />
          </View>
        )}
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column"
  },
  focused: {
    borderBottomColor: colours.primary,
    borderBottomWidth: 2
  },
  errorIcon: {
    marginLeft: Styles.Layout.Margins.small,
    width: 18
  },
  errorWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  informationText: {
    color: "grey"
  }
});
