// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import React, { Component, type ElementConfig } from "react";
import { Image, StyleSheet, View, Text } from "react-native";

// Utilities
import colours from "../../../../styles/colours";
import { IsSmallDevice } from "../../../../styles/layout";
import Styles from "../../../../styles";
import LoadingIndicator from "../../../common/loading-indicator";
import translate from "../../../../locales/";

import SyncTickIcon from "../../../../assets/icons/sync-tick/sync-tick.png";
import SyncErrorIcon from "../../../../assets/icons/sync-error/sync-error.png";
import { errorCodes } from "../../../../constants/errorMessaging";

type Props = {|
  ...ElementConfig<typeof View>,
  formMetadata: ProjectFormProps,
  syncState: AsyncState<*>
|};

export default class ProgressBar extends Component<Props> {
  renderSyncState() {
    if (!this.props.formMetadata.isDraft) {
      return null;
    }

    let syncText;
    let iconView;

    if (this.props.syncState.isFetching) {
      iconView = <LoadingIndicator style={styles.syncIcon} color={"black"} />;
      syncText = translate("common.saving");
    } else if (this.props.syncState.error) {
      if (this.props.syncState.error.code === errorCodes.API_NOT_FOUND) {
        iconView = <Image style={styles.syncIcon} source={SyncErrorIcon} resizeMode={"contain"} />;
        syncText = translate("common.draftMissing");
      } else {
        iconView = <Image style={styles.syncIcon} source={SyncErrorIcon} resizeMode={"contain"} />;
        syncText = translate("common.savedToDeviceOnly");
      }
    } else {
      iconView = <Image style={styles.syncIcon} source={SyncTickIcon} resizeMode={"contain"} />;
      syncText = translate("common.latestSaved");
    }

    return (
      <View style={styles.syncContainer}>
        {iconView}
        <Text style={[Styles.Text.body, Styles.Text.primaryFontBody]}>{syncText}</Text>
      </View>
    );
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { style, formMetadata, ...rest } = this.props;
    const percentage = `${(formMetadata.sequence / formMetadata.totalSteps) * 100}%`;

    return (
      <View style={[styles.container, style]}>
        <View style={styles.barWrapper}>
          <View style={[styles.bar, { width: percentage }]} />
        </View>
        <View style={styles.countWrapper}>
          <Text style={styles.stepCount}>
            {formMetadata.sequence} {"/"} {formMetadata.totalSteps}
          </Text>
          {this.renderSyncState()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colours.primary
  },
  barWrapper: {
    backgroundColor: colours.border,
    position: "relative",
    height: 10
  },
  stepCount: {
    ...Styles.Text.h3,
    ...Styles.Text.primaryFontBody,
    fontWeight: "bold",
    color: colours.black,
    paddingVertical: Styles.Layout.Margins.tiny,
    borderRadius: Styles.Layout.BorderRadius.small
  },
  countWrapper: {
    alignItems: "center",
    backgroundColor: Styles.Colours.semiTransparentWhite,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: IsSmallDevice ? Styles.Layout.Margins.small : Styles.Layout.Margins.medium
  },
  container: {
    backgroundColor: Styles.Colours.semiTransparentWhite,
    marginHorizontal: IsSmallDevice ? -Styles.Layout.Margins.small : -Styles.Layout.Margins.medium
  },
  syncContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  syncIcon: {
    height: 15,
    width: 15,
    margin: 0,
    marginRight: Styles.Layout.Margins.tiny
  }
});
