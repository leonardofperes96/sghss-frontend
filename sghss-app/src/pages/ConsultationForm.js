import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ConsultationForm.module.css";

import { useUserContext } from "../contexts/UserContext";
import { useInsertDocument } from "../hooks/useInsertDocument";
import { useUpdateDocument } from "../hooks/useUpdateDocument";
import { useFetchDocument } from "../hooks/useFetchDocument";
import { useFetchDocuments } from "../hooks/useFetchDocuments";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase/firebase";


const MIN_INTERVAL_MS = 30 * 60 * 1000;

const buildDateTime = (date, time) => {
  return new Date(`${date}T${time}:00`);
};

const ConsultationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: user } = useUserContext();

  const { insertDocument, error: insertError } =
    useInsertDocument("consultations");

  const { updateRegister, error: updateError } =
    useUpdateDocument("consultations");

  const { document: consultation, loading: consultationLoading } =
    useFetchDocument("consultations", id);

  const { data: patients, loading: patientsLoading } =
    useFetchDocuments("patients");

  const safePatients = useMemo(
    () => (Array.isArray(patients) ? patients : []),
    [patients]
  );

  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");

  const [patientError, setPatientError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [status, setStatus] = useState("AGENDADA");

  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (isEdit && consultation) {
      setPatientId(consultation.patientId || "");
      setDate(consultation.date || "");
      setTime(consultation.time || "");
      setType(consultation.type || "");
      setNotes(consultation.notes || "");
      setStatus(consultation.status || "AGENDADA")
    }
  }, [isEdit, consultation]);

/*  Regra de negócio para conflitos de horário. */
  const checkScheduleConflict = async (date, time) => {
    const q = query(
      collection(db, "consultations"),
      where("date", "==", date)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return false;

    const newDateTime = buildDateTime(date, time).getTime();

    return snapshot.docs.some((doc) => {
      if (isEdit && doc.id === id) return false;

      const data = doc.data();

      if (!data.date || !data.time) return false;

      const existingDateTime = buildDateTime(
        data.date,
        data.time
      ).getTime();

      const diff = Math.abs(existingDateTime - newDateTime);

      return diff < MIN_INTERVAL_MS;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setPatientError("");
    setDateError("");
    setTimeError("");
    setTypeError("");

    let hasError = false;

    if (!patientId) {
      setPatientError("Selecione um paciente.");
      hasError = true;
    }

    if (!date) {
      setDateError("Informe a data da consulta.");
      hasError = true;
    }

    if (!time) {
      setTimeError("Informe o horário da consulta.");
      hasError = true;
    }

    if (!type) {
      setTypeError("Selecione o tipo da consulta.");
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const hasConflict = await checkScheduleConflict(date, time);

      if (hasConflict) {
        setTimeError(
          "Já existe uma consulta dentro do intervalo de 30 minutos."
        );
        setIsSubmitting(false);
        return;
      }

      const selectedPatient = safePatients.find(
        (p) => p.id === patientId
      );

      const consultationData = {
        patientId,
        patientName: selectedPatient?.name || "",
        date,
        time,
        type,
        notes,
        doctorId: user.uid,
        doctorName: user.displayName,
        status: isEdit ? status : "AGENDADA",
        updatedAt: new Date(),
      };

      if (isEdit) {
        await updateRegister(id, consultationData);
      } else {
        await insertDocument({
          ...consultationData,
          createdAt: new Date(),
        });
      }

      navigate("/consultas");
    } catch (error) {
      setTimeError("Erro ao salvar a consulta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (consultationLoading || patientsLoading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }


  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>{isEdit ? "Editar Consulta" : "Nova Consulta"}</h1>
        <p>Preencha as informações abaixo</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Paciente</label>
          <select
            value={patientId}
            onChange={(e) => {
              setPatientId(e.target.value);
              setPatientError("");
            }}
            disabled={isSubmitting}
          >
            <option value="">Selecione um paciente</option>
            {safePatients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
          {patientError && (
            <span className={styles.error}>{patientError}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setDateError("");
            }}
            disabled={isSubmitting}
          />
          {dateError && <span className={styles.error}>{dateError}</span>}
        </div>

        <div className={styles.field}>
          <label>Horário</label>
          <input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setTimeError("");
            }}
            disabled={isSubmitting}
          />
          {timeError && <span className={styles.error}>{timeError}</span>}
        </div>

        <div className={styles.field}>
          <label>Tipo da consulta</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setTypeError("");
            }}
            disabled={isSubmitting}
          >
            <option value="">Selecione</option>
            <option value="avaliacao">Avaliação</option>
            <option value="retorno">Retorno</option>
            <option value="exame">Exame</option>
            <option value="outro">Outro</option>
          </select>
          {typeError && <span className={styles.error}>{typeError}</span>}
        </div>

        <div className={styles.field}>
          <label>Observações</label>
          <textarea
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações adicionais (opcional)"
            disabled={isSubmitting}
          />
        </div>

        {isEdit && (
        <div className={styles.field}>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="AGENDADA">Agendada</option>
            <option value="REALIZADA">Realizada</option>
          </select>
        </div>
      )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => navigate("/consultas")}
            disabled={isSubmitting}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className={styles.save}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Salvando..."
              : isEdit
              ? "Salvar alterações"
              : "Cadastrar consulta"}
          </button>
        </div>

        {(insertError || updateError) && (
          <p className={styles.error}>{insertError || updateError}</p>
        )}
      </form>
    </main>
  );
};

export default ConsultationForm;
