// @flow

import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import { StyleSheet, Text, View } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
const turf = require("@turf/turf");
import Bubble from "../../../common/bubble";
import translate, { formatNumber } from "../../../../locales/";
import colours from "../../../../styles/colours";
// eslint-disable-next-line import/default
import Slider from "@react-native-community/slider";
import ProjectFlowScreen from "../screen";
import Styles from "../../../../styles";
import type { ProjectFormProps } from "../../../../screens/projectForms";
import { projectCreationNavigation, projectCreationNavigationEvents } from "../../../../utils/navigation";

const LOCATION = require("../../../../assets/icons/pitch/location/pin_drop.png");
import NetInfo from "@react-native-community/netinfo";
import Toast from "../../../common/toast";

type Props = {|
  /**
   * Automatically sent by RNN if mounted in a navigation stack
   */
  +componentId: string,

  /**
   * Metadata about the form being modified
   */
  +formMetadata: ProjectFormProps,

  +initialGeoJson: ?string,

  /**
   * Updates the saved form so that it can be resumed
   */
  updateSavedGeoJson: string => void
|};

type State = {|
  +hasUserDrawnCircle: boolean,
  +pin: ?{|
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [number, number]
    }
  |},
  +radiusInMeters: number,
  +shape: ?{},
  +showBanner: boolean
|};

export default class PitchLocationScreen extends Component<Props, State> {
  static options(passProps: { formMetadata: ProjectFormProps }) {
    return {
      ...projectCreationNavigation(passProps.formMetadata)
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);

    if (props.initialGeoJson) {
      const shape = JSON.parse(props.initialGeoJson);
      this.state = {
        hasUserDrawnCircle: false,
        pin: turf.center(shape),
        radiusInMeters: 56,
        shape,
        showBanner: false
      };
    } else {
      this.state = {
        hasUserDrawnCircle: false,
        pin: null,
        radiusInMeters: 56,
        shape: null,
        showBanner: true
      };
    }

    const self: any = this;
    self._startNextScreen = this._startNextScreen.bind(this);
    self.onLatLngSelected = this.onLatLngSelected.bind(this);
    self.onRadiusChange = this.onRadiusChange.bind(this);
  }

  componentDidMount(): void {
    NetInfo.fetch().then(state => {
      if (!state.isConnected && this.refs.defaultToastBottom !== null) {
        this.refs.defaultToastBottom.showToast(translate("common.noInternet"), 2000);
      }
      return true;
    });
  }

  onLatLngSelected(e: any) {
    const location = MapboxGL.geoUtils.makeFeature(e.geometry);
    location.id = `${Date.now()}`;
    this.setState(state => ({
      hasUserDrawnCircle: true,
      pin: location,
      shape: this.createGeoJSONCircle(e.geometry.coordinates, state.radiusInMeters)
    }));
  }

  navigationButtonPressed(event: any) {
    projectCreationNavigationEvents(event.buttonId, this.props.formMetadata);
  }

  _startNextScreen() {
    if (this.state.hasUserDrawnCircle) {
      this.props.updateSavedGeoJson(JSON.stringify(this.state.shape));
    }
    this.props.formMetadata.pushNextScreen(this.props.componentId);
  }

  createGeoJSONCircle = (center: [number, number], radiusInMeters: number) => {
    return turf.circle(center, radiusInMeters, {
      steps: 50,
      units: "meters"
    });
  };

  onRadiusChange(value: number) {
    this.setState(prevState => ({
      radiusInMeters: value,
      shape: this.createGeoJSONCircle(prevState.pin?.geometry?.coordinates ?? [0, 0], value)
    }));
  }

  render() {
    const hasDrawnShape = !!this.state.shape;
    const hasPin = !!this.state.pin;
    const bbox = hasDrawnShape ? turf.bbox(this.state.shape) : null;
    const bounds =
      hasDrawnShape && bbox
        ? {
            ne: [bbox[0], bbox[1]],
            sw: [bbox[2], bbox[3]],
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 10,
            paddingBottom: 10
          }
        : null;

    return (
      <ProjectFlowScreen
        componentId={this.props.componentId}
        formMetadata={this.props.formMetadata}
        style={styles.fullScreen}
        isNextButtonEnabled={true}
        onNextButtonPressed={this._startNextScreen}
      >
        <Toast ref="defaultToastBottom" position="bottom" />
        <MapboxGL.MapView
          contentInset={10}
          styleURL={"mapbox://styles/mapbox/streets-v11"}
          style={styles.fullScreen}
          onPress={this.onLatLngSelected}
        >
          <MapboxGL.Camera
            centerCoordinate={hasPin && !bounds ? this.state.pin?.geometry?.coordinates : null}
            animationDuration={500}
            minZoomLevel={1}
            bounds={bounds}
          />

          {hasDrawnShape ? (
            <>
              <MapboxGL.ShapeSource
                id="circleOverlay"
                type="geojson"
                belowLayerID={hasPin ? "locationPin" : null}
                shape={this.state.shape}
              >
                <MapboxGL.FillLayer id="circleFillOverlay" style={customStyles.circleOverlayStyle} />
              </MapboxGL.ShapeSource>

              {hasPin ? (
                <MapboxGL.ShapeSource id="locationPin" hitbox={{ width: 15, height: 15 }} shape={this.state.pin}>
                  <MapboxGL.SymbolLayer id="symbolLocationSymbols" minZoomLevel={1} style={customStyles.icon} />
                </MapboxGL.ShapeSource>
              ) : null}
            </>
          ) : null}
        </MapboxGL.MapView>
        {this.state.showBanner && (
          <Bubble
            title={translate("createPitch.details.locationMap")}
            body={translate("createPitch.details.locationMapHelpAdvice")}
          />
        )}
        {this.state.hasUserDrawnCircle ? (
          <View key="radiusContainer" style={styles.container}>
            <Text style={[Styles.Text.h5, styles.infoText]}>{translate("mobile.project.location.area")}</Text>
            <Text style={[Styles.Text.h4, styles.infoText]}>
              {translate("mobile.project.location.radius", null, {
                km: formatNumber(this.state.radiusInMeters / 1000.0)
              })}
            </Text>
            <Slider
              step={28}
              maximumValue={100000}
              minimumValue={56}
              onValueChange={this.onRadiusChange}
              value={this.state.radiusInMeters}
              thumbTintColor={colours.primary}
              minimumTrackTintColor={colours.primary}
            />
          </View>
        ) : null}
      </ProjectFlowScreen>
    );
  }
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    padding: 0
  },
  container: {
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  infoText: {
    textAlign: "center",
    textTransform: "uppercase"
  }
});

const customStyles = {
  icon: {
    iconImage: LOCATION,
    iconAllowOverlap: true,
    iconColor: Styles.Colours.primary
  },
  circleOverlayStyle: {
    fillColor: colours.primary,
    fillOpacity: 0.15,
    fillOutlineColor: colours.black
  }
};
