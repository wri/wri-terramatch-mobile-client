// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import { connect } from "react-redux";
import OfferScreen from "../../../components/offers/details";
import { OfferRead } from "wri-api";

import { fetchOfferData } from "../../../redux/wri-api/cache/actions";

type OwnProps = {|
  +componentId: string,
  +filteredId: number,
  +isOwnedByUser: boolean,
  +offerBase: ?OfferRead,
  +offerId: number
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    contactsState: state.wriCache.offerContacts,
    myPitches: state.wri.organisations.pitches,
    myOrganisation: state.wri.organisations.read,
    offerDetails: state.wriCache.offerDetails,
    organisationState: state.wriCache.organisationDetails
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    fetchOfferData: () => {
      dispatch(fetchOfferData(props.offerId, props.offerBase?.organisation_id));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OfferScreen);
