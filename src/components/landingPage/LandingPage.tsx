import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./LandingPage.scss";
import HomePage from "../home/HomePage";
import AboutUs from "../aboutUs/AboutUs";
import DriverLandingPage from "../DriverLandingPage/DriverLandingPage";
import { useAuth } from "../authContext/AuthContext";
function LandingPage() {
  const location = useLocation();
  const { userData } = useAuth();
  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [location]);
  return (
    <main className="landing-container">
      <section id="home">
        {userData?.role === "driver" ? (
          <DriverLandingPage />
        ) : (
          <HomePage />
        )}
      </section>
      <section id="about">
        <AboutUs />
      </section>
    </main>
  );
}

export default LandingPage;