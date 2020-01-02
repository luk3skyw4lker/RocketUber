import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import { getPixelSize } from '../../utils';

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import {
  Back,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
  MapStyle
} from './styles';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      destination: null,
      duration: null,
      address: null
    };
    Geocoder.init('AIzaSyCx6eomNF-EDjuJ7L-ehTCODS_M7RonorY');
  }

  async componentDidMount() {
    Geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].address_components[1].long_name;

        // console.log('Address:', address);

        this.setState({
          address,
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134
          }
        });

        // console.log('Get position succesfull:', this.state.region);
        // console.log('State Address:', this.state.address);
      },
      () => { },
      {
        timeout: 10000,
        maximumAge: 4000,
        enableHighAccuracy: true
      }
    );
  }

  handleLocationSelected = (data, { geometry }) => {
    const { location } = geometry;

    // console.log('Location:', location);

    this.setState({
      destination: {
        latitude: location.lat,
        longitude: location.lng,
        title: data.structured_formatting.main_text
      }
    });

    console.log('Destination:', this.state.destination);
  }

  handleBack = () => {
    this.setState({
      destination: null
    });
  }

  render() {
    const { region, destination, duration, address } = this.state;

    // console.log('Region:', region);

    return (
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1, ...StyleSheet.absoluteFillObject }}
          region={region}
          showsUserLocation
          loadingEnabled
          ref={el => this.mapView = el}
          customMapStyle={MapStyle}
          showsMyLocationButton={false}
        >
          {destination && (
            <Fragment>
              <Directions
                origin={region}
                destination={destination}
                onReady={(result) => {
                  this.setState({
                    duration: Math.floor(result.duration)
                  });

                  // console.log('Duration:', this.state.duration);

                  this.mapView.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: getPixelSize(50),
                      left: getPixelSize(30),
                      top: getPixelSize(50),
                      bottom: getPixelSize(350)
                    }
                  })
                }}
              />
              <Marker
                coordinate={destination}
                anchor={{ x: 0, y: 0 }}
                image={markerImage}
              >
                <LocationBox>
                  <LocationText>{destination.title}</LocationText>
                </LocationBox>
              </Marker>

              <Marker
                coordinate={region}
                anchor={{ x: 0, y: 0 }}
              >
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeText>{duration}</LocationTimeText>
                    <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                  </LocationTimeBox>
                  <LocationText>{address}</LocationText>
                </LocationBox>
              </Marker>
            </Fragment>
          )}
        </MapView>

        {destination ? (
          <Fragment>
            <Back onPress={this.handleBack}>
              <Image source={backImage} />
            </Back>
            <Details />
          </Fragment>
        ) : (
            <Search onLocationSelected={this.handleLocationSelected} />
          )}
      </View>
    );
  }
}
