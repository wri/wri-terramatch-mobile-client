//@flow
import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import Styles from "../../../../styles";
import { PitchRead } from "wri-api";
import MapboxGL from "@react-native-mapbox-gl/maps";
const turf = require("@turf/turf");
import translate, { formatNumber } from "../../../../locales";

const LOCATION = require("../../../../assets/icons/pitch/location/pin_drop.png");
type Props = {|
  pitch: PitchRead
|};

export default class ProjectGeolocation extends Component<Props> {
  geoJson: any;
  pin: any;

  constructor(props: Props) {
    super(props);
    try {
      this.geoJson = JSON.parse(this.props.pitch.land_geojson ?? "");
      this.pin = turf.center(this.geoJson);
    } catch (err) {
      console.warn("3SC", "Could not parse project geojson", err);
    }
  }

  render() {
    if (!this.geoJson || !this.pin?.geometry?.coordinates) {
      return null;
    }

    const bbox = turf.bbox(this.geoJson);
    const bounds = {
      ne: [bbox[0], bbox[1]],
      sw: [bbox[2], bbox[3]],
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 10,
      paddingBottom: 10
    };

    return (
      <View style={styles.info}>
        <Text style={styles.viewTitleText}>{translate("mobile.project.location.latLong")}</Text>
        <Text style={styles.viewSubtitleText}>
          {/* eslint-disable-next-line react/jsx-no-literals */}
          {`${formatNumber(this.pin.geometry.coordinates[1])} ${formatNumber(this.pin.geometry.coordinates[0])}`}
        </Text>
        <View style={styles.mapView}>
          <MapboxGL.MapView contentInset={10} styleURL={"mapbox://styles/mapbox/streets-v11"} style={styles.fullScreen}>
            <MapboxGL.Camera animationDuration={0} minZoomLevel={1} bounds={bounds} />
            <MapboxGL.ShapeSource id="circleOverlay" type="geojson" belowLayerID="locationPin" shape={this.geoJson}>
              <MapboxGL.FillLayer id="circleFillOverlay" style={customStyles.circleOverlayStyle} />
            </MapboxGL.ShapeSource>
            <MapboxGL.ShapeSource id="locationPin" hitbox={{ width: 15, height: 15 }} shape={this.pin}>
              <MapboxGL.SymbolLayer id="symbolLocationSymbols" minZoomLevel={1} style={customStyles.icon} />
            </MapboxGL.ShapeSource>
          </MapboxGL.MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewTitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    color: Styles.Colours.brownGrey
  },
  viewSubtitleText: {
    ...Styles.Text.h4,
    fontSize: 20,
    paddingBottom: Styles.Layout.Margins.small
  },
  info: {
    paddingTop: Styles.Layout.Margins.small,
    paddingBottom: Styles.Layout.Margins.medium
  },
  mapView: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  fullScreen: {
    width: "100%",
    height: "100%"
  }
});

const customStyles = {
  icon: {
    iconImage: LOCATION,
    iconAllowOverlap: true
  },
  circleOverlayStyle: {
    fillColor: Styles.Colours.primary,
    fillOpacity: 0.15,
    fillOutlineColor: Styles.Colours.black
  }
};
