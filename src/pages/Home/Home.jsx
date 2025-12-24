import React from 'react';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Services from './components/Services/Services';
import waterMark from "../../assets/Images/WaterMark.png"
import waterMark2 from "../../assets/Images/image.png"
import Impact from './components/Impact/Impact';
import { GrGroup } from "react-icons/gr";  
import { TfiWorld } from "react-icons/tfi";  

import { PiBookOpenTextThin } from "react-icons/pi";
import { VscBriefcase } from "react-icons/vsc";
import './Home.css';

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Services
       clas="bacground"
        waterMark={waterMark}
         title="Why Choose"
          titleBlue="ScholarX?"
          paragraf="We're dedicated to making education accessible and providing the resources students need to succeed globally." 
          head1="Scholarship Research "
          head2="Mentorship" 
          head3="Opportunities" 
          text1="Access curated local and international scholarships"
          clasOrage="orange" 
          icon1={<TfiWorld />}
          icon2={<GrGroup />}
          icon3={<TfiWorld />} 
          />
         <Services
       clas="bacground2"
        waterMark={waterMark2}
         title="Who We "
          titleBlue="Help?"
          paragraf="We support students at every stage of their educational journey, providing tailored resources for their specific needs." 
          head1="High School Students "
          head2="University Students" 
          head3="Recent Graduates" 
          text1="Discover scholarships and prepare for university applications early."
          text2="Access mentorship, internships, and study-abroad opportunities."
          text3="Find career guidance, advanced degrees, and professional development."
          clasOrage="black" 
          icon1={<PiBookOpenTextThin />}
          icon2={<GrGroup />}
          icon3={<VscBriefcase />} />
         <Impact  waterMark={waterMark}/>
    </>
  );
}

export default Home;
