import React from "react";
import styles from "./ErrorPage.module.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className={styles.error_container}>
      <h1>Ooops</h1>
      <h2>404 - page not found</h2>
      <p>The page you are looking might have been removed or doesnt exists</p>
      <Link to="/" className={styles.error_link}>
        Go to homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
