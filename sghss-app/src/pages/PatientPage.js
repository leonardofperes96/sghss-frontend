import React, { useState } from "react";
import styles from "./Patient.module.css";
import { useNavigate } from "react-router-dom";
import { useFetchDocuments } from "../hooks/useFetchDocuments";
import { PatientDetailsModal } from "../components";

const PatientPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { data: patients, loading, error } = useFetchDocuments("patients");

  const filteredPatients = patients
    ? patients.filter((patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <main className={styles.patients}>
      <header className={styles.header}>
        <h1>Pacientes</h1>

        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />

          <button
            className={styles.addButton}
            onClick={() => navigate("/pacientes/novo")}
          >
            + Novo Paciente
          </button>
        </div>
      </header>

      <section className={styles.list}>
        {loading && <p className={styles.loading}>Carregando pacientes...</p>}

        {error && <p className={styles.error}>Erro ao carregar pacientes</p>}

        {!loading && filteredPatients.length === 0 && (
          <p className={styles.empty}>Nenhum paciente encontrado</p>
        )}

        {!loading &&
          filteredPatients.map((patient) => (
            <div key={patient.id} className={styles.card}>
              <div>
                <strong>{patient.name}</strong>

                {patient.age && <p>Idade: {patient.age} anos</p>}

                {patient.lastVisit && (
                  <p>Última consulta: {patient.lastVisit}</p>
                )}
              </div>

              <div className={styles.actions}>
               <button onClick={() => setSelectedPatient(patient)}>
                Ver
              </button>

                <button
                  className={styles.edit}
                  onClick={() =>
                    navigate(`/pacientes/${patient.id}/editar`)
                  }
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
      </section>
       {selectedPatient && (
    <PatientDetailsModal
      patient={selectedPatient}
      onClose={() => setSelectedPatient(null)}
      onEdit={() =>
        navigate(`/pacientes/${selectedPatient.id}/editar`)
      }
    />
  )}
    </main>
  );
};

export default PatientPage;
