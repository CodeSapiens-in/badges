"use client";

// This components shows one individual badge
// It receives data from src/app/badge/[id]/page.jsx

import { React } from "react";

import styles from "./Badge.module.css";


export default function Badge({
  badgeId,
  badge
}) {
  console.log('badgeid',badgeId)
  console.log(badge)
  return (
    <div className={styles.badgeContainer}>
      <div className={styles.heading}>
        <span className={styles.username}>{badge.user}</span> was awarded this badge on {badge.assignedon}.
        <br />
        The unique Badge ID is <span className={styles.badgeId}>{badgeId}</span>.
      </div>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img src={badge.image} alt="Badge" className={styles.badgeImage} />
        </div>
        <div className={styles.descriptionContainer}>
          <h2 className={styles.title}>{badge.name}</h2>
          <p className={styles.description}>{badge.description}</p>
        </div>
      </div>
    </div>
  );
}
