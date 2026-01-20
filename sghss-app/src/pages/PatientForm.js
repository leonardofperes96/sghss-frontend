import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PatientForm.module.css";

import { useUserContext } from "../contexts/UserContext";
import { useInsertDocument } from "../hooks/useInsertDocument";
import { useUpdateDocument } from "../hooks/useUpdateDocument";
import { useFetchDocument } from "../hooks/useFetchDocument";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase/firebase";

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: user } = useUserContext();

  const {
    insertDocument,
    error: insertError,
  } = useInsertDocument("patients");

  const {
    updateRegister,
    error: updateError,
  } = useUpdateDocument("patients");

  const { document: patient, loading: fetchLoading } =
    useFetchDocument("patients", id);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [sexo, setSexo] = useState("M");

  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);


  const formatCPF = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(
        /^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/,
        "$1.$2.$3-$4"
      );
  };

  const isValidCPF = (cpf) => {
    const cleanCpf = cpf.replace(/\D/g, "");

    if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += cleanCpf[i] * (10 - i);
    let check1 = (sum * 10) % 11;
    if (check1 === 10) check1 = 0;
    if (check1 !== Number(cleanCpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += cleanCpf[i] * (11 - i);
    let check2 = (sum * 10) % 11;
    if (check2 === 10) check2 = 0;

    return check2 === Number(cleanCpf[10]);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const checkCpfExists = async (cpf) => {
    const q = query(
      collection(db, "patients"),
      where("cpf", "==", cpf)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      if (isEdit) {
        return snapshot.docs.some((doc) => doc.id !== id);
      }
      return true;
    }

    return false;
  };


  useEffect(() => {
    if (isEdit && patient) {
      setName(patient.name || "");
      setAge(patient.age || "");
      setEmail(patient.email || "");
      setSexo(patient.sexo || "M");

      if (patient.cpf) {
        setCpf(formatCPF(patient.cpf));
      }
    }
  }, [isEdit, patient]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    setNameError("");
    setAgeError("");
    setCpfError("");
    setEmailError("");
    setFormError("");

    let hasError = false;

    if (!name.trim()) {
      setNameError("O nome é obrigatório.");
      hasError = true;
    }

    if (!age) {
      setAgeError("A idade é obrigatória.");
      hasError = true;
    } else if (Number(age) <= 0) {
      setAgeError("Informe uma idade válida.");
      hasError = true;
    }

    if (!isValidEmail(email)) {
      setEmailError("Informe um e-mail válido.");
      hasError = true;
    }

    if (!cpf) {
      setCpfError("Informe o CPF.");
      hasError = true;
    } else if (!isValidCPF(cpf)) {
      setCpfError("CPF inválido.");
      hasError = true;
    } else {
      const exists = await checkCpfExists(cpf.replace(/\D/g, ""));
      if (exists) {
        setCpfError("Já existe um paciente cadastrado com este CPF.");
        hasError = true;
      }
    }

    if (hasError) return;

    setIsSubmitting(true);

    const patientData = {
      name,
      age: Number(age),
      email,
      cpf: cpf.replace(/\D/g, ""),
      sexo,
      doctorId: user.uid,
      doctorName: user.displayName,
      updatedAt: new Date(),
    };

    try {
      if (isEdit) {
        await updateRegister(id, patientData);
      } else {
        await insertDocument({
          ...patientData,
          createdAt: new Date(),
        });
      }

      navigate("/pacientes");
    } catch (error) {
      setFormError("Erro ao salvar o paciente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchLoading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

 
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>{isEdit ? "Editar Paciente" : "Novo Paciente"}</h1>
        <p>Preencha as informações abaixo</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Nome completo</label>
          <input
            type="text"
            value={name}
            placeholder="Ex: João da Silva"
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            disabled={isSubmitting}
          />
          {nameError && <span className={styles.error}>{nameError}</span>}
        </div>

        <div className={styles.field}>
          <label>Idade</label>
          <input
            type="number"
            value={age}
            placeholder="Ex: 35"
            onChange={(e) => {
              setAge(e.target.value);
              setAgeError("");
            }}
            disabled={isSubmitting}
          />
          {ageError && <span className={styles.error}>{ageError}</span>}
        </div>

        <div className={styles.field}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            placeholder="email@exemplo.com"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            disabled={isSubmitting}
          />
          {emailError && <span className={styles.error}>{emailError}</span>}
        </div>

        <div className={styles.field}>
          <label>CPF</label>
          <input
            type="text"
            value={cpf}
            placeholder="000.000.000-00"
            onChange={(e) => {
              setCpf(formatCPF(e.target.value));
              setCpfError("");
            }}
            disabled={isSubmitting}
          />
          {cpfError && <span className={styles.error}>{cpfError}</span>}
        </div>

        <div className={styles.field}>
          <label>Sexo</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                checked={sexo === "M"}
                onChange={() => setSexo("M")}
                disabled={isSubmitting}
              />
              Masculino
            </label>

            <label>
              <input
                type="radio"
                checked={sexo === "F"}
                onChange={() => setSexo("F")}
                disabled={isSubmitting}
              />
              Feminino
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => navigate("/pacientes")}
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
              : "Cadastrar paciente"}
          </button>
        </div>

        {(insertError || updateError || formError) && (
          <p className={styles.error}>
            {insertError || updateError || formError}
          </p>
        )}
      </form>
    </main>
  );
};

export default PatientForm;
