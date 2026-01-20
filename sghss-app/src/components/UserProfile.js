import React from "react";
import { useUserContext } from "../contexts/UserContext";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const { data: user, logout } = useUserContext();

  if (!user) return null;
  console.log(user);

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Perfil do Usuário</h2>

        <div className={styles.info}>
          <p>
            <strong>Nome:</strong> {user.displayName || "Não informado"}
          </p>
          <p>
            <strong>E-mail:</strong> {user.email}
          </p>
        </div>

        <button
          className={styles.logoutButton}
          onClick={logout}
        >
          Sair do sistema
        </button>
      </div>
    </section>
  );
};

export default UserProfile;
