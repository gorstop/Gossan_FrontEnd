import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import { AroundMarker } from './AroundMarker';
import { POS_KEY } from '../constants';

class AroundMap extends React.Component {


  render() {
    const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));

    return(
      <GoogleMap
        defaultZoom={11}
        defaultCenter={{ lat: lat, lng: lon }}
      >
        {this.props.posts.map((post) => <AroundMarker key={post.url} post={post}/> )}
      </GoogleMap>
    );
  }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap));