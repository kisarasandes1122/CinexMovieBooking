import React from 'react';
import './ContactUs.css'; // Assuming you have a CSS file for styling

const AboutUs = () => {
  return (
    <div className="abs-about-us-container">

      <section className="abs-about-us-intro">
        <h2>Our Story</h2>
        <p>
          We are a team of passionate individuals dedicated to [Your Company's Mission or Purpose].
          We believe in [Your Core Values or Principles] and strive to [Your Vision or Goal].
        </p>
        <p>
            Founded in [Year] by [Founder Name/Names], we started with the idea of...
        </p>
      </section>

      <section className="abs-bout-us-team">
        <div className="abs-team-members">
          {/* Example Team Member - you can map through an array of team data */}
          <div className="abs-team-member">
            <img src="/images/team-member1.jpg" alt="abs-Team Member 1" className="abs-team-member-image" />
            <h3>John Doe</h3>
            <p>CEO</p>
             <p>A brief description of John's expertise and experience.</p>
          </div>
          <div className="abs-team-member">
          <img src="/images/team-member1.jpg" alt="abs-Team Member 1" className="abs-team-member-image" />
            <h3>Jane Smith</h3>
            <p>CTO</p>
            <p>A brief description of Jane's expertise and experience.</p>
          </div>

           <div className="abs-team-member">
           <img src="/images/team-member1.jpg" alt="abs-Team Member 1" className="abs-team-member-image" />
            <h3>Peter Jones</h3>
            <p>Marketing Lead</p>
             <p>A brief description of Peter's expertise and experience.</p>
          </div>


          {/* Add more team member components here */}
        </div>
      </section>

    </div>
  );
};

export default AboutUs;