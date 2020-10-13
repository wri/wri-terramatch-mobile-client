// @flow

import type { AsyncState } from "../../redux/redux.types";
import { UserRead } from "wri-api";
import React, { Component } from "react";
import { Text, View, StyleSheet, Linking, Image } from "react-native";
import { Navigation } from "react-native-navigation";
import { withSafeArea } from "react-native-safe-area";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Styles from "../../styles/";
import { IsSmallDevice } from "../../styles/layout";
import { screens } from "../../screens";
import Button from "./../common/button";
import TabView from "./../common/tab-view";
import Touchable from "./../common/touchable";
import NewsCard from "../news/news-card";
import PartnerCard from "../partner-card";
import CarouselWithControls from "./../common/carousel-with-controls";
import ProjectsInfoCard from "./../common/projects-info-card";
import Screen from "./../common/screen";
import translate from "../../locales/";
import debounceFunc from "../../utils/debounceFunc";
import { logScheduleDemoEvent, logRequestAccountEvent, logRegistrationEvent } from "../../utils/analytics";
import Config from "react-native-config";
import OrganisationApprovalBanner from "../../containers/organisation/approval-card";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  +hasNotifications: boolean,

  +user: ?UserRead,

  +newsWordpressState: AsyncState<any>,

  +projectsWordpressState: AsyncState<any>
|};

const NAV_BAR_BUTTON_ID_LOGIN = "nav_bar_btn_login";
const NAV_BAR_BUTTON_ID_SETTINGS = "nav_bar_btn_settings";
const NAV_BAR_BUTTON_ID_NOTIFICATIONS = "nav_bar_btn_notifications";
const notificationUnreadIcon = require("../../assets/icons/home/notification-unread.png");
const notificationIcon = require("../../assets/icons/home/notification.png");
const settingsIcon = require("../../assets/icons/home/settings.png");
const mobileLaptopIcon = require("../../assets/icons/welcome/laptop-mobile.png");
const heroImage = require("../../assets/icons/welcome/hero.jpeg");
const wriIcon = require("../../assets/icons/welcome/WRI-logo.png");
import partnersList from "./partnersList";

const SafeAreaView = withSafeArea(KeyboardAwareScrollView, "padding", "bottom");

export default class HomeScreen extends Component<Props> {
  static options(passProps: Props) {
    return {
      topBar: {
        title: {
          text: translate("common.home")
        }
      }
    };
  }

  routes: any;

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);

    this.routes = [
      {
        key: "overview",
        title: translate("landing.whatCanTabs.overview.title"),
        headerOne: translate("landing.whatCanTabs.overview.header1"),
        headerTwo: translate("landing.whatCanTabs.overview.header2"),
        bodyOne: translate("landing.whatCanTabs.overview.paragraph1"),
        bodyTwo: translate("landing.whatCanTabs.overview.paragraph2")
      },
      {
        key: "projectDevelopers",
        title: translate("landing.whatCanTabs.developers.title"),
        headerOne: translate("landing.whatCanTabs.developers.header1"),
        headerTwo: translate("landing.whatCanTabs.developers.header2"),
        bodyOne: translate("landing.whatCanTabs.developers.paragraph1"),
        bodyTwo: translate("landing.whatCanTabs.developers.paragraph2")
      },
      {
        key: "funders",
        title: translate("landing.whatCanTabs.funders.title"),
        headerOne: translate("landing.whatCanTabs.funders.header1"),
        headerTwo: translate("landing.whatCanTabs.funders.header2"),
        bodyOne: translate("landing.whatCanTabs.funders.paragraph1"),
        bodyTwo: translate("landing.whatCanTabs.funders.paragraph2")
      }
    ];

    const self: any = this;
    self.newsFlow = this.newsFlow.bind(this);
    self.renderTabContents = this.renderTabContents.bind(this);
  }

  componentDidAppear() {
    this._updateNavBarButtons(!!this.props.user);
  }

  componentDidUpdate(prevProps: Props) {
    const isLoggedIn = !!this.props.user;
    const wasLoggedIn = !!prevProps.user;
    const previouslyHadNotifications = prevProps.hasNotifications;
    const hasNotifications = this.props.hasNotifications;

    if (isLoggedIn !== wasLoggedIn || previouslyHadNotifications !== hasNotifications) {
      this._updateNavBarButtons(isLoggedIn);
    }
  }

  renderTabContents({ route }: any) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabHeader}>{route.headerOne}</Text>
        <Text style={styles.tabBody}>{route.bodyOne}</Text>
        <Text style={styles.tabHeader}>{route.headerTwo}</Text>
        <Text style={styles.tabBody}>{route.bodyTwo}</Text>
      </View>
    );
  }

  openNotifications = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.NOTIFICATION_SCREEN
      }
    });
  });

  openLogin = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.LOGIN
      }
    });
  });

  openSettings = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SETTINGS
      }
    });
  });

  navigationButtonPressed(event: any) {
    switch (event.buttonId) {
      case NAV_BAR_BUTTON_ID_LOGIN: {
        this.openLogin();
        break;
      }
      case NAV_BAR_BUTTON_ID_NOTIFICATIONS: {
        this.openNotifications();
        break;
      }
      case NAV_BAR_BUTTON_ID_SETTINGS: {
        this.openSettings();
        break;
      }
    }
  }

  scheduleDemo() {
    logScheduleDemoEvent();
    Linking.openURL(Config.WRI_SCHEDULE_DEMO_URL);
  }

  _startCreateOrganisationFlow = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_START
      }
    });
  });

  _startEditOrganisationFlow = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_DETAILS
      }
    });
  });

  _displayOrganisation = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.PROFILE_SCREEN
      }
    });
  });

  _startSignUpFlow = debounceFunc(() => {
    logRequestAccountEvent("clickedOnRequestAccount");
    logRegistrationEvent("start");
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_START
      }
    });
  });

  _startVerifyFlow = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.VERIFY
      }
    });
  });

  newsFlow = debounceFunc((article: any) => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.NEWS_SCREEN,
        passProps: {
          article: article
        }
      }
    });
  });

  _updateNavBarButtons = (isLoggedIn: boolean) => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: isLoggedIn
          ? [
              {
                id: NAV_BAR_BUTTON_ID_SETTINGS,
                icon: settingsIcon,
                showAsAction: "always"
              },
              {
                id: NAV_BAR_BUTTON_ID_NOTIFICATIONS,
                icon: this.props.hasNotifications ? notificationUnreadIcon : notificationIcon,
                showAsAction: "always"
              }
            ]
          : [
              {
                id: NAV_BAR_BUTTON_ID_LOGIN,
                text: translate("login.login"),
                showAsAction: "always",
                fontSize: 15,
                fontFamily: Styles.Text.FONT_FAMILY
              }
            ]
      }
    });
  };

  openPrivacyPolicy() {
    Linking.openURL(Config.PRIVACY_POLICY);
  }

  openTerms() {
    Linking.openURL(Config.TERMS_OF_SERVICE);
  }

  openContactUsEmail() {
    const emailAddress = Config.WRI_EMAIL_ADDRESS;
    Linking.openURL(`mailto:${emailAddress}?subject=${translate("footer.contactSubject")}`);
  }

  goToUrl = debounceFunc(url => {
    Linking.openURL(url.partner_website);
  });

  renderNewsCard = (card: any) => {
    return <NewsCard content={card} />;
  };

  renderProjectsCard = (card: any) => {
    return <ProjectsInfoCard content={card} />;
  };

  renderPartnerCard = (card: any) => {
    return <PartnerCard content={card} />;
  };

  render() {
    const latestNewsItem = this.props.newsWordpressState?.data;
    const latestProjectsItem = this.props.projectsWordpressState?.data;
    const isLoggedIn = !!this.props.user;
    const hasVerifiedEmail = !!this.props.user?.email_address_verified_at ?? false;
    const hasOrganisation = !!this.props.user?.organisation_id ?? false;
    return (
      <Screen
        style={styles.screen}
        scrollComponent={SafeAreaView}
        secondary
        // set scrollReset to false to resolve issue with  keyboard-aware-scroll-view:
        // https://3sidedcube.atlassian.net/browse/WRM-1491
        // https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/313
        enableResetScrollToCoords={false}
      >
        <OrganisationApprovalBanner
          isAwaitingFirstApproval={true}
          onEditOrganisationPressed={this._startEditOrganisationFlow}
        />
        <View style={styles.videoWrapper}>
          <View style={styles.videoOverlay} />
          <Image source={heroImage} style={styles.video} resizeMode="cover" />

          <View style={styles.buttonWrapper}>
            <Text
              style={[Styles.Text.secondaryH1, Styles.Text.uppercase, { marginBottom: Styles.Layout.Margins.medium }]}
            >
              {translate("landing.hero")}{" "}
              <Text
                style={[Styles.Text.tertiaryH1, Styles.Text.uppercase, { marginBottom: Styles.Layout.Margins.medium }]}
              >
                {translate("landing.heroSecondary")}
              </Text>
            </Text>

            <Button
              style={[Styles.Buttons.hero, Styles.Layout.FullWidth, { marginBottom: Styles.Layout.Margins.small }]}
              onPress={
                !isLoggedIn
                  ? this._startSignUpFlow
                  : !hasVerifiedEmail
                  ? this._startVerifyFlow
                  : !hasOrganisation
                  ? this._startCreateOrganisationFlow
                  : this._displayOrganisation
              }
              title={
                !isLoggedIn
                  ? translate("landing.request")
                  : !hasVerifiedEmail
                  ? translate("mobile.landing.verify", "Complete sign up")
                  : !hasOrganisation
                  ? translate("mobile.landing.createOrg", "Create organisation")
                  : translate("mobile.landing.editOrg", "View organisation")
              }
            />

            <Button
              style={[Styles.Buttons.hero, Styles.Layout.FullWidth]}
              onPress={this.scheduleDemo}
              title={translate("landing.demo")}
            />
          </View>
        </View>

        <View>
          <Text style={[Styles.Text.secondaryH2, Styles.Text.uppercase, { marginTop: Styles.Layout.Margins.medium }]}>
            {translate("landing.whatCan")}
          </Text>

          <View style={styles.tabWrapper}>
            <TabView
              navigationState={{
                routes: this.routes
              }}
              renderScene={this.renderTabContents}
            />
          </View>

          <View style={styles.imageWrapper}>
            <Image style={styles.image} source={mobileLaptopIcon} resizeMode={"contain"} />
          </View>

          {!isLoggedIn ? (
            <CarouselWithControls content={latestProjectsItem} renderItem={this.renderProjectsCard} />
          ) : (
            <>
              {latestNewsItem && latestNewsItem.length > 0 && (
                <NewsCard content={latestNewsItem[0]} onPress={() => this.newsFlow(latestNewsItem[0])} />
              )}
            </>
          )}

          <View style={styles.logoWrapper}>
            <Image style={styles.wriLogo} source={wriIcon} />
            <Text style={styles.footerText}>{translate("footer.body")}</Text>
          </View>

          <CarouselWithControls
            content={partnersList}
            secondary
            onPress={this.goToUrl}
            title={translate("landing.ourPartners")}
            renderItem={this.renderPartnerCard}
          />

          <View style={styles.footerLinksWrapper}>
            {this.renderSetting({ title: translate("footer.terms"), onPress: this.openTerms })}
            {this.renderSetting({
              title: translate("footer.privacy"),
              onPress: this.openPrivacyPolicy
            })}
            {this.renderSetting({ title: translate("footer.contact"), onPress: this.openContactUsEmail })}
          </View>
        </View>
      </Screen>
    );
  }

  renderSetting(details: { title: string, onPress: string => any }) {
    return (
      <>
        <Touchable onPress={details.onPress} accessibilityRole={"button"}>
          <Text style={styles.footerLinks}>{details.title}</Text>
        </Touchable>
      </>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0
  },
  videoWrapper: {
    position: "relative",
    marginLeft: -20,
    marginRight: -20,
    aspectRatio: IsSmallDevice ? 375 / 284 : 375 / 244
  },
  buttonWrapper: {
    padding: Styles.Layout.Margins.medium,
    position: "absolute",
    zIndex: 2,
    bottom: 0,
    width: "100%"
  },
  video: {
    width: "100%",
    height: "100%"
  },
  videoOverlay: {
    backgroundColor: Styles.Colours.black38,
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  footerLinks: {
    color: Styles.Colours.brownGrey,
    fontWeight: "700",
    padding: Styles.Layout.Margins.medium
  },
  footerLinksWrapper: {
    ...Styles.Utilities.flexRow,
    justifyContent: "space-around"
  },
  tabWrapper: {
    paddingTop: Styles.Layout.Margins.medium,
    marginHorizontal: -Styles.Layout.Margins.medium
  },
  tabContent: {
    paddingHorizontal: Styles.Layout.Margins.medium
  },
  tabHeader: {
    ...Styles.Text.h3,
    ...Styles.Text.uppercase,
    marginBottom: Styles.Layout.Margins.tiny
  },
  tabBody: {
    ...Styles.Text.body,
    marginBottom: Styles.Layout.Margins.small
  },
  imageWrapper: {
    marginHorizontal: -Styles.Layout.Margins.medium,
    paddingHorizontal: Styles.Layout.Margins.medium,
    paddingBottom: Styles.Layout.Margins.medium
  },
  image: {
    width: "100%"
  },
  wriLogo: {
    width: 103,
    height: 36,
    marginRight: Styles.Layout.Margins.medium
  },
  logoWrapper: {
    ...Styles.Utilities.flexRow,
    paddingVertical: Styles.Layout.Margins.medium
  },
  footerText: {
    ...Styles.Text.body,
    ...Styles.Utilities.flexShrink,
    color: Styles.Colours.brownGrey
  }
});
