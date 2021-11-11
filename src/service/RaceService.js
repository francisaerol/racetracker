import React from 'react';

class RaceService {

    static URL = 'http://localhost:8080/';

    static RACE_URL = 'racetracker/race/';

    static RACES_URL = 'racetracker/races/';

    static get Headers () {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        headers.append('Access-Control-Allow-Origin', RaceService.URL);
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('GET', 'POST', 'DELETE', 'PUT');
        return headers;
    }

    static addEvent = (eventDetails, addCB) =>{
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: RaceService.Headers,
            body: JSON.stringify(eventDetails)
        };
        fetch(RaceService.URL + RaceService.RACE_URL, requestOptions)
        .then(response => response.json())
        .then(data => { addCB(data); });
    }

    static updateEvent = (eventDetails, updateCB) => {
        const requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: RaceService.Headers,
            body: JSON.stringify(eventDetails)
        };
        fetch(RaceService.URL + RaceService.RACE_URL + eventDetails.race_id, requestOptions)
            .then((response)=> {
                updateCB();
            });
    }

    static deleteEvent = (id, deleteCB) => {
        const requestOptions = {
            method: 'DELETE',
            mode: 'cors',
            headers: RaceService.Headers
        };
        fetch(RaceService.URL + RaceService.RACE_URL + id, requestOptions)
            .then((response)=> {
                deleteCB();
            });
    };

    static getEvents = (getCB) =>{
        fetch(RaceService.URL + RaceService.RACES_URL)
        .then(response => response.json())
        .then((data) => { getCB(data); });        
    };
}

export default RaceService;