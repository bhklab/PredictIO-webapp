import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// individual page components
import {
  Home,
  Predict,
  Test
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
            <Route path='/predict' exact component={Predict} />
            <Route path='/test' exact component={Test} />
          </Switch>
        </Router>
    </React.Fragment>
  );
};

export default App;
