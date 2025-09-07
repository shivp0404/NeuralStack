import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import CreateSnippet from "./page/CreateSnippet";
import EditSnippet from "./page/EditSnippet";
import SnippetsList from "./page/SnippetsList";
import Journals from "./page/Journals";
import Register from "./page/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/journals" element={<Journals/>} />
        <Route path="/allsnippets" element={<SnippetsList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateSnippet />} />
        <Route path="/edit/:id" element={<EditSnippet />} />

        
      </Routes>
    </BrowserRouter>
  );
}
