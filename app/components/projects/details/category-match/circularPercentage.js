import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Styles from "../../../../styles";
import PropTypes from "prop-types";
import translate from "../../../../locales/";
import LoadingIndicator from "../../../common/loading-indicator";

const propStyle = (percentage, baseDeg) => {
  const rotate = baseDeg + percentage * 3.6;
  return {
    transform: [{ rotateZ: `${rotate}deg` }]
  };
};

const renderOverlay = percentage => {
  if (percentage > 50) {
    return <View style={[styles.secondProgressLayer, propStyle(percentage - 50, 45)]} />;
  } else {
    return <View style={styles.offsetLayer} />;
  }
};

export const CircleMatchIndicator = ({ style, progress, total }) => {
  let firstProgressLayerStyle;
  const percentage = (progress / total) * 100;
  if (percentage > 50) {
    firstProgressLayerStyle = propStyle(50, -135);
  } else {
    firstProgressLayerStyle = propStyle(percentage, -135);
  }

  return (
    <View style={style}>
      <View style={[styles.firstProgressLayer, firstProgressLayerStyle]} />
      {renderOverlay(percentage ?? 0)}
      {!percentage && percentage !== 0 ? (
        <LoadingIndicator size={"large"} style={styles.loadingIndicator} />
      ) : (
        <>
          <Text style={styles.percentageText}>
            {progress}/{total}
          </Text>
          <Text style={styles.percentageText}>{translate("api.notification.actions.match")}</Text>
        </>
      )}
    </View>
  );
};

CircleMatchIndicator.propTypes = {
  progress: PropTypes.number,
  style: PropTypes.any,
  total: PropTypes.number
};
const styles = StyleSheet.create({
  firstProgressLayer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
    borderLeftColor: "transparent",
    borderLeftWidth: 5,
    borderBottomColor: "transparent",
    borderBottomWidth: 5,
    borderRightColor: Styles.Colours.primary,
    borderRightWidth: 5,
    borderTopColor: Styles.Colours.primary,
    borderTopWidth: 5,
    transform: [{ rotateZ: "-135deg" }]
  },
  secondProgressLayer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
    borderLeftColor: "transparent",
    borderLeftWidth: 5,
    borderBottomColor: "transparent",
    borderBottomWidth: 5,
    borderRightColor: Styles.Colours.primary,
    borderRightWidth: 5,
    borderTopColor: Styles.Colours.primary,
    borderTopWidth: 5,
    transform: [{ rotateZ: "45deg" }]
  },
  offsetLayer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
    borderLeftColor: "transparent",
    borderLeftWidth: 5,
    borderBottomColor: "transparent",
    borderBottomWidth: 5,
    borderRightColor: Styles.Colours.brownGrey,
    borderRightWidth: 5,
    borderTopColor: Styles.Colours.brownGrey,
    borderTopWidth: 5,
    transform: [{ rotateZ: "-135deg" }]
  },
  percentageText: {
    ...Styles.Text.h3,
    ...Styles.Text.uppercase,
    fontSize: 23,
    justifyContent: "center",
    alignSelf: "center"
  },
  loadingIndicator: {
    height: "100%",
    width: "100%"
  }
});
