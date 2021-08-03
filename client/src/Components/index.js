import { lazy } from 'react';
const Home = lazy(() => import('./Home/Home'));
const Explore = lazy(() => import('./IOExplore/Explore'));
const BiomarkerEvaluationRequest = lazy(() => import('./BiomarkerEvaluation/BiomarkerEvaluationRequest'));
const BiomarkerEvaluationResult = lazy(() => import('./BiomarkerEvaluation/BiomarkerEvaluationResult'));
const PredictIO = lazy(() => import('./PredictIO/PredictIO'));
const Download = lazy(() => import('./Download/Download'));
const About = lazy(() => import('./About/About'));
const Test = lazy(() => import('./Test/Test'));

export {
  Home,
  Explore,
  BiomarkerEvaluationRequest,
  BiomarkerEvaluationResult,
  PredictIO,
  Download,
  About,
  Test
};
