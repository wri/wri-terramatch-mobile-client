// @flow

import type { PendingTreeSpecies } from "../../../../redux/wri-api/pitches";
import React, { Component } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import Styles from "../../../../styles";
import InputLabel from "../../../../components/common/forms/input-label";
import Touchable from "../../../../components/common/touchable";
import translate, { formatCurrency, formatNumber } from "../../../../locales";
import Checkbox from "../../../common/checkbox";
import { getTotalCost } from "../../../../api/wri/helpers";

type Props = {|
  item: PendingTreeSpecies,
  removeSpecie: PendingTreeSpecies => void
|};

type State = {|
  +isExpanded: boolean
|};

const treeIcon = require("../../../../assets/icons/pitch/tree.png");
const removeIcon = require("../../../../assets/icons/pitch/remove.png");
const upIcon = require("../../../../assets/icons/projects/arrowUp/ic_keyboard_arrow_up_black_24dp.png");
const downIcon = require("../../../../assets/icons/projects/arrowDown/ic_keyboard_arrow_down_black_24dp.png");

class TreeSpeciesPreviewCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: false
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

  removeSpecie = () => {
    Alert.alert(
      translate("createPitch.details.treeSpecies.remove"),
      translate("createPitch.details.treeSpecies.removeDescription"),
      [
        {
          text: translate("common.cancel"),
          style: "cancel"
        },
        {
          text: translate("common.yes"),
          onPress: () => this.props.removeSpecie(this.props.item)
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const species = this.props.item.data;

    const arrowIcon = this.state.isExpanded ? upIcon : downIcon;
    return (
      <View style={styles.previewCard}>
        <Touchable
          accessibilityRole={"button"}
          onPress={this.state.isExpanded ? this.hideDropdown.bind(this) : this.showDropdown.bind(this)}
        >
          <View style={styles.previewCardHeader}>
            <View style={[Styles.Utilities.flexRow, Styles.Utilities.flexCenter]}>
              <View style={styles.treeIconWrapper}>
                <Image source={treeIcon} style={styles.treeIcon} />
              </View>
              <Text style={[Styles.Text.h4, Styles.Text.uppercase]}>{species.name}</Text>
            </View>
            <Image source={arrowIcon} style={styles.arrowIcon} />
          </View>
        </Touchable>
        {this.state.isExpanded && (
          <View style={styles.previewCardContent}>
            <InputLabel title={translate("createPitch.details.treeSpecies.name")} />
            <Text style={Styles.Text.body}>{species.name}</Text>

            <Checkbox
              isSelected={species.is_native}
              checkboxLabel={translate("createPitch.details.treeSpecies.isNative")}
            />

            <InputLabel title={translate("createPitch.details.treeSpecies.season")} />
            <Text style={Styles.Text.body}>{species.season}</Text>

            <InputLabel title={translate("createPitch.details.treeSpecies.count")} />
            <Text style={Styles.Text.body}>{formatNumber(species.count)}</Text>

            <InputLabel title={translate("createPitch.details.treeSpecies.priceToPlant")} />
            <Text style={Styles.Text.body}>{formatCurrency(species.price_to_plant)}</Text>

            <InputLabel title={translate("createPitch.details.treeSpecies.priceToMaintain")} />
            <Text style={Styles.Text.body}>{formatCurrency(species.price_to_maintain)}</Text>

            <InputLabel title={translate("createPitch.details.treeSpecies.saplings")} />
            <Text style={Styles.Text.body}>{formatCurrency(species.saplings)}</Text>

            <InputLabel title={translate("createPitch.details.treeSpecies.sitePrep")} />
            <Text style={Styles.Text.body}>{formatCurrency(species.site_prep)}</Text>

            <InputLabel title={translate("createPitch.details.treeSpecies.totalPricePerTree")} />
            <Text style={Styles.Text.body}>{formatCurrency(getTotalCost(species))}</Text>

            <Checkbox
              isSelected={species.produces_food ?? false}
              checkboxLabel={translate("createPitch.details.treeSpecies.produces_food")}
            />
            <Checkbox
              isSelected={species.produces_firewood ?? false}
              checkboxLabel={translate("createPitch.details.treeSpecies.produces_firewood")}
            />
            <Checkbox
              isSelected={species.produces_timber ?? false}
              checkboxLabel={translate("createPitch.details.treeSpecies.produces_timber")}
            />

            <InputLabel title={translate("createPitch.details.treeSpecies.owner")} />
            <Text style={Styles.Text.body}>{species.owner}</Text>

            <Touchable accessibilityRole={"button"} onPress={this.removeSpecie}>
              <Image source={removeIcon} style={styles.removeIcon} />
            </Touchable>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  previewCard: {
    backgroundColor: Styles.Colours.white,
    borderRadius: Styles.Layout.BorderRadius.medium,
    marginTop: Styles.Layout.Margins.large,
    ...Styles.Containers.cardShadow
  },
  previewCardContent: {
    padding: Styles.Layout.Margins.medium
  },
  previewCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Styles.Colours.white,
    borderRadius: Styles.Layout.BorderRadius.medium,
    padding: Styles.Layout.Margins.medium,
    ...Styles.Containers.cardShadow
  },
  treeIcon: {
    width: 36,
    height: 40
  },
  removeIcon: {
    width: 36,
    height: 40,
    alignSelf: "center",
    marginTop: Styles.Layout.Margins.medium,
    resizeMode: "contain"
  },
  treeIconWrapper: {
    borderColor: Styles.Colours.border,
    borderWidth: 2,
    borderRadius: Styles.Layout.BorderRadius.medium,
    paddingVertical: Styles.Layout.Margins.small,
    paddingHorizontal: Styles.Layout.Margins.medium,
    height: 62,
    width: 62,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginRight: Styles.Layout.Margins.small
  },
  arrowIcon: {
    width: 10,
    height: 18
  }
});

export default TreeSpeciesPreviewCard;
