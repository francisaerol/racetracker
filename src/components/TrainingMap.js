import React, { useState,useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import StravaService from '../service/StravaService';
import  './TrainingMap.css';
import { MapContainer, TileLayer, Polyline, Tooltip, useMap } from 'react-leaflet'
import polyline_decoder  from '@mapbox/polyline';

function MapPanner(props) {
    const map = useMap();
    console.log('map center:', map.getCenter());
    map.panTo(props.center);

    return null;

    
  }

function TrainingMap() {

    const  [routes,  setRoutes]  = useState([]);
    const [month, setMonth] = useState(null);
    const  [centerRoute, setCenterRoute] = useState([38.98372,-77.38276]);

    useEffect(() => {
        setMonth(new Date());
        StravaService.getActivities().then(trainingData => setTrainingRoutes(trainingData));
    }, []);

    const monthHandler = (e) =>{
      setMonth(e.value);
      StravaService.getActivities(e.value).then(trainingData => setTrainingRoutes(trainingData));
    };

    const handleClick = (e) =>{
        console.log(e);
        setCenterRoute(e);
    };

    const setTrainingRoutes = (trainingData)=>{
        let trainingRoutes = trainingData.filter(training => training.type === 'Run' && training.map.summary_polyline)
            .map((i) => {
                return {
                    distance: (i.distance * 0.000621371192).toFixed(2),
                    startRoute: i.start_latlng,
                    route: polyline_decoder.decode(i.map.summary_polyline)
                };
            });
        setRoutes(trainingRoutes);
    };

    const normalLines = { color: 'blue' };
    
    return (
    <div className="p-grid">
        <div className="p-col-fixed dash">
            <Calendar id="monthpicker" value={month} onChange={monthHandler} view="month" dateFormat="MM - yy" yearNavigator yearRange="2010:2030" />
            <br />
            {routes.map((obj,index) => {
                return <Button key={index} label={obj.distance + ' Miles'}  className="p-button-link" startroute={obj.startRoute} onClick={() => handleClick(obj.startRoute)}/> 
            })}
        </div>
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
                    <MapPanner center={centerRoute}/>
                </MapContainer>
            </div>
        </div>
    </div>
    )
}
                
export default TrainingMap;