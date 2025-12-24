import React from 'react';
import './About.css';

const About = () => {

  return (
    <>
      <div className="about-wrapper">
        <div className="about-bg-deco"></div>
        <div className="about-white-arc"></div>
        <div className="about-page">
          <section className="about-header">
            <h1 className='aboutuslabel'>About Us</h1>
            <h1 className='storybehind'>The Story Behind ScholarX</h1>
            <div className="gallery">
              <img src="/Img 1.png" alt="ScholarX event 1" />
              <img src="/Img 2.png" alt="ScholarX event 2" />
              <img src="/Img 3.png" alt="ScholarX event 3" />
            </div>
          </section>

          <div className="content-sections">
            <section className="content-row">
              <div className="text-block">
                <p className='mission'>Our Mission</p>
                <h2 className='subhead'>Empowering Youth, Creating Opportunities</h2>
                <p  className='info'>
                ScholarX was founded with a clear vision—to bridge the gap between ambition and
                opportunity. Our mission is to empower students and young professionals with the
                resources, mentorship, and guidance needed to secure scholarships and
                educational opportunities worldwide. We believe that every student deserves a fair
                chance at accessing quality education, and we work tirelessly to make that a reality.
                Our approach is holistic, ensuring that students receive not only scholarship
                guidance but also essential skills that will serve them throughout their careers.
                <br/><br/>
                Through a combination of training programs, awareness events, and structured skills
                development initiatives, ScholarX ensures that young people are not left behind in
                the race for global opportunities. By collaborating with top institutions and forming
                strategic alliances, we create a sustainable network that continuously supports
                students in their educational journeys.
                </p>   
              </div>
              <div className="image-block">
                <img src="/Imgstud.png" alt="Students collaborating" width="570" height="434" className='alignimg' />
              </div>
            </section>

            <section className="content-row reversed">
              <div className="image-block" style={{ textAlign: 'center' }} >
                <img src="/Img (1)founder.png" alt="Founder's journey" width="583" height="371"className='alignimgleft' />
                <p className='centertestimg' ><br></br>Meet Asaf Nady – The Visionary Behind ScholarX</p>
              </div>
              <div className="text-block">
                <p className='mission'>The Founder's Journey</p>
                <h2 className='subhead'> From Rejection to Revolution</h2>
                <p className='info'>
                ScholarX was born out of a personal challenge faced by our founder, Asaf Nady.
                Growing up in rural Upper Egypt, Asaf had big dreams but limited resources. At
                the age of 16, he applied for Egypt s prestigious STEM high school program—but
                was rejected.
                <br/><br/>
                That moment could have been the end of his dreams, but instead, it became
                the spark that ignited his lifelong mission. Instead of giving up, Asaf turned his
                setback into motivation, realizing that thousands of students face similar
                challenges due to lack of awareness, guidance, and support. He committed
                himself to learning about educational opportunities worldwide, developing
                strategies to secure scholarships, and helping others along the way.
                </p>
              </div>
            </section>

            <section className="content-row">
              <div className="text-block">
                <p  className='info'>
                Determined to change the narrative, Asaf embarked on an extensive journey of
                self education and networking. He began reaching out to mentors, joining
                scholarship programs, and attending leadership training sessions. He
                participated in numerous global programs, including the SUSI Economic
                Empowerment Program in USA and the Ashoka Changemakers Initiative, where
                he gained firsthand experience in leadership, economic development, and
                educational equity.
                <br/><br/>
                During this transformative period, Asaf began mentoring other students in his
                community, sharing insights on how to apply for scholarships, craft compelling
                applications, and develop essential skills. Seeing the impact of his guidance, he
                realized that many talented students simply lacked the right support system.
                This realization drove him to create ScholarX in 2022, a platform that would
                offer structured trainings, skill building workshops, and a network of global
                opportunities.
                </p>
              </div>
              <div className="image-block">
                <img src="/Img (2)founder.png" alt="Harvard campus" width="583" height="371" className='alignimg' />
              </div>
            </section>

            <section className="content-row reversed">
              <div className="image-block">
                <img src="/Img (3)founder.png" alt="Founder's journey" width="583" height="371" className='alignimgleft'  />
              </div>
              <div className="text-block">
                <p  className='info'>
                What started as a small initiative helping a handful of students has now grown
                into a nationwide movement, impacting thousands across Egypt. ScholarX has
                evolved into a comprehensive educational ecosystem, offering specialized
                training programs, international networking events, mentorship circles, and
                guidance in securing scholarships and internships.
                <br/><br/>
                Asaf s vision extends beyond Egypt—he aims to expand ScholarX globally,
                ensuring that students from underprivileged backgrounds worldwide receive
                the support they need to pursue their educational and professional dreams. His
                ultimate goal is to build a sustainable educational platform that connects
                students with mentors, funding opportunities, and skill enhancing experiences,
                enabling them to thrive in a competitive global landscape
                </p>
              
              </div>
            </section>
            <section className="impact-section">
                <h2 className="impact-title">Our Impact</h2>
                <div className="impact-underline"></div>
                
                <div className="impact-grid">
                  <div className="impact-item">
                    <div className="impact-icon">
                    <img src="/Icon.png" alt="Training students" className='iconsize' />
                    </div>
                    <h3>Trained thousands of <br></br> students</h3>
                    <p className='impacttext'>On scholarship applications, leadership skills, and personal development</p>
                  </div>

                  <div className="impact-item">
                    <div className="impact-icon">
                    <img src="/Icon (1).png" alt="Partnerships" className='iconsize' />
                    </div>
                    <h3>Secured partnerships</h3>
                    <p className='impacttext'>With global institutions like the U.S. Department of State, U.S. Embassy in Cairo, Ashoka, Schneider Electric, and Aspire Institute (Harvard-founded)</p>
                  </div>

                  <div className="impact-item">
                    <div className="impact-icon">
                    <img src="/Icon (2).png" alt="Helping students"  className='iconsize'  />
                    </div>
                    <h3>Helped students</h3>
                    <p className='impacttext'>Access international scholarships, exchange programs, and career-changing opportunities</p>
                  </div>
                  <div className='iconscenter'>
                  <div className="impact-item">
                    <div className="impact-icon">
                    <img src="/Icon (3).png" alt="Built a strong network"  className='iconsize'  />
                    </div>
                    <h3>Built a strong<br></br> network</h3>
                    <p className='impacttext'>Of alumni and mentors, who continue to support
                    the next generation of students</p>
                  </div>

                  <div className="impact-item">
                    <div className="impact-icon">
                    <img src="/Icon (4).png" alt="Conducted awareness campaigns"  className='iconsize'  />
                    </div>
                    <h3>Conducted awareness<br></br> campaigns</h3>
                    <p className='impacttext'>Across schools and universities, reaching
                      students who otherwise wouldn t have known
                      about available opportunities</p>
                  </div>
                  </div>
                </div>
              </section>
              <section className="vision-section">
              <div className="vision-wrapper">
                <div className="vision-image">
                  <img src="/Groupvision.png" alt="Vision Image" className="vision-image"/>
                </div>
                <p className="vision-text">
                  To make global opportunities accessible to every student,
                  regardless of background or circumstances. We envision a
                  world where educational equity is a reality, where students
                  from all socioeconomic backgrounds can aspire to and
                  achieve academic excellence.
                </p>
                </div>
              <div className="vision-underline"></div>
            </section>


            </div>
          </div>
        </div>
    </>
  );
};

export default About;