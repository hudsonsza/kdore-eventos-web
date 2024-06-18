import { useContext, useEffect} from "react";
import { Card } from "../../../components/card/Card";
import { EventList } from "../../../components/eventList/EventList";
import { Pagination } from "../../../components/pagination/Pagination";
import { SearchContext } from "../../../context/SearchContext";
import { useLocation } from "react-router-dom";
import ToastAnimated, {showToast} from "../../../components/ui-lib/Toast";

export default function Home() {
    const {events, eventsFound, eventName, currentPage, handlePageChange} = useContext(SearchContext);
    const {state} = useLocation();

    useEffect(()=> {
        showToast({type: 'success', message: state});
    },[])
    
    return(
        <>
            {/* Componente de alerts */}
            <ToastAnimated />

            <div className="container">
                {/* Lista eventos */}
                <EventList>              
                    {eventsFound.length > 0
                        ? eventsFound.map(event => (<Card event={event} key={event.id} />))
                        : events.length > 0
                            ? events.map(event => (<Card event={event} key={event.id} />))
                            : <p style={{ color: '#757679' }}>Nenhum evento encontrado {eventName && 'com o nome'} <strong>{eventName && `"${eventName}"`}</strong>.</p>
                    }
                </EventList>

                {
                    events.length > 0 &&
                    // Botões para paginação
                    <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalLimit={10} events={events} />
                }
            </div>
        </>
    )
}