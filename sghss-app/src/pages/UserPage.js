import React from "react";
import { Routes, Route } from "react-router-dom";
import styles from "./UserPage.module.css";
import UserProfile from "../components/UserProfile";

const UserPage = () => {
  return (
    <div className={styles.user_container}>
      <Routes>
        <Route path="/" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default UserPage;
