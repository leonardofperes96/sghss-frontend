import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.css";
import { useUserContext } from "../contexts/UserContext";
import { FaHospital } from "react-icons/fa";

const Navigation = () => {
  const { data } = useUserContext();

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>

       
        {data && (
          <NavLink className={styles.header_logo} to="/">
            <FaHospital />
          </NavLink>
        )}

        <nav className={styles.nav}>
          <ul className={styles.nav_list}>

           
            {!data && (
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.nav_link
                  }
                  to="/login"
                >
                  Login
                </NavLink>
              </li>
            )}

            
            {data && (
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.nav_link
                  }
                  to="/perfil"
                >
                  User
                </NavLink>
              </li>
            )}

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
