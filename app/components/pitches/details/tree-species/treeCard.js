//@flow

import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { TreeSpeciesRead } from "wri-api";
import Styles from "../../../../styles";
import ARROW_UP from "../../../../assets/icons/projects/arrowUp/ic_keyboard_arrow_up_black_24dp.png";
import ARROW_DOWN from "../../../../assets/icons/projects/arrowDown/ic_keyboard_arrow_down_black_24dp.png";
import Touchable from "../../../common/touchable";
import translate, { formatCurrency, formatNumber } from "../../../../locales";
import { getTotalCost } from "../../../../api/wri/helpers";

type Props = {|
  treeData: TreeSpeciesRead
|};

type State = {|
  isExpanded: boolean
|};
export default class TreeInfo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: true
    };
  }

  showDropdown = () => {
    this.setState({
      isExpanded: true
    });
  };

  hideDropdown = () => {
    this.setState({
      isExpanded: false
    });
  };

  renderArrowDown = () => {
    return <Image style={styles.dropImg} source={ARROW_DOWN} />;
  };

  renderArrowUp = () => {
    return <Image style={styles.dropImg} source={ARROW_UP} />;
  };

  renderTitle = (header: any) => {
    return (
      <View style={styles.dropdownSection}>
        <View style={styles.dropdownSectionTextView}>
          <Text style={styles.dropdownSectionText}>{header}</Text>
        </View>
        <View style={styles.dropdownSectionBorderView}>
          <View style={styles.borderLine} />
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Touchable
          accessibilityRole={"button"}
          onPress={this.state.isExpanded ? this.hideDropdown.bind(this) : this.showDropdown.bind(this)}
        >
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerText}>{this.props.treeData.name}</Text>
            </View>
            <View style={styles.iconContainer}>
              <View style={styles.dropIcon}>
                {this.state.isExpanded ? this.renderArrowDown() : this.renderArrowUp()}
              </View>
            </View>
            <View />
          </View>
        </Touchable>
        {this.state.isExpanded ? null : (
          <View style={styles.info}>
            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.numberOfTrees")}</Text>
            <Text style={styles.viewSubtitleText}>{formatNumber(this.props.treeData.count)}</Text>
            {this.renderTitle(translate("filters.treeSpecies"))}

            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.priceToPlant")}</Text>
            <Text style={styles.viewSubtitleText}>{formatCurrency(this.props.treeData.price_to_plant)}</Text>
            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.priceToMaintain")}</Text>
            <Text style={styles.viewSubtitleText}>{formatCurrency(this.props.treeData.price_to_maintain)}</Text>
            <Text style={styles.viewTitleText}>{translate("createPitch.details.treeSpecies.saplings")}</Text>
            <Text style={styles.viewSubtitleText}>{formatCurrency(this.props.treeData.saplings)}</Text>
            <Text style={styles.viewTitleText}>{translate("createPitch.details.treeSpecies.sitePrep")}</Text>
            <Text style={styles.viewSubtitleText}>{formatCurrency(this.props.treeData.site_prep)}</Text>
            <Text style={styles.viewTitleText}>{translate("createPitch.details.treeSpecies.totalPricePerTree")}</Text>
            <Text style={styles.viewSubtitleText}>{formatCurrency(getTotalCost(this.props.treeData))}</Text>
            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.survivalRate")}</Text>
            <Text style={styles.viewSubtitleText}>{this.props.treeData.survival_rate}</Text>
            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.producesFood")}</Text>
            <Text style={styles.viewSubtitleText}>
              {this.props.treeData.produces_food ? translate("common.yes") : translate("common.no")}
            </Text>
            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.producesFirewood")}</Text>
            <Text style={styles.viewSubtitleText}>
              {this.props.treeData.produces_firewood ? translate("common.yes") : translate("common.no")}
            </Text>
            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.producesTimber")}</Text>
            <Text style={styles.viewSubtitleText}>
              {this.props.treeData.produces_timber ? translate("common.yes") : translate("common.no")}
            </Text>
            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.owner")}</Text>
            <Text style={styles.viewSubtitleText}>{this.props.treeData.owner}</Text>
            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.native")}</Text>
            <Text style={styles.viewSubtitleText}>
              {this.props.treeData.is_native ? translate("common.yes") : translate("common.no")}
            </Text>
            <Text style={styles.viewTitleText}>{translate("project.treeSpecies.season", "Season")}</Text>
            <Text style={styles.viewSubtitleText}>{this.props.treeData.season}</Text>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    margin: Styles.Layout.Margins.small
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: Styles.Layout.Margins.small,
    paddingVertical: Styles.Layout.Margins.tiny,
    borderWidth: 1,
    borderColor: Styles.Colours.lightGrey
  },
  info: {
    padding: Styles.Layout.Margins.small
  },
  headerTitleContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center"
  },
  iconContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center"
  },
  dropIcon: {
    width: 25,
    height: 25
  },
  headerText: {
    ...Styles.Text.h1,
    fontSize: 20
  },
  dropImg: {
    height: 25,
    width: 25
  },
  borderLine: {
    borderColor: Styles.Colours.lightGrey,
    width: "100%",
    borderWidth: 0.5,
    alignSelf: "center"
  },
  viewTitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    color: Styles.Colours.brownGrey
  },
  viewSubtitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    paddingBottom: Styles.Layout.Margins.small
  },
  dropdownSection: {
    flexDirection: "row"
  },
  dropdownSectionTextView: {
    width: "60%",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  dropdownSectionText: {
    ...Styles.Text.h4,
    ...Styles.Text.uppercase,
    fontSize: 16,
    paddingBottom: Styles.Layout.Margins.small
  },
  dropdownSectionBorderView: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center"
  }
});
