import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// individual page components
import {
  Home,
  Explore,
  BiomarkerEvaluationRequest,
  BiomarkerEvaluationResult,
  PredictIO,
  Datasets,
  About,
  Contact,
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
              <Route path='/predict/main' exact component={PredictIO} />
              <Route path='/datasets' exact component={Datasets} />
              <Route path='/about' exact component={About} />
              <Route path='/contact' exact component={Contact} />
              <Route path='/download' exact component={Home} />
              <Route path='/test' exact component={Test} />
            </Suspense>
          </Switch>
        </Router>
    </React.Fragment>
  );
};

export default App;
