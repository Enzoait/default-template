import React, { Component, Suspense } from 'react';
import {Input} from 'reactstrap';
import { Link } from 'react-router-dom';
import {DataTable, WaitingPane, EmptyPane } from '_components/_common';
import {FolderTemplateDetails } from '_components/_admin';
import { containerService } from '_services/container.services';
import { RiFolderSettingsLine } from "react-icons/ri";
import Button from 'react-bootstrap/Button'

/**
 * Generates folder icon
 */
const folderIcon = (val) => {
	if(val) return <td><i className="icon-folder icons font-xl"></i></td>
	return <td></td>
}
/**
 * Folder template page
 */
class FolderTemplates extends Component {

	constructor(props){
		super(props);
		this.state = {
			items: [],	
			metaData: '',
			loading:true,
			viewMode: 'viewList',
			name: ''
		}
	}
	componentDidMount(){
		containerService.getAllFolderTemplates(0, 10, false, this.props.containerId)
        .then(json => {
            return json;
        })
        .then(json => {
        	this.setState({
        		items: json.data,
        		metaData: json.metaData,
        		loading: false,
        	})
        })
        .catch(error => {
        	console.error(error);
        	this.setState({
        		loading: false,
        	})
        });
    }
    componentDidUpdate(prevProps, prevState){
		if(prevState.viewMode !== this.props.viewMode){
			this.setState({
				viewMode: this.props.viewMode
			})
		}
	}
    selectTemplate(e, id){
		if(e) e.preventDefault()
		this.setState({
			selectedTemplate: id,
			viewMode: 'viewDetails'
		})
	}
    LinkTo(val, item){
        return <td>
			<Link onClick={e=>this.selectTemplate(e,item.attributes.id)}>
				{val.displayName}
			</Link>
        </td>
    }
    url = (item) => {
        const url = `/admin/p/folderTemplates/${item.attributes.id}`
        return url;
    }
    moreActions = (val) => {	
		return (
			<td className="dt-center">
				<Button variant="outline-secondary" size="sm">DETAILS</Button>
			</td>
		)
	}
	
	getSearchHeader(){
		return	<div className="admin-filters"> 
		    	<Input type="text" id="input1-group2"
		    		className="admin-filters-search-input" 
		    		name="input1-group2" 
		    		placeholder="Folder template name"
		    		autocomplete="off"
		    		defaultValue={this.state.searchTerm}/>
	       </div>
	}	
	
	
	render() {
		const items = this.state.items;
        const metaData = this.state.metaData;
        const tableConfig = {
        		columnsConfig: [
        			{ displayComponent: (v) => enIcon(v) },
        		    { name:'Name', displayComponent: (v, i) => this.LinkTo(v,i), dataField: 'attributes' },
        		    { name:'Description', dataField: 'attributes.description'},
        			{ name:'Internal name', dataField: 'attributes.internalName'},
        		    //{ name:'Created', dataField: 'attributes.createDate', dateFormat: 'DD/MM/YYYY'},
		        	{ name:'Last updated', dataField: 'attributes.lastModifiedDate', dateFormat: 'DD/MM/YYYY HH:mm' },
		        	{ name: 'Content', displayComponent: (e, v) => this.moreActions(e, v.id), dataField: 'attributes'},
        		],
        };
        
        let leftContent;
        if(this.state.viewMode === 'viewList'){
        	 if(this.state.loading === true){
         		leftContent = <div className="p-5">
         		 	<WaitingPane />
         		 </div>
         	}	
        	else if(this.state.items.length === 0){
        		leftContent = <div className="p-5"> 
        			<EmptyPane hideMainMessage={true} emptyMessage='Current container has no folder templates' />
        		</div>
        	}
        	else {
	        	leftContent =   <DataTable
	        			tableClassName="data-table" 
		        		items={JSON.stringify(items)} 
		        		pagination={true}
		        		displayTotalElements={true}	
		        		metaData={JSON.stringify(metaData)} 
		        		tableConfig={tableConfig}/>
        	}
       
	        return <div className="portlet-content">
		    	{leftContent}
		    </div>
		}
		
		if(this.state.viewMode === 'viewDetails'){
			return <div>
				<FolderTemplateDetails 
					pushBreadCrumb={this.props.pushBreadCrumb} 
					templateId={this.state.selectedTemplate}/>
			</div>
		}
  }
}

const enIcon = (val) => {
	if(val) return <td  className="dt-center">
			<RiFolderSettingsLine  className="mr-2" color="#EEEE" size="1.3em"/>
		</td>
	return <td></td>
}

export default FolderTemplates;


