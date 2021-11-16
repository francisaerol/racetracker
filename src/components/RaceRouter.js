
import Dashboard from './Dashboard';
import TrainingMap from './TrainingMap';


import {
  Switch,
  Route
} from "react-router-dom";

function RaceRouter() {
    return (
      <Switch>
          <Route path="/" exact component={Dashboard}/>
          <Route path="/run-map" component={TrainingMap}/>
      </Switch>
    )
}

export default RaceRouter;
