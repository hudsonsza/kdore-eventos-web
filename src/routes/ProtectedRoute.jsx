import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ExclamationCircle } from "react-bootstrap-icons";

export const ProtectedRoute = ({children, roleIsVisitor, roleIsAdmin}) => {
    const {userLogged, isAdmin, userInfo} = useContext(AuthContext); 
    const roleVisitor = userInfo.role.nome.toLowerCase();

    // Se não estiver logado, redireciona para a página de login
    if(!userLogged) {
        return <Navigate to='/login' />;  
    } 
    
    // Se não for admin, bloqueia o acesso
    if(roleIsAdmin && isAdmin !== roleIsAdmin) {
        return <h1 className="d-block text-center text-danger"><ExclamationCircle /> (401) Unauthorized!</h1>
    }
    
    // Bloqueia acesso de usuário com cargo de visitante/público
    if(roleIsVisitor && roleVisitor === 'visitante' || roleIsVisitor === 'público') {
        return <h1 className="d-block text-center text-danger"><ExclamationCircle /> (401) Unauthorized!</h1>
    }

    // Se logado e tiver o papel necessário (ou não for necessário um papel específico), retorna o que estiver dentro da ProtectedRoute -> children
    return children;
}