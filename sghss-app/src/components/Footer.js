import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}
    style={{backgroundColor: "#2c7be5"}}
    >
      <div className={styles.footer_container}>
        <p>
          2023 <span>Reactgram</span> All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
