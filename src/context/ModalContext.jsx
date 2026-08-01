import { createContext, useContext, useReducer } from "react";

const ModalContext = createContext();

const initialData = {
  showError: false,
  showSuccess: false,
  message: "",
};

function modalDataReducer(state, action) {
  switch (action.type) {
    case "open": {
      return {
        ...state,
        showError: true,
        showSuccess: false,
        message: action?.payload,
      };
    }

    case "success": {
      return {
        ...state,
        showError: false,
        showSuccess: true,
        message: action?.payload,
      };
    }

    case "close": {
      return {
        ...state,
        showError: false,
        showSuccess: false,
        message: "",
      };
    }

    default:
      return state;
  }
}

function ModalContextProvider({ children }) {
  const [modalData, dispatch] = useReducer(modalDataReducer, initialData);

  return (
    <ModalContext.Provider value={{ modalData, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
}

function useModalContext() {
  const context = useContext(ModalContext);

  if (context === undefined)
    throw new Error(
      "ModalContext was used outside of the ModalContextProvider"
    );
  return context;
}

export { useModalContext, ModalContextProvider };
