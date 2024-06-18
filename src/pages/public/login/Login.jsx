import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useLocation } from "react-router-dom";
import ToastAnimated, {showToast} from "../../../components/ui-lib/Toast";
import {verifyEmail, verifyPassword} from '../../../components/formValidation/loginValidation';
import { EnvelopeAt, Lock } from "react-bootstrap-icons";
import '../../../components/formValidation/formValidation.css';

export default function Login() {
    
    const { loginUser } = useContext(AuthContext);
    const location = useLocation();
    
    const {message,status} = location.state || {}; // está sendo utilizada para pegar os erros e mensagens da requisição

    useEffect(()=>{
        showToast({ type: 'info', message: message });
    }, [])

    // Utilizado para o preenchimento dos campos
    const [fieldValue, setFieldValue] = useState({
        email: "",
        senha: ""
    });


    // Utilizado para as validações
    const [fieldErrors, setFieldErrors] = useState({
        email: false,
        senha: false
    });

    // A cada mudança nos inputs, captura o texto digitado
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFieldValue({
            ...fieldValue, // valor do state em questão é espalhado neste objeto
            [name]: value // atualiza as informações dinamicamente
        });

        // Validação dos campos na medida que forem preenchidos
         if (name === "email") {
                setFieldErrors({
                   ...fieldErrors,
                    email: !verifyEmail(value)
                });
        } else if (name === "senha") {
                setFieldErrors({
                ...fieldErrors,
                senha: !verifyPassword(value)
            });
        }
    };
    
    
    // Sempre que for fazer uma requisição, utilizar função assíncrona (async)
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verifica novamente as validações antes de enviar
        const emailIsValid = verifyEmail(fieldValue.email);
        const senhaIsValid = verifyPassword(fieldValue.senha);
        
        if (!emailIsValid || !senhaIsValid) {
            setFieldErrors({
                   email: !emailIsValid,
                   senha: !senhaIsValid
                });
            
                showToast({ type: 'error', message: 'Verifique se os campos foram preenchidos corretamente.' });
                return; // encerra execução do código caso os campos não tenham sido preenchidos corretamente
        }

        try {
            // Chama a função de login (do context) e passa os valores do form
            await loginUser(fieldValue);          
        } catch (error) {
            showToast({ type: 'error', message: error.response.data.message });
        }             
    }

    return(
        <section>
            {/* Componente de alerts */}
            <ToastAnimated />

         <h1 className="titulo">Login</h1>   
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                     <label htmlFor="inputLogin" className="form-label"><EnvelopeAt /> E-mail</label>
                     <input type="text" 
                     className={`form-control ${fieldErrors.email && 'input-error'}`} 
                     name="email" 
                     value={fieldValue.email} 
                     id="inputLogin" 
                     onChange={handleChange} required />

                 {fieldErrors.email && <div className="error-message">E-mail inválido.</div>}
                 </div>

                 <div className="mb-3">
                     <label htmlFor="inputSenha" className="form-label"><Lock /> Senha</label>
                     <input type="password" 
                        className={`form-control ${fieldErrors.senha && 'input-error'}`} 
                        name="senha"
                        value={fieldValue.senha}
                        id="inputSenha" 
                        onChange={handleChange} required />

                    {fieldErrors.senha && <div className="error-message">Senha inválida. Deve conter entre 7 e 20 caracteres.</div>}
                 </div>

               <button type="submit" className="btn btn-primary">Entrar</button>
            </form>
        </section>
    );

}