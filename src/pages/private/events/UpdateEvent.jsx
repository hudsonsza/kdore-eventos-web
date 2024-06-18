import { useEffect, useState } from "react";
import { findEventById, updateEvent } from "../../../services/eventService";
import { findAllLocals } from "../../../services/localService";
import { getCategories } from "../../../services/categoryService";
import { useNavigate, useParams } from "react-router-dom";
import { verifyURL, verifyEventName, verifyEventDescription, verifyDateStart, verifyDateEnd } from "../../../components/formValidation/eventValidation";
import ToastAnimated, {showToast} from "../../../components/ui-lib/Toast";
import { ArrowLeftSquare, CalendarEvent, FileImage, FileText, PatchQuestionFill, PinMap, Tag, TextareaT } from "react-bootstrap-icons";
import '../../../components/formValidation/formValidation.css';

export const UpdateEvent = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const navigate = useNavigate();
    const {id} = useParams();
    const [locals, setLocals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [event, setEvent] = useState({});

    const [fieldValue, setFieldValue] = useState({
        imagem: "",
        nome: "",
        descricao: "",
        data_inicio: "",
        data_fim: "",
        usuario_id: userInfo.id,
        categoria_id: "",
        local_id: "",
    });

    // Utilizado para as validações
    const [fieldErrors, setFieldErrors] = useState({
        imagem: false,
        nome: false,
        descricao: false,
        data_inicio: false,
        data_fim: false,
        categoria_id: false,
        local_id: false
    });

    useEffect(()=> {
        getEventById();
        getAllLocals();
        getAllCategories();
    }, [])


    const getEventById = async () => {
        try {
            const response = await findEventById(id);
            if (response) {
                setEvent(response);
                setFieldValue({
                    imagem: response.imagem,
                    nome: response.nome,
                    descricao: response.descricao,
                    data_inicio: response.data_inicio ? new Date(response.data_inicio).toISOString().slice(0, 16) : '',
                    data_fim: response.data_fim ? new Date(response.data_fim).toISOString().slice(0, 16) : '',
                    usuario_id: response.usuario_id,
                    categoria_id: response.categoria.id,
                    local_id: response.local.id,
                });
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const getAllLocals = async() => {
        try {
            const response = await findAllLocals();
            setLocals(response || []);
        } catch (error) {
            console.log(error.message)
        }
    }

    const getAllCategories = async() => {
        try {
            const response = await getCategories();
            setCategories(response || []);
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFieldValue({
            ...fieldValue, 
            [name]: value 
        });

        // Validação dos campos na medida que forem preenchidos
        if (name === "imagem") {
                setFieldErrors({
                ...fieldErrors,
                imagem: !verifyURL(value)
                });
            } else if (name === "nome") {
                    setFieldErrors({
                    ...fieldErrors,
                    nome: !verifyEventName(value)
                });
            }
          else if (name === "descricao") {
                    setFieldErrors({
                    ...fieldErrors,
                    descricao: !verifyEventDescription(value)
                });
            }
          else if (name === "data_inicio") {
                    setFieldErrors({
                    ...fieldErrors,
                    data_inicio: !verifyDateStart(value)
                });
            }
          else if (name === "data_fim") {
                    setFieldErrors({
                    ...fieldErrors,
                    data_fim: !verifyDateEnd(fieldValue.data_inicio, value)
                });
            }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica novamente as validações antes de enviar
        const imgUrlIsValid = verifyURL(fieldValue.imagem);
        const nameIsValid = verifyEventName(fieldValue.nome);
        const descriptionIsValid = verifyEventDescription(fieldValue.descricao);
        const dateStartIsValid = verifyDateStart(fieldValue.data_inicio);
        const dateEndIsValid = verifyDateEnd(fieldValue.data_inicio, fieldValue.data_fim);
        const categoriaIsValid = fieldValue.categoria_id;
        const localIsValid = fieldValue.local_id;
        
        if (!imgUrlIsValid || !nameIsValid || !descriptionIsValid || !dateStartIsValid |!dateEndIsValid || !categoriaIsValid || !localIsValid) {
            setFieldErrors({
                    imagem: !imgUrlIsValid,
                    nome: !nameIsValid,
                    descricao: !descriptionIsValid,
                    data_inicio: !dateStartIsValid,
                    data_fim: !dateEndIsValid,
                    categoria_id: !categoriaIsValid,
                    local_id: !localIsValid
            });
                    
            showToast({ type: 'error', message: 'Verifique se os campos foram preenchidos corretamente.' });
            return; // encerra execução do código caso os campos não tenham sido preenchidos corretamente
        }

        const formattedData = {
            ...fieldValue,
            // Modificando as datas para o formato ISO 8601
            data_inicio: fieldValue.data_inicio ? new Date(fieldValue.data_inicio).toISOString() : '',
            data_fim: fieldValue.data_fim ? new Date(fieldValue.data_fim).toISOString() : ''
        }

        
        try {
            await updateEvent(event.id, formattedData);
            navigate('/app/my-events', {state: `Evento "${fieldValue.nome}" atualizado com sucesso!`})
        } catch (error) {
            const {message, status} = error.response;
            status >= 400 && showToast({ type: 'success', message: message });
        }
    }

    return(
        <>
        {/* Componente de alerts */}
        <ToastAnimated />

        <h1>
            Atualizar evento
            <span title="Voltar" onClick={() => navigate('/app/my-events')}><ArrowLeftSquare /></span>
            </h1>
        
        <form onSubmit={handleSubmit}>
                {fieldValue.imagem !== '' &&
                (<figure className="mb-3 text-center">
                     <img src={fieldValue.imagem} alt={event.nome} className="img-fluid" width={450} />
                    <figcaption>Prévia da imagem</figcaption>
                </figure>
                )}
                
                <div className="row mt-5 mb-3">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="imagem" className="form-label"><FileImage /> Imagem
                        <sup><PatchQuestionFill style={{color: '#f00', fontSize: '.8rem'}} title="Escolha uma imagem de alta resolução no formato paisagem (largura > altura), para garantir a melhor qualidade visual na publicação dos seus eventos. Ex.: 1200 x 400. Sua imagem deve ser enviada por meio de link - confira se a mesma foi inserida corretamente por meio da prévia da imagem." /></sup> 
                        </label>
                        <input type="text" 
                        className={`form-control ${fieldErrors.imagem && 'input-error'}`}
                        name="imagem" 
                        value={fieldValue.imagem} 
                        id="imagem" onChange={handleChange} />

                    {fieldErrors.imagem && <div className="error-message">ULR inválida.</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="nome" className="form-label"><TextareaT /> Nome do evento</label>
                        
                        <input type="text" 
                        className={`form-control ${fieldErrors.nome && 'input-error'}`} 
                        name="nome" 
                        value={fieldValue.nome} 
                        id="nome" onChange={handleChange} />

                        {fieldErrors.nome && <div className="error-message">O nome do evento deve conter de 5 a 40 caracteres. <strong>Total de carecteres digitados: {fieldValue.nome.length}.</strong>
                        </div> }
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12">
                        <label htmlFor="descricao" className="form-label"><FileText /> Descrição</label>
                        <textarea name="descricao" 
                        className={`form-control ${fieldErrors.descricao && 'input-error'}`} 
                        id="descricao" 
                        value={fieldValue.descricao} 
                        rows={5} onChange={handleChange}></textarea> 

                        {fieldErrors.descricao && <div className="error-message">A descrição deve conter de 500 a 1500 caracteres. <strong>Total de carecteres digitados: {fieldValue.descricao.length}.</strong> </div>}                      
                    </div>
                </div>

                <div className="row mt-4 mb-3">
                    <div className="col-md-3 mb-3">
                        <label htmlFor="dataInicio" className="form-label"><CalendarEvent /> Data de início</label>
                        <input type="datetime-local" 
                        className={`form-control ${fieldErrors.data_inicio && 'input-error'}`}
                        name="data_inicio" 
                        value={fieldValue.data_inicio} 
                        id="dataInicio" onChange={handleChange} />

                        {fieldErrors.data_inicio && <div className="error-message">A data de início não pode ser inferior a data de hoje.</div>}
                    </div>

                    <div className="col-md-3 mb-3">
                        <label htmlFor="dataFim" className="form-label"><CalendarEvent /> Último dia</label>
                        <input type="datetime-local" 
                        className={`form-control ${fieldErrors.data_fim && 'input-error'}`} 
                        name="data_fim" 
                        value={fieldValue.data_fim} 
                        id="dataFim" onChange={handleChange} />

                        {fieldErrors.data_fim && <div className="error-message">A data de encerramento não pode ser inferior a data de início.</div>}
                    </div>

                    <div hidden>
                        <input type="text" className="form-control" name="usuario_id" value={fieldValue.usuario_id}  onChange={handleChange} hidden />
                    </div>

                    <div className="col-md-3 mb-3">
                        <label htmlFor="categoria" className="form-label"><Tag /> Categoria</label> <br/>
                        <select name="categoria_id" 
                        id="categoria" 
                        value={fieldValue.categoria_id} 
                        onChange={handleChange} 
                        className={`form-select ${fieldErrors.categoria_id && 'input-error'}`} 
                        aria-label="Default select example">
                            <option value="" disabled>Selecione uma das opções abaixo</option>
                            {categories.map(category => (
                                <option value={category.id} key={category.id}>{category.nome}</option>
                            ))}
                        </select>

                        {fieldErrors.categoria_id && <div className="error-message">Selecione uma categoria.</div>}
                    </div>

                    <div className="col-md-3 mb-3">                    
                        <label htmlFor="local" className="form-label"><PinMap /> Local</label> <br/>
                        <select name="local_id" 
                        id="local" 
                        value={fieldValue.local_id} 
                        onChange={handleChange}
                        className={`form-select ${fieldErrors.local_id && 'input-error'}`}
                        aria-label="Default select example">
                            <option value="" disabled>Selecione uma das opções abaixo</option>

                            {locals.map(local => (
                            <option value={local.id} key={local.id}>{local.nome}</option>
                            ))}
                        </select>
                    </div>

                    {fieldErrors.local_id && <div className="error-message">Selecione um local.</div>}
                </div>

               <button type="submit" className="btn btn-primary mt-2">Atualizar</button>
            </form>
        </>
    );
}