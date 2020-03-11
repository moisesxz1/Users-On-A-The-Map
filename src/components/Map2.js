import React, {useRef, useEffect} from 'react';

import '../Styling/Map.css';

const Map = (props) => {

    const mapRef = useRef();

    const { center, zoom} = props;

    useEffect(() => {

        const map = new window.google.maps.Map(mapRef.current, {
            center: props.center,
            zoom: props.zoom
        });
    
        {/*MARKER */}
        new window.google.maps.Marker({ position: props.center, map: map });
    
    }, [center,zoom]);

    return (
    <div 
    className={`map ${props.className}`} 
    style={props.style}
    ></div>
    );
};

export default Map;