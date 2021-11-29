import React, { useState,useEffect } from 'react';
import StravaService from '../service/StravaService';
import  './TrainingMap.css';
import { MapContainer, TileLayer, Polyline, Tooltip } from 'react-leaflet'
import polyline_decoder  from '@mapbox/polyline';

function TrainingMap() {

    const  [routes,  setRoutes]  = useState([]);

    useEffect(() => {
        StravaService.getActivities().then(trainingData => {
            let trainingRoutes = trainingData.filter(training => training.type === 'Run' && training.map.summary_polyline)
            .map((i) => {
                return {
                    distance: (i.distance * 0.000621371192).toFixed(2),
                    route: polyline_decoder.decode(i.map.summary_polyline)
                };
            });

            setRoutes(trainingRoutes);
        });
    }, []);

    const normalLines = { color: 'blue' };
    
    return (
    <div className="p-grid">
        <div className="p-col-fixed dash"></div>
        <div className="p-col">
            <div className='race-map'>
                <MapContainer center={[38.98372,-77.38276]} zoom={14} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {routes.map((obj, index)=>{
                    return <Polyline  key={index} pathOptions={normalLines} positions={obj.route}>
                                <Tooltip sticky>Distance: {obj.distance} miles</Tooltip>
                            </Polyline>
                    })}
                    
                </MapContainer>
            </div>
        </div>
    </div>
    )
}
                
export default TrainingMap;