import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import AdminPage from "./pages/AdminPage";
import PostEditorPage from "./pages/PostEditorPage";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:slug" element={<PostPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/new" element={<PostEditorPage />} />
              <Route path="/admin/edit/:id" element={<PostEditorPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
