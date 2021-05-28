import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// individual page components
import {
  Home,
  Explore,
  BiomarkerEvaluationRequest,
  BiomarkerEvaluationResult,
  Test,
} from './Components/index';

// styled component
import GlobalStyles from './styles/GlobalStyles';

const App = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
        <Router>
          <Switch>
            <Suspense fallback={<div />}>
              <Route path='/' exact component={Home} />
              <Route path='/explore/precomputed' exact component={Explore} />
              <Route path='/explore/biomarker/request' exact component={BiomarkerEvaluationRequest} />
              <Route path='/explore/biomarker/result/:id' exact component={BiomarkerEvaluationResult} />
              <Route path='/test' exact component={Test} />
            </Suspense>
          </Switch>
        </Router>
    </React.Fragment>
  );
};

export default App;
