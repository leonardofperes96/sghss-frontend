import React, { useState } from "react";
import styles from "./Login.module.css";
import { useUserContext } from "../contexts/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error: loginError, loading } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    await login(data);
    setEmail("");
    setPassword("");
  };


  return (
    <div className={styles.login}>
      <div className={styles.login_container}>
        <div className={styles.login_img}></div>
        <div className={styles.login_form}>
          <h2>SGHSS</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loading ? (
              <button disabled className={styles.form_btn}>
                Loading...
              </button>
            ) : (
              <button className={styles.form_btn}>Entrar</button>
            )}
            {loginError && <p className="error">{loginError}</p>}
          </form>
          <div><p></p></div>
         
        </div>
      </div>
    </div>
  );
};

export default Login;
