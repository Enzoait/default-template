import React, {useEffect, useState} from 'react';
import {Pagination, PaginationItem, PaginationLink} from "reactstrap";

function DatatablePagination(props) {

    const [maxPage, setMaxPage] = useState(props.metaData.totalPages)
    const [hasPrevious, setHasPrevious] = useState(props.metaData.hasPreviousPage)
    const [hasNext, setHasNext] = useState(props.metaData.hasNextPage)
    const [currentPage, setCurrentPage] = useState(props.metaData.pageNumber)
    const [totalElements, setTotalElements] = useState(props.metaData.totalElements)

    useEffect(() => {
        setMaxPage(props.metaData.totalPages)
        setHasPrevious(props.metaData.hasPreviousPage)
        setHasNext(props.metaData.hasNextPage)
        setCurrentPage(props.metaData.pageNumber)
        setTotalElements(props.metaData.totalElements)

    }, [props.metaData])

    const goNextPage = (e) =>{
        e.preventDefault();
        if(hasNext === true){
            let pc = currentPage + 1;
            if(pc > maxPage){
                _doGoToPage(0)
            }
            else {
                _doGoToPage(pc)
            }
        }
    }

    const goPreviousPage = (e) => {
        e.preventDefault();
        if(hasPrevious === true){
            let pc = currentPage - 1;
            if(pc < 0){
                _doGoToPage(0);
            }
            else {
                _doGoToPage(pc)
            }
        }
    }

    const handlePagination = (e, i) => {
        e.preventDefault();
        _doGoToPage(i);
    }

    const _doGoToPage = (i)  => {
        if (props.goToPage) {
            props.goToPage(i)
        }
    }

    let pagination, index = 0;
    const pitem = [];

    let displayTotalElements = props.displayTotalElements === true;
    const paginationSize = props.tableConfig ? props.tableConfig.paginationSize : paginationSize;

    if(props.paginate === true) {
        pitem.push(<PaginationItem disabled={!hasPrevious} >
            <PaginationLink previous tag="button" onClick={e => goPreviousPage(e)}>Prev</PaginationLink>
        </PaginationItem>);

        for(let i = index; i < maxPage; i++) {
            let pageIndex = i;
            let active = currentPage === pageIndex
            let elem = <PaginationItem active={active} key={i}>
                <PaginationLink tag="button" name={pageIndex} href={pageIndex} onClick={e => handlePagination(e, pageIndex)}>{++index}</PaginationLink>
            </PaginationItem>

            pitem.push(elem);
        }

        pitem.push(<PaginationItem disabled={!hasNext}>
            <PaginationLink next tag="button" onClick={e => goNextPage(e)}>Next</PaginationLink>
        </PaginationItem>);

        let totalElements;
        if(displayTotalElements){
            totalElements = <div className="items-number">
                <p>Page {currentPage + 1} of {maxPage} - {props.metaData.totalElements} Element(s)</p>
            </div>
        }

        pagination = <div className="table-footer">
            {maxPage > 1 &&
              <Pagination aria-label="Page navigation" className="pagination" size={paginationSize}>{pitem}</Pagination>
            }
            <div className="table-total-elements">{totalElements}</div>
        </div>
    }
    else {
        pagination = <div></div>
    }

    return pagination;

}

export default DatatablePagination;
