import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import $ from 'jquery';
import {API_ROOT, GEO_OPTIONS, POS_KEY, TOKEN_KEY, AUTH_PREFIX} from '../constants';


const TabPane = Tabs.TabPane;


export class Home extends React.Component {
  state = {
    loadingGeoLocation: false,
    loadingPosts: false,
    error: '',
  }

  componentDidMount() {
    this.getGeoLocation()
  }

  getGeoLocation = () => {
    this.setState({ loadingGeoLocation: true, error: ''});
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.onSuccessLoadGeoLocation,
        this.onFailedLoadGeoLocation,
        GEO_OPTIONS,
        );
    } else {
      this.setState({ error: 'Your browser does not support geolocation'});
    }
  }

  onSuccessLoadGeoLocation = (position) => {
    this.setState({ loadingGeoLocation: true, error: ''});
    this.setState({ loadingGeoLocation: false});
    console.log(position);
    const { latitude, longitude} = position.coords;
    localStorage.setItem('POS_KEY', JSON.stringify({ lat: latitude, lon: longitude}));
    this.loadNearByPosts();
  }

  onFailedLoadGeoLocation = (error) => {
    this.setState({ loadingGeoLocation: false});
    console.log(error);
    this.setState({ error: 'Failed to load geolocation'});
  }

  loadNearByPosts = () => {
    this.setState({ loadingPosts : true, error: '' });
    const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
    $.ajax({
      url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`,
      method: 'GET',
      headers: {
        Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
      },
    }).then((response) => {
      console.log(response);
      this.setState({ loadingPosts : false, error: ''});
    }, (response) => {
      console.log(response.responseText);
      this.setState({ loadingPosts : false });
      this.setState({ error: 'Failed to load posts'});
    }).catch((error) => {
      console.log(error);
    });

  }

  getGalleryPanelContent = () => {
    if(this.state.error) {
      return <div>{this.state.error}</div>
    } else if (this.state.loadingGeoLocation) {
      return <Spin tip="loading geo location..."/>
    } else if (this.state.loadingPosts) {
      return <Spin tip="loading posts..."/>
    } else {
      return '';
    }
  }
  render() {
    const operations = <Button type="primary">Create New Post</Button>;

    return (
      <div className="main-tabs">
        <Tabs tabBarExtraContent={operations}>
          <TabPane tab="Posts" key="1">
            {this.getGalleryPanelContent()}
            </TabPane>
          <TabPane tab="Map" key="2">Map</TabPane>
        </Tabs>
      </div>
    );
  }
}
