// @flow

import type { AsyncState } from "../../../../../redux/redux.types";

import React, { Component } from "react";
import { Platform, ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import { withSafeArea } from "react-native-safe-area";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";
import { OrganisationCreate, OrganisationTypeReadAll, CountryReadAll } from "wri-api";
import Styles from "../../../../../styles";
import { screens } from "../../../../../screens/";
import translate, { translateCountry, translateOrganisationType } from "../../../../../locales/";
import ValidatedTextInput from "../../../../common/validated-input";
import InputLabel from "../../../../common/forms/input-label/";
import Picker from "../../../../common/picker";
import Validation from "../../../../../utils/validation";
import textInputProps from "../../../../../constants/textInputProps";
import Screen from "../../../../common/screen";
import Touchable from "../../../../common/touchable";
import { organisationCreationNavigation } from "../../../../../utils/navigation";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * Async state representing a request for the countries that should be shown in the picker on this screen
   */
  +countriesState: AsyncState<CountryReadAll>,

  /**
   * Optional property that if present indicates the initial values that should be displayed in the form
   */
  +form: $Shape<OrganisationCreate>,

  /**
   * Whether we are editing the organisation, as opposed to creating a brand new organisation
   */
  +isEdit: boolean,

  /**
   * Async state representing a request for the organisation types that should be shown in the picker on this screen
   */
  +organisationTypesState: AsyncState<OrganisationTypeReadAll>,

  /**
   * Updates the saved form so that it can be resumed
   */
  +updateSavedForm: ($Shape<OrganisationCreate>) => void
|};
type State = {|
  +showDatePicker: boolean
|};

const NAV_BAR_BUTTON_ID_HOME = "nav_bar_btn_home";

const SafeAreaView = withSafeArea(ScrollView, "padding", "bottom");

export default class OrganisationDetailsScreen extends Component<Props, State> {
  static options(passProps: { isEdit: boolean }) {
    return {
      ...organisationCreationNavigation(passProps.isEdit)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      showDatePicker: Platform.OS === "ios" // On Android the date picker is a modal so is summoned by pressing a button
    };
  }

  navigationButtonPressed(event: any) {
    switch (event.buttonId) {
      case NAV_BAR_BUTTON_ID_HOME: {
        Navigation.popToRoot(this.props.componentId);
        break;
      }
    }
  }

  _startOrganisationDescription = () => {
    Navigation.push(this.props.componentId, {
      component: {
        ...screens.SIGNUP_ORGANISATION_DESCRIPTION,
        passProps: {
          isEdit: this.props.isEdit ? true : false
        }
      }
    });
  };

  _previousStep = () => {
    Navigation.pop(this.props.componentId);
  };

  handleChangeAccountType = (val: any) => {
    this.props.updateSavedForm({
      category: val
    });
  };

  handleChangeOrganisationType = (val: any) => {
    this.props.updateSavedForm({
      type: val
    });
  };

  handleChangeCountry = (val: any) => {
    this.props.updateSavedForm({
      country: val
    });
  };

  _showDatePicker = () => {
    this.setState({
      showDatePicker: true
    });
  };

  _updateFormField = (fieldName: $Keys<OrganisationCreate>, text: string) => {
    this.props.updateSavedForm({
      [fieldName]: text
    });
  };

  setDate = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      this.setState({
        showDatePicker: false
      });
    }
    if (date) {
      // The date param is in the user's local timezone - strip out any timezone info for this field
      const utc = Moment.utc({
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate()
      });
      this.props.updateSavedForm({
        founded_at: utc.toISOString()
      });
    }
  };

  render() {
    const { form } = this.props;

    const organisationListData = this.props.organisationTypesState.data;
    const countriesData = this.props.countriesState.data;
    const isAccountTypeValid = Validation.accountType.validate(form.category ?? "");
    const isOrganisationTypeValid = Validation.organisationType.validate(form.type ?? "");
    const isNumberValid = Validation.mobileNumber.validate(form.phone_number ?? "");
    const isOrganisationValid = Validation.organisation.validate(form.name ?? "");
    const isOrganisationFoundedAtValid = Validation.foundedAt.validate(form.founded_at);
    const isAddress1Valid = Validation.addressLine.validate(form.address_1 ?? "");
    const isCityValid = Validation.city.validate(form.city ?? "");
    const isStateValid = Validation.stateProvince.validate(form.state ?? "");
    const isZipCodeValid = Validation.zipCode.validate(form.zip_code ?? "");
    const isCountryValid = Validation.country.validate(form.country ?? "");
    const isWebsiteValid = Validation.website.validate(form.website ?? "");
    const isInstagramValid = Validation.instagram.validate(form.instagram ?? "");
    const isFacebookValid = Validation.facebook.validate(form.facebook ?? "");
    const isTwitterValid = Validation.twitter.validate(form.twitter ?? "");
    const isLinkedInValid = Validation.linkedin.validate(form.linkedin ?? "");
    const allInputsValid =
      isAccountTypeValid &&
      isOrganisationTypeValid &&
      isNumberValid &&
      isOrganisationValid &&
      isOrganisationFoundedAtValid &&
      isAddress1Valid &&
      isCountryValid &&
      isWebsiteValid &&
      isInstagramValid &&
      isFacebookValid &&
      isLinkedInValid &&
      isStateValid &&
      isZipCodeValid &&
      isTwitterValid;

    // The founded_at date is an ISO8601 timestamp
    // Although it could come back in any timezone, we will display and update it always in UTC
    const foundedAtUtc = form.founded_at ? Moment(form.founded_at).utc() : null;

    // However, the date picker component expects Date objects and displays them in the user's local timezone
    // This could lead to the UTC date being displayed and saved one day out from intended.
    // Therefore we will create a new date object representing the equivalent date (at midnight) in the local device tz
    const foundedAtLocal = foundedAtUtc
      ? Moment({
          year: foundedAtUtc.year(),
          month: foundedAtUtc.month(),
          date: foundedAtUtc.date()
        })
      : null;

    // Also do the same for the maximum selectable foundation date
    const foundedAtMaxLocal = Moment();

    return (
      <Screen
        scrollComponent={SafeAreaView}
        secondary
        keyboard
        header={translate("createOrganisation.details.title")}
        subtext={translate("createOrganisation.details.subtext")}
        isNextButtonEnabled={allInputsValid}
        onPreviousButtonPressed={this._previousStep}
        onNextButtonPressed={this._startOrganisationDescription}
      >
        {!this.props.isEdit && (
          <>
            <InputLabel title={translate("createOrganisation.details.accountType")} required />
            <Picker
              placeholder={{ label: translate("createOrganisation.details.accountType"), value: null }}
              value={form.category}
              onValueChange={this.handleChangeAccountType}
              items={[
                { label: translate("organisation.categories.funder"), value: "funder" },
                { label: translate("organisation.categories.developer"), value: "developer" },
                { label: translate("organisation.categories.both"), value: "both" }
              ]}
              fullBorder
            />
          </>
        )}

        <InputLabel title={translate("createOrganisation.details.organisationType")} required />
        <Picker
          placeholder={{ label: translate("createOrganisation.details.organisationType"), value: null }}
          value={form.type}
          onValueChange={this.handleChangeOrganisationType}
          items={(organisationListData ?? []).map(item => ({
            label: translateOrganisationType(item.type) ?? "Unknown",
            value: item.type
          }))}
          fullBorder
        />

        {!this.props.isEdit && (
          <>
            <InputLabel title={translate("createOrganisation.details.name")} required />

            <ValidatedTextInput
              key="organisation-name-input"
              ref="organisation-name-input"
              placeholder={translate("createOrganisation.details.name")}
              valid={isOrganisationValid}
              value={form.name}
              message={Validation.organisation.errorString(form.name ?? "")}
              onChangeText={this._updateFormField.bind(this, "name")}
              style={{ marginBottom: Styles.Layout.Margins.small }}
              {...textInputProps.organisationName}
            />
          </>
        )}

        <InputLabel title={translate("createOrganisation.details.foundedAt")} required />

        {Platform.OS === "android" && (
          <Touchable accessibilityRole={"button"} onPress={this._showDatePicker}>
            <ValidatedTextInput
              key="organisation-date-input"
              ref="organisation-date-input"
              placeholder={translate("createOrganisation.details.foundedAt")}
              valid={isOrganisationFoundedAtValid}
              value={foundedAtLocal ? foundedAtLocal.format("LL") : null}
              message={Validation.foundedAt.errorString(form.founded_at)}
              style={{ marginBottom: Styles.Layout.Margins.small }}
              editable={false}
              disabledStyle={{}}
            />
          </Touchable>
        )}
        {this.state.showDatePicker && (
          <DateTimePicker
            value={(foundedAtLocal ?? foundedAtMaxLocal).toDate()}
            mode="date"
            maximumDate={foundedAtMaxLocal.toDate()}
            display="spinner"
            onChange={this.setDate}
          />
        )}

        <InputLabel title={translate("createOrganisation.details.address_1")} required />

        <ValidatedTextInput
          key="organisation-address-1-input"
          ref="organisation-address-1-input"
          placeholder={translate("createOrganisation.details.address_1")}
          valid={isAddress1Valid}
          value={form.address_1}
          message={Validation.addressLine.errorString(form.address_1 ?? "")}
          onChangeText={this._updateFormField.bind(this, "address_1")}
          onSubmitEditing={() => {
            this.refs["organisation-address-2-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.address1}
        />

        <InputLabel title={translate("createOrganisation.details.address_2")} />

        <ValidatedTextInput
          key="organisation-address-2-input"
          ref="organisation-address-2-input"
          placeholder={translate("createOrganisation.details.address_2")}
          value={form.address_2}
          valid={true}
          onChangeText={this._updateFormField.bind(this, "address_2")}
          onSubmitEditing={() => {
            this.refs["organisation-city-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.address2}
        />

        <InputLabel title={translate("createOrganisation.details.city")} required />

        <ValidatedTextInput
          key="organisation-city-input"
          ref="organisation-city-input"
          placeholder={translate("createOrganisation.details.city")}
          valid={isCityValid}
          value={form.city}
          message={Validation.city.errorString(form.city ?? "")}
          onChangeText={this._updateFormField.bind(this, "city")}
          onSubmitEditing={() => {
            this.refs["organisation-stateProvince-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.city}
        />

        <InputLabel title={translate("createOrganisation.details.state")} required />

        <ValidatedTextInput
          key="organisation-stateProvince-input"
          ref="organisation-stateProvince-input"
          placeholder={translate("createOrganisation.details.state")}
          valid={isStateValid}
          value={form.state}
          message={Validation.stateProvince.errorString(form.state ?? "")}
          onChangeText={this._updateFormField.bind(this, "state")}
          onSubmitEditing={() => {
            this.refs["organisation-zipcode-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.stateProvince}
        />

        <InputLabel title={translate("createOrganisation.details.zipCode")} />

        <ValidatedTextInput
          key="organisation-zipcode-input"
          ref="organisation-zipcode-input"
          placeholder={translate("createOrganisation.details.zipCode")}
          valid={isZipCodeValid}
          value={form.zip_code}
          onChangeText={this._updateFormField.bind(this, "zip_code")}
          message={Validation.zipCode.errorString(form.zip_code ?? "")}
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.postalCode}
        />

        <InputLabel title={translate("createOrganisation.details.country")} required />
        <Picker
          placeholder={{ label: translate("createOrganisation.details.country"), value: null }}
          value={form.country}
          onValueChange={this.handleChangeCountry}
          items={(countriesData ?? []).map(item => ({
            label: translateCountry(item.code) ?? "Unknown",
            value: item.code
          }))}
          sorted
          fullBorder
        />

        <InputLabel title={translate("createOrganisation.details.phoneNumber")} required />

        <ValidatedTextInput
          key="organisation-number-input"
          ref="organisation-number-input"
          placeholder={translate("createOrganisation.details.phoneNumber")}
          valid={isNumberValid}
          value={form.phone_number}
          message={Validation.mobileNumber.errorString(form.phone_number ?? "")}
          onChangeText={this._updateFormField.bind(this, "phone_number")}
          onSubmitEditing={() => {
            this.refs["organisation-website-input"].focus();
          }}
          returnKeyType="done"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.mobileNumber}
        />

        <InputLabel title={translate("createOrganisation.details.website")} required />

        <ValidatedTextInput
          key="organisation-website-input"
          ref="organisation-website-input"
          placeholder={translate("createOrganisation.details.website")}
          valid={isWebsiteValid}
          value={form.website}
          message={Validation.website.errorString(form.website ?? "")}
          onChangeText={this._updateFormField.bind(this, "website")}
          onSubmitEditing={() => {
            this.refs["organisation-facebook-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.website}
        />

        <InputLabel title={translate("createOrganisation.details.facebook")} />

        <ValidatedTextInput
          key="organisation-facebook-input"
          ref="organisation-facebook-input"
          placeholder={translate("createOrganisation.details.facebook")}
          valid={isFacebookValid}
          value={form.facebook}
          onChangeText={this._updateFormField.bind(this, "facebook")}
          message={Validation.facebook.errorString(form.facebook ?? "")}
          onSubmitEditing={() => {
            this.refs["organisation-twitter-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.website}
        />

        <InputLabel title={translate("createOrganisation.details.twitter")} />

        <ValidatedTextInput
          key="organisation-twitter-input"
          ref="organisation-twitter-input"
          placeholder={translate("createOrganisation.details.twitter")}
          valid={isTwitterValid}
          value={form.twitter}
          onChangeText={this._updateFormField.bind(this, "twitter")}
          message={Validation.twitter.errorString(form.twitter ?? "")}
          onSubmitEditing={() => {
            this.refs["organisation-instagram-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.website}
        />

        <InputLabel title={translate("createOrganisation.details.instagram")} />

        <ValidatedTextInput
          key="organisation-instagram-input"
          ref="organisation-instagram-input"
          placeholder={translate("createOrganisation.details.instagram")}
          valid={isInstagramValid}
          value={form.instagram}
          onChangeText={this._updateFormField.bind(this, "instagram")}
          message={Validation.instagram.errorString(form.instagram ?? "")}
          onSubmitEditing={() => {
            this.refs["organisation-linkedin-input"].focus();
          }}
          returnKeyType="next"
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.website}
        />

        <InputLabel title={translate("createOrganisation.details.linkedin")} />

        <ValidatedTextInput
          key="organisation-linkedin-input"
          ref="organisation-linkedin-input"
          placeholder={translate("createOrganisation.details.linkedin")}
          valid={isLinkedInValid}
          value={form.linkedin}
          onChangeText={this._updateFormField.bind(this, "linkedin")}
          message={Validation.linkedin.errorString(form.linkedin ?? "")}
          onSubmitEditing={allInputsValid ? this._startOrganisationDescription : null}
          returnKeyType={allInputsValid ? "go" : null}
          style={{ marginBottom: Styles.Layout.Margins.small }}
          {...textInputProps.website}
        />
      </Screen>
    );
  }
}
