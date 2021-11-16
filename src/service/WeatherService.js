import { WEATHER_API_KEY }  from './auth.json';
const URL = 'http://api.openweathermap.org/data/2.5/forecast?';

class WeatherService {
    static getWeather(zipCode){
        let promise = new Promise((resolve, reject) => {
            fetch(URL+'zip='+zipCode+',US&appid='+WEATHER_API_KEY+'&units=imperial')
            .then(response => response.json())
            .then(data => resolve(data));
        });
        return promise;
    }
}

export default WeatherService;