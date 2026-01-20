import styles from "./StatCard.module.css";

const StatCard = ({ label, value }) => {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
    </div>
  );
};

export default StatCard;
