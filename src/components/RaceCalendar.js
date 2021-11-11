import React, { useState, useEffect } from 'react';
import FullCalendar, { CalendarDataProvider } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

import RaceService from '../service/RaceService';

function RaceCalendar(props) {

    const [displayModal, setDisplayModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [calendar, setCalendar] = useState(null);

    const [raceDate, setRaceDate] = useState(null);
    const [raceName, setRaceName] = useState('');
    const [raceType, setRaceType] = useState(null);
    const [raceDistance, setRaceDistance] = useState(0.0);
    const [raceZip, setRaceZip] = useState('');
    const [raceId, setRaceId] = useState('');

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
        setCalendar(args.view.calendar); 
        resetModal();
        setIsUpdate(false);
        setRaceDate(args.date);
        setDisplayModal(true);
    }

    const handleEventClick =(args) => {
        let info = args.event;
        setCalendar(args.view.calendar); 
        setIsUpdate(true);
        setDisplayModal(true);
        setRaceName(info.title);
        setRaceId(info.id);
        setRaceType(info.extendedProps.type);
        setRaceDate(info.start);
        setRaceDistance(info.extendedProps.distance);
        setRaceZip(info.extendedProps.zip);
    }

    const onHide = () => {
        setDisplayModal(false);
    }

    const addEvent = () => {
    
        RaceService.addEvent({
            "race_id": raceId,
            "date": raceDate,
            "distance": raceDistance,
            "type": raceType,
            "zip": raceZip,
            "name": raceName
        },(data)=>{
            calendar.addEvent({
                id: data.race_id,
                title: data.name,
                start: data.date,
                extendedProps: {
                    type: data.type,
                    distance: data.distance,
                    zip: data.zip
                }
            });
            resetModal(data);
            setDisplayModal(false);
        });
    }

    const updateEvent = () => {
        
        setIsUpdate(false);

        let calEvent = calendar.getEventById(raceId);
        calEvent.setProp('title', raceName);
        calEvent.setStart(raceDate);
        calEvent.setExtendedProp('type', raceType);
        calEvent.setExtendedProp('distance', raceDistance);
        calEvent.setExtendedProp('zip', '20171');

        RaceService.updateEvent({
            "race_id": raceId,
            "date": "2021-11-20T05:00:00.000+00:00",
            "distance": raceDistance,
            "type": raceType,
            "zip": raceZip,
            "name": raceName
        }, () => {
            resetModal();
            setDisplayModal(false);
        });
    }

    const deleteEventFromCalendar = () => {
        RaceService.deleteEvent(raceId, ()=>{
            let calEvent = calendar.getEventById(raceId);
            calEvent.remove();
            setDisplayModal(false);
        })      
    }

    const resetModal = (data) =>{
        let x = data;
        setRaceDistance(0);
        setRaceId('');
        setRaceName('');
        setRaceType('');
        setRaceZip('');
    }

    const renderFooter = () => {
        if(isUpdate){
            return (
                <div>
                    <Button label="Delete" icon="pi pi-times" onClick={deleteEventFromCalendar} className="p-button-danger"/>
                    <Button label="Update" icon="pi pi-check" onClick={updateEvent} autoFocus />
                </div>
            );
        } 
        return (
            <div>
                <Button label="Add" className="p-button-success" icon="pi pi-check" onClick={addEvent} autoFocus />
            </div>
        );
    }

    return (
        <div className="RaceCalendar">
        <div className="content p-p-4">
            <FullCalendar 
            events={props.events} 
            eventDrop = {dropEvt}
            eventClick = {handleEventClick}
            dateClick = {handleDateClick}
            initialView='dayGridMonth' 
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: null }} 
            editable selectable selectMirror dayMaxEvents />

            <form>
                <Dialog header={isUpdate ? "Update Race" : "Add Race"} 
                visible={displayModal} 
                style={{ width: '50vw' }} 
                footer={renderFooter} 
                onHide={onHide}>
                    <label htmlFor="racename">Race Name: </label>
                    <InputText className="racename" value={raceName} onChange={raceNameChangeHandler} />
                    <br />
                    <label htmlFor="time12">Date / Time: </label>
                    <Calendar id="time12" value={raceDate} onChange={raceDateChangeHandler} showTime hourFormat="12" />
                    <br />
                    Type: 
                    <RadioButton name="ocr" value="OCR" onChange={raceTypeChangeHandler} checked={raceType === 'OCR'} />
                    <label htmlFor="ocr">OCR</label>
                    <RadioButton name="road" value="NML" onChange={raceTypeChangeHandler} checked={raceType === 'NML'} />
                    <label htmlFor="road">Road</label>
                    <br />
                    <label htmlFor="distance">Distance:</label>
                    <InputNumber className="racename" value={raceDistance} onValueChange={distanceChangeHandler} suffix=" mi" />
                    <br />
                    <label htmlFor="zip">Zip: </label>
                    <InputText className="racename" value={raceZip} onChange={raceZipChangeHandler} />
                </Dialog>
            </form>
        </div>
        </div>
    );
}

export default RaceCalendar;
