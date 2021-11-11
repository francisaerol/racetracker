
import RaceCalendar from './RaceCalendar';
import Dashboard from './Dashboard';
import RaceDetails from './RaceDetails';
import {
  Switch,
  Route
} from "react-router-dom";

function RaceRouter() {
    return (
      <Switch>
          <Route path="/" exact component={Dashboard}/>
          <Route path="/page-1" component={RaceDetails}/>
      </Switch>
    )
}

export default RaceRouter;
