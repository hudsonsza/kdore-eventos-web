import { createContext } from 'react';
import useAuth from '../hooks/useAuth'; // Hook criado para autenticação

// Permite inicializar o contexto do componente AuthProvider
export const AuthContext = createContext();

// Responsável em fornecer/Prover os dados
export const AuthProvider = ({children}) => {
    
    // Importa o hooks com suas funcionalidades de forma desestruturada
    const { userLogged, loading, loginUser, logoutUser, isAdmin, userInfo  } = useAuth();

    // Enquanto estiver carregando, renderiza o spinner, ao finalizar carrega os componentes children
    if (loading) {
        return(
            <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>    
            </div>
        );
    }

    return (
        // Indica o que será provido por meio da propriedade value
        <AuthContext.Provider value={{ userLogged, loading, loginUser, logoutUser, isAdmin, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
}