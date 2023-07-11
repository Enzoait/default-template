import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { DataTableHeader, DataTableRow } from '../index';
import PropTypes from 'prop-types';
import {EmptyPane} from '_components/_common';
import DatatablePagination from "_components/_common/DataTable/Table/DatatablePagination";

const propTypes = {
    tableConfig: PropTypes.array,
    items: PropTypes.any,
    metaData: PropTypes.any,
    tableClassName: PropTypes.string,
    paginate: PropTypes.bool,
    goToPage: PropTypes.func,
};
const defaultProps = {
    tableConfig:[],
    items:'',
    metaData: '',
    paginate: true,
};
/**
 * Simple DataTable
 */
class DataTable extends Component {

	constructor(props){
		super(props)

		let maxPage = 1,
		metaData = null, currentPage = 0,
		hasPrevious =false,
		hasNext = false, totalElements = 0;

		if(this.props.metaData){
			metaData = JSON.parse(this.props.metaData)
			if(metaData){
				maxPage = metaData.totalPages
				currentPage= metaData.pageNumber
				hasPrevious= metaData.hasPreviousPage
				hasNext= metaData.hasNextPage
				totalElements = metaData.totalElements
			}
		}

		this.state ={
			currentPage: currentPage,
			maxPage: maxPage,
			hasPrevious: hasPrevious,
			hasNext: hasNext,
			totalElements: totalElements,

			metaData: metaData,
			items: this.props.items !== null ? JSON.parse(this.props.items) : [],
		}
	}

	loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    populateRows() {
        const rows = [];
        const itms = JSON.parse(this.props.items);
		itms.map((item) => {
            rows.push(
             <DataTableRow  {...this.props}
							item={item}
							tableConfig={this.props.tableConfig}
							columns={this.props.tableConfig.columnsConfig}/>
            );
		 });
		 return rows;
	}

    componentWillUpdate(nextProps, prevState){
    	//console.log('>>>>>>>>>> nextProps : ' + nextProps.metaData)
    	//console.log('>>>>>>>>>> this.state : ' + JSON.stringify(this.state.metaData))
    	if(this.state.metaData && nextProps.metaData !== JSON.stringify(this.state.metaData)){
    		let metaData = JSON.parse(nextProps.metaData);
    		this.setState({
    			metaData: metaData,
    			items: JSON.parse(nextProps.items),
    			currentPage: metaData.pageNumber,
    			maxPage : metaData.totalPages,
				hasPrevious: metaData.hasPreviousPage,
				hasNext: metaData.hasNextPage,
				totalElements: metaData.totalElements
    		})
    	}
    }

	render() {

		if(this.props.totalElements > 0 || this.props.items ){
			const rows = this.populateRows();
            const title = this.props.tableTitle ? this.props.tableTitle :
            	this.props.tableConfig.title? this.props.tableConfig.title : '';

            const titleDisplay = title ? (
                  <div className="katappult-table-header">
                      <h3>{title}</h3>
                  </div>
            ): ''

			const metaData = this.props.metaData ? JSON.parse(this.props.metaData) : {}

			return (
				<React.Fragment>
                  {titleDisplay}
                  <Table hover={this.props.hover} responsive
                  	size={this.props.size} id={this.props.tableId}
                  	className={this.props.tableClassName} striped={this.props.striped}
                  	bordered={this.props.bordered}>

					  <DataTableHeader {...this.props}
							hideTableHeader={this.props.tableConfig.hideTableHeader}
							columns={this.props.tableConfig.columnsConfig}/>
					  <tbody>{rows}</tbody>
                  </Table>
				  <DatatablePagination {...this.props} metaData={metaData}/>
          </React.Fragment>
		  );
		}
		else {
            return emptyTableContent(this.props.tableConfig.emptyMessageTitle,
                this.props.tableConfig.emptyMessageDescription,
                this.props.tableConfig.emptyMessageSubDescription,
                this.props.tableConfig.emptyActions);
		}
  }
}

const emptyTableContent = (title, description, subDescription, emptyActions) => {
	let emptyActionsDisplay
	if(emptyActions){
		emptyActionsDisplay = emptyActions()
	}

	return (
        <div className="empty-table-pane">
              <EmptyPane mainMessage={description} actions={emptyActionsDisplay}/>
        </div>
  )
}


DataTable.propTypes = propTypes;
DataTable.defaultProps = defaultProps;

export default DataTable;
