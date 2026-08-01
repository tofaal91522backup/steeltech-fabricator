import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { store } from "./app/store";
import { Provider } from "react-redux";

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </>
  );
}

export default App;
