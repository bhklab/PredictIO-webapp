import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';

// individual page components
import {
  Home,
  Explore,
  BiomarkerEvaluationRequest,
  BiomarkerEvaluationResult,
  PredictIORequest,
  PredictIOResult,
  DatasetsSignatures,
  Dataset,
  About,
  Contact,
  Test,
} from './Components/index';

// styled component
import GlobalStyles from './styles/GlobalStyles';

const App = () => {
    // Google Analytics set up
	useEffect(() => {
		ReactGA.initialize('G-NKMP8P3WXW')
		ReactGA.pageview(window.location.pathname + window.location.search)
	}, []);
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
              <Route path='/predictio/request' exact component={PredictIORequest} />
              <Route path='/predictio/result/:id' exact component={PredictIOResult} />
              <Route path='/datasets_signatures' exact component={DatasetsSignatures} />
              <Route path='/dataset/:id' exact component={Dataset} />
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
