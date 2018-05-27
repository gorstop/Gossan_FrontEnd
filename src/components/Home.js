import React from 'react';
import { Tabs, Spin } from 'antd';
import $ from 'jquery';
import {API_ROOT, GEO_OPTIONS, POS_KEY, TOKEN_KEY, AUTH_PREFIX} from '../constants';
import { Gallery } from './Gallery';
import { CreatePostButton } from "./CreatePostButton";
import { WrappedAroundMap } from "./AroundMap";


const TabPane = Tabs.TabPane;


export class Home extends React.Component {
  state = {
    loadingGeoLocation: false,
    loadingPosts: false,
    error: '',
    posts: [],
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
    this.setState({ error: ''});
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
      url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
      method: 'GET',
      headers: {
        Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
      },
    }).then((response) => {
      console.log(response);
      this.setState({ posts: response, loadingPosts : false, error: ''});
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
    } else if (this.state.posts && this.state.posts.length > 0) {
      const images = this.state.posts.map((post) => {
        return {
          user: post.user,
          src: post.url,
          thumbnail: post.url,
          caption: post.message,
          thumbnailWidth: 400,
          thumbnailHeight: 300,
        }
      });
      return <Gallery images={images}/>
    } else {
      return '';
    }
  }
  render() {
    const operations = <CreatePostButton loadNearByPosts={this.loadNearByPosts}/>;

    return (
      <div className="main-tabs">
        <Tabs tabBarExtraContent={operations}>
          <TabPane tab="Posts" key="1">
            {this.getGalleryPanelContent()}
            </TabPane>
          <TabPane tab="Map" key="2">
            <WrappedAroundMap
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              posts={this.state.posts}
              />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
