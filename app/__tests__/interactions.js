/**
 * Invokes the relevant button callbacks to simulate a button press off-device
 *
 * @param button
 */
export function pressButton(button) {
  button.props.onFocus?.();
  button.props.onPressIn?.();
  button.props.onPress?.();
  button.props.onPressOut?.();
  button.props.onBlur?.();
}

/**
 * Invokes the relevant textinput callbacks to type text
 *
 * @param button
 */
export function submitText(textInput, text) {
  textInput.props.onFocus?.();
  textInput.props.onChangeText?.(text);
  textInput.props.onBlur();
  textInput.props.onSubmitEditing?.();
}
