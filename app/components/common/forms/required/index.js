"use strict";

import React, { Component } from "react";
import { Text } from "react-native";
import translate from "../../../../locales/";

class Required extends Component {
  render() {
    return (
      <Text accessible={true} accessibilityLabel={translate("mobile.accessibility.common.required", "Required")}>
        {translate("mobile.accessibility.common.requiredField", "*")}
      </Text>
    );
  }
}

export default Required;
