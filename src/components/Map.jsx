import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
console.log(`This is the Api key${apiKey}`);

const mapStyles = { width: '100px', height: '400px', marginTop: '-50px' };
const containerStyle = {
    position: "relative",
    width: "50%",
    height: "400px",
    marginTop: "5rem"
};
const markerStyle = { height: '50px', width: '50px', marginTop: '-50px' };
const imgStyle = { height: '75%' };

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
      current_user: ''
    };
  }

  componentDidMount() {
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
            axios.post("http://localhost:3001/update-location", {
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
    console.log(`Location is ${this.state.locations}`);
    console.log(`Location is ${JSON.stringify(this.state.locations)}`);
    let locationMarkers = Object.keys(this.state.locations).map((username, id) => (
      <Marker
        key={id}
        title={username === this.state.current_user ? 'My location' : `${username}'s location`}
        lat={this.state.locations[username].lat}
        lng={this.state.locations[username].lng}
      />
    ));

    return (
      <div>
        <div className='maps_container' style={containerStyle}>
        <GoogleMap
          style={mapStyles}
          bootstrapURLKeys={{ key:apiKey}}
          containerStyle={containerStyle}
          center={this.state.center}
          zoom={14}
        >
          {locationMarkers}
        </GoogleMap>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default Map;