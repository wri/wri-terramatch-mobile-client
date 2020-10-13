// This is the screen where the expanded project information will be displayed
// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component } from "react";
import { View } from "react-native";
import {
  CarbonCertificationVersionReadAll,
  OrganisationRead,
  PitchRead,
  RestorationMethodMetricVersionReadAll,
  TreeSpeciesVersionReadAll
} from "wri-api";
import translate from "../../../../locales";

import HeaderDropdown from "../../../common/dropdown-header";
import Geolocation from "../geolocation";
import RestorationMetrics from "../restoration-metrics";
import TreeSpecies from "../tree-species";
import DevelopmentGoals from "../../../projects/details/development-goals";
import OrganisationDetails from "../../../projects/details/organisation-details";
import Certification from "../certification";
import FundingDetails from "../funding";
import ReportingCapabilities from "../../../../containers/projects/details/reporting-capabilities";

type Props = {|
  +certificationState: AsyncState<CarbonCertificationVersionReadAll>,

  +metricsState: AsyncState<RestorationMethodMetricVersionReadAll>,

  +organisationState: AsyncState<OrganisationRead>,

  +pitch: PitchRead,

  +treeSpeciesState: AsyncState<TreeSpeciesVersionReadAll>
|};

export default class MetricsTab extends Component<Props> {
  render() {
    return (
      <View>
        <HeaderDropdown header={translate("project.organisationDetails.title")}>
          <OrganisationDetails organisationState={this.props.organisationState} />
        </HeaderDropdown>

        <HeaderDropdown header={translate("project.funding.title")}>
          <FundingDetails pitch={this.props.pitch} />
        </HeaderDropdown>

        <HeaderDropdown header={translate("project.certificates.title")}>
          <Certification certificationState={this.props.certificationState} />
        </HeaderDropdown>

        <HeaderDropdown header={translate("project.capabilities.title")}>
          <ReportingCapabilities project={this.props.pitch} />
        </HeaderDropdown>

        <HeaderDropdown header={translate("project.metrics")}>
          <RestorationMetrics pitch={this.props.pitch} metricsState={this.props.metricsState} />
        </HeaderDropdown>

        {this.props.treeSpeciesState.data && this.props.treeSpeciesState.data.length > 0 && (
          <HeaderDropdown header={translate("project.treeSpecies.title")}>
            <TreeSpecies treeSpeciesState={this.props.treeSpeciesState} />
          </HeaderDropdown>
        )}

        {this.props.pitch.land_geojson && (
          <HeaderDropdown header={translate("project.geolocation.title")}>
            <Geolocation pitch={this.props.pitch} />
          </HeaderDropdown>
        )}

        <HeaderDropdown header={translate("project.sustainableDevelopmentGoals.title")}>
          <DevelopmentGoals project={this.props.pitch} />
        </HeaderDropdown>
      </View>
    );
  }
}
