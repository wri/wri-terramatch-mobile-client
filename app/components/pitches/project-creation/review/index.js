// @flow

import type { PendingRestorationMethodMetric, PitchRegistrationForm } from "../../../../redux/wri-api/pitches";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import type { AsyncState } from "../../../../redux/redux.types";

import React, { Component, type ElementRef } from "react";
import { Navigation } from "react-native-navigation";
import translate from "../../../../locales/";
import { BackHandler, StyleSheet } from "react-native";
import Screen from "../../../common/screen";
import LoadingIndicator from "../../../common/loading-indicator";
import Error from "../../../common/error";
import Styles from "../../../../styles";
import { errorCodes, errorDomains } from "../../../../constants/errorMessaging";
import { logProjectCreationEvent } from "../../../../utils/analytics";

import {
  CarbonCertificationVersionReadAll,
  OfferReadAll,
  OrganisationRead,
  PitchContactRead,
  PitchContactReadAll,
  PitchDocumentRead,
  PitchDocumentReadAll,
  PitchDocumentVersionReadAll,
  PitchRead,
  PitchVersionReadAll,
  RestorationMethodMetricVersionReadAll,
  TeamMemberRead,
  TeamMemberReadAll,
  TreeSpeciesVersionReadAll,
  UserRead,
  UserReadAll,
  OrganisationVersionReadAll
} from "wri-api";
import PitchDetails from "../../details/base-view";
import { initialAsyncState, successState } from "../../../../redux/asyncActionReducer";
import {
  convertPendingCertificationsToVersions,
  convertPendingRestorationMethodMetricToVersion,
  convertPendingTreeSpeciesToVersions,
  convertPitchDocumentsToVersions,
  convertPitchesToVersions
} from "../../../../api/wri/helpers";
import Button from "../../../common/button";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  +continueWithoutSaving: () => any,

  +createPitchState: AsyncState<any>,

  +filteredId: number,

  +form: PitchRegistrationForm,

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
  pitchState: PitchState
|};

type PitchState = {|
  +componentId: string,
  +isOwnedByUser: boolean,
  +pitchBase: ?PitchRead,
  +pitchId: number,
  +certificationState: AsyncState<CarbonCertificationVersionReadAll>,
  +contactsState: AsyncState<PitchContactReadAll>,
  +documentsState: AsyncState<PitchDocumentVersionReadAll>,
  +metricsState: AsyncState<RestorationMethodMetricVersionReadAll>,
  +myOffers: AsyncState<OfferReadAll>,
  +myOrganisation: AsyncState<OrganisationVersionReadAll>,
  +organisationState: AsyncState<OrganisationRead>,
  +treeSpeciesState: AsyncState<TreeSpeciesVersionReadAll>,
  +versionsState: AsyncState<PitchVersionReadAll>
|};

export default class ReviewPitchScreen extends Component<Props, State> {
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
      pitchState: this._createPitchState()
    };

    this.screenRef = React.createRef();
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._previousStep);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._previousStep);
  }

  _createPitchState = (): PitchState => {
    // eslint-disable-next-line no-unused-vars
    const { cover_photo, video, ...pitchDetails } = this.props.form.details ?? {};
    const pitchBase = PitchRead.constructFromObject({
      ...pitchDetails,
      avatar: this.props.organisationState?.data?.avatar ?? null,
      cover_photo: this.props.form.uploads.coverPhoto?.uri ?? null,
      video: this.props.form.uploads.video?.uri ?? this.props.form.details.video ?? null,
      created_at: null,
      visibility: this.props.form.base?.details?.visibility ?? null,
      id: 0
    });

    const docs = PitchDocumentReadAll.constructFromObject([
      ...this.props.form.uploads.documents
        .filter(item => item.type !== "deleted")
        .map(item =>
          PitchDocumentRead.constructFromObject({
            id: null,
            pitch_id: null,
            name: item.file.name,
            type: "legal",
            document: item.file.uri
          })
        )
    ]);

    const teamMembers = this.props.form.contacts
      .filter(item => item.type !== "deleted")
      .map((member, idx) => {
        if (member.data.team_member_id) {
          const teamMember =
            this.props.organisationMembers.find(item => item.id === member.data.team_member_id) ?? new TeamMemberRead();
          return PitchContactRead.constructFromObject({
            avatar: teamMember.avatar,
            first_name: teamMember.first_name,
            last_name: teamMember.last_name,
            job_role: teamMember.job_role,
            pitch_id: 0,
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
          return PitchContactRead.constructFromObject({
            avatar: teamUser.avatar,
            first_name: teamUser.first_name,
            last_name: teamUser.last_name,
            job_role: teamUser.job_role,
            pitch_id: 0,
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
    const certificationState = successState(
      convertPendingCertificationsToVersions(this.props.form.certificate.filter(item => item.type !== "deleted"))
    );
    const contactsState = successState(PitchContactReadAll.constructFromObject(teamMembers));
    const documentsState = successState(convertPitchDocumentsToVersions(docs));
    const metricsState = successState(
      convertPendingRestorationMethodMetricToVersion(this.getRestorationMethodMetricList(this.props.form.metrics))
    );
    const myOffers = successState(new OfferReadAll());
    const organisationState = this.props.organisationState;
    const treeSpeciesState = successState(
      convertPendingTreeSpeciesToVersions(this.props.form.species.filter(item => item.type !== "deleted"))
    );
    const versionsState = successState(convertPitchesToVersions(([pitchBase]: Array<PitchRead>)));
    const pitchId = 0;
    const isOwnedByUser = true;
    const componentId = this.props.componentId;

    return {
      componentId,
      isOwnedByUser,
      pitchBase,
      pitchId,
      certificationState,
      contactsState,
      documentsState,
      metricsState,
      myOffers,
      organisationState,
      treeSpeciesState,
      versionsState,
      myOrganisation: initialAsyncState
    };
  };

  getRestorationMethodMetricList = (metrics: any): Array<PendingRestorationMethodMetric> => {
    return Object.keys(metrics).map(key => metrics[key]);
  };

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  _previousStep = () => {
    if (this.props.formMetadata.popBackScreen) {
      Navigation.popTo(this.props.formMetadata.popBackScreen);
    } else {
      Navigation.pop(this.props.componentId);
    }
    return true;
  };

  _submit = async () => {
    logProjectCreationEvent("submit");
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
      isOwnedByUser,
      pitchBase,
      pitchId,
      certificationState,
      contactsState,
      documentsState,
      metricsState,
      myOffers,
      myOrganisation,
      organisationState,
      treeSpeciesState,
      versionsState
    } = this.state.pitchState;
    const isFetching = this.props.createPitchState.isFetching;
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
        header={translate("mobile.createPitch.review.title")}
        subtext={translate("mobile.createPitch.review.subtext")}
        isNextButtonEnabled={!isFetching}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._submit}
        nextTitle={nextTitle}
      >
        {isFetching && <LoadingIndicator />}
        {this.state.hasSubmitted && !isFetching && !!this.props.createPitchState.error && (
          <Error
            style={styles.error}
            textStyle={styles.errorText}
            error={this.props.createPitchState.error}
            errorMessagingOverrides={{
              [errorDomains.NETWORKING]: {
                [errorCodes.NETWORKING_DISCONNECTED]: () => translate("mobile.createPitch.review.network_error"),
                [errorCodes.NETWORKING_TIMEOUT]: () => translate("mobile.createPitch.review.network_error")
              }
            }}
          >
            {this.props.createPitchState.error?.code === errorCodes.WRI_COMPLETED_WITH_ERRORS && (
              <Button
                style={[Styles.Buttons.centeredSecondaryButton, styles.errorButton]}
                onPress={this.props.continueWithoutSaving}
                title={translate("mobile.common.continue_anyway")}
              />
            )}
          </Error>
        )}
        <PitchDetails
          certificationState={certificationState}
          componentId={componentId}
          contactsState={contactsState}
          documentsState={documentsState}
          filteredId={this.props.filteredId}
          isOwnedByUser={isOwnedByUser}
          metricsState={metricsState}
          myOffers={myOffers}
          myOrganisation={myOrganisation}
          organisationState={organisationState}
          pitchBase={pitchBase}
          pitchId={pitchId}
          treeSpeciesState={treeSpeciesState}
          versionsState={versionsState}
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
