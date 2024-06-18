import './Pagination.css'
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";

export const Pagination = ({currentPage, handlePageChange, totalLimit, events}) => {
    return(
        <div className="text-center mt-4 mb-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
            className='btnPagination'>
                <ArrowLeft />
            </button>

            <span className='currentPage'>pág {currentPage}</span>

            <button onClick={() => handlePageChange(currentPage + 1)} disabled={events.length < totalLimit}
            className='btnPagination'>
                <ArrowRight />
            </button>
        </div>
    );
}