//@flow

import React, { Component } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import Layout, { IsSmallDevice } from "../../../styles/layout";
import Styles from "../../../styles";
import translate from "../../../locales";
import Button from "../../common/button";
import { withSafeArea } from "react-native-safe-area";
import Screen from "../../common/screen";
import FilterButton from "../../../components/common/filter-button";
import { Navigation } from "react-native-navigation";
import type { AsyncState } from "../../../redux/redux.types";
import {
  CarbonCertificationTypeReadAll,
  LandOwnershipReadAll,
  LandSizeReadAll,
  FundingSourceReadAll,
  RestorationGoalReadAll,
  RestorationMethodReadAll,
  SustainableDevelopmentGoalReadAll,
  ContinentReadAll,
  FilterCondition,
  FundingBracketReadAll,
  ReportingFrequencyReadAll,
  ReportingLevelReadAll
} from "wri-api";

const NAV_BAR_BUTTON_CANCEL = "nav_bar_btn_cancel";
const cancelIcon = require("../../../assets/icons/projects/filter/remove.png");
const SafeAreaView = withSafeArea(View, "padding", "bottom");

import ValidatedTextInput from "../../common/validated-input";
import Validation from "../../../utils/validation";
import textInputProps from "../../../constants/textInputProps";
import { removeAttributeFromFilters } from "../../../api/wri/helpers";
import type { Project } from "../../../utils/models.types";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,
  +sortingOption: string,
  +filterCondition: Array<FilterCondition>,
  +fundingSource: AsyncState<FundingSourceReadAll>,
  +fundingBrackets: AsyncState<FundingBracketReadAll>,
  +landOwnership: AsyncState<LandOwnershipReadAll>,
  +landTypes: AsyncState<CarbonCertificationTypeReadAll>,
  +landSizes: AsyncState<LandSizeReadAll>,
  +restorationMethod: AsyncState<RestorationMethodReadAll>,
  +sustainableGoal: AsyncState<SustainableDevelopmentGoalReadAll>,
  +restorationGoal: AsyncState<RestorationGoalReadAll>,
  +continents: AsyncState<ContinentReadAll>,
  +reportingFrequencies: AsyncState<ReportingFrequencyReadAll>,
  +reportingLevels: AsyncState<ReportingLevelReadAll>,
  +updateFilters: (Array<FilterCondition>, string) => void,
  +type: Project
|};

type State = {|
  +option: Array<FilterCondition>
|};

export default class SearchFilterScreen extends Component<Props, State> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: translate("mobile.filter.title", "Filter Search"),
          alignment: "fill"
        },
        rightButtons: [
          {
            id: NAV_BAR_BUTTON_CANCEL,
            icon: cancelIcon,
            showAsAction: "always"
          }
        ]
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      option: this.props.filterCondition
    };
  }

  navigationButtonPressed(event: { buttonId: string }) {
    if (event.buttonId === NAV_BAR_BUTTON_CANCEL) {
      Navigation.pop(this.props.componentId);
    }
  }

  saveFilter = () => {
    this.props.updateFilters(this.state.option, this.props.sortingOption);
    Navigation.pop(this.props.componentId);
  };

  clearFilter = () => {
    this.setState({ option: [] });
  };

  costTitle = translate("filters.amountNeeded");
  regionTitle = translate("filters.geography");
  landOwnerTitle = translate("filters.landOwnerships");
  restorationTitle = translate("filters.restorationGoals");
  sustainableTitle = translate("filters.sustDevGoals");
  landSizeTitle = translate("filters.landSize");
  landTypeTitle = translate("filters.landTypes");
  fundingSourceTitle = translate("filters.fundingSources");
  restorationMetricTitle = translate("filters.restorationMethods");
  reportingFrequencyTitle = translate("filters.reportingFrequencies");
  reportingLevelTitle = translate("filters.reportingLevels");
  pricePerTreeTitle =
    this.props.type === "pitch" ? translate("filters.maximumPricePerTree") : translate("filters.minimumPricePerTree");

  _updateTreePrice = (price: number) => {
    let treePrice = null;
    if (price) {
      let treePriceArray = [];
      if (this.props.type === "pitch") {
        treePriceArray = [0, price];
      } else {
        // 2147483647 is the max number that server accepts
        treePriceArray = [price, 2147483647];
      }
      treePrice = new FilterCondition();
      treePrice.attribute = "price_per_tree";
      treePrice.operator = "between";
      treePrice.value = treePriceArray;
    }
    //Remove the old price_per_tree filterCondition but keep all the other filterConditions
    const modifiedOption = removeAttributeFromFilters(this.state.option, "price_per_tree");
    const filterOptions = treePrice ? [...modifiedOption, treePrice] : modifiedOption;

    this.setState({
      option: filterOptions
    });
  };

  getPricePerTree = (): ?number => {
    const boundaries = this.state.option.find(item => item.attribute === "price_per_tree") ?? new FilterCondition();
    return boundaries.value
      ? this.props.type === "offer"
        ? Number(boundaries.value[0])
        : Number(boundaries.value[1])
      : null;
  };

  renderButtonSet = (
    operator: OperatorEnum,
    category: AttributesEnum,
    title: string,
    dataArray: Array<?string>,
    translationKeyOverride: ?string
  ) => {
    const buttons = [];

    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      const translationKey = translationKeyOverride ? translationKeyOverride : category;
      if (value) {
        buttons.push(
          <FilterButton
            key={i}
            singleSelection={false}
            content={translate(`api.${translationKey}.${value}`, value)}
            category={category}
            operator={operator}
            filters={this.state.option}
            onValueChange={filter => this.setState({ option: filter })}
            value={value}
          />
        );
      }
    }
    return (
      <View>
        <Text style={styles.headerPadding}>{title}</Text>
        <View style={styles.categoryButtonView}>{buttons}</View>
        <View style={styles.bottomLine} />
      </View>
    );
  };

  render() {
    const pricePerTree = this.getPricePerTree();
    const isPriceValid = Validation.filterTreePrice.validate(pricePerTree);

    return (
      <Screen containerComponent={SafeAreaView} secondary keyboard style={styles.viewPadding}>
        <ScrollView style={styles.scrollViewSize}>
          <View style={styles.sectionListView}>
            {this.renderButtonSet(
              "in",
              "funding_bracket",
              this.costTitle,
              this.props.fundingBrackets.data ? this.props.fundingBrackets.data.map(item => item.bracket) : []
            )}
            {this.renderButtonSet(
              "in",
              "land_continent",
              this.regionTitle,
              this.props.continents.data ? this.props.continents.data.map(item => item.continent) : [],
              "continents"
            )}
            {this.renderButtonSet(
              "contains",
              "land_ownerships",
              this.landOwnerTitle,
              this.props.landOwnership.data ? this.props.landOwnership.data.map(item => item.ownership) : []
            )}
            {this.renderButtonSet(
              "contains",
              "restoration_goals",
              this.restorationTitle,
              this.props.restorationGoal.data ? this.props.restorationGoal.data.map(item => item.goal) : []
            )}
            {this.renderButtonSet(
              "contains",
              "restoration_methods",
              this.restorationMetricTitle,
              this.props.restorationMethod.data ? this.props.restorationMethod.data.map(item => item.method) : []
            )}
            {this.renderButtonSet(
              "contains",
              "sustainable_development_goals",
              this.sustainableTitle,
              this.props.sustainableGoal.data ? this.props.sustainableGoal.data.map(item => item.goal) : []
            )}
            {this.renderButtonSet(
              "contains",
              "land_types",
              this.landTypeTitle,
              this.props.landTypes.data ? this.props.landTypes.data.map(item => item.type) : []
            )}
            {this.renderButtonSet(
              "in",
              "land_size",
              this.landSizeTitle,
              this.props.landSizes.data ? this.props.landSizes.data.map(item => item.size) : [],
              "land_sizes"
            )}
            {this.renderButtonSet(
              "contains",
              "funding_sources",
              this.fundingSourceTitle,
              this.props.fundingSource.data ? this.props.fundingSource.data.map(item => item.source) : []
            )}
            {this.renderButtonSet(
              "in",
              "reporting_frequency",
              this.reportingFrequencyTitle,
              this.props.reportingFrequencies.data
                ? this.props.reportingFrequencies.data.map(item => item.frequency)
                : [],
              "reporting_frequencies"
            )}
            {this.renderButtonSet(
              "in",
              "reporting_level",
              this.reportingLevelTitle,
              this.props.reportingLevels.data ? this.props.reportingLevels.data.map(item => item.level) : [],
              "reporting_levels"
            )}
            <Text style={styles.headerPadding}> {this.pricePerTreeTitle} </Text>
            <ValidatedTextInput
              placeholder={this.pricePerTreeTitle}
              valid={isPriceValid}
              value={pricePerTree}
              onChangeText={this._updateTreePrice}
              message={Validation.filterTreePrice.errorString(pricePerTree)}
              returnKeyType="done"
              {...textInputProps.decimal}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonRow}>
          <Button
            style={[Styles.Buttons.secondary, styles.buttonStyle]}
            title={translate("projects.clearFilters")}
            onPress={this.clearFilter}
          />
          <Button
            style={[Styles.Buttons.primary, styles.buttonStyle]}
            title={translate("mobile.projects.applyFilters", "Apply Filters")}
            onPress={this.saveFilter}
          />
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  viewPadding: {
    ...Styles.Utilities.flexGrow,
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  buttonRow: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: Styles.Colours.white,
    alignItems: "center",
    marginTop: Layout.Margins.large,
    paddingVertical: Layout.Margins.small,
    ...Layout.FlexRow,
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    flexShrink: 1
  },
  buttonStyle: {
    height: 50,
    alignSelf: "center",
    flexGrow: 1,
    marginHorizontal: Layout.Margins.small,
    paddingHorizontal: undefined
  },
  sectionListView: {
    paddingHorizontal: IsSmallDevice ? Layout.Margins.small : Layout.Margins.medium,
    paddingTop: Layout.Margins.medium,
    width: "100%"
  },
  categoryButtonView: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    paddingBottom: Layout.Margins.medium
  },
  scrollViewSize: {
    marginBottom: "17%"
  },
  bottomLine: {
    borderWidth: 1,
    width: "100%",
    height: 0,
    borderColor: Styles.Colours.tableDivider,
    marginBottom: Layout.Margins.tiny
  },
  headerPadding: {
    ...Styles.Text.secondaryH2,
    paddingTop: Layout.Margins.tiny
  }
});
