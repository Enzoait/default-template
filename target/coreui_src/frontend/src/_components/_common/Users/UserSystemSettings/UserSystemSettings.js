import React, { Component } from 'react';
import { EmptyPane, WaitingPane, DataTable, Wizard, WizardConfirm} from '_components/_common';
import { preferencesService } from '_services/preferences.service';
import AddSettings from './AddSettings.js';
import Form from 'react-bootstrap/Form';
import queryString from 'query-string';

class UserSystemSettings extends Component {

	constructor(props){
		super(props);
		this.state = {
			loading:true,
			results:[],
			metaData:{},
			createForm:{},
			editingRow: null,
		}

		this.updateEditedSetting = this.updateEditedSetting.bind(this);
		this.cancelEditedSetting = this.cancelEditedSetting.bind(this);
		this.setEditingRow = this.setEditingRow.bind(this);
		this.formDataChange = this.formDataChange.bind(this);
		this.getCreatePage = this.getCreatePage.bind(this);
		this.delete = this.delete.bind(this);
		this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this);
	}

	getRootObjectForDetailsId(){
		const queryUrlParams = queryString.parse(this.props.location.search);
		let objectforDetailsId = queryUrlParams.rootId;
		return objectforDetailsId
	}

	delete(itemId){
		let containerId = this.props.containerId;

		preferencesService.drop(itemId, containerId).then(response => {
			this.componentDidMount();
			this.setState({
				loading:true,
				createForm:{},
				editingRow: null,
			});
		})
	}
	onCreateItemSuccess(wizardCloseFunction){
		if(wizardCloseFunction) {
			wizardCloseFunction();
		}

		this.componentDidMount();
	}

	getCreatePage(wizardCloseFunction){
		return <AddSettings
					userHidden={true}
					accountId={this.getRootObjectForDetailsId()}
					containerId={this.props.containerId}
					onCreateItemSuccess={() => this.onCreateItemSuccess(wizardCloseFunction)}
					wizardMode={true}/>
	}

	updateEditedSetting(val){
		let id = val.id;
		let containerId = this.props.containerId;
		let accountId = this.getRootObjectForDetailsId();
		let value = this.state.createForm.value;

		preferencesService.update(accountId, id, containerId, value).then(response => {
			this.componentDidMount();
			this.setState({
				createForm:{},
				editingRow: null,
			});
		})
	}

	cancelEditedSetting(val){
		let id = val.id;
		this.setState({
			createForm: {},
			editingRow: null
		})
	}

	setEditingRow(v, i){
		let createForm = {};
		createForm['value'] = v.value;
		createForm['id'] = v.id;

		this.setState({
			editingRow: v.id,
			createForm: createForm,
		})
	}

	formDataChange(e){
		let createForm = {...this.state.createForm}
		createForm[e.target.name] = e.target.value
		this.setState({
			createForm: createForm
		})
	}

	settingsDatatable(){
		const tableConfig = {
				columnsConfig: [
					{ name:'Name', dataField: 'attributes.displayName', headerClassName: 'td-left', className: 'td-left'},
					{ name:'Value',displayComponent: (v,i) => this.settingsValue(v,i), dataField: 'attributes', headerClassName: 'td-left', className: 'td-left'},
					{ displayComponent: (v,i) => this.rowAction(v,i), dataField: 'attributes'}
				],
		}

		let items = [];
		this.state.results.map(item => {
			items.push({attributes: {id: item.attributes.accountId, value: item.attributes.value, key: item.attributes.key, displayName: item.attributes.displayName}})
		})

		return 	<DataTable items={JSON.stringify(items)}
	            	metaData={JSON.stringify(this.state.metaData)}
	                tableConfig={tableConfig}
	                displayTotalElements={true}
	            	paginate={false}/>
	}

	settingsValue(val){
		let form;
		if(this.state.editingRow && this.state.editingRow === val.id){
			form = (
		      <Form.Control type="text"
		    	  placeholder="Value"
		    	  onChange={this.formDataChange}
		    	  value={this.state.createForm.value}
		    	  name="value"
		    	  className="mb-2"/>
			)
		}
		else {
			form = val.value;
		}

		return <td className="td-left">
			{form}
		</td>
	}
	componentDidMount(){
		let containerId = this.props.containerId;
		let accountId = this.getRootObjectForDetailsId();

		preferencesService.getSystemPreferences(accountId, containerId).then(response => {
			this.setState({
				results: response.data,
				metaData:response.metaData,
				loading:false
			});
			return response;
		})
		.catch(error => {
			this.setState({
				loading:false
			});
		})
	}
	headerActions(){
		return <div className="btn-toolbar border-bottom" style={{padding: '12px'}}>
				<Wizard
					dialogSize="md"
					buttonIcon="fa fa-sm fa-plus"
					hideFooter={true}
					buttonTitle='NEW USER SETTINGS'
					dialogTitle="New user settings"
					dialogContentProvider={(wizardCloseFunction)=>this.getCreatePage(wizardCloseFunction)}/>
		</div>
	}
	rowAction(v, i){
		if(this.state.editingRow && this.state.editingRow === v.id){
			return 	<td width="12%">
				<div className="btn-toolbar" style={{paddingTop: '1rem'}}>
					<button onClick={() => this.updateEditedSetting(v,i)}> UPDATE </button>
					<button onClick={() => this.cancelEditedSetting(v,i)}>CANCEL</button>
				</div>
			</td>
		}
		else {
			let ref = v.id;
			return 	<td width="12%">
				<div className="btn-toolbar" style={{paddingTop: '1rem'}}>
					<button onClick={() => this.setEditingRow(v,i)}><i className="fa fa-pencil"></i></button>
					<WizardConfirm
						buttonIcon="fa fa-times"
						onConfirm={() => this.delete(ref)}
						dialogMessage="Do you really want to remove this user system settings?"
						dialogTitle={"Remove setting".toUpperCase()}/>
				</div>
			</td>
		}
	}

	rows(){
		if(this.state.results && this.state.results.length > 0){
    		return this.settingsDatatable();
    	}
    	else {
			return <EmptyPane />
		}
	}

    render() {
    	if(this.state.loading === true){
    		return <WaitingPane />
    	}

    	return  <div className="">
    		{this.headerActions()}
    		{this.rows()}
        </div>
   }
}


export default UserSystemSettings;
