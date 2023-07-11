import React, { Component } from 'react';
import { revControlledService } from '_services/revcontrolled.services';
import { DataTable, WaitingPane, EmptyPane } from '_components/_common';
import { RiPencilLine, RiCheckLine } from "react-icons/ri";
import Button from "react-bootstrap/Button";

class AllIterations extends Component {

	constructor(props){
		super(props)
		this.state = {
			items: [],
			loading: true,
		}

		this.tableActions = this.tableActions.bind(this)
	}

	componentDidMount(){
		let revControlledId = this.props.revControlledId;
		if(!this.props.versionId){
			revControlledService.allIterationsOf(revControlledId, this.props.containerId).then(response => {
				this.setState({
					items: response && response.data ? response.data : [],
					metaData: response && response.data ? response.metaData : {},
					loading: false
				})
			})
		}
		else {
			revControlledService.allIterationsOfversion(revControlledId, this.props.versionId,this.props.containerId).then(response => {
				this.setState({
					items: response && response.data ? response.data : [],
					metaData: response && response.data ? response.metaData : {},
					loading: false
				})
			})
		}
	}

	tableActions(v,i){
		return <td className={'td-center'}>
			<Button onClick={() => this.props.toIterationDetails(v.id)}><i className="fa fa-info fa-sm"></i></Button>
		</td>
	}

	render (){
		let items = this.state.items;
		let metaData = this.state.metaData;
		let tableConfig;
		if(!this.props.versionId){
			tableConfig = {
				columnsConfig: [
					{ displayComponent: (v) => lockedIcon(v), dataField: 'attributes', defaultSortOrder: 'asc', headerClass: 'td-left', className:'td-left'},
					{ name: 'Name', dataField: 'attributes', displayComponent: (v) => nameOf(this.props.name), headerClass: 'td-left', className:'td-left'},
					{ name: 'Version', dataField: 'attributes.iterationInfo.iterationNumber', defaultSortOrder: 'asc', headerClass: 'td-left', className:'td-left' },
					{ name: 'Created', dataField: 'attributes.createDate', dateFormat: 'DD/MM/YYYY', headerClass: 'td-left', className:'td-left' },
					{ name: 'Updated', dataField: 'attributes.lastModifiedDate', dateFormat: 'DD/MM/YYYY', headerClass: 'td-left', className:'td-left' },
				],
			}
		}
		else {
			tableConfig = {
				columnsConfig: [
					{ displayComponent: (v) => lockedIcon(v), dataField: 'attributes', defaultSortOrder: 'asc', headerClass: 'td-left', className:'td-left'},
					{ name: 'Name', dataField: 'attributes', displayComponent: (v) => nameOf(this.props.name), headerClass: 'td-left', className:'td-left'},
					{ name: 'Version', dataField: 'attributes.versionInfo.versionId', defaultSortOrder: 'asc', headerClass: 'td-left', className:'td-left' },
					{ name: 'Iteration', dataField: 'attributes.iterationInfo.iterationNumber', defaultSortOrder: 'asc', headerClass: 'td-left', className:'td-left' },
					{ name: 'Created', dataField: 'attributes.createDate', dateFormat: 'DD/MM/YYYY', headerClass: 'td-left', className:'td-left' },
					{ name: 'Updated', dataField: 'attributes.lastModifiedDate', dateFormat: 'DD/MM/YYYY', headerClass: 'td-left', className:'td-left' },
					{ dataField: 'attributes', displayComponent: (v,i) => this.tableActions(v,i), headerClass: 'td-center', className: 'td-center'},
				],
			}

		}

		let content;
		if(items !== null && items.length > 0){
			content = <DataTable items={JSON.stringify(items)}
						tableClassName="data-table"
						pagination={false}
						displayTotalElements={true}
						metaData={JSON.stringify(metaData)}
						tableConfig={tableConfig}/>
		}
		else if(this.state.loading === true){
			content = <WaitingPane />
		}
		else {
			content = <EmptyPane mainMessage="No history" />
		}

		return content
	}
}

export default AllIterations;


const  nameOf = (name) => {
	return <td className={'td-left'}>
		{name}
	</td>
}

const lockedIcon = (attributes) => {
	if(attributes.workInfo.isWorkingCopy === true){
		return <td className="dt-left">
			<RiPencilLine color="#000" size="1.5em"/>
		</td>
	}
	else if(attributes.iterationInfo.isLatestIteration === true){
		return <td className={'td-left'}>
			<RiCheckLine color="#000" size="1.5em"/>
		</td>
	}

	return <td></td>
}
