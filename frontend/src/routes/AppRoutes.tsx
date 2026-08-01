/**
 * Centralized route configuration for the application.
 *
 * All pages are lazy-loaded to keep the initial JS bundle small.
 * This is the single place that maps URL paths to page components —
 * no other module should define <Route> elements.
 */

import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "@/components/common/PageLoader";
import { AppLayout } from "@/components/layout/AppLayout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const PredictionPage = lazy(() => import("@/pages/PredictionPage"));
const DatasetInfoPage = lazy(() => import("@/pages/DatasetInfoPage"));
const ModelInfoPage = lazy(() => import("@/pages/ModelInfoPage"));
const ModelComparisonPage = lazy(() => import("@/pages/ModelComparisonPage"));
const AboutTeamPage = lazy(() => import("@/pages/AboutTeamPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

/**
 * Application route tree, wrapped in the shared `AppLayout` (nav,
 * footer, background effects) and a `Suspense` boundary that shows
 * `PageLoader` while a lazy page chunk is being fetched.
 */
export function AppRoutes(): JSX.Element {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/predict" element={<PredictionPage />} />
          <Route path="/dataset" element={<DatasetInfoPage />} />
          <Route path="/model-info" element={<ModelInfoPage />} />
          <Route path="/model-comparison" element={<ModelComparisonPage />} />
          <Route path="/about" element={<AboutTeamPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
