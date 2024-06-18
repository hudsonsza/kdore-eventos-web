import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import './App.css'
import { AuthProvider } from './context/AuthContext.jsx';
import PublicRoutes from './routes/PublicRoutes.jsx';
import PrivateRoutes from './routes/PrivateRoutes.jsx';
import { SearchProvider } from "./context/SearchContext.jsx";
import { Route, Routes } from "react-router-dom";

export default function App() {
    return (
      <div className="app-container">
          <AuthProvider>
              <SearchProvider>
                  <Header />
                    <main>
                        <Routes>
                            <Route path="/*" element={<PublicRoutes />} />
                            <Route path="/app/*" element={<PrivateRoutes />} />
                        </Routes>
                    </main>
                  <Footer/>
              </SearchProvider>
          </AuthProvider>
      </div>
    );
}
