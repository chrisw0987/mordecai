import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "./Components/ScrollToTop";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import BusinessCheck from "./Pages/BusinessCheck";
import Work from "./Pages/Work";
import Contact from "./Pages/Contact";

import "./App.css";

function App() {
  return (
    <>
      <ScrollToTop />

      <Navbar />

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
          path="/contact"
          element={<Contact />}
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
    </>
  );
}

export default App;