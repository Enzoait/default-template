import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {  Input} from 'reactstrap';
import {WaitingPane, EmptyPane, DataTable } from '_components/_common';
import {TeamTemplateDetails } from '_components/_admin';
import { containerService } from '_services/container.services';
import { RiTeamLine } from "react-icons/ri";
import Button from 'react-bootstrap/Button'

/**
 * Team template page
 */
class TeamTemplates extends Component {

	constructor(props){
		super(props);
		this.state = {
			items: [],
			metaData: '',
			loading:true,

			viewMode: 'viewList'
		}
	}

	componentDidMount(){
		containerService.getAllTeamTemplates(0, 6, false, this.props.containerId).then(json => {
            return json;
        })
        .then(json => {
        	this.setState({
        		items: json.data,
        		metaData: json.metaData,
        		loading: false
        	})
        })
        .catch(error => {
        	console.error(error);
        	this.setState({
        		loading: false
        	})
        });
	}

    selectTemplate(e, id){
		if(e) e.preventDefault()
		this.setState({
			selectedTemplate: id,
			viewMode: 'viewDetails'
		})
	}

	componentDidUpdate(prevprops, prevState){
		if(prevState.viewMode !== this.props.viewMode){
			this.setState({
				viewMode: this.props.viewMode
			})
		}
	}

	/**
     * Generates href with link to details view
     */
    LinkTo(val, item){
        return <td>
				<Link onClick={e=>this.selectTemplate(e,item.attributes.id)}>
					{val.displayName}
				</Link>
        </td>
    }

    moreActions = (val) => {
		return (
			<td className="dt-center">
				<Button onClick={e => this.selectTemplate(e, val.id)}>DETAILS</Button>
			</td>
		)
	}

	getSearchHeader(){
		return <div className="admin-filters-root"> 
		    	<Input type="text" id="input1-group2"
		    		className="admin-filters-search-input"
		    		name="input1-group2"
		    		placeholder="Search team template"
		    		autocomplete="off"
		    		defaultValue={this.state.searchTerm}/>
	     </div>
	}

	render() {
		let items = this.state.items;
		const metaData = this.state.metaData;

		const tableConfig = {
			columnsConfig: [
				{ displayComponent: (v) => enIcon(v) },
			    { name: 'Name', displayComponent: (v, i) => this.LinkTo(v,i), dataField: 'attributes'},
			    { name:'Description', dataField: 'attributes.description'},
        		{ name:'Internal name', dataField: 'attributes.internalName'},
			    //{ name:'Created', dataField: 'attributes.createDate', dateFormat: 'DD/MM/YYYY' },
		       	{ name:'Last updated', dataField: 'attributes.lastModifiedDate', dateFormat: 'DD/MM/YYYY HH:mm' },
				{ name: 'Content', displayComponent: (e, v) => this.moreActions(e, v.id), dataField: 'attributes'},
			],
		}

		if(this.state.viewMode === 'viewList'){
			let datatable;
			if(this.state.loading){
				datatable = <WaitingPane />
			}
	        else if(this.state.items.length === 0){
	        	datatable = <EmptyPane mainMessage='Current container has no team templates' />
	        }
	        else {
	        	datatable = <DataTable items={JSON.stringify(items)}
	        			tableClassName="data-table"
						pagination={true}
		        		hideTableHeader={true}
		        		displayTotalElements={true}
	        			metaData={JSON.stringify(metaData)}
	        			tableConfig={tableConfig}/>
	        }

	        return <div className="portlet-box">{datatable}</div>
        }

        return <div className="">
				<TeamTemplateDetails
					pushBreadCrumb={this.props.pushBreadCrumb}
					templateId={this.state.selectedTemplate}/>
		</div>
  }
}

const enIcon = (val) => {
	if(val) return <td  className="dt-center">
			<RiTeamLine  color="#EEEE" size="1.3em"/>
		</td>
	return <td></td>
}


export default TeamTemplates;
