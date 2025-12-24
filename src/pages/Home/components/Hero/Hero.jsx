import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>


      <div className={styles.content}>

        
        <div className={styles.text}>
          <h1>
            Empowering Youth<br />
            Changing <span className={styles.highlight}>Lives.</span>
          </h1>
          <p>
            ScholarX helps students and young professionals unlock<br />
            global opportunities
          </p>
          <div className={styles.buttons}>
            <div>
              <Link to="/services" style={{ textDecoration: 'none' }}>
                <button className={styles.btnPrimary}>
                  Explore Services
                  <span className={styles.icon}>→</span>
                </button>
              </Link>
            </div>
            <div>
              <Link  to="/services" style={{ textDecoration: 'none' }}>

              <button className={styles.btnSecondary}>
                Join our Community
                <span className={styles.icon} style={{marginLeft:5}}>→</span>

              </button>
                </Link>
            </div>
          </div>
        </div>

        <div className={styles.image}>
          <div className={styles.imageContainer}>
            <div className={styles.socialProof}>
              <span className={styles.reactions}>Join 10,000 students worldwide</span>
              
              <div className={styles.avatarGroup}>
                <div className={`${styles.avatar} ${styles.avatar1}`}></div>
                <div className={`${styles.avatar} ${styles.avatar2}`}></div>
                <div className={`${styles.avatar} ${styles.avatar3}`}></div>
                <div className={`${styles.avatar} text-danger fs-6`}>1+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
