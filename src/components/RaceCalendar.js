import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

function RaceCalendar() {

  const [events, setEvents] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);

  const dropEvt = (info) => {
    setDisplayModal(true);
    const { start, end } = info.oldEvent._instance.range;
    console.log(start, end);
    const {
      start: newStart,
      end: newEnd
    } = info.event._instance.range;
    console.log(newStart, newEnd);
    if (new Date(start).getDate() === new Date(newStart).getDate()) {
      info.revert();
    }
  };

  const handleDateClick =(arg) => {
    setDisplayModal(true);
  }

const onHide = () => {
  setDisplayModal(false);
}
const renderFooter = () => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={onHide} autoFocus />
                <Button label="Delete" icon="pi pi-times" onClick={onHide} className="p-button-danger"/>
            </div>
        );
    }

  useEffect(() => {

    fetch('http://localhost:8080/racetracker/races')
      .then(response => response.json())
      .then((data) => {
          let result = data.map((obj, index)=>{
            return {id: obj.race_id, 
                  title: obj.type,
                  start: obj.date};
          });
          setEvents(result);
      });
  }, []);

  

  return (
    <div className="RaceCalendar">
      <div class="content p-p-4">
        <FullCalendar 
        events={events} 
        eventDrop = {dropEvt}
        eventClick = {handleDateClick}
        initialView='dayGridMonth' 
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: null }} 
        editable selectable selectMirror dayMaxEvents />

        <Dialog header="Race Card" 
          visible={displayModal} 
          style={{ width: '50vw' }} 
          footer={renderFooter} 
          onHide={onHide}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim </p>
        </Dialog>
      </div>
    </div>
  );
}

export default RaceCalendar;
