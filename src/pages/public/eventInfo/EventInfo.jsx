import { useLocation, useNavigate, useParams } from "react-router-dom";
import { findEventById } from "../../../services/eventService";
import { useEffect, useState } from "react";
import { ArrowLeftSquare, Clock, ChevronRight, PinMap } from 'react-bootstrap-icons';
import './EventInfo.css';

export const EventInfo = () => {

  const navigate = useNavigate(); // Permite navegar entre páginas
  const { id } =  useParams(); // Pega o valor do id passado via parâmetro
  const { state } = useLocation(); // Pega estado passado por meio do navigate
  const [event, setEvent] = useState({});

  useEffect(()=>{
    getEventById();
  }, [id])

  const getEventById = async () => {
    try {
      const response = await findEventById(id);
      response && setEvent(response);
    } catch (error) {
      console.error(error.message)
    }
  }

  const formattedDate1 = new Intl.DateTimeFormat('pt-BR', {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  });

  const formattedDate2 = new Intl.DateTimeFormat('pt-BR', {
    day: "2-digit",
    month: "short",
    hour:"2-digit",
    minute: "2-digit"
  });

  const differentDates = state.data_inicio !== state.data_fim;

  return(
    <section className={'container-event'}>
      <div className="titulo">{event.nome}</div>
      <div className="banner">
        <img src={event.imagem} alt="img" className="imgBanner" />
      </div>

      <div className="container-fluid">
        <div className="headerInfo">
          <h1>
            {event.nome}
            <span title="Voltar" onClick={() => window.history.back()}><ArrowLeftSquare /></span>
          </h1>

          <div className="dateInfo">
            <span className="icon"><Clock /></span>
            {differentDates ?
              formattedDate2.format(new Date(state.data_inicio)) : formattedDate1.format(new Date(state.data_inicio))
            }
            { differentDates && (<ChevronRight />) }
            { differentDates && formattedDate2.format(new Date(state.data_fim)) }
          </div>

          <h4> <span className="icon"><PinMap /></span> {state.local.endereco} - {state.local.cidade}, {state.local.estado}
          </h4>
        </div>

        <div className="eventDescription">
          <h2>Descrição do evento</h2>

          <p>{event.descricao}</p>
        </div>

      </div>
    </section>
  )
};