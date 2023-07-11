import React, { Component } from 'react';
import { AttributeListGroup, WaitingPane} from '_components/_common';
import { preferencesService } from '_services/preferences.service';
import {commons} from "_helpers/commons";

/**
 * Add new settings
 */
class AddSettings extends Component {

	constructor(props) {
		super(props)
		this.state = {
			formData: {
				createContainerId: this.props.ceateContainerId,
				loading: false
			},
			errors:[]
		}

		this.create = this.create.bind(this)
		this.attributesList = this.attributesList.bind(this);
		this.handleSuccessResponse = this.handleSuccessResponse.bind(this);
		this.handleErrorResponse = this.handleErrorResponse.bind(this);
	}
	async create(formData) {
		this.setState({
			loading:true
		})

		let accountId = this.props.accountId;
		let containerId = this.props.containerId;
		let userHidden = this.props.userHidden;

		formData.owner = accountId;
		formData.container = containerId;
		formData.userHidden = userHidden;

		preferencesService.create(formData, this.props.containerId).then(response => {
			if(commons.isRequestSuccess(response)){
				this.handleSuccessResponse(response, formData);
			}
			else {
				this.handleErrorResponse(response);
			}
		})
	}
	handleErrorResponse(formData){
		this.setState({
			loading: false,
			errors: ['Error occurs when creating entity'],
			formData: formData
		})
	}
	handleSuccessResponse(response, formData){
		this.setState({
			loading: false,
		})

		let itemId = response.data.attributes.id;
		if(this.props.onCreateItemSuccess){
			this.props.onCreateItemSuccess(itemId);
		}
	}
	/**
	 * Attributes list
	 */
	attributesList(){
        const attributesList = {
            title: 'Summary',
			icon: 'fa fa-info float-right',
			formId: 'create_profileAttributesList_form',
			saveButtonTitle: 'CREATE',
			addHeaderMargin: true,
			onSubmit: (formData) => this.create(formData),
            attributes: [
                {name: 'Display Name', dataField: 'displayName', type: 'text',required:true,  placeHolder: 'Name'},
    			{name: 'Key', dataField: 'key', type: 'text', required: true},
    			{name: 'Value', dataField: 'value', type: 'text', required: true},
            ]
        }

        return attributesList;
    }

   render() {
	   if(this.state.loading === true){
		   return <WaitingPane bordered={false}/>
	   }

	   let errors = [];
	   if(this.state.errors.length > 0) {
		   this.state.errors.map(error => {
			   errors.push(<p>{error}</p>)
		   })
	   }

	  let formData ={...this.state.formData};
	  return (
	        <div>
				<div id="form-errors-section" className="form-error">
					{errors}
				</div>
				<AttributeListGroup
					attributesListConfig={this.attributesList()}
					data={formData}
					standardFooterActions="true"
					formMode='create_object'/>
	      </div>
	   )
  }
}

export default AddSettings;
