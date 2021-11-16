import React, { useState,useEffect } from 'react';
import StravaService from '../service/StravaService';
import  './TrainingMap.css';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet'
import polyline_decoder  from '@mapbox/polyline';

function TrainingMap() {

    const  [routes,  setRoutes]  = useState([]);

    useEffect(() => {
        StravaService.getActivities((trainingData) => {
            console.log(trainingData);
            let trainingRoutes  = trainingData.filter(training => training.type === 'Run' && training.map.summary_polyline)
                                    .map(i => polyline_decoder.decode(i.map.summary_polyline));
            console.log(trainingRoutes);
            setRoutes(trainingRoutes);
        });
    
    },[]);

    return (
        <div className='race-map'>
        <MapContainer center={[38.98372,-77.38276]} zoom={12} scrollWheelZoom={false}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline className='polyline-marker' positions={routes} />
        </MapContainer>
        </div>
        
    )
}
                
export default TrainingMap;