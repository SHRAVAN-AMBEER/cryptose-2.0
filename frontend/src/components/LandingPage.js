"use client";
import React from "react";
import styles from "./LandingPage.module.css";  // ✅ Importing the CSS module

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>CRYPTOSE</h1>
      <p>Your ultimate crypto management platform</p>
      <div>
        <button className={`${styles.button} ${styles.getStarted}`}>Get Started</button>
        <button className={`${styles.button} ${styles.learnMore}`}>Learn More</button>
      </div>
    </div>
  );
};

export default LandingPage;
