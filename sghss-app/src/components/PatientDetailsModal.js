import React from "react";
import styles from "./PatientDetailsModal.module.css";

const PatientDetailsModal = ({ patient, onClose, onEdit }) => {
  if (!patient) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h3>Detalhes do paciente</h3>
          
        </header>

        <section className={styles.content}>
          <div>
            <strong>Nome</strong>
            <p>{patient.name}</p>
          </div>

          <div>
            <strong>Idade</strong>
            <p>{patient.age} anos</p>
          </div>

          <div>
            <strong>E-mail</strong>
            <p>{patient.email}</p>
          </div>

          <div>
            <strong>CPF</strong>
            <p>{patient.cpf}</p>
          </div>

          <div>
            <strong>Sexo</strong>
            <p>{patient.sexo === 'F' ? 'Feminino' : 'Masculino'}</p>
          </div>



          <div>
            <strong>Médico responsável</strong>
            <p>{patient.doctorName}</p>
          </div>
        </section>

        <footer className={styles.actions}>
          <button className={styles.secondary} onClick={onClose}>
            Fechar
          </button>
          <button className={styles.primary} onClick={onEdit}>
            Editar paciente
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
