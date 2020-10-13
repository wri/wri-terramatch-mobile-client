// @flow

import type { AppState, ComponentProps, Dispatch } from "../../../redux/redux.types";
import { connect } from "react-redux";
import OfferScreen from "../../../components/offers/details/mine";
import wriAPI from "../../../api/wri";

import { OfferRead, OfferComplete } from "wri-api";
import { createOrResumeForm } from "../../../screens/projectForms";
import { fetchOrganisationOffers, inspectOrganisationOffers } from "../../../redux/wri-api/organisations/actions";
import { fetchOfferData } from "../../../redux/wri-api/cache/actions";
import { transformAsyncState } from "../../../redux/asyncActionReducer";
import { findMostRecentOrganisationVersion } from "../../../api/wri/helpers";

type OwnProps = {|
  +componentId: string,
  +filteredId: number,
  +offerBase: OfferRead,
  +offerId: number
|};

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    contactsState: state.wriCache.offerContacts,
    offerDetails: transformAsyncState(state.wriCache.offerDetails, data => data, props.offerBase),
    organisationState: transformAsyncState(
      state.wri.organisations.read,
      versions => findMostRecentOrganisationVersion(versions)?.data
    )
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
  return {
    fetchOfferData: () => {
      if (!props.offerBase?.completed) {
        dispatch(fetchOfferData(props.offerId, null));
      }
    },
    onArchiveOfferPressed: async () => {
      await wriAPI.offers.offersIDCompletePatch(
        props.offerId,
        OfferComplete.constructFromObject({ successful: false })
      );

      const orgId = props.offerBase.organisation_id;
      if (orgId) {
        dispatch(inspectOrganisationOffers(orgId));
        dispatch(fetchOrganisationOffers(orgId));
      }
    },
    onEditOfferPressed: async () => {
      await dispatch(createOrResumeForm("offer", null, null, props.offerId));
    }
  };
};

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, AppState, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(OfferScreen);
