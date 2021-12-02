import React, { useState, useRef, useEffect } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Knob } from 'primereact/knob';
import { Toast } from 'primereact/toast';

import RaceService from '../service/RaceService';
import WeatherService from '../service/WeatherService';

const usePrevious = (value) =>{
    const ref = useRef();
    useEffect(()=>{
        ref.current = value;
    }, [value]);
    return ref.current;
};

function RaceCalendar(props) {

    const [displayModal, setDisplayModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [calendar, setCalendar] = useState(null);

    const [raceDate, setRaceDate] = useState(null);
    const [raceName, setRaceName] = useState('');
    const [raceType, setRaceType] = useState(null);
    const [raceDistance, setRaceDistance] = useState(0);
    const previousDistance = usePrevious(raceDistance);
    const [raceZip, setRaceZip] = useState('');
    const [raceId, setRaceId] = useState('');
    const [raceLink, setRaceLink] = useState('');
    const [raceWeather, setRaceweather] = useState (0);
    const [raceReady, setReadinness] = useState(0);
    const toast = useRef(null);

    const  raceDateChangeHandler = (event) => {
        setRaceDate(event.value);
    }

    const raceNameChangeHandler = (event) => {
        setRaceName(event.target.value);
    }

    const raceTypeChangeHandler = (event) => {
        setRaceType(event.value);
    }

    const distanceChangeHandler = (event) =>{
        setRaceDistance(event.value);
    }

    const raceZipChangeHandler = (event) =>{
        setRaceZip(event.target.value);
    }

    const raceLinkChangeHandler =  (event) => {
        setRaceLink(event.target.value);
    }

    // TODO: Fix this drag & drop
    const dropEvt = (info) => {
        setDisplayModal(true);
        const { start, end } = info.oldEvent._instance.range;
        console.log(start, end);
        const {
        start: newStart,
        end: newEnd
        } = info.event._instance.range;
        console.log(newStart, newEnd);
        if (new Date(start).getDate() > new Date(newStart).getDate()) {
        info.revert();
        }
    };

    const handleDateClick = (args) => {
        let todaysDate = new Date();
        if (args.date.getTime() < todaysDate.getTime()) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Date is in the past',
                life: 2000
            });
        } else {
            setIsUpdate(false);
            setCalendar(args.view.calendar);
            resetModal();
            setRaceDate(args.date);
            setDisplayModal(true);
        }
    }

    const handleEventClick =(args) => {
        let info = args.event;
        let todaysDate = new Date();
        let eventDate = new Date(info.start);
        if(eventDate.getTime() < todaysDate.getTime()){
            setIsReadOnly(true);
        } else  {
            setIsUpdate(true);
        }

        WeatherService.getWeather(info.extendedProps.zip)
        .then((data) => {
            setRaceweather(data.list[0].main.temp);
            setCalendar(args.view.calendar); 
            setDisplayModal(true);
            setRaceName(info.title);
            setRaceId(info.id);
            setRaceType(info.extendedProps.type);
            setRaceDate(info.start);
            setRaceDistance(info.extendedProps.distance);
            setRaceZip(info.extendedProps.zip);
            setRaceLink(info.extendedProps.race_link);
            computeReadiness(info.extendedProps.distance);
        });
    }

    const onHide = () => {
        setIsReadOnly(false);
        setDisplayModal(false);
    }

    const addEvent = () => {
    
        RaceService.addEvent({
            'race_id': raceId,
            'date': raceDate,
            'distance': raceDistance,
            'type': raceType,
            'zip': raceZip,
            'name': raceName,
            'race_link': raceLink
        },(data)=>{
            calendar.addEvent({
                id: data.race_id,
                title: data.name,
                start: data.date,
                extendedProps: {
                    type: data.type,
                    distance: data.distance,
                    zip: data.zip,
                    race_link: data.race_link
                }
            });
            props.calculateTarget(data.distance);
            resetModal(data);
            setDisplayModal(false);
        });
    }

    const updateEvent = () => {
        
        setIsUpdate(false);

        let calEvent = calendar.getEventById(raceId);
        calEvent.setProp('title', raceName);
        calEvent.setStart(raceDate);
        calEvent.setEnd(raceDate);
        calEvent.setExtendedProp('type', raceType);
        calEvent.setExtendedProp('distance', raceDistance);
        calEvent.setExtendedProp('zip', raceZip);
        calEvent.setExtendedProp('race_link', raceLink);

        if(previousDistance !== raceDistance){
            let newDistance = -Math.abs(previousDistance) + raceDistance;
            props.calculateTarget(newDistance);
        }

        RaceService.updateEvent({
            'race_id': raceId,
            'date': raceDate,
            'distance': raceDistance,
            'type': raceType,
            'zip': raceZip,
            'name': raceName,
            'race_link': raceLink
        }, () => {
            setDisplayModal(false);
        });
    }

    const deleteEventFromCalendar = () => {
        RaceService.deleteEvent(raceId, ()=>{
            let calEvent = calendar.getEventById(raceId);
            calEvent.remove();
            props.calculateTarget(-Math.abs(raceDistance));
            resetModal();
            setDisplayModal(false);
        })      
    }

    const computeReadiness = (distance)=> {
        let totalTraining  =  parseFloat(props.totalTraining);
        let percentage = (totalTraining >= distance) ? 100 :  parseFloat(((totalTraining/distance) * 100).toFixed(2));
        setReadinness(percentage);
    }

    const resetModal = (data) =>{
        setRaceDistance(0);
        setRaceId('');
        setRaceName('');
        setRaceType('');
        setRaceZip('');
        setRaceLink('');
        setRaceweather(0);
        setReadinness(0);

    }

    const openLink = () =>{
        window.open(raceLink, '_blank');
    }

    const renderFooter = () => {
        if(isReadOnly){
            return(
                <div></div>
            );
        }
        if(isUpdate){
            return (
                <div>
                    <Button label='Delete' icon='pi pi-times' onClick={deleteEventFromCalendar} className='p-button-danger'/>
                    <Button label='Update' icon='pi pi-check' onClick={updateEvent} autoFocus />
                </div>
            );
        } 
        return (
            <div>
                <Button label='Add' className='p-button-success' icon='pi pi-check' onClick={addEvent} autoFocus />
            </div>
        );
    }
    
    const renderHeader = () =>{
        let header = 'Add Race';
        if(isReadOnly){
            header = 'Race is Finished';
        } else if (isUpdate) {
            header = 'Update Race';
        } 
        return header;
    }

    return (
        <div className='RaceCalendar'>
        <Toast ref={toast} />
        <div className='content p-p-4'>
            <FullCalendar 
            events={props.events} 
            defaultAllDay={true}
            eventDrop = {dropEvt}
            eventClick = {handleEventClick}
            dateClick = {handleDateClick}
            initialView='dayGridMonth' 
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: null }} 
            editable selectable selectMirror dayMaxEvents />

            <form>
                <Dialog header={renderHeader} 
                visible={displayModal} 
                style={{ width: '50vw' }} 
                footer={renderFooter} 
                onHide={onHide}>
                    <div className="p-grid">
                        <div className="p-col">
                            <label htmlFor='racename'>Race Name: </label>
                            <InputText className='racename' value={raceName} onChange={raceNameChangeHandler} disabled={isReadOnly}/>
                            <br />
                            <label htmlFor='time12'>Date / Time: </label>
                            <Calendar id='time12' value={raceDate} onChange={raceDateChangeHandler} disabled={isReadOnly} showTime hourFormat='12' />
                            <br />
                            Type: 
                            <RadioButton name='ocr' value='OCR' onChange={raceTypeChangeHandler} disabled={isReadOnly} checked={raceType === 'OCR'} />
                            <label htmlFor='ocr'>OCR</label>
                            <RadioButton name='road' value='NML' onChange={raceTypeChangeHandler} disabled={isReadOnly} checked={raceType === 'NML'} />
                            <label htmlFor='road'>Road</label>
                            <br />
                            <label htmlFor='distance'>Distance:</label>
                            <InputNumber mode="decimal" className='racename' value={raceDistance} disabled={isReadOnly} onValueChange={distanceChangeHandler} suffix=' mi' />
                            <br />
                            <label htmlFor='zip'>Zip: </label>
                            <InputText className='racename' value={raceZip} disabled={isReadOnly} onChange={raceZipChangeHandler} />
                            <h3><b>Weather:</b>{raceWeather}</h3>
                            <br />
                            <label htmlFor='raceLink'>Link: </label>
                            <InputText className='raceLink' value={raceLink}  disabled={isReadOnly} onChange={raceLinkChangeHandler} />
                            {raceLink  && raceLink.length > 1 ? <Button icon='pi pi-globe' onClick={openLink} className='p-button-rounded p-button-info p-button-outlined' /> :null}
                        </div>
                        <div className="p-col">
                            <Knob value={raceReady} suffix=' %' readyOnly/>
                        </div>
                    </div>
                   </Dialog>
            </form>
        </div>
        </div>
    );
}

export default RaceCalendar;
