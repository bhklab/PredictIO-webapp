import { lazy } from 'react';
const Home = lazy(() => import('./Home/Home'));
const Explore = lazy(() => import('./IOExplore/Explore'));
const BiomarkerEvaluationRequest = lazy(() => import('./BiomarkerEvaluation/BiomarkerEvaluationRequest'));
const BiomarkerEvaluationResult = lazy(() => import('./BiomarkerEvaluation/BiomarkerEvaluationResult'));
const PredictIO = lazy(() => import('./PredictIO/PredictIO'));
const ForestPlot = lazy(() => import("./Diagram/ForestPlot"));
const Test = lazy(() => import('./Test/Test'));

export {
  Home,
  Explore,
  BiomarkerEvaluationRequest,
  BiomarkerEvaluationResult,
  PredictIO,
  ForestPlot,
  Test
};