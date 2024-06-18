import { useEffect, useState } from "react";
import { Pagination } from "../../../components/pagination/Pagination";
import { deleteEvent, findAllEventsByUserId } from "../../../services/eventService";
import { useLocation, useNavigate } from "react-router-dom";
import { EventList } from "../../../components/eventList/EventList";
import { CardPrivate } from "../../../components/card/CardPrivate";
import ToastAnimated, {showToast} from "../../../components/ui-lib/Toast";
import { TextareaT } from "react-bootstrap-icons";

export const EventListByUser = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // pega info do usuário logado no localStorage
  
    const navigate = useNavigate();
    const {state} = useLocation();
    const [events, setEvents] = useState([]);
    const [eventName, setEventName] = useState("");
    const [checkClosedEvents, setCheckClosedEvents] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=> {   
        getAllEventsByUserId(userInfo.id); // Faz requisição com o id do usuário logado
    }, [currentPage, eventName, checkClosedEvents])
    
    useEffect(()=> {
        state && showToast({ type: 'success', message: state });
    }, [state])
  
    const getAllEventsByUserId = async (id) => {
        const limit = 10;
        const offset = (currentPage - 1) * limit;
        
        try {
            const response = await findAllEventsByUserId(id, eventName, checkClosedEvents, limit, offset);
            if(response) 
                setEvents(response);
        } catch(error) {
            console.log(error.message)
        }
    };
    
    const removeEvent = async (id) => {
        const answer = window.confirm('Tem certeza que deseja excluir este evento?');
        if (answer) {
            await deleteEvent(id);
            showToast({ type: 'success', message: 'Evento excluído com sucesso!' });
            getAllEventsByUserId(userInfo.id);
        }
    };
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    const handleCheckChange = (e) => {
        (e.target.checked) ? setCheckClosedEvents('true') : setCheckClosedEvents('')
    }
        

    return(
        <>
            {/* Componente de alerts */}
            <ToastAnimated />

            <div>
                <button className="btn btn-primary mb-5 float-end" onClick={() => navigate('/app/create/event')}>Cadastrar evento</button>
            </div>

            <div className="searchByName">
                <label>
                    <TextareaT />
                    <input className="form-control" type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Buscar por nome" />
                </label>

                <label>
                    <span className="seeEventsFinished">Exibir eventos encerrados</span> 
                    <input type="checkbox" onChange={handleCheckChange} />
                </label>
            </div>

            <EventList>
                {events.length > 0 ? events.map(event => (<CardPrivate event={event} key={event.id} handleDelete={removeEvent} />))
                    : (<p style={{ color: '#757679' }}>Nenhum evento cadastrado {eventName && 'com o nome'} <strong>{eventName && `"${eventName}"`}</strong>.</p>)
                }
            </EventList>

            {
                events.length > 0 &&
                //  Botões para paginação 
                <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalLimit={10} events={events} />
            }
        </>
    )
}