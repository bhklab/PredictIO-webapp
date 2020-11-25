import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// individual page components
import {
  Home
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
          </Switch>
        </Router>
    </React.Fragment>
  );
};

export default App;