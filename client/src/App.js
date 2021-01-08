import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// individual page components
import {
  Home,
  Explore,
  ForestPlot
} from './Components/index';

// styled component
import GlobalStyles from './styles/GlobalStyles';

const App = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
        <Router>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/explore' exact component={ForestPlot} />
            <Route path='/test' exact component={Explore} />
          </Switch>
        </Router>
    </React.Fragment>
  );
};

export default App;
