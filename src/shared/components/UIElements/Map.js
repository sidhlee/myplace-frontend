import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = (props) => {
  const mapRef = useRef();

  // Place async operations (fetching data) inside effect
  useEffect(() => {
    // google maps SDK: https://developers.google.com/maps/documentation/javascript/tutorial
    // Render the map inside mapRef.current element.
    const map = new window.google.maps.Map(mapRef.current, {
      // center: {lat: -34.397, lng: 150.644},
      center: props.center, // controlled from above this component
      zoom: props.zoom,
    });
    // Create a new marker
    new window.google.maps.Marker({
      position: props.center, // at here
      map: map, // on this map object
    });
  }, [props.center, props.zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
