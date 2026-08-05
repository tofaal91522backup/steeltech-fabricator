import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ModalContextProvider } from "./context/ModalContext.jsx";
import QueryProvider from "./providers/query-provider.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <ModalContextProvider>
        <App />
      </ModalContextProvider>
    </QueryProvider>
  </StrictMode>,
);
