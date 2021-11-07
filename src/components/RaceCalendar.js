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

function RaceCalendar() {

    const [events, setEvents] = useState([]);
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

        //TODO: move to a DB Layer
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        headers.append('Access-Control-Allow-Origin', 'http://localhost:8080');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('GET', 'POST', 'OPTIONS', 'PUT');
        
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify({
                "race_id": raceId,
                "date": raceDate,
                "distance": raceDistance,
                "type": raceType,
                "zip": raceZip,
                "name": raceName
            })
        };
        fetch('http://localhost:8080/racetracker/race/', requestOptions)
        .then(response => response.json())
        .then(data => {
                addEventToCalendar(data);
                resetModal(data);
                setDisplayModal(false);
            });
    }

    const addEventToCalendar = (data) => {
        let event = {
            id: data.race_id,
            title: data.name,
            start: data.date,
            extendedProps: {
                type: data.type,
                distance: data.distance,
                zip: data.zip
            }
        }

        calendar.addEvent(event);
    }

    const updateEvent = () => {
        
        setIsUpdate(false);

        let calEvent = calendar.getEventById(raceId);
        calEvent.setProp('title', raceName);
        calEvent.setStart(raceDate);
        calEvent.setExtendedProp('type', raceType);
        calEvent.setExtendedProp('distance', raceDistance);
        calEvent.setExtendedProp('zip', '20171');

        //TODO: move to a DB Layer
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
    
        headers.append('Access-Control-Allow-Origin', 'http://localhost:8080');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('GET', 'POST', 'OPTIONS', 'PUT');
        
        const requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify({
                "race_id": raceId,
                "date": "2021-11-20T05:00:00.000+00:00",
                "distance": raceDistance,
                "type": raceType,
                "zip": raceZip,
                "name": raceName
            })
        };
        fetch('http://localhost:8080/racetracker/race/'+raceId, requestOptions)
            .then((response)=> {
                resetModal(response);
                setDisplayModal(false);
            });
    }

    const deleteEvent =  (event) =>{
        const requestOptions = {
            method: 'DELETE',
            mode: 'cors'
        };
        fetch('http://localhost:8080/racetracker/race/'+raceId, requestOptions)
            .then((response)=> {
                deleteEventFromCalendar(raceId);
                setDisplayModal(false);
            });
    }

    const deleteEventFromCalendar = (id) => {
        let calEvent = calendar.getEventById(id);
        calEvent.remove();
    }

    const resetModal = (data) =>{
        let x = data;
        setRaceDistance(0);
        setRaceId('');
        setRaceName('');
        setRaceType('');
        setRaceZip('');
    }

    useEffect(() => {

        // TODO: move to DB Layer

        fetch('http://localhost:8080/racetracker/races')
        .then(response => response.json())
        .then((data) => {
            let result = data.map((obj, index)=>{
                return {id: obj.race_id, 
                    title: obj.name,
                    start: obj.date,
                    extendedProps: {
                        type: obj.type,
                        distance: obj.distance,
                        zip: obj.zip
                    }};
            });
            setEvents(result);
        });
    }, []);

    const renderFooter = () => {
        if(isUpdate){
            return (
                <div>
                    <Button label="Delete" icon="pi pi-times" onClick={deleteEvent} className="p-button-danger"/>
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
            events={events} 
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
