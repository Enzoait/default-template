import React, {Component} from 'react';
import {Table} from 'reactstrap';
import {DataTableHeader, DataTableRow} from '../index';

class AutoScrollDataTable extends Component {

    constructor(props) {
        super(props)

        let maxPage= 1,
            metaData = null,
            currentPage = 0,
            hasPrevious = false,
            hasNext = false,
            pageElements= 0,
            totalElements = 0;

        if (this.props.metaData) {
            metaData = JSON.parse(this.props.metaData)
            if (metaData) {
                maxPage = metaData.totalPages
                currentPage = metaData.pageNumber
                hasPrevious = metaData.hasPreviousPage
                hasNext = metaData.hasNextPage
                totalElements = metaData.totalElements
                pageElements = metaData.pageElements ? metaData.pageElements : 0;
            }
        }

        this.state = {
            currentPage: currentPage,
            maxPage: maxPage,
            metaData: metaData,
            hasPrevious: hasPrevious,
            hasNext: hasNext,
            totalElements: totalElements,
            pageElements: pageElements,
            isLoading: false,
            items: this.props.items !== null ? JSON.parse(this.props.items) : [],
        }

        this.handlePagination = this.handlePagination.bind(this)
        this.onScroll = this.onScroll.bind(this)
    }

    onScroll() {
        let scroll = window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight
            && !this.state.isLoading;

        if (scroll) {
            let canGoNext = this.state.hasNext === true && this.props.goToPage;
            if (canGoNext) {
                this.goNextPage();
            }
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    handlePagination(e, i) {
        if (e) e.preventDefault();
        if (this.props.goToPage) {
            this._doGoToPage(e.target.name)
        }
    }

    goNextPage(e) {
        if (e) e.preventDefault();
        if (this.state.hasNext === true && this.props.goToPage) {
            let pc = ++this.state.currentPage
            if (pc > this.state.maxPage) {
                this._doGoToPage(0)
            } else {
                this._doGoToPage(pc)
            }

        }
    }

    goPreviousPage(e) {
        if (e) e.preventDefault();
        if (this.state.hasPrevious === true && this.props.goToPage) {
            let pc = --this.state.currentPage
            if (pc < 0) {
                this._doGoToPage(0)
            } else {
                this._doGoToPage(pc)
            }

        }
    }

    _doGoToPage(i) {
        if (this.props.goToPage) {
            this.props.goToPage(i)
        }
        this.setState({isLoading: true})
    }

    populateHeaderPagination() {
        const {metaData} = this.state;
        let pagination = <div className="float-right autoscroll-pagination">
            <p className="table-total-element">{this.state.pageElements}/{metaData.totalElements} Element(s)</p>
        </div>
        return pagination;
    }

    populateFooterPagination() {
        const {metaData} = this.state;
        let pagination = <div className="float-right autoscroll-pagination">
            <p className="table-total-element">{this.state.pageElements}/{metaData.totalElements} Element(s)</p>
        </div>
        return pagination;
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    populateRows() {
        const rows = [];
        const items = this.state.items;
        items.map((item) => {
            rows.push(
                <DataTableRow  {...this.props} item={item} columns={this.props.tableConfig.columnsConfig}/>
            );
        });

        return rows;
    }

    componentWillUpdate(nextProps, prevState) {
        if (this.state.metaData && nextProps.metaData !== JSON.stringify(this.state.metaData)) {
            let metaData = JSON.parse(nextProps.metaData);
            let currItems = this.state.items.slice();
            currItems.concat(JSON.parse(nextProps.items));

            //console.log('nextProps.metaData : ' + nextProps.metaData)
            let pageElements;
            if (metaData.totalPages > 1) {
                pageElements = this.state.pageElements + metaData.pageElements
            } else {
                pageElements = metaData.totalElements
            }

            this.setState({
                metaData: metaData,
                items: JSON.parse(nextProps.items),
                currentPage: metaData.pageNumber,
                maxPage: metaData.totalPages,
                hasPrevious: metaData.hasPreviousPage,
                hasNext: metaData.hasNextPage,
                totalElements: metaData.totalElements,
                pageElements: pageElements,
                isLoading: false
            })
        }
    }

    render() {
        if (this.props.totalElements > 0 || this.props.items !== null) {
            const rows = this.populateRows();
            const headerPagination = this.populateHeaderPagination();
            const footerPagination = this.populateFooterPagination();

            return (
                <React.Fragment>
                    {headerPagination}
                    <Table hover={this.props.hover} responsive
                           size={this.props.size} id={this.props.tableId}
                           className={this.props.tableClassName} striped={this.props.striped}
                           bordered={this.props.bordered}>

                        <DataTableHeader {...this.props}
                                         hideTableHeader={this.props.tableConfig.hideTableHeader}
                                         columns={this.props.tableConfig.columnsConfig}/>
                        <tbody>{rows}</tbody>
                    </Table>
                    {footerPagination}
                </React.Fragment>
            );
        }
    }
}


export default AutoScrollDataTable;
