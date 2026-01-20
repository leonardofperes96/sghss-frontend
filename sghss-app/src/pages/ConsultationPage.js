import React, { useState, useMemo } from "react";
import styles from "./ConsultationPage.module.css";
import { useNavigate } from "react-router-dom";

import { useFetchDocuments } from "../hooks/useFetchDocuments";

const ConsultationPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data: consultations, loading, error } =
    useFetchDocuments("consultations");


  const filteredConsultations = useMemo(() => {
    if (!consultations) return [];

    return consultations.filter((consultation) =>
      consultation.patientName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [consultations, search]);

  if (loading) {
    return <p className={styles.loading}>Carregando consultas...</p>;
  }

  if (error) {
    return (
      <p className={styles.error}>
        Erro ao carregar consultas.
      </p>
    );
  }

  return (
    <main className={styles.consultations}>
      <header className={styles.header}>
        <h1>Consultas</h1>

        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Buscar por paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className={styles.addButton}
            onClick={() => navigate("/consultas/nova")}
          >
            + Nova Consulta
          </button>
        </div>
      </header>

      <section className={styles.list}>
        {filteredConsultations.length === 0 && (
          <p className={styles.empty}>
            Nenhuma consulta encontrada
          </p>
        )}

        {filteredConsultations.map((consultation) => (
      <div
        key={consultation.id}
        className={`${styles.card} ${
          consultation.status === "REALIZADA"
            ? styles.done
            : ""
        }`}
      >
        <div>
          <strong>{consultation.patientName}</strong>

          <p>
            Data: {consultation.date} às {consultation.time}
          </p>

          <p>Tipo: {consultation.type}</p>

          {consultation.status === "REALIZADA" && (
            <span className={styles.badgeDone}>
              Consulta realizada
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <button
            onClick={() =>
              navigate(`/consultas/${consultation.id}`)
            }
          >
            Ver
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
      </div>
    ))}

      </section>
    </main>
  );
};

export default ConsultationPage;
