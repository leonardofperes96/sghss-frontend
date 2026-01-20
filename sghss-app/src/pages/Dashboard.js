import React, { useMemo } from "react";
import styles from "./Dashboard.module.css";
import { ActionCard, StatCard } from "../components";

import { useFetchDocuments } from "../hooks/useFetchDocuments";

const Dashboard = () => {
  const { data: patients } = useFetchDocuments("patients");
  const { data: consultations } = useFetchDocuments("consultations");

  // 🔥 formato compatível com o input date
  const today = new Date().toISOString().split("T")[0];

  const stats = useMemo(() => {
    if (!patients || !consultations) return [];

    const consultationsToday = consultations.filter(
      (c) => c.date === today
    );

    const pendingConsultations = consultations.filter(
      (c) => c.status === "AGENDADA"
    );

    return [
      {
        label: "Consultas hoje",
        value: consultationsToday.length,
      },
      {
        label: "Pacientes cadastrados",
        value: patients.length,
      },
      {
        label: "Consultas pendentes",
        value: pendingConsultations.length,
      },
    ];
  }, [patients, consultations, today]);

  const actions = [
    { label: "Pacientes", route: "/pacientes" },
    { label: "Nova Consulta", route: "/consultas/nova" },
    { label: "Consultas", route: "/consultas" },
    { label: "Meu Perfil", route: "/perfil" },
  ];

  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Bem-vindo, Doutor</h1>
        <p>
          Acompanhe seus atendimentos e acesse as principais funcionalidades
        </p>
      </header>

      <section className={styles.stats}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      <section className={styles.actionsWrapper}>
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <ActionCard key={index} {...action} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
