import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import {API_KEY} from 'react-native-dotenv';

const Directions = ({destination, origin, onReady}) => (
  <MapViewDirections
    origin={origin}
    destination={destination}
    onStart={() => console.log('Started already')}
    onReady={onReady}
    strokeWidth={3}
    strokeColor="#fff"
    apikey={API_KEY}
    precision="high"
  />
);

export default Directions;
