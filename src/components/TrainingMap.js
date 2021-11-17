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

    const getRandomColor=()=> {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        console.log(color);
        return color;
    }
      

    return (
        <div className='race-map'>
        <MapContainer center={[38.98372,-77.38276]} zoom={12} scrollWheelZoom={false}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routes.map((route, index)=>{
               return <Polyline  key={index} style={{color: String(getRandomColor())}} positions={route} />
            })}
            
        </MapContainer>
        </div>
        
    )
}
                
export default TrainingMap;