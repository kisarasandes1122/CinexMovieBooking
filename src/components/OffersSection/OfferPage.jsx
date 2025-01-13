import React from 'react';
import './OfferPage.css';

function Offerspage() {
  const offers = [
    {
      id: 1,
      title: 'BUY ONE GET ONE FREE ON MOVIE TICKETS',
      subtitle: 'AT ALL SCOPE CINEMAS THEATRES FOR BOC CREDITCARD HOLDERS.',
      description: 'Buy 1 Get 1 on movie tickets - BOC  Credit Card (Master and Visa)',
      imageUrl: 'deal1.png',
      moreInfoLink: '#',
    },
    {
      id: 2,
      title: 'BUY ONE GET ONE FREE ON MOVIE TICKETS',
      subtitle: 'AT ALL SCOPE CINEMAS THEATRES',
      description: 'Offer Valid from 20th December to 20th January 2025\nAvailable Exclusively For DFCC Pinnacle Credit Card (Master and Visa)\nFor Only Website Purchases.',
      imageUrl: 'deal2.png',
      moreInfoLink: '#',
    },
    {
      id: 3,
      title: 'BUY ONE GET ONE FREE ON MOVIE TICKETS',
      subtitle: 'AT SELECTED SCOPE CINEMAS THEATRES',
      description: 'Offer Valid from 10th January to 28th February 2025\nAvailable Exclusively For HSBC Live+\nFor Website & Over-the-Counter Purchases',
      imageUrl: 'deal3.png',
      moreInfoLink: '#',
    },
  ];

  return (
    <div className="offers-page">
      <h1>Offers and Deals</h1>
      <div className="offers-list">
        {offers.map(offer => (
          <div key={offer.id} className="offer-item">
            <div className="offer-text">
              <h3>{offer.title}</h3>
              {offer.subtitle && <p className="offer-subtitle">{offer.subtitle}</p>}
              <p className="offer-description">{offer.description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}</p>
            </div>
            <div className="offer-image-container">
              <img src={'./src/assets/deal1.png'} alt={offer.title} className="offer-image" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Offerspage;