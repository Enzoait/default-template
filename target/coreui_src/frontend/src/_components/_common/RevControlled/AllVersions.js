import React, { Component } from 'react';
import { revControlledService } from '_services/revcontrolled.services';
import { DataTable, WaitingPane, EmptyPane } from '_components/_common';
import { RiPencilLine, RiCheckLine } from "react-icons/ri";
import Button from "react-bootstrap/Button";
import {AllIterations} from "_components/_common";

class AllVersions extends Component {

	constructor(props){
		super(props)
		this.state = {
			items: [],
			loading: true,
		}

		this.allVersionView = this.allVersionView.bind(this)
		this.onAllIterationsSelected = this.onAllIterationsSelected.bind(this)
		this.tableActions = this.tableActions.bind(this)
		this.toIterationDetails = this.toIterationDetails.bind(this)
	}

	componentDidMount(){
		let revControlledId = this.props.revControlledId;
		revControlledService.allVersionsOf(revControlledId, this.props.containerId).then(response => {
			this.setState({
				items: response && response.data ? response.data : [],
				metaData: response && response.data ? response.metaData : {},
				loading: false
			})
		})
		.catch(error=> {
			this.setState({loading: false})
		})
	}

	allVersionView(){
		this.setState({
			viewMode: null,
			allIterationsItem: null
		})
	}

	onAllIterationsSelected(v, item){
		this.setState({
			viewMode: 'allIterations',
			allIterationsItem: item
		})
	}

	tableActions(v, i){
		return <td>
			<Button onClick={() => this.onAllIterationsSelected(v,i)}><i className="fa fa-list fa-sm"></i></Button>
		</td>
	}

	allIterationsView(){
		const data = this.state.allIterationsItem
		const versionId = data.attributes.versionInfo.versionId
		return <>
			<div className={'btn-toolbar btn-toolbar-right'}>
				<button onClick={this.allVersionView}>Toutes les versions</button>
			</div>
			<AllIterations
				toIterationDetails={this.props.toIterationDetails}
				versionId={versionId}
				containerId={this.props.containerId}
				name={data.masterAttributes.name}
				description={data.masterAttributes.description}
				revControlledId={data.attributes.id}/>
		</>
	}

	toIterationDetails(id){

	}

	render (){

		if(this.state.viewMode === 'allIterations'){
			return this.allIterationsView()
		}

		let items = this.state.items;
		let metaData = this.state.metaData;
		let tableConfig = {
			columnsConfig: [
				{ displayComponent: (v) => lockedIcon(v), dataField: 'attributes', defaultSortOrder: 'asc', headerClass: 'td-left', className:'td-left'},
			    { name: 'Name', dataField: 'attributes', displayComponent: (v) => nameOf(this.props.name), headerClass: 'td-left', className:'td-left'},
				{ name: 'Version', dataField: 'attributes.versionInfo.versionId', defaultSortOrder: 'asc', headerClass: 'td-left', className:'td-left' },
			    { name: 'Created', dataField: 'attributes.createDate', dateFormat: 'DD/MM/YYYY', headerClass: 'td-left', className:'td-left' },
    		    { name: 'Updated', dataField: 'attributes.lastModifiedDate', dateFormat: 'DD/MM/YYYY', headerClass: 'td-left', className:'td-left' },
				{ displayComponent: (v,i) => this.tableActions(v,i), headerClass: 'td-left', className: 'td-left'},
			],
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

export default AllVersions;


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
