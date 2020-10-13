// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component } from "react";
import { View } from "react-native";
import { OfferRead, OrganisationRead } from "wri-api";
import translate from "../../../../locales";

import HeaderDropdown from "../../../common/dropdown-header";
import DevelopmentGoals from "../../../projects/details/development-goals";
import OrganisationDetails from "../../../projects/details/organisation-details";
import FundingDetails from "../funding";
import ReportingCapabilities from "../../../../containers/projects/details/reporting-capabilities";

type Props = {|
  +offer: OfferRead,

  +organisationState: AsyncState<OrganisationRead>
|};

export default class MetricsTab extends Component<Props> {
  render() {
    return (
      <View>
        <HeaderDropdown header={translate("projectPitch.metrics.organizationDetails.title", "Organization Details")}>
          <OrganisationDetails organisationState={this.props.organisationState} />
        </HeaderDropdown>

        <HeaderDropdown header={translate("projectPitch.metrics.funding.title", "Funding")}>
          <FundingDetails offer={this.props.offer} />
        </HeaderDropdown>

        <HeaderDropdown header={translate("projectPitch.metrics.capabilities.title", "Reporting Capabilities")}>
          <ReportingCapabilities project={this.props.offer} />
        </HeaderDropdown>

        <HeaderDropdown header={translate("projectPitch.metrics.devGoals.title", "Sustainable Development Goals")}>
          <DevelopmentGoals project={this.props.offer} />
        </HeaderDropdown>
      </View>
    );
  }
}
