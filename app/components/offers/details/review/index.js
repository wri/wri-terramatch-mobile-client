// @flow

import type { ProjectFormProps } from "../../../../screens/projectForms";

import React, { Component, type ElementRef } from "react";
import { Navigation } from "react-native-navigation";
import translate from "../../../../locales/";
import { StyleSheet } from "react-native";
import Screen from "../../../common/screen";
import LoadingIndicator from "../../../common/loading-indicator";
import Error from "../../../common/error";
import Styles from "../../../../styles";
import type { AsyncState } from "../../../../redux/redux.types";
import {
  OfferContactReadAll,
  OfferContactRead,
  OfferRead,
  OrganisationRead,
  OrganisationVersionReadAll,
  PitchReadAll,
  TeamMemberRead,
  TeamMemberReadAll,
  UserRead,
  UserReadAll
} from "wri-api";
import OfferDetails from "../../details/base-view";
import { initialAsyncState, successState } from "../../../../redux/asyncActionReducer";
import Button from "../../../common/button";
import type { OfferRegistrationForm } from "../../../../redux/wri-api/offers";
import { errorCodes, errorDomains } from "../../../../constants/errorMessaging";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  +continueWithoutSaving: () => any,

  +createOfferState: AsyncState<any>,

  +filteredId: number,

  +form: OfferRegistrationForm,

  +organisationState: AsyncState<OrganisationRead>,

  /**
   * Metadata about the form being modified
   */
  // eslint-disable-next-line react/no-unused-prop-types
  +formMetadata: ProjectFormProps,

  +organisationMembers: TeamMemberReadAll,

  +organisationUsers: UserReadAll,

  +submitForm: () => Promise<void>
|};

type State = {|
  hasSubmitted: boolean,
  offerState: OfferState
|};

type OfferState = {|
  +componentId: string,
  +contactsState: AsyncState<OfferContactReadAll>,
  +isOwnedByUser: boolean,
  +myOrganisation: AsyncState<OrganisationVersionReadAll>,
  +myPitches: AsyncState<PitchReadAll>,
  +offerDetails: AsyncState<OfferRead>,
  +organisationState: AsyncState<OrganisationRead>,
  +offerBase: ?OfferRead,
  +offerId: number
|};

export default class OfferReviewScreen extends Component<Props, State> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  screenRef: { current: null | ElementRef<typeof Screen> };

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      hasSubmitted: false,
      offerState: this._createOfferState()
    };

    this.screenRef = React.createRef();
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  _createOfferState = (): OfferState => {
    // eslint-disable-next-line no-unused-vars
    const details = this.props.form.details ?? {};
    const offer = OfferRead.constructFromObject({
      ...details,
      created_at: null,
      completed: null,
      completed_at: null,
      completed_by: null,
      successful: null,
      avatar: this.props.form.uploads.avatar?.uri ?? "",
      cover_photo: this.props.form.uploads.coverPhoto?.uri ?? "",
      compatibility_score: null,
      organisation_id: this.props.organisationState.data?.id ?? 0,
      visibility: this.props.form?.base?.details?.visibility ?? null,
      id: 0
    });

    const teamMembers = this.props.form.contacts
      .filter(item => item.type !== "deleted")
      .map((member, idx) => {
        if (member.data.team_member_id) {
          const teamMember =
            this.props.organisationMembers.find(item => item.id === member.data.team_member_id) ?? new TeamMemberRead();
          return OfferContactRead.constructFromObject({
            avatar: teamMember.avatar,
            first_name: teamMember.first_name,
            last_name: teamMember.last_name,
            job_role: teamMember.job_role,
            offer_id: 0,
            user_id: null,
            team_member_id: teamMember.id,
            facebook: teamMember.facebook,
            twitter: teamMember.twitter,
            instagram: teamMember.instagram,
            linkedin: teamMember.linkedin,
            id: idx
          });
        } else {
          const teamUser = this.props.organisationUsers.find(item => item.id === member.data.user_id) ?? new UserRead();
          return OfferContactRead.constructFromObject({
            avatar: teamUser.avatar,
            first_name: teamUser.first_name,
            last_name: teamUser.last_name,
            job_role: teamUser.job_role,
            offer_id: 0,
            user_id: teamUser.id,
            team_member_id: null,
            facebook: teamUser.facebook,
            twitter: teamUser.twitter,
            instagram: teamUser.instagram,
            linkedin: teamUser.linkedin,
            id: idx
          });
        }
      });

    const contactsState = successState(OfferContactReadAll.constructFromObject(teamMembers));
    const myPitches = successState(new PitchReadAll());
    const organisationState = this.props.organisationState;
    const offerId = 0;
    const isOwnedByUser = true;
    const componentId = this.props.componentId;
    const offerBase = offer;
    const offerDetails = successState(offer);
    return {
      componentId,
      contactsState,
      isOwnedByUser,
      myPitches,
      offerDetails,
      organisationState,
      offerBase,
      offerId,
      myOrganisation: initialAsyncState
    };
  };

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  _submit = async () => {
    this.setState({
      hasSubmitted: true
    });

    // Scroll to the top to show the progress indicator...
    if (this.screenRef.current) {
      this.screenRef.current.scrollToTop();
    }

    try {
      await this.props.submitForm();
    } catch (err) {
      // Scroll to the top to show any errors...
      if (this.screenRef.current) {
        this.screenRef.current.scrollToTop();
      }
    }
  };

  render() {
    const {
      componentId,
      contactsState,
      isOwnedByUser,
      myPitches,
      myOrganisation,
      offerDetails,
      organisationState,
      offerBase,
      offerId
    } = this.state.offerState;
    const isFetching = this.props.createOfferState.isFetching;

    const nextTitle = isFetching
      ? translate("common.saving")
      : this.state.hasSubmitted
      ? translate("common.retry")
      : translate("common.submit");
    return (
      <Screen
        style={styles.screen}
        headingStyle={styles.screenHeader}
        ref={this.screenRef}
        secondary
        header={translate("mobile.createOffer.review.title")}
        subtext={translate("mobile.createOffer.review.subtext")}
        isNextButtonEnabled={!isFetching}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._submit}
        nextTitle={nextTitle}
      >
        {isFetching && <LoadingIndicator />}
        {this.state.hasSubmitted && !isFetching && !!this.props.createOfferState.error && (
          <Error
            style={styles.error}
            textStyle={styles.errorText}
            error={this.props.createOfferState.error}
            errorMessagingOverrides={{
              [errorDomains.NETWORKING]: {
                [errorCodes.NETWORKING_DISCONNECTED]: () => translate("mobile.createOffer.review.network_error"),
                [errorCodes.NETWORKING_TIMEOUT]: () => translate("mobile.createOffer.review.network_error")
              }
            }}
          >
            {this.props.createOfferState.error?.code === errorCodes.WRI_COMPLETED_WITH_ERRORS && (
              <Button
                style={[Styles.Buttons.centeredSecondaryButton, styles.errorButton]}
                onPress={this.props.continueWithoutSaving}
                title={translate("mobile.common.continue_anyway")}
              />
            )}
          </Error>
        )}
        <OfferDetails
          componentId={componentId}
          isOwnedByUser={isOwnedByUser}
          contactsState={contactsState}
          filteredId={this.props.filteredId}
          myPitches={myPitches}
          myOrganisation={myOrganisation}
          organisationState={organisationState}
          offerBase={offerBase}
          offerId={offerId}
          offerDetails={offerDetails}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    backgroundColor: Styles.Colours.red,
    padding: Styles.Layout.Margins.medium
  },
  errorText: {
    color: "white"
  },
  errorButton: {
    marginTop: Styles.Layout.Margins.small
  },
  screen: {
    padding: 0,
    paddingBottom: Styles.Layout.Margins.medium
  },
  screenHeader: {
    backgroundColor: "white",
    ...Styles.Containers.cardShadow,
    paddingBottom: Styles.Layout.Margins.medium
  }
});
