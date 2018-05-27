import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import { AroundMarker } from './AroundMarker';
import { POS_KEY } from '../constants';

class AroundMap extends React.Component {
  reloadMarker = () => {
    const center = this.map.getCenter();
    const location = { lat: center.lat(), lon: center.lng() };
    this.props.loadNearByPosts(location);

  }
  getMapref = (map) => {
    this.map = map;
  }

  render() {
    const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));

    return(
      <GoogleMap
        ref={this.getMapref}
        onDragEnd={this.reloadMarker}
        defaultZoom={11}
        defaultCenter={{ lat: lat, lng: lon }}
      >
        {this.props.posts.map((post) => <AroundMarker key={post.url} post={post}/> )}
      </GoogleMap>
    );
  }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap));