//@flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component, type ElementConfig, type Node } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Styles from "../../../../styles";
import ARROW_UP from "../../../../assets/icons/projects/arrowUp/ic_keyboard_arrow_up_black_24dp.png";
import ARROW_DOWN from "../../../../assets/icons/projects/arrowDown/ic_keyboard_arrow_down_black_24dp.png";
import LAND_OWNERSHIP_ICON from "../../../../assets/icons/projects/categoryMatch/landOwnership/land-ownership.png";
import LAND_TYPE_ICON from "../../../../assets/icons/projects/categoryMatch/landType/land-type.png";
import RESTORATION_METHOD_ICON from "../../../../assets/icons/projects/categoryMatch/restorationMethod/noun-refresh-761270.png";
import FUNDING_SOURCE_ICON from "../../../../assets/icons/projects/categoryMatch/fundingSource/fill-1.png";
import GOAL_ICON from "../../../../assets/icons/projects/categoryMatch/goal/goal.png";
import COST_ICON from "../../../../assets/icons/projects/categoryMatch/cost/cost.png";
import LAND_SIZE_ICON from "../../../../assets/icons/projects/categoryMatch/landSize/group-3.png";
import REGION_ICON from "../../../../assets/icons/projects/categoryMatch/region/fill-1.png";
import PRICE_PER_TREE_ICON from "../../../../assets/icons/projects/categoryMatch/pricePerTree/price-per-tree.png";
import REPORTING_LEVEL_ICON from "../../../../assets/icons/projects/categoryMatch/reportingLevel/reporting-level.png";
import REPORTING_FREQUENCY_ICON from "../../../../assets/icons/projects/categoryMatch/reportingFrequency/reporting-frequency.png";
import SDG_ICON from "../../../../assets/icons/projects/categoryMatch/SDG/sd-gs.png";

import { CircleMatchIndicator } from "./circularPercentage";
import Touchable from "../../../common/touchable";
import Picker from "../../../common/picker";

import { OfferReadAll, OfferRead, PitchRead, PitchReadAll } from "wri-api";
import translate, {
  formatCurrency,
  translateContinent,
  translateCountry,
  translateFundingBracket,
  translateFundingSource,
  translateLandOwnership,
  translateLandSize,
  translateLandType,
  translateReportingFrequency,
  translateReportingLevel,
  translateRestorationGoal,
  translateRestorationMethod,
  translateSustainableDevelopmentGoal
} from "../../../../locales";
import type { Project } from "../../../../utils/models.types";

type Props = {|
  ...ElementConfig<typeof View>,
  +comparableProjects: AsyncState<PitchReadAll> | AsyncState<OfferReadAll>,
  +filteredId: number,
  +project: PitchRead | OfferRead,
  +projectType: Project,
  +isOwnedByUser: boolean
|};

type State = {|
  +comparisonProjectId: ?number,
  +isCollapsed: boolean
|};

type Category = {|
  label: string,
  searchMatch: boolean,
  value: string | Array<string>,
  icon: number,
  subheading: string | null
|};

export default class CategoryMatchCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      comparisonProjectId: props.filteredId ?? (props.comparableProjects.data ?? [])[0]?.id,
      isCollapsed: true
    };
  }

  getLocation = () => {
    return [translateContinent(this.props.project.land_continent), translateCountry(this.props.project.land_country)]
      .filter(part => !!part)
      .join(", ");
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed
    }));
  };

  getNamesOfOwnerships = (list: Array<string>): Array<string> => {
    return list.map(item => translateLandOwnership(item));
  };

  getNamesOfLandTypes = (list: Array<string>): Array<string> => {
    return list.map(item => translateLandType(item));
  };

  getNamesOfRestorationMethodMetrics = (list: Array<string>): Array<string> => {
    return list.map(item => translateRestorationMethod(item));
  };

  getNamesOfGoals = (list: Array<string>): Array<string> => {
    return list.map(item => translateRestorationGoal(item));
  };

  getNamesOfSusDevGoals = (list: Array<string>): Array<string> => {
    return list.map(item => translateSustainableDevelopmentGoal(item));
  };

  getNamesOfFundingSources = (list: Array<string>): Array<string> => {
    return list.map(item => translateFundingSource(item));
  };

  getNamesOfLandSizes = (item: string) => {
    return translateLandSize(item);
  };

  getNamesOfFundingBracket = (item: string) => {
    return translateFundingBracket(item);
  };

  getNamesOfReportingLevels = (item: string) => {
    return translateReportingLevel(item);
  };

  getNamesOfReportingFrequency = (item: string) => {
    return translateReportingFrequency(item);
  };

  handleFocusedProjectChanged = (val: number) => {
    this.setState({ comparisonProjectId: val });
  };

  containsValues = (array: Array<string>, array2: Array<string>) => {
    return array.some(i => array2.includes(i));
  };

  getCategories = () => {
    const selectedComparisonId = this.state.comparisonProjectId;
    const comparisonProject = (this.props.comparableProjects.data ?? []).find(
      project => project.id === selectedComparisonId
    );
    return [
      {
        label: translate("attributes.land_ownerships"),
        searchMatch: this.containsValues(
          comparisonProject?.land_ownerships ?? [],
          this.props.project.land_ownerships ?? []
        ),
        value: this.getNamesOfOwnerships(this.props.project.land_ownerships ?? []),
        icon: LAND_OWNERSHIP_ICON,
        subheading: null
      },
      {
        label: translate("attributes.land_types"),
        searchMatch: this.containsValues(comparisonProject?.land_types ?? [], this.props.project.land_types ?? []),
        value: this.getNamesOfLandTypes(this.props.project.land_types ?? []),
        icon: LAND_TYPE_ICON,
        subheading: null
      },
      {
        label: translate("attributes.restoration_methods"),
        searchMatch: this.containsValues(
          comparisonProject?.restoration_methods ?? [],
          this.props.project.restoration_methods ?? []
        ),
        value: this.getNamesOfRestorationMethodMetrics(this.props.project.restoration_methods ?? []),
        icon: RESTORATION_METHOD_ICON,
        subheading: null
      },
      {
        label: translate("attributes.funding_sources"),
        searchMatch: this.containsValues(
          comparisonProject?.funding_sources ?? [],
          this.props.project.funding_sources ?? []
        ),
        value: this.getNamesOfFundingSources(this.props.project.funding_sources ?? []),
        icon: FUNDING_SOURCE_ICON,
        subheading: null
      },
      {
        label: translate("attributes.restoration_goals"),
        searchMatch: this.containsValues(
          comparisonProject?.restoration_goals ?? [],
          this.props.project.restoration_goals ?? []
        ),
        value: this.getNamesOfGoals(this.props.project.restoration_goals ?? []),
        icon: GOAL_ICON,
        subheading: null
      },
      {
        label: translate("attributes.funding_bracket"),
        searchMatch: comparisonProject?.funding_bracket === this.props.project.funding_bracket,
        value: this.getNamesOfFundingBracket(this.props.project.funding_bracket ?? ""),
        icon: COST_ICON,
        subheading: null
      },
      {
        label: translate("attributes.land_size"),
        searchMatch: comparisonProject?.land_size === this.props.project.land_size,
        value: this.getNamesOfLandSizes(this.props.project.land_size ?? ""),
        icon: LAND_SIZE_ICON,
        subheading: null
      },
      {
        label: translate("filters.geography"),
        searchMatch: comparisonProject?.land_continent === this.props.project.land_continent,
        value: this.getLocation(),
        icon: REGION_ICON,
        subheading: null
      },
      {
        label: translate("attributes.sustainable_development_goals"),
        searchMatch:
          (comparisonProject?.sustainable_development_goals ?? []).length > 0 &&
          (this.props.project.sustainable_development_goals ?? []).length > 0
            ? this.containsValues(
                comparisonProject?.sustainable_development_goals ?? [],
                this.props.project.sustainable_development_goals ?? []
              )
            : true,
        value:
          this.props.project.sustainable_development_goals &&
          this.props.project.sustainable_development_goals.length > 0
            ? this.getNamesOfSusDevGoals(this.props.project.sustainable_development_goals ?? [])
            : translate("common.na"),
        icon: SDG_ICON,
        subheading: null
      },
      {
        label: translate("attributes.reporting_frequency"),
        searchMatch: comparisonProject?.reporting_frequency === this.props.project.reporting_frequency,
        value: this.getNamesOfReportingFrequency(this.props.project.reporting_frequency ?? ""),
        icon: REPORTING_FREQUENCY_ICON,
        subheading: null
      },
      {
        label: translate("attributes.reporting_level"),
        searchMatch: comparisonProject?.reporting_level === this.props.project.reporting_level,
        value: this.getNamesOfReportingLevels(this.props.project.reporting_level ?? ""),
        icon: REPORTING_LEVEL_ICON,
        subheading: null
      },
      {
        label: translate("attributes.price_per_tree"),
        searchMatch:
          this.props.projectType === "pitch"
            ? (comparisonProject?.price_per_tree ?? 0) >= (this.props.project.price_per_tree ?? 0)
            : (comparisonProject?.price_per_tree ?? 0) <= (this.props.project.price_per_tree ?? 0),
        value: this.props.project.price_per_tree
          ? formatCurrency(this.props.project.price_per_tree, { minimumFractionDigits: 0 })
          : translate("common.na"),
        icon: PRICE_PER_TREE_ICON,
        subheading: null
      }
    ];
  };

  renderCategoryValue = (subheading: string | null, label: string | Array<string>) => {
    if (subheading != null) {
      return (
        <View style={styles.categoryValueView}>
          <Text style={styles.categoryValueText}>{label}</Text>
          <Text style={styles.subheadingText}>{subheading}</Text>
        </View>
      );
    } else {
      return <View style={styles.categoryValueView}>{this.renderMultipleCategoryValue(label)}</View>;
    }
  };

  renderMultipleCategoryValue = (label: string | Array<string>, isExpandedOption?: boolean): Node => {
    if (typeof label === "string") {
      return <Text style={styles.categoryValueText}>{label}</Text>;
    } else {
      if (isExpandedOption) {
        const commaSeparatedString = label.join(", ");
        return <Text style={styles.expandedCategoryValueText}>{commaSeparatedString}</Text>;
      } else {
        return <Text style={styles.categoryValueText}>{label[0]}</Text>;
      }
    }
  };

  renderCategories = (dataArray: Array<Category>) => {
    const categories = [];

    for (let i = 0; i < dataArray.length; i++) {
      const path = dataArray[i];
      categories.push(
        <View style={styles.categoryViewWrapper}>
          <View style={styles.categoryView}>
            <View style={styles.categoryLabelView}>
              <View style={styles.categoryIconView}>
                <Image source={path.icon} style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryLabelText}>{path.label}</Text>
            </View>
            {this.renderCategoryValue(path.subheading, path.value)}
            <View
              style={
                this.props.isOwnedByUser ||
                !this.props.comparableProjects.data ||
                this.props.comparableProjects.data.length === 0
                  ? styles.notSelectedView
                  : path.searchMatch
                  ? styles.matchView
                  : styles.notMatchView
              }
            />
          </View>
          {typeof path.value === "object" && path.value.length > 1 && (
            <View style={styles.categoryMultipleChoice}>{this.renderMultipleCategoryValue(path.value, true)}</View>
          )}
        </View>
      );
    }
    return <View>{categories}</View>;
  };

  renderPicker = () => {
    return (
      <Picker
        placeholder={{}}
        value={this.state.comparisonProjectId}
        onValueChange={itemValue => this.handleFocusedProjectChanged(itemValue)}
        items={(this.props.comparableProjects.data ?? []).map(item => ({ label: item.name, value: item.id }))}
        sorted
        fullBorder
      />
    );
  };

  renderMatchHeader = (numMatch: number, totalCategories: number) => {
    return (
      <View style={styles.matchHeaderView}>
        <Text style={styles.matchText}>
          {numMatch}/{totalCategories} {translate("project.match.amount")}
        </Text>
        <Text style={styles.basicText}>
          {this.props.projectType === "pitch"
            ? translate("project.match.basedOnFunding")
            : translate("project.match.basedOnPitch")}
        </Text>
      </View>
    );
  };

  renderDropDown = () => {
    return (
      <Touchable accessibilityRole={"button"} onPress={this.toggleDropdown.bind(this)}>
        <View style={styles.toggleExpandButton}>
          <Text style={styles.dropButtonText}>
            {this.state.isCollapsed
              ? translate("project.match.viewMore")
              : translate("mobile.project.match.viewLess", "View less")}
          </Text>
          <View style={styles.dropImgView}>
            <Image style={styles.dropImg} source={this.state.isCollapsed ? ARROW_DOWN : ARROW_UP} />
          </View>
        </View>
      </Touchable>
    );
  };

  render() {
    const categoryData = this.getCategories();
    const numMatch = categoryData.filter(function(category) {
      return category.searchMatch;
    }).length;
    return (
      <View style={[styles.container, this.props.style]}>
        {!this.props.isOwnedByUser &&
          this.props.comparableProjects.data &&
          this.props.comparableProjects.data.length > 0 && (
            <View style={styles.headerView}>
              <Text style={styles.basicText}>
                {this.props.projectType === "pitch"
                  ? translate("project.match.basedOnFunding")
                  : translate("project.match.basedOnPitch")}
              </Text>
              {this.renderPicker()}
              <CircleMatchIndicator style={styles.progressView} progress={numMatch} total={categoryData.length} />
              <Text style={styles.matchText}>
                {numMatch}/{categoryData.length} {translate("project.match.amount")}
              </Text>
            </View>
          )}

        <View style={styles.mainView}>
          {this.state.isCollapsed
            ? this.renderCategories(categoryData.slice(0, 4))
            : this.renderCategories(categoryData)}
          {this.renderDropDown()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    alignSelf: "stretch",
    marginBottom: Styles.Layout.Margins.small,
    borderTopWidth: 1,
    borderColor: Styles.Colours.border,
    paddingHorizontal: Styles.Layout.Margins.medium
  },
  mainView: {
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: Styles.Layout.Margins.small,
    borderBottomWidth: 1,
    borderColor: Styles.Colours.border,
    paddingHorizontal: Styles.Layout.Margins.medium
  },
  container: {
    alignItems: "center",
    marginVertical: Styles.Layout.Margins.small
  },
  matchView: {
    width: "1.5%",
    height: 25,
    borderBottomLeftRadius: Styles.Layout.Margins.small,
    borderTopLeftRadius: Styles.Layout.Margins.small,
    backgroundColor: Styles.Colours.primary,
    alignItems: "flex-end"
  },
  notSelectedView: {
    width: "1.5%",
    height: 25,
    borderBottomLeftRadius: Styles.Layout.Margins.small,
    borderTopLeftRadius: Styles.Layout.Margins.small,
    backgroundColor: Styles.Colours.lightGrey,
    alignItems: "flex-end"
  },
  notMatchView: {
    width: "1.5%",
    height: 25,
    borderBottomLeftRadius: Styles.Layout.Margins.small,
    borderTopLeftRadius: Styles.Layout.Margins.small,
    backgroundColor: Styles.Colours.brownGrey,
    alignItems: "flex-end"
  },
  categoryViewWrapper: {
    margin: 5,
    width: "100%"
  },
  categoryView: {
    borderRadius: 5,
    backgroundColor: Styles.Colours.white,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    ...Styles.Containers.cardShadow,
    alignItems: "center"
  },
  categoryMultipleChoice: {
    backgroundColor: Styles.Colours.black8,
    width: "100%",
    flexDirection: "row",
    padding: Styles.Layout.Margins.small,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  categoryLabelView: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  categoryValueView: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Styles.Layout.Margins.tiny
  },
  categoryIconView: {
    margin: Styles.Layout.Margins.small,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  categoryIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain"
  },
  categoryLabelText: {
    ...Styles.Text.bodyHero,
    fontSize: 17,
    flex: 1
  },
  categoryValueText: {
    ...Styles.Text.bodyHero,
    ...Styles.Text.emphasis,
    color: Styles.Colours.black,
    fontSize: 17,
    marginLeft: "auto",
    paddingHorizontal: Styles.Layout.Margins.small,
    lineHeight: 17,
    textAlign: "right"
  },
  expandedCategoryValueText: {
    ...Styles.Text.bodyHero,
    fontSize: 16,
    paddingHorizontal: Styles.Layout.Margins.small,
    lineHeight: 16,
    textAlign: "left",
    flex: 1,
    fontWeight: "normal"
  },
  subheadingText: {
    ...Styles.Text.bodyHero,
    color: Styles.Colours.black,
    fontSize: 13,
    marginLeft: "auto",
    paddingHorizontal: Styles.Layout.Margins.small,
    lineHeight: 13,
    textAlign: "right"
  },
  matchText: {
    ...Styles.Text.h3,
    ...Styles.Text.uppercase,
    textAlign: "center"
  },
  matchHeaderView: {
    alignSelf: "flex-start",
    marginVertical: Styles.Layout.Margins.medium
  },
  basicText: {
    ...Styles.Text.h3,
    ...Styles.Text.uppercase,
    textAlign: "center",
    marginTop: Styles.Layout.Margins.medium
  },
  toggleExpandButton: {
    flexDirection: "row",
    alignItems: "center",
    margin: Styles.Layout.Margins.small,
    marginTop: Styles.Layout.Margins.medium
  },
  dropButtonText: {
    ...Styles.Text.bodyHero,
    ...Styles.Text.emphasis,
    ...Styles.Text.uppercase,
    color: Styles.Colours.black,
    fontSize: 17
  },
  dropImgView: {
    justifyContent: "center",
    alignItems: "center"
  },
  dropImg: {
    height: 25,
    width: 25
  },
  progressView: {
    width: 100,
    height: 100,
    borderWidth: 5,
    borderRadius: 50,
    borderColor: Styles.Colours.brownGrey,
    backgroundColor: Styles.Colours.white,
    marginTop: Styles.Layout.Margins.medium,
    marginBottom: Styles.Layout.Margins.medium,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
});
