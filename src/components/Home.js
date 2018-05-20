import React from 'react';
import { GEO_OPTIONS } from '../constants';

export class Home extends React.Component {
  componentDidMount() {
    this.getGeoLocation()
  }

  getGeoLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.onSuccessLoadGeoLocation,
        this.onFailedLoadGeoLocation,
        GEO_OPTIONS,
        );
    } else {

    }
  }

  onSuccessLoadGeoLocation = (position) => {
    console.log(position);
  }

  onFailedLoadGeoLocation = (error) => {
    console.log(error);
  }

  render() {
    return (
      <div>This is home</div>
    );
  }
}
