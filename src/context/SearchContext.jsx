import { createContext } from 'react';
import useSearch from '../hooks/useSearch'; // Hook criado para busca

// Permite inicializar o contexto do componente useSearch
export const SearchContext = createContext();

// Responsável em fornecer/Prover os dados
export const SearchProvider = ({children}) => {
    
    const { getAllEvents, events, eventsFound, setEventsFound, currentPage, handlePageChange, eventName, setEventName, categories, setCategory, locals, setLocalId, setDate  } = useSearch();

    return (
        <SearchContext.Provider value={{ getAllEvents, events, eventsFound, setEventsFound, currentPage, handlePageChange, eventName, setEventName, categories, setCategory, locals, setLocalId, setDate }}>
            {children}
        </SearchContext.Provider>
    );
}