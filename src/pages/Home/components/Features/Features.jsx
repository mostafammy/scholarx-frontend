import React from 'react';
import styles from './Features.module.css';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <section className={styles.features}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2>Welcome to <span className={styles.highlight}>ScholarX</span></h2>
          <p>
            ScholarX is dedicated to empowering students through
            education, mentorship, and community support. We
            believe in breaking down barriers and creating
            opportunities for ambitious learners worldwide
          </p>
          <ul className={styles.list}>
            <li>
              <span className={styles.icon}>✓</span>
              Development Training Program
            </li>
            <li>
              <span className={styles.icon}>✓</span>
              Community Support
            </li>
            <li>
              <span className={styles.icon}>✓</span>
              Resource Library
            </li>
          </ul>
          <Link to="/login" style={{ textDecoration: 'none' }} >
          <button className={styles.btnPrimary}>
            Take the First Step Today!
            <span className={styles.arrow}>→</span>
          </button>
          </Link>
        </div>

        <div className={styles.image}>
          <div className={styles.imageFrame}>
            <img src="home-page/home-feature.jpg" alt="Bosla Scholarship" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
