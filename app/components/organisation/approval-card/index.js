// @flow

import type { AsyncState } from "../../../redux/redux.types.js";
import React, { Component, type ElementConfig, type Node } from "react";
import { StyleSheet, View } from "react-native";
import { OrganisationVersionRead, OrganisationVersionReadAll } from "wri-api";
import translate from "../../../locales/";
import Styles from "../../../styles";
import { findMostRecentOrganisationApprovedVersion, findMostRecentOrganisationVersion } from "../../../api/wri/helpers";
import LoadingIndicator from "../../common/loading-indicator";
import Error from "../../common/error";
import ScreenHeader from "../../common/screen/header";
import ScreenSubtext from "../../common/screen/subtext";
import Button from "../../common/button";

type Props = {|
  ...ElementConfig<typeof View>,

  +isAwaitingFirstApproval: boolean,

  +organisationVersionsState: AsyncState<OrganisationVersionReadAll>,

  +onEditOrganisationPressed: () => void,

  +onSignInPressed?: () => void
|};

/**
 * Approval banner shown only before the user has properly signed in to the app
 */
export default class OrganisationApprovalBanner extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    // If there is ANY approved version, then that is what we show. Otherwise, simply show the status of the most recent
    // version
    const mostRecentApprovedVersion = this.props.isAwaitingFirstApproval
      ? findMostRecentOrganisationApprovedVersion(this.props.organisationVersionsState.data ?? [])
      : null;
    const mostRecentVersion =
      mostRecentApprovedVersion ?? findMostRecentOrganisationVersion(this.props.organisationVersionsState.data ?? []);
    const isFetching = this.props.organisationVersionsState.isFetching;
    const hasError = !!this.props.organisationVersionsState.error;

    if (!mostRecentVersion && !isFetching && !hasError) {
      return null;
    }

    const cardContents = this.renderCardContents(mostRecentVersion);

    if (!cardContents && !isFetching && !hasError) {
      return null;
    }

    return (
      <View style={styles.notificationBanner}>
        {isFetching && <LoadingIndicator />}
        {cardContents}
        {!isFetching && hasError && <Error error={this.props.organisationVersionsState.error} />}
      </View>
    );
  }

  renderCardContents = (mostRecentVersion: ?OrganisationVersionRead): Node => {
    const approvalStatus = mostRecentVersion?.status;

    if (!mostRecentVersion || !approvalStatus) {
      return null;
    }

    switch (approvalStatus) {
      case "pending": {
        return (
          <>
            <ScreenHeader style={styles.heading}>{translate("organisation.awaitingApproval")}</ScreenHeader>
            <ScreenSubtext>{translate("organisation.awaitingApprovalMessage")}</ScreenSubtext>
          </>
        );
      }
      case "approved": {
        if (!this.props.isAwaitingFirstApproval) {
          return null;
        }
        return (
          <>
            <ScreenHeader style={styles.heading}>{translate("mobile.organisation.approved")}</ScreenHeader>
            <ScreenSubtext>{translate("mobile.organisation.approvedMessage")}</ScreenSubtext>
            <Button
              style={Styles.Buttons.primary}
              onPress={this.props.onSignInPressed}
              title={translate("mobile.login.enterApp")}
            />
          </>
        );
      }
      case "rejected": {
        return (
          <>
            <ScreenHeader style={styles.heading}>{translate("organisation.rejected")}</ScreenHeader>

            <ScreenSubtext>
              {translate("organisation.rejectedMessage", null, {
                reason: `${translate(
                  `api.rejected_reasons.${mostRecentVersion.rejected_reason ?? "other"}`
                )}: ${mostRecentVersion.rejected_reason_body ?? ""}`
              })}
            </ScreenSubtext>
            <Button
              style={Styles.Buttons.primary}
              onPress={this.props.onEditOrganisationPressed}
              title={translate("mobile.organisation.rejectedButton")}
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
