import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

const Directions = ({ destination, origin, onReady }) => (
  <MapViewDirections
    origin={origin}
    destination={destination}
    onStart={() => console.log('Started already')}
    onReady={onReady}
    strokeWidth={3}
    strokeColor='#fff'
    apikey="AIzaSyCx6eomNF-EDjuJ7L-ehTCODS_M7RonorY"
    precision="high"
  />
);

export default Directions;
