import React from 'react';
import './Aboutus.css'; // Assuming you have a CSS file for styling

const Aboutus = () => {
  return (
    <div className="abs-about-us-container">

      <section className="abs-about-us-intro">
        <h2>Our Story</h2>
        <p className='aus-phara'>
        Welcome to Cinex, Sri Lanka's premier movie booking platform! Founded by our visionary CEO, John Doe, 
        and powered by the technical expertise of our CTO, Jane Smith, Cinex brings the magic of cinema to your fingertips.
        Our Marketing Lead, Peter Jones, ensures that movie lovers across the country stay connected with the latest releases,
        exclusive events, and exciting promotions. Inspired by global leaders like BookMyShow, Cinex is designed to offer a 
        seamless and convenient movie booking experience, making it easier than ever for you to catch the latest blockbusters 
        at your favorite cinemas. Join us on this cinematic journey and make every movie night unforgettable with Cinex!
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

export default Aboutus;