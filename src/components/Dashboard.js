import React, { useEffect, useState } from 'react';
import { Knob } from 'primereact/knob';
import StravaService from '../service/StravaService';
import RaceService from '../service/RaceService';

import RaceCalendar from './RaceCalendar';

import 'primeflex/primeflex.css';
import './Dashboard.css';

function Dashboard() {

    const [events, setEvents] = useState([]);
    const [value8, setValue8] = useState(0);
    
    // TODO: Move this to app.js
    useEffect(() => {
        StravaService._reAuthorize();
        StravaService.getActivities((trainingData) => {
            let result = trainingData.filter(training => training.type === 'Run')
            console.log(result);

            let totalTraining  = result.flatMap(i => i.distance).reduce((preVal, curVal)=>preVal+curVal);
            let x  = totalTraining * 0.000621371192;
            console.log("Total Training: "+x);
            setValue8((x/30) * 100); // training / target miles
        });
        RaceService.getEvents((data) => {
            // TODO: sum all distance and use them as target distance
            // new Date(data[4].date).getMonth()
            let result = data.map((obj, index)=>{
                return {id: obj.race_id, 
                        title: obj.name,
                        start: obj.date,
                        extendedProps: {
                            type: obj.type,
                            distance: obj.distance,
                            zip: obj.zip
                        }
                    };
            });

            // TODO: Get all upcoming races miles

            setEvents(result);
        });
        
    }, []);
    

    return (
        <div>
            <div className='knob'>
                <Knob value={value8} size={200} readOnly/>
            </div>
            <div className='race-calendar'>
                <RaceCalendar events={events} />
            </div>
            
            
        </div>
  
    )
}

export default Dashboard;
