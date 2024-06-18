import { useEffect, useState } from "react";
import { findAllEvents } from "../services/eventService";
import { getCategories } from "../services/categoryService";
import { findAllLocals } from "../services/localService";

const useSearch = () => {

    const [events, setEvents] = useState([]);
    const [eventsFound, setEventsFound] = useState([]);

    const [eventName, setEventName] = useState("");

    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState("");
    
    const [locals, setLocals] = useState([]);
    const [localId, setLocalId] = useState("");

    const [date, setDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
 
    useEffect(() => {
        getAllEvents();
    }, [currentPage, eventName, category, localId, date]); // Busca eventos sempre que houver uma alteração na página os parâmetros de filtragem

    useEffect(() => {
        getAllCategories();
        getAllLocals();
    }, []); // Carrega as categorias e locais apenas uma vez


    const getAllEvents = async () => {
        const limit = 10;
        const offset = (currentPage - 1) * limit;
        
        try {
            const response = await findAllEvents(eventName, category, localId, date, limit, offset);
            if(response) {
                setEvents(response);
            } else setEvents([]);
        } catch(error) {
            console.log(error.message)
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const getAllCategories = async() => {
        try {
            const response = await getCategories();
            setCategories(response || []);
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
   
    // Retorna um objeto com todas as variáveis de estado e funções
    return { getAllEvents, events, eventsFound, setEventsFound, currentPage, handlePageChange, eventName, setEventName, categories, setCategory, locals, setLocalId };
}

export default useSearch;