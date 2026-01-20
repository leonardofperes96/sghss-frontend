import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import reducer from "../reducers/user_reducer";
import {
  LOGIN_SUCCESS,
  LOGIN_BEGIN,
  LOGIN_ERROR,
  USERCREDENTIALS_BEGIN,
  USERCREDENTIALS_SUCCESS,
  USERCREDENTIALS_ERROR,
} from "../actions";

import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  app,
} from "../utils/firebase/firebase";

const UserContext = createContext();

const initialState = {
  loading: false,
  error: null,
  data: null,
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //memory leak state
  const [cancelled, setCancelled] = useState(false);

  // deal with memory leak
  const checkCancelledBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  useEffect(() => {
    const updateUser = async () => {
      checkCancelledBeforeDispatch({ type: USERCREDENTIALS_BEGIN });

      try {
        await onAuthStateChanged(auth, (user) => {
          checkCancelledBeforeDispatch({
            type: USERCREDENTIALS_SUCCESS,
            payload: user,
          });
        });
      } catch (err) {
        checkCancelledBeforeDispatch({
          type: USERCREDENTIALS_ERROR,
          payload: err.message,
        });
      }
    };
    updateUser();
  }, [auth]);

 const login = async (data) => {
  checkCancelledBeforeDispatch({ type: LOGIN_BEGIN });

  try {
    const response = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = response.user;
    if (!user.displayName) {
      const name = window.prompt(
        "Digite seu nome para completar o cadastro:"
      );

      if (name && name.trim().length > 2) {
        await updateProfile(user, {
          displayName: name.trim(),
        });
      }
    }

    checkCancelledBeforeDispatch({ type: LOGIN_SUCCESS });
  } catch (err) {
    checkCancelledBeforeDispatch({
      type: LOGIN_ERROR,
      payload: err.message,
    });
  }
};




  const logout = async () => {
    await signOut(auth);
  };

  //cleaning memory
  useEffect(() => {
    return () => setCancelled(true);
  }, []);
  return (
    <UserContext.Provider value={{ ...state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
