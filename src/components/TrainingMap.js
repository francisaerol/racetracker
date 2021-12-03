import React, { useState,useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
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

    const [routes, setRoutes] = useState([]);
    const [month, setMonth] = useState(null);
    const [centerRoute, setCenterRoute] = useState([38.98372, -77.38276]);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        setMonth(new Date());
        StravaService.getActivities().then(trainingData => setTrainingRoutes(trainingData));
    }, []);

    const monthHandler = (e) =>{
      setMonth(e.value);
      StravaService.getActivities(e.value).then(trainingData => setTrainingRoutes(trainingData));
    };

    const onSelectRow = (e) =>{
        setSelectedRow(e.value);
        if(e.value.start_route && e.value.start_route.length > 0){
            setCenterRoute(e.value.start_route);
        }
    }

    const setTrainingRoutes = (trainingData)=>{
        let trainingRoutes = trainingData.filter(training => training.type === 'Run')
            .map((i) => {
                return {
                    id: i.id,
                    title: i.name,
                    total_elevation: (i.total_elevation_gain / 0.3048).toFixed(2),
                    distance: (i.distance * 0.000621371192).toFixed(2) +' mi',
                    date: new Date(i.start_date).getTime(),
                    total_time: new Date(i.elapsed_time * 1000).toISOString().substr(11, 8),
                    start_route: i.start_latlng,
                    route: (i.map.summary_polyline ? polyline_decoder.decode(i.map.summary_polyline) : null),
                    on_road:  (i.map.summary_polyline ? 'Yes'  : 'No')
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

    const dateTemplate = (rowData) =>{
        return new Date(rowData.date).toDateString();
    }

    return (
        <div id="outer-container">
        <div id="sidebar">
            <Calendar id="monthpicker" readOnlyInput="true" value={month} onChange={monthHandler} view="month" dateFormat="MM - yy" yearNavigator yearRange="2010:2030" showIcon />
            <br />
            <DataTable value={routes} 
                    selectionMode="single" 
                    selection={selectedRow} 
                    onSelectionChange={onSelectRow} 
                    dataKey="id" 
                    scrollable scrollHeight="400px" >
                <Column field="date" header="Date" body={dateTemplate} sortable/>
                <Column field="distance" header="Distance"/>
                <Column field="on_road" header="Road" sortable/>
            </DataTable>
        </div>
        <div id="content">
        <div className='race-map'>
                <MapContainer center={[38.98372,-77.38276]} zoom={14} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {routes.map((obj, index)=>{
                    return (obj.route ? <Polyline key={index} pathOptions={colorGen()} positions={obj.route}>
                                <Popup>
                                    {obj.title}: {new Date(obj.date).toLocaleString()} <br/>
                                    Distance: {obj.distance} <br/>
                                    Total Time: {obj.total_time} <br />
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