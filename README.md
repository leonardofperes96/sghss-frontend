# SGHSS – Sistema de Gestão Hospitalar e de Serviços de Saúde

Projeto desenvolvido para a disciplina de Projeto Multidisciplinar,
com foco em Frontend, conforme roteiro disponibilizado pelo professor.

## 📌 Descrição
O SGHSS é um sistema web para gerenciamento de consultas médicas e pacientes,
permitindo o cadastro, edição, visualização e controle de status das consultas.

O sistema foi desenvolvido utilizando React no frontend e Firebase como Backend as a Service,
realizando operações reais de CRUD, sem uso de dados mockados.

## 🚀 Funcionalidades
- Autenticação de usuário (Firebase Auth)
- Dashboard com indicadores de consultas e pacientes
- Cadastro e edição de pacientes (com validação de CPF único)
- Cadastro, edição e visualização de consultas
- Regras de negócio para agendamento (intervalo mínimo de 30 minutos)
- Controle de status da consulta (Agendada, Realizada, Cancelada)
- Interface responsiva

## 🛠️ Tecnologias Utilizadas
- React
- JavaScript
- HTML5
- CSS3
- Firebase (Auth + Firestore)

## 📂 Estrutura do Projeto
O projeto segue uma organização por páginas, componentes e hooks,
facilitando a manutenção e futuras evoluções.

## ▶️ Execução do Projeto
- navegar até a pasta do projeto cd sghss-app
- npm install
- npm start
