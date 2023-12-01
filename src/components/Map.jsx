import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import axios from 'axios';
import Pusher from 'pusher-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mapStyles = { width: '100%', height: '100%' };
const markerStyle = { height: '50px', width: '50px', marginTop: '-50px' };
const imgStyle = { height: '100%' };

const Marker = ({ title }) => (
  <div style={markerStyle}>
    <img style={imgStyle} src="https://res.cloudinary.com/og-tech/image/upload/s--OpSJXuvZ--/v1545236805/map-marker_hfipes.png" alt={title} />
    <h3>{title}</h3>
  </div>
);

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: { lat: 5.6219868, lng: -0.23223 },
      locations: {},
      users_online: [],
      current_user: ''
    };
  }

  componentDidMount() {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      authEndpoint: "http://localhost:3128/pusher/auth",
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      encrypted: true
    });

    this.presenceChannel = pusher.subscribe('presence-channel');

    this.presenceChannel.bind('pusher:subscription_succeeded', members => {
      this.setState({
        users_online: members.members,
        current_user: members.myID
      });
      this.getLocation();
      this.notify();
    });

    this.presenceChannel.bind('location-update', body => {
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.locations[body.username] = body.location;
        return newState;
      });
    });

    this.presenceChannel.bind('pusher:member_removed', member => {
      this.setState((prevState) => {
        const newState = { ...prevState };
        delete newState.locations[member.id];
        delete newState.users_online[member.id];
        return newState;
      });
      this.notify();
    });
  }

  notify = () => toast(`Users online : ${Object.keys(this.state.users_online).length}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    type: 'info'
  });

  getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        position => {
          let location = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.setState(prevState => ({
            center: location,
            locations: {
              ...prevState.locations,
              [prevState.current_user]: location
            }
          }), () => {
            axios.post("http://localhost:3128/update-location", {
              username: this.state.current_user,
              location: location
            })
            .then(res => {
              if (res.status === 200) {
                console.log("Location updated successfully");
              }
            })
            .catch(err => console.error(err));
          });
        },
        error => {
          console.error(`Geolocation Error: ${error.code} - ${error.message}`);
          alert(`Geolocation Error: ${error.code} - ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by this browser.");
    }
  }

  render() {
    console.log(this.state.locations.lat)
    let locationMarkers = Object.keys(this.state.locations).map((username, id) => (
      <Marker
        key={id}
        title={username === this.state.current_user ? 'My location' : `${username}'s location`}
        lat={this.state.locations.lat}
        lng={this.state.locations.lng}
      />
    ));

    return (
      <div>
        <GoogleMap
          style={mapStyles}
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
          center={this.state.center}
          zoom={14}
        >
          {locationMarkers}
        </GoogleMap>
        <ToastContainer />
      </div>
    );
  }
}

export default Map;