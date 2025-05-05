import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import "./index.css";
import { Dataset } from "@/routes/dataset";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dataset/:id" element={<Dataset />} />
      <Route path="/:id" element={<App />} />
    </Routes>
  </BrowserRouter>
);
