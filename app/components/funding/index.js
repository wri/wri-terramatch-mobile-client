// @flow

import type { AsyncState } from "../../redux/redux.types";
import _ from "lodash";
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, RefreshControl } from "react-native";
import { IsSmallDevice } from "../../styles/layout";
import Styles from "../../styles";
import { FloatingAction } from "react-native-floating-action";
import translate from "../../locales";
import colours from "../../styles/colours";
import { Navigation } from "react-native-navigation";
import { screens } from "../../screens";
import { FilterCondition, OfferRead, PitchRead, OrganisationVersionReadAll, FilterSearch, PitchReadAll } from "wri-api";
import { findMostRecentOrganisationApprovedVersion, findMostRecentOrganisationVersion } from "../../api/wri/helpers";

import ProjectCard from "../projects/projects-card";
import LoadingIndicator from "../common/loading-indicator";
import Picker from "../common/picker";
import wriAPI from "../../api/wri";
import debounceFunc from "../../utils/debounceFunc";
import Banner from "../common/banner";

const NAV_BAR_BUTTON_FILTER = "nav_bar_btn_filter";
const filterIcon = require("../../assets/icons/projects/filter.png");
const fabIcon = require("../../assets/icons/common/add.png");
const fundingBannerIcon = require("../../assets/icons/funding/funding.png");

type Props = {|
  +componentId: string,
  +organisationVersionsState: AsyncState<OrganisationVersionReadAll>,
  +pitches: AsyncState<PitchReadAll>,
  +updateSavedForm: (PitchRead, SortAttributeEnum) => void,
  +updateFilters: (Array<FilterCondition>, SortAttributeEnum) => void,
  +sortOption: SortAttributeEnum,
  +filteredPitchId: ?number,
  +filterCondition: Array<FilterCondition>
|};

type State = {|
  +close: boolean,
  +hasReachedEnd: boolean,
  +isLoading: boolean,
  +pageNumber: number,
  +paginatedResults: Array<OfferRead>
|};

export default class FundingScreen extends Component<Props, State> {
  static options(passProps: {}) {
    return {
      topBar: {
        rightButtons: [
          {
            id: NAV_BAR_BUTTON_FILTER,
            icon: filterIcon,
            showAsAction: "always"
          }
        ],
        title: {
          text: translate("projects.exploreFunding")
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      close: false,
      pageNumber: 0,
      paginatedResults: [],
      isLoading: false,
      hasReachedEnd: false
    };
  }
  openFilterSettings = debounceFunc(() => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.FUNDING_SEARCH_FILTER_SCREEN
      }
    });
  });

  navigationButtonPressed(event: { buttonId: string }) {
    if (event.buttonId === NAV_BAR_BUTTON_FILTER) {
      this.openFilterSettings();
    }
  }

  componentDidMount() {
    //Pre-populate the search filters based on user's first pitch
    if (!this.props.filteredPitchId && this.props.pitches.data && this.props.pitches.data.length > 0) {
      this.props.updateSavedForm(this.props.pitches.data[0], this.props.sortOption);
    } else {
      this.search(true);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const prevFilter = prevProps.filterCondition;
    const prevSort = prevProps.sortOption;
    if (!_.isEqual(this.props.filterCondition, prevFilter) || this.props.sortOption !== prevSort) {
      this.search(true);
    }
  }

  retrievePitchById = (id: number): ?PitchRead => {
    return this.props.pitches.data ? this.props.pitches.data.find(item => item.id === id) : null;
  };

  handleChangePitch = (value: any) => {
    const pitch = this.retrievePitchById(value);
    if (pitch) {
      this.props.updateSavedForm(pitch, this.props.sortOption);
    }
  };

  _handleFabMenuItem = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.PROJECTS_START_SCREEN,
        passProps: {
          type: "offer"
        }
      }
    });
  };

  handleChangeSortOption = (value: any) => {
    if (this.props.filteredPitchId) {
      this.props.updateSavedForm(this.retrievePitchById(this.props.filteredPitchId) ?? new PitchRead(), value);
    } else {
      this.props.updateFilters(this.props.filterCondition, value);
    }
  };

  displayOffer = debounceFunc((selectedOffer: OfferRead) => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.OFFER_SCREEN,
        passProps: {
          isOwnedByUser: false,
          offerBase: selectedOffer,
          offerId: selectedOffer.id,
          filteredId: this.props.filteredPitchId
        }
      }
    });
  });

  search = (clearResults: boolean = false) => {
    this.setState(
      prevState => ({
        pageNumber: 0,
        paginatedResults: clearResults ? [] : prevState.paginatedResults,
        hasReachedEnd: false,
        isLoading: false
      }),
      this.paginate
    );
  };

  paginate = async () => {
    if (this.state.isLoading || this.state.hasReachedEnd) {
      return;
    }

    try {
      const param = new FilterSearch();
      param.page = this.state.pageNumber + 1;
      param.filters = this.props.filterCondition;
      param.sortAttribute = this.props.sortOption;
      param.sortDirection = "desc";

      this.setState({ isLoading: true });

      const results = await wriAPI.offers.offersSearchPost(param);
      if (results.length > 0) {
        this.setState(state => ({
          paginatedResults: param.page === 1 ? [...results] : [...state.paginatedResults, ...results],
          pageNumber: state.pageNumber + 1,
          isLoading: false
        }));
      } else {
        this.setState({
          hasReachedEnd: true
        });
      }
    } catch (error) {
      //for now we do not need to do anything
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  renderEmptyView() {
    if (this.state.isLoading) {
      return null;
    }
    return <Banner imageSource={fundingBannerIcon} header={translate("mobile.funding.empty", " No fundings found")} />;
  }

  renderHeader = () => {
    if ((this.props.pitches.data ?? []).length > 0) {
      return (
        <>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>
              {translate("mobile.funding.options.showingResult", "Showing results based on:")}
            </Text>
            <Picker
              placeholder={
                this.props.filteredPitchId === null ? { label: translate("funding.filter.none"), value: null } : {}
              }
              value={this.props.filteredPitchId}
              onValueChange={this.handleChangePitch}
              items={(this.props.pitches.data ?? []).map(item => ({ label: item.name ?? "Unknown", value: item.id }))}
              sorted
            />
          </View>
          {this.renderSortOption()}
        </>
      );
    } else {
      return this.renderSortOption();
    }
  };

  renderSortOption = () => {
    return (
      <View style={styles.pickerBottomWrapper}>
        <Text style={styles.pickerLabel}>{translate("sort.sortBy")}</Text>
        <Picker
          value={this.props.sortOption}
          onValueChange={this.handleChangeSortOption}
          placeholder={{}} //to disable the empty/non selected state
          items={[
            { label: translate("sort.compatibility_score_desc"), value: "compatibility_score" },
            { label: translate("sort.created_at_desc"), value: "created_at" }
          ]}
        />
      </View>
    );
  };

  renderFooter = () => {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    } else {
      return null;
    }
  };

  render() {
    // If there is ANY approved version, then that is what we show. Otherwise, simply show the status of the most recent
    // version
    const mostRecentVersion =
      findMostRecentOrganisationApprovedVersion(this.props.organisationVersionsState.data ?? []) ??
      findMostRecentOrganisationVersion(this.props.organisationVersionsState.data ?? []);

    const isCompatiblityHidden = this.props.filterCondition.length === 0;

    return (
      <View style={styles.screen}>
        <FlatList
          contentContainerStyle={[
            styles.resultsList,
            this.state.paginatedResults.length === 0 && !this.state.isLoading ? styles.centerEmptySet : {}
          ]}
          ListHeaderComponent={this.renderHeader()}
          data={(this.state.paginatedResults: any)}
          onEndReached={() => {
            this.paginate();
          }}
          renderItem={({ item }) => (
            <ProjectCard
              project={{ type: "offer", data: item }}
              onPress={() => this.displayOffer(item)}
              isCompatiblityHidden={isCompatiblityHidden}
            />
          )}
          ListFooterComponent={this.renderFooter()}
          ListEmptyComponent={this.renderEmptyView()}
          refreshControl={
            <RefreshControl refreshing={this.state.pageNumber === 1 && this.state.isLoading} onRefresh={this.search} />
          }
        />
        {mostRecentVersion?.data?.category !== "developer" && (
          <FloatingAction
            color={colours.primary}
            overlayColor={colours.transparentWhite}
            onPressMain={this._handleFabMenuItem}
            floatingIcon={this.state.close ? <Image source={fabIcon} /> : <Image source={fabIcon} />}
            onOpen={() => this.setState({ close: true })}
            onClose={() => this.setState({ close: false })}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerWrapper: {
    marginTop: Styles.Layout.Margins.small,
    padding: Styles.Layout.Margins.small,
    backgroundColor: Styles.Colours.pickerBackground,
    borderRadius: Styles.Layout.Margins.tiny
  },
  pickerBottomWrapper: {
    marginTop: Styles.Layout.Margins.small,
    padding: Styles.Layout.Margins.small,
    backgroundColor: Styles.Colours.pickerBackground,
    borderRadius: Styles.Layout.Margins.tiny,
    marginBottom: Styles.Layout.Margins.small
  },
  pickerLabel: {
    ...Styles.Text.h5,
    ...Styles.Text.uppercase,
    color: Styles.Colours.black
  },
  screen: {
    flex: 1,
    backgroundColor: colours.backgroundSecondary,
    borderTopColor: Styles.Colours.primary,
    borderTopWidth: 4
  },
  resultsList: {
    paddingHorizontal: IsSmallDevice ? Styles.Layout.Margins.small : Styles.Layout.Margins.medium
  },
  centerEmptySet: {
    height: "100%"
  }
});
