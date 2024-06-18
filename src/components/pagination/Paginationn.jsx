import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Button from "react-bootstrap/Button"
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons"

// Como adicinar no componente pai que usa o componente Paginationn
/* 
import React, { useState, useCallback } from 'react';
import Paginationn from "../../../components/pagination/Paginationn.jsx"; // Ajuste o caminho conforme necessário

function ParentComponent() {
    // Estado para a lista de itens completa
    const [items, setItems] = useState([...]); // Sua lista de itens
    // Estado para os itens da página atual
    const [currentItems, setCurrentItems] = useState([]);

    // Função de callback para lidar com a mudança de página
    const handlePageChange = useCallback((pageItems) => {
        setCurrentItems(pageItems);
    }, []);

    // Renderização do componente pai e dos itens da página atual
    return (
        <div>
            <div>
                {currentItems.map(item => (
                    <div key={item.id}>{item.name}</div>
                ))}
            </div>
            <Paginationn items={items} onPageChange={handlePageChange} />
        </div>
    );
}

// Exportação do componente pai
export default ParentComponent;
*/


// Componente de paginação que recebe itens e uma função de callback para informar a mudança de página
export default function Pagination({ items, onPageChange }) {
    
    const [currentPage, setCurrentPage] = useState(1) // Estado para controlar a página atual
    
    const [totalPages, setTotalPages] = useState(1) // Estado para controlar o número total de páginas
    
    const itemsPerPage = 10 // Número de itens por página

    // Efeito para atualizar o número total de páginas e resetar a página atual quando os itens mudam
    useEffect(() => {
        setTotalPages(Math.ceil(items.length / itemsPerPage))
        setCurrentPage(1)
    }, [items])

    // Efeito para atualizar os itens da página atual e chamar a função de callback
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const current = items.slice(startIndex, endIndex)
        onPageChange(current)
    }, [currentPage, items, onPageChange])

    // Função para ir para a próxima página
    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
    }

    // Função para ir para a página anterior
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
    }

    // Renderização do componente de paginação
    return (
        <div className='mt-4 d-flex justify-content-center align-items-center'>
            <Button variant='primary' onClick={goToPreviousPage} disabled={currentPage === 1}>
                <ArrowLeft />
            </Button>
            <div className='mx-4 d-flex justify-content-center align-items-center'>
                <span>pág {currentPage}</span>
            </div>
            <Button variant='primary' onClick={goToNextPage} disabled={currentPage === totalPages}>
                <ArrowRight />
            </Button>
        </div>
    )
}

// PropTypes para validar as props do componente Pagination
Pagination.propTypes = {
    items: PropTypes.array.isRequired,
    onPageChange: PropTypes.func.isRequired,
}
