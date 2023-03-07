import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";

// individual page components
import {
  Home,
  Explore,
  BiomarkerEvaluationRequest,
  BiomarkerEvaluationResult,
  PredictIORequest,
  PredictIOResult,
  DatasetsSignatures,
  AnalysisStatus,
  Dataset,
  About,
  Contact,
  Test,
  Suspension
} from "./Components/index";

// styled component
import GlobalStyles from "./styles/GlobalStyles";

const App = () => {
  // Google Analytics set up
  useEffect(() => {
    ReactGA.initialize("UA-102362625-12");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  return (
    <React.Fragment>
      <GlobalStyles />
      <Router>
        <Switch>
          <Suspense fallback={<Suspension />}>
            <Route path="/" exact component={Home} />
            <Route path="/explore/precomputed" exact component={Explore} />
            <Route
              path="/explore/biomarker/request"
              exact
              component={BiomarkerEvaluationRequest}
            />
            <Route
              path="/explore/biomarker/result/:id"
              exact
              component={BiomarkerEvaluationResult}
            />
            <Route
              path="/predictio/request"
              exact
              component={PredictIORequest}
            />
            <Route
              path="/predictio/result/:id"
              exact
              component={PredictIOResult}
            />
            <Route
              path="/datasets_signatures"
              exact
              component={DatasetsSignatures}
            />
            <Route path="/analysis_status" exact component={AnalysisStatus} />
            <Route path="/dataset/:id" exact component={Dataset} />
            <Route path="/about" exact component={About} />
            <Route path="/contact" exact component={Contact} />
            <Route path="/download" exact component={Home} />
            <Route path="/test" exact component={Test} />
          </Suspense>
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
