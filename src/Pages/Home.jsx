import React from 'react'
import Home from '../components/Home/Home';
import Homecomingsoon from '../components/Home/Homecomingsoon';
import Homenowshowing from '../components/Home/Homenewshowing';


const Home1 = () => {
  return (
    <div>
      <Home/>
      <Homenowshowing/>
      <Homecomingsoon/>
    </div>
  )
}

export default Home1;
