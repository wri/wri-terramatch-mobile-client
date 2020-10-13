// @flow

import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from "react-native";

import Styles from "../../../../styles";
import GOAL_01 from "../../../../assets/icons/projects/developmentGoals/goal01/the-global-goals-icons-black-goal-1.png";
import GOAL_02 from "../../../../assets/icons/projects/developmentGoals/goal02/the-global-goals-icons-black-goal-2.png";
import GOAL_03 from "../../../../assets/icons/projects/developmentGoals/goal03/the-global-goals-icons-black-goal-3.png";
import GOAL_04 from "../../../../assets/icons/projects/developmentGoals/goal04/the-global-goals-icons-black-goal-4.png";
import GOAL_05 from "../../../../assets/icons/projects/developmentGoals/goal05/the-global-goals-icons-black-goal-5-2.png";
import GOAL_06 from "../../../../assets/icons/projects/developmentGoals/goal06/the-global-goals-icons-black-goal-6.png";
import GOAL_07 from "../../../../assets/icons/projects/developmentGoals/goal07/the-global-goals-icons-color-goal-7.png";
import GOAL_08 from "../../../../assets/icons/projects/developmentGoals/goal08/the-global-goals-icons-black-goal-8.png";
import GOAL_09 from "../../../../assets/icons/projects/developmentGoals/goal09/the-global-goals-icons-black-goal-9.png";
import GOAL_10 from "../../../../assets/icons/projects/developmentGoals/goal10/the-global-goals-icons-black-goal-10.png";
import GOAL_11 from "../../../../assets/icons/projects/developmentGoals/goal11/the-global-goals-icons-black-goal-11.png";
import GOAL_12 from "../../../../assets/icons/projects/developmentGoals/goal12/the-global-goals-icons-black-goal-12.png";
import GOAL_13 from "../../../../assets/icons/projects/developmentGoals/goal13/the-global-goals-icons-black-goal-13.png";
import GOAL_14 from "../../../../assets/icons/projects/developmentGoals/goal14/the-global-goals-icons-black-goal-14.png";
import GOAL_15 from "../../../../assets/icons/projects/developmentGoals/goal15/the-global-goals-icons-black-goal-15.png";
import GOAL_16 from "../../../../assets/icons/projects/developmentGoals/goal16/the-global-goals-icons-black-goal-16.png";
import GOAL_17 from "../../../../assets/icons/projects/developmentGoals/goal17/the-global-goals-icons-black-goal-17.png";
import { translateSustainableDevelopmentGoal } from "../../../../locales";

import { OfferRead, PitchRead } from "wri-api";

type Props = {|
  project: PitchRead | OfferRead
|};

type SustainableGoal = {|
  key: string,
  color: string,
  icon: number
|};

export default class DevelopmentGoals extends Component<Props> {
  // when this component is hooked up to Redux, the keys in this array may need updating with the keys that are passed through for the sustainable development goals
  dataKey = [
    {
      key: "goal_1",
      color: "#E5243B",
      icon: GOAL_01
    },
    {
      key: "goal_2",
      color: "#DDA63A",
      icon: GOAL_02
    },
    {
      key: "goal_3",
      color: "#4C9F38",
      icon: GOAL_03
    },
    {
      key: "goal_4",
      color: "#C5192D",
      icon: GOAL_04
    },
    {
      key: "goal_5",
      color: "#FF3A21",
      icon: GOAL_05
    },
    {
      key: "goal_6",
      color: "#26BDE2",
      icon: GOAL_06
    },
    {
      key: "goal_7",
      color: "#FCC30B",
      icon: GOAL_07
    },
    {
      key: "goal_8",
      color: "#A21942",
      icon: GOAL_08
    },
    {
      key: "goal_9",
      color: "#FD6925",
      icon: GOAL_09
    },
    {
      key: "goal_10",
      color: "#DD1367",
      icon: GOAL_10
    },
    {
      key: "goal_11",
      color: "#FD9D24",
      icon: GOAL_11
    },
    {
      key: "goal_12",
      color: "#BF8B2E",
      icon: GOAL_12
    },
    {
      key: "goal_13",
      color: "#3F7E44",
      icon: GOAL_13
    },
    {
      key: "goal_14",
      color: "#0A97D9",
      icon: GOAL_14
    },
    {
      key: "goal_15",
      color: "#56C02B",
      icon: GOAL_15
    },
    {
      key: "goal_16",
      color: "#00689D",
      icon: GOAL_16
    },
    {
      key: "goal_17",
      color: "#19486A",
      icon: GOAL_17
    }
  ];

  renderDevGoals = (dataArray: Array<string>, keyData: Array<SustainableGoal>) => {
    const goals = [];
    for (let i = 0; i < dataArray.length; i++) {
      for (let l = 0; l < keyData.length; l++) {
        if (dataArray[i] === keyData[l].key) {
          goals.push(
            <View>
              <View style={[styles.categoryView, { backgroundColor: keyData[l].color }]}>
                <View style={styles.categoryLabelView}>
                  <View style={styles.categoryIconView}>
                    <Image source={keyData[l].icon} style={styles.categoryIcon} />
                  </View>
                  <Text style={styles.categoryLabelText}>{translateSustainableDevelopmentGoal(dataArray[i])}</Text>
                </View>
              </View>
            </View>
          );
        }
      }
    }
    return goals;
  };

  render() {
    return (
      <View style={styles.info}>
        {this.renderDevGoals(this.props.project.sustainable_development_goals ?? [], this.dataKey)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    paddingTop: Styles.Layout.Margins.small,
    paddingBottom: Styles.Layout.Margins.medium
  },
  categoryView: {
    borderRadius: 5,
    margin: 5,
    height: 40,
    backgroundColor: Styles.Colours.white,
    flexDirection: "row",
    alignItems: "center"
  },
  categoryLabelView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center"
  },
  categoryIconView: {
    margin: Styles.Layout.Margins.small,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  categoryIcon: {
    height: 25,
    width: 25,
    tintColor: Styles.Colours.white
  },
  categoryLabelText: {
    ...Styles.Text.bodyHero,
    fontWeight: "500",
    fontSize: 17,
    color: Styles.Colours.white
  }
});
