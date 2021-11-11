import { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, ACCESS_TOKEN } from './auth.json'

const AUTH_LINK = "https://www.strava.com/oauth/token";
const API_LINK = 'https://www.strava.com/api/v3';
// TODO: Have this  in a config file that will be read


class StravaService {

    static _accessToken = ACCESS_TOKEN;

    static getActivities= (getCB) =>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let params = {
            access_token: this._accessToken,
            after: '1633825925'
        }
      //"c754832d527328066c71918bbb6104de5ea7b0ce"
        fetch(API_LINK + '/athlete/activities?'+'access_token=c754832d527328066c71918bbb6104de5ea7b0ce&after=1633825925', {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((data) => {
                getCB(data);
            })
    };

    static _reAuthorize = () => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(AUTH_LINK, {
            method: 'POST',
            headers:  headers,
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token:  REFRESH_TOKEN,
                grant_type: 'refresh_token'
            })
        }).then((response) => response.json())
        .then((data) => {
            this._accessToken = data.access_token;
            console.dir(data);
            console.log('reauthorized');
        });
    }
}


export default StravaService;
