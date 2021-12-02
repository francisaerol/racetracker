import React, { useState,useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import StravaService from '../service/StravaService';
import  './TrainingMap.css';
import { MapContainer, TileLayer, Polyline, Popup, useMap } from 'react-leaflet'
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
        let trainingRoutes = trainingData.filter(training => training.type === 'Run')
            .map((i) => {
                let startDateTime  = new Date(i.start_date_local);
                let endDateTime = new Date(startDateTime.getTime() + i.elapsed_time);
                return {
                    title: i.name,
                    total_elevation: (i.total_elevation_gain / 0.3048).toFixed(2),
                    distance: (i.distance * 0.000621371192).toFixed(2),
                    start_date: startDateTime.toTimeString(),
                    end_date: endDateTime.toTimeString(),
                    startRoute: i.start_latlng,
                    route: (i.map.summary_polyline ? polyline_decoder.decode(i.map.summary_polyline) : null)
                };
            });
        setRoutes(trainingRoutes);
    };

    const colorGen = () => {
        var letters = '0123456789ABCDEF';
        var x = '#';
        for (var i = 0; i < 6; i++) {
            x += letters[Math.floor(Math.random() * 16)];
        }
        return {color: x};
    }
    return (
    <div className="p-grid">
        <div className="p-col-fixed dash">
            <Calendar id="monthpicker" value={month} onChange={monthHandler} view="month" dateFormat="MM - yy" yearNavigator yearRange="2010:2030" />
            <br />
            {
                routes.map((obj, index) => {
                    return <Button key = {index}
                            label = { obj.distance + ' Miles: ' + (obj.route ? 'on road' : 'on machine')}
                            className = "p-button-link"
                            polylineid= {obj.id}
                            onClick = {() => (obj.route ? handleClick(obj.startRoute) : null)}
                            />
                })
            }
        </div>
        <div className="p-col">
            <div className='race-map'>
                <MapContainer center={[38.98372,-77.38276]} zoom={14} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {routes.map((obj, index)=>{
                    return (obj.route ? <Polyline key={index} pathOptions={colorGen()} positions={obj.route}>
                                <Popup>
                                    {obj.title} <br/>
                                    Distance: {obj.distance} mi <br/>
                                    Start Time: {obj.start_date} <br/>
                                    End Time: {obj.end_date} <br/>
                                    Total Elevation: {obj.total_elevation} ft <br />
                                </Popup>
                            </Polyline> : null);
                    })}
                    <MapPanner center={centerRoute}/>
                </MapContainer>
            </div>
        </div>
    </div>
    )
}
                
export default TrainingMap;