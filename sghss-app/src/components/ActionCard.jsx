import { useNavigate } from "react-router-dom";
import styles from "./ActionCard.module.css";

const ActionCard = ({ label, route }) => {
  const navigate = useNavigate();

  return (
    <button
      className={styles.card}
      onClick={() => navigate(route)}
      type="button"
    >
      <span>{label}</span>
    </button>
  );
};

export default ActionCard;
