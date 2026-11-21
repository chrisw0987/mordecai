import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "./Components/ScrollToTop";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollReveal from "./Components/ScrollReveal";
import DashboardSkeleton from "./Components/DashboardSkeleton";

import Home from "./Pages/Home";
import BusinessCheck from "./Pages/BusinessCheck";
import Work from "./Pages/Work";
import Pricing from "./Pages/Pricing";
import Contact from "./Pages/Contact";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";

import "./App.css";

const DashboardAccess = lazy(() => import("./Pages/DashboardAccess"));

function App() {
  const { pathname } = useLocation();

  if (pathname.replace(/\/+$/, "").toLowerCase() === "/dashboard") {
    return (
      <Suspense fallback={<DashboardSkeleton />}>
        <ScrollReveal
          selector="h1, h2, main > p, main > button, main > div > p, main > div > div > button, dl > div, [aria-label='Dashboard views'] button, main > div > div > span, thead, tbody > tr, form > fieldset"
          stagger
          observeChanges
        >
          <div className="dashboard-reveal"><DashboardAccess /></div>
        </ScrollReveal>
      </Suspense>
    );
  }
  return (
    <>
      <ScrollToTop />

      <Navbar />

      <ScrollReveal key={pathname}>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/business-check"
            element={<BusinessCheck />}
          />

          <Route
            path="/work"
            element={<Work />}
          />

          <Route
            path="/pricing"
            element={<Pricing />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/terms"
            element={<Terms />}
          />

          <Route
            path="/privacy"
            element={<Privacy />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
        <Footer />
      </ScrollReveal>
    </>
  );
}

export default App;