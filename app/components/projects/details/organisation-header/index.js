//@flow

import type { AsyncState } from "../../../../redux/redux.types";
import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { Navigation } from "react-native-navigation";
import Moment from "moment";
import { OrganisationRead } from "wri-api";
import Styles from "../../../../styles";
import Touchable from "../../../common/touchable";
import translate, { translateOrganisationType } from "../../../../locales";
import { screens } from "../../../../screens";
import LoadingIndicator from "../../../common/loading-indicator";
import type { TabName } from "../../../organisation/details/base-view";
import debounceFunc from "../../../../utils/debounceFunc";

type Props = {|
  +componentId: string,
  +organisationState: AsyncState<OrganisationRead>
|};

type DocumentData = {|
  key: string,
  title: string,
  tab: TabName
|};

let documentData: Array<DocumentData>;
export default class OrganizationHeader extends Component<Props> {
  constructor(props: Props) {
    super(props);
    documentData = [
      {
        key: "1",
        title: translate("organisation.awards"),
        tab: "docs"
      }
    ];
  }

  renderDownloadButton = (dataArray: Array<DocumentData>) => {
    const downloadButtons = [];

    for (let i = 0; i < dataArray.length; i++) {
      downloadButtons.push(
        <View style={styles.documentViewButtonWrapper} key={i}>
          <Touchable accessibilityRole={"button"} onPress={() => this.loadOrganisation(dataArray[i].tab)}>
            <View style={styles.touchableDocumentView}>
              <View style={styles.circleViewHolder}>
                <View style={styles.circleView} />
              </View>
              <View style={styles.buttonTitleHolder}>
                <Text style={styles.documentViewText}>{dataArray[i].title}</Text>
              </View>
              <View style={styles.linkTypeHolder}>
                <Text style={styles.downloadText}>{translate("common.viewAll")}</Text>
              </View>
            </View>
          </Touchable>
        </View>
      );
    }
    return downloadButtons;
  };

  calculateYearOfOperation = (): string | number => {
    if (this.props.organisationState && this.props.organisationState.data?.founded_at) {
      return Moment().diff(Moment(this.props.organisationState.data?.founded_at ?? "", "DD-MM-YYYY"), "years");
    } else {
      return translate("mobile.common.unknown");
    }
  };

  loadOrganisation = debounceFunc((selectedTab: TabName) => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.ORGANISATION_DETAILS_SCREEN,
        passProps: {
          isOwnedByUser: false,
          organisationId: this.props.organisationState.data?.id,
          selectedTab: selectedTab
        }
      }
    });
  });

  render() {
    const organisation = this.props.organisationState.data;
    const yearsOfOperation = this.calculateYearOfOperation();
    return (
      <View style={styles.container}>
        {organisation && (
          <>
            <View style={styles.headerRow}>
              <View style={styles.orgLogoView}>
                <Image style={styles.orgLogo} source={{ uri: organisation?.avatar ?? "" }} />
              </View>
              <View style={styles.wrapper}>
                <Text style={styles.orgNameText} numberOfLines={1}>
                  {organisation?.name ?? ""}
                </Text>
                <View style={styles.subheadingHorizontalView}>
                  <View style={styles.orgTypeView}>
                    <Text style={styles.orgTypeText} numberOfLines={1}>
                      {translateOrganisationType(organisation?.type)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.infoViewText}>
                  {parseInt(yearsOfOperation) > 0
                    ? translate("organisation.yearsOfOperation", null, { count: yearsOfOperation })
                    : translate("organisation.lessThanOneYearOfOperation")}
                </Text>
              </View>
            </View>
            <View style={styles.touchablesContainer}>
              {organisation.awards && this.renderDownloadButton(documentData)}
              <Touchable
                style={styles.profileOpenButton}
                accessibilityRole={"button"}
                onPress={() => this.loadOrganisation("about")}
              >
                <Text style={styles.profileButtonText}>{translate("common.viewProfile")}</Text>
              </Touchable>
            </View>
          </>
        )}
        {this.props.organisationState.isFetching && <LoadingIndicator />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  orgLogoView: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: Styles.Layout.Margins.small
  },
  orgLogo: {
    resizeMode: "center",
    width: 80,
    aspectRatio: 1,
    borderRadius: 10
  },
  wrapper: {
    margin: Styles.Layout.Margins.small,
    flex: 1
  },
  orgNameText: {
    ...Styles.Text.h1,
    ...Styles.Text.uppercase,
    fontSize: 20,
    lineHeight: 20
  },
  container: {
    flex: 1
  },
  infoViewText: {
    ...Styles.Text.bodyHero,
    ...Styles.Text.emphasis,
    color: Styles.Colours.black,
    marginVertical: Styles.Layout.Margins.tiny,
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  orgTypeView: {
    height: 20,
    width: "100%",
    paddingRight: Styles.Layout.Margins.small
  },
  documentViewButtonWrapper: {
    ...Styles.Containers.cardShadow,
    backgroundColor: Styles.Colours.white,
    height: 40,
    borderRadius: 10,
    width: "100%",
    marginBottom: Styles.Layout.Margins.medium
  },
  touchablesContainer: {
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: Styles.Layout.Margins.small,
    paddingHorizontal: Styles.Layout.Margins.medium
  },
  profileOpenButton: {
    ...Styles.Containers.cardShadow,
    backgroundColor: Styles.Colours.secondary,
    height: 40,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  profileButtonText: {
    ...Styles.Text.h1,
    ...Styles.Text.uppercase,
    fontSize: 15,
    lineHeight: 15
  },
  touchableDocumentView: {
    width: "100%",
    flexDirection: "row",
    height: 40,
    borderRadius: 10
  },
  circleView: {
    width: 20,
    height: 20,
    backgroundColor: Styles.Colours.lightGrey,
    borderRadius: 20
  },
  documentViewText: {
    ...Styles.Text.bodyHero,
    color: Styles.Colours.black,
    fontSize: 14,
    lineHeight: 14
  },
  downloadText: {
    ...Styles.Text.bodyHero,
    ...Styles.Text.emphasis,
    color: Styles.Colours.black,
    fontSize: 14,
    lineHeight: 14,
    textAlign: "right"
  },
  circleViewHolder: {
    height: 40,
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Styles.Layout.Margins.tiny
  },
  buttonTitleHolder: {
    height: 40,
    width: "40%",
    justifyContent: "center"
  },
  linkTypeHolder: {
    height: 40,
    width: "40%",
    justifyContent: "center"
  },
  subheadingHorizontalView: {
    flexDirection: "row",
    resizeMode: "contain",
    height: 25,
    alignItems: "center"
  },
  orgTypeText: {
    ...Styles.Text.bodyHero,
    ...Styles.Text.uppercase,
    fontSize: 16,
    color: Styles.Colours.black
  },
  headerRow: {
    flexDirection: "row",
    marginHorizontal: Styles.Layout.Margins.medium
  }
});
