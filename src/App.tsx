import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Counter from "./pages/Counter";
import JsonCreator from "./pages/JsonCreator";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Counter />} />
        <Route path="/json" element={<JsonCreator />} />
      </Route>
    </Routes>
  );
}

export default App;
