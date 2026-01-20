import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Footer, Navigation } from "./components/index";
import { useUserContext } from "./contexts/UserContext";
import {
  Dashboard,
  Login,
  UserPage,
  ErrorPage,
  PatientPage,
  PatientForm,
  ConsultationPage,
  ConsultationForm,
  ConsultationDetails
} from "./pages";
import { ProtectedRoute } from "./components";
const App = () => {
  const { data } = useUserContext();


  return (
    <Router>
      <Navigation />
      <main>
        <Routes>
      
     
      <Route path="/login" element={!data ? <Login /> : <Navigate to="/" />} />

     
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pacientes"
        element={
          <ProtectedRoute>
            <PatientPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pacientes/novo"
        element={
          <ProtectedRoute>
            <PatientForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pacientes/:id/editar"
        element={
          <ProtectedRoute>
            <PatientForm />
          </ProtectedRoute>
        }
      />

    <Route
      path="/consultas"
      element={
        <ProtectedRoute>
          <ConsultationPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/consultas/nova"
      element={
        <ProtectedRoute>
          <ConsultationForm />
        </ProtectedRoute>
      }
    />

      <Route
        path="/consultas/:id/editar"
        element={
          <ProtectedRoute>
            <ConsultationForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/consultas/:id"
        element={
          <ProtectedRoute>
            <ConsultationDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="perfil/*"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;
