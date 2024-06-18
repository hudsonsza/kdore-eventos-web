import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import api from '../services/api';

const useAuth = () => {
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo'))); // Armazena informações do usuário
    const [userLogged, setUserLogged] = useState(false); // Estado que vai indicar se o usuário está ou não logado
    const [loading, setloading] = useState(true); // Utilizado para evitar o userLogged como false quando o usuário estiver logado
    const [isAdmin, setIsAdmin] = useState(false); // utilizado para acesso de páginas restritas à admin
    const [sessionExpired, setSessionExpired] = useState(false); // utilizado para a mensagem de sessão expirada

    // Realiza navegação entre páginas
    const navigate = useNavigate();
    
    useEffect(() => {
        // Verifica se existe...
        if (userInfo) {
            // Add header em todas as chamadas da aplicação quando estiver logado
            api.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
            
            setUserLogged(true); // Utilizado caso já esteja logado
        }
        
        setloading(false);

        // Configura intervalo para verificar a validade do token
        const tokenCheckInterval = setInterval(() => {
            if (userInfo) {
                // Verifica se o token ainda é válido
                const isTokenExpired = checkTokenExpiration(userInfo.token);
                
                if (isTokenExpired) {
                    setSessionExpired(true); // Seta a mensagem de sessão expirada
                }
            }
        }, 60000); // Verifica a cada minuto (60000 ms)
        
        return () => clearInterval(tokenCheckInterval);
    }, [userInfo]);
        

    useEffect(()=>{
        if (sessionExpired) {
            logoutUser();
        }
    }, [sessionExpired])
    

    const checkTokenExpiration = (token) => {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); //  Verificar a expiração do token
        const currentTime = Date.now() / 1000; // Tempo atual em milissegundos
        // Compara o tempo de expiração do token (decodedToken.exp) com o tempo atual
        return decodedToken.exp < currentTime; 
    };

     // Função para ser utilizada na página de login
    const loginUser = async (inputValues) => {
        try {
            const response = await login(inputValues);

            if (response) {
                // Salva dados do usuário logado no localStorage
                localStorage.setItem('userInfo', JSON.stringify(response));

                 // Atualiza o estado do userInfo
                 setUserInfo(response);

                // Add header em todas as chamadas da aplicação - ao logar
                api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

                setUserLogged(true); // Altera status do usuário -> Logado
                setIsAdmin(response.isAdmin); // Seta true/false com base no user logado
                navigate('/', { state: `Seja bem vindo(a), ${getFirstName(response.name)}!` }); // Redireciona para home - listagem de eventos (Exibe o nome do usuário logado)
            }

        } catch (error) {
            throw error;
        }
    };


    const logoutUser = () => {
        // Limpa o localStorage
        localStorage.removeItem('userInfo'); 
        setUserLogged(false); // Estado passa a ser falso (Não logado)
        setIsAdmin(false);
        setUserInfo(null);
        setSessionExpired(false)
        navigate('/login', { state: {message: sessionExpired ? 'Sessão expirada. Faça login novamente.' : 'Desconectado com sucesso.' } }); // Redireciona para pág login com a mensagem apropriada
    };

    function getFirstName(fullName) {
        // Divide a string em partes usando o espaço como separador
        const nameParts = fullName.split(' ');
      
        // Retorna a primeira parte do array
        return nameParts[0];
      }

    // Retorna um objeto com todas as variáveis de estado e funções
    return { userLogged, loading, loginUser, logoutUser, isAdmin, userInfo };
}

export default useAuth;