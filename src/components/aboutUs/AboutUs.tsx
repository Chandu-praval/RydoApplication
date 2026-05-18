import React from "react";
import "./AboutUs.scss";

const AboutUs: React.FC = () => {
  return (
    <div className="about-page mx-3 py-5 ">
      <div className="text-center mb-5  ">
        <h1 className="fw-bold">About Our Ride Booking App</h1>
        <p className="lead text-muted">
          Fast, reliable, and affordable rides at your fingertips.
        </p>
      </div>
      <section className="mb-5 mx-2">
        <h2 className="section-title">Our Mission</h2>
        <p className="mission-content">
          Our mission is to make transportation seamless and accessible for everyone.
          Whether you're commuting daily or traveling occasionally, we provide
          safe, quick, and comfortable rides with just a few taps.
        </p>
      </section>
      <section className="mb-5 mx-2">
        <h2 className="section-title mb-4">Why Choose Us?</h2>
        <div className="row g-4">
          
          <div className="col-md-4">
            <div className="feature-card">
              <h5> Easy Booking</h5>
              <p>Book rides instantly with a simple interface.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <h5> Affordable Pricing</h5>
              <p>Transparent pricing with no hidden charges.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card">
              <h5> Safety First</h5>
              <p>Verified drivers and real-time tracking for safety.</p>
            </div>
          </div>

        </div>
      </section>
     
    </div>
  );
};

export default AboutUs;