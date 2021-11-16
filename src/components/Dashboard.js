import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import StravaService from '../service/StravaService';
import RaceService from '../service/RaceService';

import RaceCalendar from './RaceCalendar';

import 'primeflex/primeflex.css';
import './Dashboard.css';

function Dashboard() {

    const [events, setEvents] = useState([]);
    const [progress, setProgress] = useState(0);
    const [totalTraining, setTotalTraining] = useState(0);
    const [targetDistance, setTargetDistance]  = useState(0);

    const calculateDashboard = (target) => {
        StravaService.getActivities((trainingData) => {
    
            let trainings  = trainingData.filter(training => training.type === 'Run')
                                    .flatMap(i => i.distance)
                                    .reduce((prevVal, curVal) => prevVal + curVal);

            let convertedValue = (trainings * 0.000621371192).toFixed(2);
            let percentage  = ((convertedValue/target) * 100).toFixed(2);
        
            setTotalTraining(convertedValue);
            setProgress(percentage);
        });
    }

    const calculateTargetDistance = (newTarget) => {
        let target = targetDistance + newTarget;
        setTargetDistance(target);
        calculateDashboard(target);
    }

    useEffect(() => {
        
        RaceService.getEvents((races) => {
            let todaysDate = new Date();

            let target = races.filter(race => new Date(race.date).getDate() > todaysDate.getDate() 
                                        && new Date(race.date).getMonth() >= todaysDate.getMonth())
                                        .flatMap(i => i.distance)
                                        .reduce((prevVal, curVal) => prevVal + curVal);

            setTargetDistance(target);
            calculateDashboard(target);
            
            let result = races.map((obj, index)=>{
                return {id: obj.race_id, 
                        title: obj.name,
                        start: obj.date,
                        extendedProps: {
                            type: obj.type,
                            distance: obj.distance,
                            zip: obj.zip,
                            race_link: obj.race_link
                        }
                    };
            });

            setEvents(result);
        });
        
    }, []);
    

    return (
        <div className='dashboard p-d-flex'>
            <div className='progress-bar p-mr-2'>
                <b>Race ready percentage:</b>
                <ProgressBar value={progress} />
                <b>Total runs this month:</b> {totalTraining} Miles
                <br />
                <b>Target Distance:</b> {targetDistance} Miles
            </div>
            <div className='race-calendar p-mr-2'>
                <RaceCalendar events={events} calculateTarget={calculateTargetDistance}/>
            </div>
        </div>
    )
}

export default Dashboard;
