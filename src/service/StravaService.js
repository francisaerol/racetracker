import { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } from './auth.json'

const AUTH_LINK = 'https://www.strava.com/oauth/token';
const API_LINK = 'https://www.strava.com/api/v3';

class StravaService {

    static get headers() {
        let headers  = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');    
        return headers;
    }

    static getActivities = (startMonth) =>  {
        let promise = new Promise((resolve, reject) => {
            let startDate = (startMonth ? new Date(startMonth) : new Date());
            startDate.setDate(1);
            startDate.setHours(0,0,0);
         
            let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1,  1);
            
            // Convert to unix epoch
            startDate =  Math.ceil(startDate.getTime() / 1000);
            endDate = Math.ceil(endDate.getTime() / 1000);

            this._reauthorization().then(access_token => {
                fetch(API_LINK + '/athlete/activities?access_token='+access_token+'&after='+startDate+'&before='+endDate, {
                    method: 'GET',
                    headers: this.headers
                })
                .then((response) => response.json())
                .then((data) => resolve(data));
            })
        });
       return promise;
    }

    static _reauthorization = () => {
        let params =  {
            method: 'POST',
            headers:  this.headers,
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token:  REFRESH_TOKEN,
                grant_type: 'refresh_token'
            })
        };
        let promise  = new Promise((resolve, reject) => {
            fetch(AUTH_LINK, params)
            .then(response => response.json())
            .then(data => resolve(data.access_token));
        });
        return promise;
    }
}

export default StravaService;
