import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// individual page components
import {
  Home,
  GeneSignatureRequest,
  Test,
  GeneSignatureResult
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
            <Route path='/explore/signature/request' exact component={GeneSignatureRequest} />
            <Route path='/explore/signature/result/:id' exact component={GeneSignatureResult} />
            <Route path='/test' exact component={Test} />
          </Switch>
        </Router>
    </React.Fragment>
  );
};

export default App;
