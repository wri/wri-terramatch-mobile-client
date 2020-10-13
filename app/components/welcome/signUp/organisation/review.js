// @flow

import type { AsyncState } from "../../../../redux/redux.types";
import type { OrganisationRegistrationForm } from "../../../../redux/wri-api/organisations";
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Navigation } from "react-native-navigation";
import {
  OfferReadAll,
  OrganisationDocumentReadAll,
  OrganisationDocumentRead,
  OrganisationDocumentVersionReadAll,
  OrganisationRead,
  OrganisationVersionReadAll,
  PitchVersionReadAll,
  TeamMemberRead,
  TeamMemberReadAll,
  UserRead,
  UserReadAll
} from "wri-api";
import translate from "../../../../locales/";
import OrganisationProfile from "../../../organisation/details/base-view";
import OrganisationSubmitScreen from "../../../../containers/welcome/signUp/organisation/submit-screen";
import Styles from "../../../../styles";
import { logAddProjectEvent } from "../../../../utils/analytics";
import { convertOrganisationDocumentsToVersions, convertOrganisationsToVersions } from "../../../../api/wri/helpers";
import { successState } from "../../../../redux/asyncActionReducer";
import { organisationCreationNavigation } from "../../../../utils/navigation";

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  componentId: string,

  form: OrganisationRegistrationForm,

  onSubmissionCompleted: () => any
|};

type OrgState = {|
  +documentsState: AsyncState<OrganisationDocumentVersionReadAll>,
  +membersState: AsyncState<TeamMemberReadAll>,
  +offersState: AsyncState<OfferReadAll>,
  +pitchesState: AsyncState<PitchVersionReadAll>,
  +usersState: AsyncState<UserReadAll>,
  +versionsState: AsyncState<OrganisationVersionReadAll>
|};

type State = {|
  // Stored here to avoid re-computing on every render
  organisation: OrgState
|};

export default class OrganisationReviewScreen extends Component<Props, State> {
  static options(passProps: { isEdit: boolean }) {
    return {
      ...organisationCreationNavigation(passProps.isEdit)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      organisation: this._createOrgState()
    };
  }

  navigationButtonPressed(event: any) {
    if (event.buttonId === NAV_BAR_BUTTON_ID_HOME) {
      {
        Navigation.popToRoot(this.props.componentId);
      }
    }
  }

  _createOrgState = (): OrgState => {
    // We need to coerce the registration form data into the models expected by OrganisationProfile
    // eslint-disable-next-line no-unused-vars
    const { avatar, cover_photo, video, ...orgDetails } = this.props.form.details ?? {};
    const organisation = OrganisationRead.constructFromObject({
      ...orgDetails,
      avatar: this.props.form.uploads.avatar?.uri ?? "",
      cover_photo: this.props.form.uploads.coverPhoto?.uri ?? "",
      created_at: null,
      id: 0,
      video: this.props.form.uploads.video?.uri ?? ""
    });

    const teamMembers: Array<TeamMemberRead> = [];
    const users: Array<UserRead> = [];

    this.props.form.pendingMembers.forEach((member, idx) => {
      switch (member.type) {
        case "created_member": {
          // eslint-disable-next-line no-unused-vars
          const { avatar, ...memberData } = member.data;
          teamMembers.push(
            TeamMemberRead.constructFromObject({
              ...memberData,
              avatar: member.avatarFile?.uri ?? member.base?.avatar,
              id: idx,
              organisation_id: organisation.id
            })
          );
          break;
        }
        case "created_user": {
          users.push(
            UserRead.constructFromObject({
              id: idx,
              organisation_id: organisation.id,
              first_name: null,
              last_name: null,
              email_address: member.data.email_address,
              email_address_verified_at: null,
              role: null,
              last_logged_in_at: null,
              job_role: null,
              facebook: null,
              twitter: null,
              instagram: null,
              linkedin: null,
              avatar: null,
              phone_number: null
            })
          );
          break;
        }
        case "existing_member": {
          // eslint-disable-next-line no-unused-vars
          const { avatar, ...memberData } = member.data;
          teamMembers.push(
            TeamMemberRead.constructFromObject({
              ...member.base,
              ...memberData,
              avatar: member.avatarFile ? member.avatarFile.uri : member.base?.avatar
            })
          );
          break;
        }
        case "existing_user": {
          // eslint-disable-next-line no-unused-vars
          const { avatar, ...memberData } = member.data;
          users.push(
            UserRead.constructFromObject({
              ...member.base,
              ...memberData,
              avatar: member.avatarFile ? member.avatarFile.uri : member.base?.avatar
            })
          );
          break;
        }
        default: {
          // eslint-disable-next-line babel/no-unused-expressions
          (member.type: empty);
          break;
        }
      }
    });

    const docs = OrganisationDocumentReadAll.constructFromObject([
      ...this.props.form.uploads.documents
        .filter(item => item.type !== "deleted")
        .map(item =>
          OrganisationDocumentRead.constructFromObject({
            id: null,
            organisation_id: null,
            name: item.file.name,
            type: "legal",
            document: item.file.uri
          })
        ),
      ...this.props.form.uploads.awards
        .filter(item => item.type !== "deleted")
        .map(item =>
          OrganisationDocumentRead.constructFromObject({
            id: null,
            organisation_id: null,
            name: item.file.name,
            type: "award",
            document: item.file.uri
          })
        )
    ]);

    const organisationVersions = convertOrganisationsToVersions(([organisation]: Array<OrganisationRead>));
    const docVersions = convertOrganisationDocumentsToVersions(docs);

    const versionsState = successState(organisationVersions);
    const membersState = successState(TeamMemberReadAll.constructFromObject(teamMembers));
    const usersState = successState(UserReadAll.constructFromObject(users));
    const documentsState = successState(docVersions);
    const offersState = successState(new OfferReadAll());
    const pitchesState = successState(new PitchVersionReadAll());

    return {
      pitchesState,
      offersState,
      documentsState,
      membersState,
      usersState,
      versionsState
    };
  };

  _previousStep = () => {
    logAddProjectEvent("review");
    Navigation.pop(this.props.componentId);
  };

  _onSubmissionCompleted = async () => {
    await this.props.onSubmissionCompleted();
  };

  render() {
    const {
      versionsState,
      usersState,
      membersState,
      offersState,
      pitchesState,
      documentsState
    } = this.state.organisation;

    return (
      <OrganisationSubmitScreen
        style={styles.screen}
        errorStyle={styles.screenError}
        headingStyle={styles.screenHeader}
        secondary
        header={translate("mobile.createOrganisation.review.title")}
        subtext={translate("mobile.createOrganisation.review.subtext")}
        onPreviousButtonPressed={this._previousStep}
        submitFormWhenNextPressed={true}
        onPostSubmit={this._onSubmissionCompleted}
      >
        <OrganisationProfile
          versionsState={versionsState}
          usersState={usersState}
          membersState={membersState}
          offersState={offersState}
          pitchesState={pitchesState}
          documentsState={documentsState}
        />
      </OrganisationSubmitScreen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    padding: 0,
    paddingBottom: Styles.Layout.Margins.medium
  },
  screenError: {
    marginHorizontal: 0
  },
  screenHeader: {
    backgroundColor: "white",
    ...Styles.Containers.cardShadow,
    paddingBottom: Styles.Layout.Margins.medium
  }
});
