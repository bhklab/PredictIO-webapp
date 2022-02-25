import { lazy } from 'react';
const Home = lazy(() => import('./Home/Home'));
const Explore = lazy(() => import('./IOExplore/Explore'));
const BiomarkerEvaluationRequest = lazy(() => import('./BiomarkerEvaluation/BiomarkerEvaluationRequest'));
const BiomarkerEvaluationResult = lazy(() => import('./BiomarkerEvaluation/BiomarkerEvaluationResult'));
const PredictIORequest = lazy(() => import('./PredictIO/PredictIORequest'));
const PredictIOResult = lazy(() => import('./PredictIO/PredictIOResult'));
const Datasets = lazy(() => import('./Datasets/Datasets'));
const Dataset = lazy(() => import('./Dataset/Dataset'));
const About = lazy(() => import('./About/About'));
const Contact = lazy(() => import('./Contact/Contact'));
const Test = lazy(() => import('./Test/Test'));

export {
  Home,
  Explore,
  BiomarkerEvaluationRequest,
  BiomarkerEvaluationResult,
  PredictIORequest,
  PredictIOResult,
  Datasets,
  Dataset,
  About,
  Contact,
  Test
};
