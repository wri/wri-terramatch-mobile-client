// @flow

import type { AsyncState } from "../../../redux/redux.types.js";
import React, { Component, type ElementConfig, type Node } from "react";
import { StyleSheet, View } from "react-native";
import { PitchVersionRead, PitchVersionReadAll } from "wri-api";
import translate from "../../../locales/";
import Styles from "../../../styles";
import { findMostRecentPitchVersion } from "../../../api/wri/helpers";
import Error from "../../common/error";
import ScreenHeader from "../../common/screen/header";
import ScreenSubtext from "../../common/screen/subtext";
import Button from "../../common/button";

type Props = {|
  ...ElementConfig<typeof View>,

  +pitchVersionsState: AsyncState<PitchVersionReadAll>,

  +onEditPitchPressed: () => any
|};

/**
 * Approval banner shown only before the user has properly signed in to the app
 */
export default class PitchApprovalBanner extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const mostRecentVersion = findMostRecentPitchVersion(this.props.pitchVersionsState.data ?? []);
    const isFetching = this.props.pitchVersionsState.isFetching;
    const hasError = !!this.props.pitchVersionsState.error;

    if (!mostRecentVersion && !hasError) {
      return null;
    }

    const cardContents = this.renderCardContents(mostRecentVersion);

    if (!cardContents && !hasError) {
      return null;
    }

    return (
      <View style={styles.notificationBanner}>
        {cardContents}
        {!isFetching && hasError && <Error error={this.props.pitchVersionsState.error} />}
      </View>
    );
  }

  renderCardContents = (mostRecentVersion: ?PitchVersionRead): Node => {
    const approvalStatus = mostRecentVersion?.status;

    if (!mostRecentVersion || !approvalStatus) {
      return null;
    }

    switch (approvalStatus) {
      case "pending": {
        return (
          <>
            <ScreenHeader style={styles.heading}>{translate("project.awaitingApproval")}</ScreenHeader>
            <ScreenSubtext>{translate("project.awaitingApprovalMessage")}</ScreenSubtext>
          </>
        );
      }
      case "approved": {
        return null;
      }
      case "rejected": {
        return (
          <>
            <ScreenHeader style={styles.heading}>
              {translate("project.rejected", "Your account has been rejected")}
            </ScreenHeader>

            <ScreenSubtext>
              {translate("project.rejectedMessage", null, {
                reason: `${translate(
                  `api.rejected_reasons.${mostRecentVersion.rejected_reason ?? "other"}`
                )}: ${mostRecentVersion.rejected_reason_body ?? ""}`
              })}
            </ScreenSubtext>
            <Button
              style={Styles.Buttons.primary}
              onPress={this.props.onEditPitchPressed}
              title={translate("mobile.pitches.rejectedButton", "Fix application")}
            />
          </>
        );
      }
      case "archived": {
        return null;
      }
      default: {
        // eslint-disable-next-line babel/no-unused-expressions
        (approvalStatus: empty); // ensure we have exhausted all cases
        return null;
      }
    }
  };
}

const styles = StyleSheet.create({
  notificationBanner: {
    backgroundColor: Styles.Colours.white,
    padding: Styles.Layout.Margins.medium
  },
  heading: {
    marginTop: Styles.Layout.Margins.small
  }
});
