import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ConsultationDetails.module.css";

import { useFetchDocument } from "../hooks/useFetchDocument";
import { useUpdateDocument } from "../hooks/useUpdateDocument";

const ConsultationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { document: consultation, loading } =
    useFetchDocument("consultations", id);

  const { updateRegister, error } =
    useUpdateDocument("consultations");

  const [isUpdating, setIsUpdating] = useState(false);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Carregando consulta...</p>;
  }

  if (!consultation) {
    return (
      <p style={{ textAlign: "center" }}>
        Consulta não encontrada.
      </p>
    );
  }

 
  const handleMarkAsDone = async () => {
    setIsUpdating(true);

    try {
      await updateRegister(id, {
        status: "REALIZADA",
        updatedAt: new Date(),
      });

      navigate("/consultas")
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Detalhes da Consulta</h1>
        <p>Informações completas da consulta</p>
      </header>

      <section className={styles.card}>
        <div className={styles.row}>
          <strong>Paciente:</strong>
          <span>{consultation.patientName}</span>
        </div>

        <div className={styles.row}>
          <strong>Data:</strong>
          <span>{consultation.date}</span>
        </div>

        <div className={styles.row}>
          <strong>Horário:</strong>
          <span>{consultation.time}</span>
        </div>

        <div className={styles.row}>
          <strong>Tipo:</strong>
          <span>{consultation.type}</span>
        </div>

        <div className={styles.row}>
          <strong>Status:</strong>
          <span
            className={
              consultation.status === "REALIZADA"
                ? styles.statusDone
                : styles.statusScheduled
            }
          >
            {consultation.status}
          </span>
        </div>

        {consultation.notes && (
          <div className={styles.row}>
            <strong>Observações:</strong>
            <span>{consultation.notes}</span>
          </div>
        )}

        <div className={styles.row}>
          <strong>Médico:</strong>
          <span>{consultation.doctorName}</span>
        </div>

        <div className={styles.row}>
          <strong>Criada em:</strong>
          <span>
            {consultation.createdAt?.toDate?.().toLocaleString()}
          </span>
        </div>
      </section>

      {consultation.status === "AGENDADA" && (
       <button
        className={styles.success}
        onClick={handleMarkAsDone}
        disabled={isUpdating}
      >
        {isUpdating ? "Atualizando..." : "✔ Marcar como realizada"}
      </button>

      )}

      {error && (
        <p className={styles.error}>
          Erro ao atualizar a consulta.
        </p>
      )}

      <div className={styles.actions}>
        <button
          className={styles.back}
          onClick={() => navigate("/consultas")}
        >
          Voltar
        </button>

        <button
          className={styles.edit}
          onClick={() =>
            navigate(`/consultas/${consultation.id}/editar`)
          }
        >
          Editar
        </button>
      </div>
    </main>
  );
};

export default ConsultationDetails;
