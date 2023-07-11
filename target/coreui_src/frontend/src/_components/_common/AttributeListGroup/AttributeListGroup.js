import React, { Component } from 'react';
import {Label, Table, Input} from 'reactstrap';
import PropTypes from 'prop-types';
import {commons} from '_helpers/commons';
import AttributeArrayGroup from './AttributeArrayGroup.js';
import AttributeArrayObjectGroup from './AttributeArrayObjectGroup.js';
import { Form } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import moment from 'moment';
import Button from 'react-bootstrap/Button'
import "react-datepicker/dist/react-datepicker.css";

const propTypes = {
	data: PropTypes.object,
	attributesListConfig: PropTypes.object.isRequired,
	cardClassName: PropTypes.string,
	orientation: PropTypes.string,
	displayHeader: PropTypes.bool,
	actions: PropTypes.func,
};

const defaultProps = {
	cardClassName: " no-border",
	orientation: "horizontal",
	displayHeader: false
};

/**
 * Displays a list of attributes grouped in table.
 */
class AttributeListGroup extends Component {

	constructor(props){
		super(props)
		this.state = {
			formsState: [],
			formValidated: false,
			editingFormData: props.data === undefined ? '{}' : props.data.attributes,
			initialData: props.data === undefined ? '{}' : props.data,
			errors: []
		}

		this.standardFooterActions = this.standardFooterActions.bind(this)
		this.standardEditForm = this.standardEditForm.bind(this)
		this.standardSaveForm = this.standardSaveForm.bind(this)
		this.standardResetForm = this.standardResetForm.bind(this)
		this.handleFormChange = this.handleFormChange.bind(this)
		this.isEditing = this.isEditing.bind(this)
	}

	handleFileChange(event){

	}

	handleFormChange(event, name, type, pattern){
		let editingFormData = {...this.state.editingFormData}
		let attPath = name ? name : event.target.name
		/*if(attPath.includes('.')) {
			let one = attPath.split('.')[0]
			let two = attPath.split('.')[1]
			attPath = two;
		}*/

		//attPath = attPath.startsWith('yes_no_') ? attPath.split('yes_no_')[1] : attPath;

		/*let one = attPath.split('.')[0]
        let two = attPath.split('.')[1]
        console.log('attPath :: ' + attPath)
        console.log('editingFormData :: ' + editingFormData)
        let editingFormData0 = editingFormData[one]
        editingFormData0[two] = event.target.value
    }
    else {*/
		// for date field, returns date directly not the
		// component
		if(event && event.target && event.target.type === 'checkbox'){
			if(event.target.name.startsWith('yes_no_')){
				editingFormData[attPath.split('yes_no_')[1]] = event.target.checked
			}
			else {
				let datas = editingFormData[attPath] ? editingFormData[attPath].split(';') : []
				if(event.target.checked){
					datas.push(event.target.value)
					editingFormData[attPath] = datas.join(';')
				}
				else {
					if(datas.length <= 1){
						editingFormData[attPath] = ''
					}
					else {
						const index = datas.indexOf(event.target.value);
						if(index !== -1) datas.splice(index, 1);
						editingFormData[attPath] = datas.join(';')
					}
				}
			}
		}
		else if(event && event.target && event.target.type === 'radio'){
			editingFormData[attPath] = event.target.value
		}
		else if(type && type === 'date'){
			editingFormData[attPath] = event != null ? moment(event).format("YYYYMMDD") : null
		}
		else if(type && type === 'datetime'){
			editingFormData[attPath] = event != null ? moment(event).format("YYYYMMDDHHmmss") : null
		}
		else {
			editingFormData[attPath] = event.target ? event.target.value : event;
			if(event.target.type === 'file') {
				this.setState({masterFile: event.target.files[0]})
			}
		}
		//}

		if(pattern){
			if(event.target.value.match(pattern)){
				if(this.props.onFormChange) this.props.onFormChange(editingFormData)
				this.setState({editingFormData: editingFormData})
			}
		}
		else {
			if(this.props.onFormChange) this.props.onFormChange(editingFormData)
			this.setState({editingFormData: editingFormData})
		}
	}

	setFormDataValue(key, value){
		let editingFormData = {...this.state.editingFormData}
		editingFormData[key] = value
		this.setState({
			editingFormData: editingFormData,
		})
	}

	standardEditForm(e, token){
		e.preventDefault()
		let formsState = [...this.state.formsState]
		formsState[token] = 'edit'

		if(!this.state.editingFormData){
			this.setState({
				formsState: formsState,
				editingFormData: {}
			})
		}
		else {
			this.setState({
				formsState: formsState,
			})
		}
	}

	standardSaveForm(e, token, attributesListConfig){
		e.preventDefault()

		if(attributesListConfig.processing){
			attributesListConfig.processing()
		}

		let formData = {...this.state.editingFormData}
		e.preventDefault();
		e.stopPropagation();

		let newErrors = []
		if(attributesListConfig.formValidity) {
			newErrors = attributesListConfig.formValidity(formData)
		}

		if (attributesListConfig.endProcessing) {
			attributesListConfig.endProcessing()
		}

		if (Object.keys(newErrors).length > 0) {
			this.setState({errors: newErrors})
		} else {
			let formsState = [...this.state.formsState]
			formsState[token] = 'view'
			if(this.state.masterFile){
				formData.masterFile = this.state.masterFile
			}

			// THIS METHOD SHOULD COLLECT FORM DATA
			// SEND REDUX ACTION EVENT TO INFORM FORM OWNER TO UPDATE DATA IN REMOTE API
			// THE OWNER WILL THE UPDATE STATE AND VIEW WILL BE REFRESHED
			if(attributesListConfig.onSubmit){
				let result = attributesListConfig.onSubmit(formData)
				if(result){ // is always undefined, client should update view
					this.setState({
						formsState: formsState,
						formValidated: true
					})
				}
			}
		}
	}

	standardResetForm(e, token){
		e.preventDefault()
		let formsState = this.state.formsState.slice()
		formsState[token] = 'view'
		let editingFormData = {...this.state.initialData}
		this.setState({
			formsState: formsState,
			editingFormData: editingFormData.attributes
		})

		let form = document.getElementById(token.split('_view')[0]);
		if(form) form.reset();
	}

	standardFooterActions = (formId, attributesListConfig) => {
		let token = formId + "_view",
			saveButtonTitle = attributesListConfig.saveButtonTitle ? attributesListConfig.saveButtonTitle : "Sauvegarder";

		if(this.state.formsState[token] === 'edit' || this.props.formMode === 'create_object') {
			if(this.props.formMode === 'create_object'){
				return (
					<React.Fragment>
							{this.props.additionalWizardLeftActions && this.props.additionalWizardLeftActions()}
							<Button block className={attributesListConfig.saveButtonClassName}
									onClick={(e) => this.standardSaveForm(e, token, attributesListConfig)}> {saveButtonTitle}
								{attributesListConfig.saveButtonIcon}
							</Button>
					</React.Fragment>
				)
			}
			else {
				return (
					<React.Fragment>
						<div className="float-right">
							<Button onClick={(e) => this.standardSaveForm(e, token, attributesListConfig)}> <i className="fa fa-save"></i> Enregistrer</Button>
							<Button onClick={(e) => this.standardResetForm(e, token)}> <i className="fa fa-undo"></i> Annuler</Button>
						</div>
					</React.Fragment>
				)
			}
		}
		else if(!this.state.formsState[token] || this.state.formsState[token] === 'view') {
			if(this.props.canEdit){
				return (
					<React.Fragment>
						<div className="float-right">
							<Button onClick={(e) => this.standardEditForm(e, token)}><i className="fa fa-edit"></i> Modifier</Button>
						</div>
					</React.Fragment>
				)
			}
			else {
				return <hr/>
			}
		}
	}

	processGroup(attributes) {
		const attrs = [];
		if(attributes && attributes.length > 0){
			let index = 0;

			attributes.map(attribute => {

				index++;
				let lastRow = index === attributes.length;

				if(attribute.type && (attribute.type === 'custom')) {
					if(attribute.displayComponent){
						attrs.push(attribute.displayComponent())
					}
				}
				else if(attribute.type && (attribute.type === 'object')) {
					attrs.push(
						<React.Fragment>
							<tr className="noBorder">
								<td colSpan="3">
									<div className="spacer-20"></div>
								</td>
							</tr>
							<tr className="noBorder">
								<td colSpan="3" className="paddingless">
									<label className="katappult-form-title-level-1">{attribute.title}</label>
								</td>
							</tr>
							<tr>
							</tr>
						</React.Fragment>
					)
					attribute.items.map(a => {
						attrs.push(this.simpleHRow(a));
					})
				}
				else if(attribute.type && (attribute.type === 'objectarray'
					|| attribute.type === 'editableLabelObjectarray')) {

					// for objectarray form, title is computed on this level
					// when it does not repeated on each bloc of array.
					// If need to repeat it, use arrayTitleProvider
					let headerActions;
					if(attribute.headerActions) headerActions = attribute.headerActions();
					let title =  attribute.title;
					if(attribute.title || attribute.titleProvider){
						title = attribute.title ? attribute.title : attribute.titleProvider()
						attrs.push(
							<React.Fragment>
								<tr>
									<td colSpan="3" className="paddingless">
										<label className="katappult-form-title-level-1">{title}</label>
										<div className="float-right">
											{headerActions}
										</div>
									</td>
								</tr>
							</React.Fragment>
						)
					}
					attrs.push(this.simpleArrayRow(attribute));
				}
				else {
					let rowActions = attribute.rowActions ? attribute.rowActions() : "";
					if("horizontal" === this.props.orientation) {
						if(rowActions){
							attrs.push(this.actionableHRow(attribute));
						}
						else {
							attrs.push(this.simpleHRow(attribute, lastRow));
						}
					}
					else {
						attrs.push(this.simpleVRow(attribute, lastRow))
					}
				}
			});
		}

		return attrs;
	}

	processHeader(){
		let header, headerActions;
		if(this.props.displayHeader === true && this.props.attributesListConfig.headerActions) {
			headerActions = this.props.attributesListConfig.headerActions()
		}

		if(this.props.displayHeader === true && this.props.attributesListConfig.title) {
			header = <tr width="100%">
				<td colSpan="3" className="paddingless">
					<h3 className="form-title-level-0">{this.props.attributesListConfig.title}</h3>
					<div className="float-right">
						{headerActions}
					</div>
				</td>
			</tr>
		}

		if(this.props.displayHeader === true && this.props.attributesListConfig.titleProvider) {
			header = <tr>
				<td colSpan="3" className="paddingless">
					<h3>{this.props.attributesListConfig.titleProvider()}</h3>
					<div className="float-right">
						{headerActions}
					</div>
				</td>
			</tr>
		}
		return header;
	}

	/**
	 * Attribute array ca be:
	 * 1. An array of string
	 * 2. An array of object
	 *
	 * Array of string (stringarray) example: {email:[
	 *  'toto@me.com','tata@me.com',
	 * ]
	 *
	 * Array of object (editableLabelObjectarray) example:
	 * phones: [
	 *   	{'Home phone': '33 11 123 12'},
	 *   	{'Mobile phone': '32 12 123 12'},
	 * ]
	 * Array of object labels can be editable
	 */
	simpleArrayRow(attribute) {
		const rootdata = this.props.data;
		if(attribute.type === 'objectarray' || attribute.type === 'editableLabelObjectarray') {

			let arrayOfvalues = commons.getPropByString(rootdata, attribute.dataField);
			if(!arrayOfvalues || arrayOfvalues === '') arrayOfvalues = []
			// in this case, the header is not repeated for each line bloc
			// we just display each row with action, unique header and footer actions
			if(attribute.type === 'editableLabelObjectarray'){
				let formId = 'formid_array_group_1'
				return <AttributeArrayGroup {...this.props}
											canEdit={this.props.canEdit}
											items={arrayOfvalues}
											attribute={attribute}
											wrapInform={formId}/>
			}
			else {
				let rows = <AttributeArrayObjectGroup {...this.props} items={arrayOfvalues} attribute={attribute}/>
				return (
					<React.Fragment>
						<tr>
							<td colSpan="3">
								<table width="100%" id="dt-form">
									<tbody>{rows}</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td colSpan="3"></td>
						</tr>
					</React.Fragment>
				)
			}
		}
	}

	rowActions(attribute){
		const rowActions = attribute.items.rowActions ? attribute.items.rowActions() : '';
		return 	(
			<tr>
				<td colspan="2"  align="right">{rowActions}</td>
			</tr>
		)
	}

	simpleVRow(attribute) {
		const data = this.state.editingFormData;
		let val = commons.getPropByString(data, attribute.dataField);
		let editor = attribute.type ? attribute.type : 'text';
		let pattern = attribute.pattern;

		return (
			<React.Fragment>
				<tr className="td-left">
					<td>{attribute.name}</td>
				</tr>
				<tr className="td-left">
					<td><Input type={editor} defaultValue={val}
							   autoComplete={'off'}
							   onChange={(e) => this.handleFormChange(e, null, null, pattern)}
							   name={attribute.dataField} pattern={attribute.pattern}/>
					</td>
				</tr>
			</React.Fragment>
		)
	}

	simpleHRow(attribute, lastRow) {

		if(this.isEditing() && !attribute.readOnly){

			const data = this.state.editingFormData;
			let val = data ? commons.getPropByString(data, attribute.dataField) : '';
			let editor = commons.getInputType(attribute);
			let showLabel = attribute.labelLess !== 'true';

			let feedBack =  <Form.Control.Feedback type="invalid">
				{attribute.invalidFeedBack ? attribute.invalidFeedBack : 'Valeur requise'}
			</Form.Control.Feedback>

			if(attribute.editorComponent){
				return  <Form.Group className="field field-string" >
					{showLabel && <Form.Label>{attribute.name}</Form.Label>}
					{attribute.editorComponent()}
				</Form.Group>
			}

			if("select" === editor && attribute.enumProvider){
				let options = [], enums = attribute.enumProvider(this.state.editingFormData);
				if(!attribute.required){
					options.push(<option value=''>...</option>)
				}

				enums.map(e => {
					let opt = <option value={e.key}>{e.value}</option>
					options.push(opt)
				})

				return (
					<React.Fragment>
						<Form.Group className="field field-string">
							{showLabel && <Form.Label>{attribute.name}</Form.Label>}
							<Form.Control as="select"
										  className={'field-select'}
										  type={'select'}
										  value={val}
										  isInvalid={!!this.state.errors[attribute.dataField]}
										  onChange={this.handleFormChange}
										  name={attribute.dataField}>
								{options}
							</Form.Control>
							{feedBack}
						</Form.Group>
					</React.Fragment>
				)
			}

			if('yesno' === editor){
				return <Form.Group className="field field-string" >
					<Form.Check
						type={'checkbox'}
						label={attribute.name}
						onChange={e=>this.handleFormChange(e)}
						name={'yes_no_' + attribute.dataField}
						checked={val === true ? 'checked' : ''}
						isInvalid={!!this.state.errors[attribute.dataField]}
						value={val}
						required={attribute.required}>
					</Form.Check>
					{feedBack}
				</Form.Group>
			}


			if("date" === editor){
				// date must be converted in that format
				// otherwise the dislayed date in input is wrong
				//val = val.split(' ')[0]
				//val = moment(str, 'YYYY-MM-DD')
				val = val ? moment(val, 'YYYYMMDD') : null
				let date = val ? val.toDate() : null;
				const placeholder = attribute.placeHolder ? attribute.placeHolder : 'dd/mm/yyyy'
				return (
					<Form.Group className="field field-string" >
						{showLabel && <Form.Label>{attribute.name}</Form.Label>}
						<DatePicker
							selected={date}
							isInvalid={!!this.state.errors[attribute.dataField]}
							onChange={e => this.handleFormChange(e, attribute.dataField, 'date')}
							placeholderText={attribute.placeHolder}
							dateFormat="dd-MM-yyyy"
							isClearable
						/>
						{feedBack}
					</Form.Group>
				)
			}
			if("datetime" === editor){
				// date must be converted in that format
				// otherwise the dislayed date in input is wrong
				//val = val.split(' ')[0]
				//val = moment(str, 'YYYY-MM-DD')
				val = val ? moment(val, 'YYYYMMDDHHmmss') : null
				let date = val ? val.toDate() : null;
				return (
					<Form.Group className="field field-string" >
						{showLabel && <Form.Label>{attribute.name}</Form.Label>}
						<DatePicker
							selected={date}
							showTimeSelect
							withPortal
							isClearable
							isInvalid={!!this.state.errors[attribute.dataField]}
							onChange={e => this.handleFormChange(e, attribute.dataField, 'datetime')}
							placeholderText={attribute.placeHolder}
							dateFormat="dd-MM-yyyy HH:mm"
							timeFormat="HH:mm"
						/>
						{feedBack}
					</Form.Group>
				)
			}

			if('textarea' === editor){
				return (
					<Form.Group className="field field-string" >
						{showLabel && <Form.Label>{attribute.name}</Form.Label>}
						<Form.Control placeholder={attribute.placeHolder}
									  autoComplete={'off'}
									  className={''}
									  isInvalid={!!this.state.errors[attribute.dataField]}
									  onChange={e=>this.handleFormChange(e)}
									  name={attribute.dataField}
									  defaultValue={val}
									  value={val} type={attribute.type ? attribute.type: 'textarea'}
									  as="textarea" rows="4"
									  required={attribute.required}/>
						{feedBack}
					</Form.Group>
				)
			}

			if('checkbox' === editor && attribute.enumProvider) {
				const result = attribute.enumProvider(this.state.editingFormData).map((data) =>
					<Form.Check
						type={'checkbox'}
						onChange={e=> this.handleFormChange(e)}
						isInvalid={!!this.state.errors[attribute.dataField]}
						name={attribute.dataField}
						checked={val.split(';').includes(data.key) ? 'checked' : ''}
						value={data.key}
						label={data.value}
						required={attribute.required}/>
				);

				return <Form.Group className="field field-string" >
					<Form.Label>{attribute.name}</Form.Label>
					<div style={{display: 'flex'}}>{result}</div>
				</Form.Group>
			}

			if('radio' === editor){
				if(attribute.enumProvider){
					const result = attribute.enumProvider(this.state.editingFormData).map((data) =>
						<Form.Check
							type={'radio'}
							onChange={e=>this.handleFormChange(e)}
							name={attribute.dataField}
							checked={val === data.key}
							isInvalid={!!this.state.errors[attribute.dataField]}
							value={data.key}
							label={data.value}
							required={attribute.required}>
						</Form.Check>
					);

					return <Form.Group className="field field-string" >
						<Form.Label>{attribute.name}</Form.Label>
						{result}
					</Form.Group>
				}
			}

			return (
				<Form.Group className="field field-string" >
					{showLabel && <Form.Label>{attribute.name}</Form.Label>}
					<Form.Control placeholder={attribute.placeHolder}
								  autoComplete={'off'}
								  className={''}
								  onChange={e=>this.handleFormChange(e)}
								  name={attribute.dataField}
								  isInvalid={!!this.state.errors[attribute.dataField]}
								  defaultValue={val}
								  value={val} type={attribute.type ? attribute.type: 'text'}
								  pattern={attribute.pattern}
								  required={attribute.required}/>
					{feedBack}
				</Form.Group>
			)
		}
		else {
			const data = this.state.initialData.attributes;
			let dataKey = attribute.dataField;
			if(dataKey.startsWith('attributes.')){
				dataKey = attribute.dataField.split('attributes.')[1]
			}

			let value = data ? commons.getPropByString(data, dataKey) : '';
			const display = commons.getAttributeViewer(attribute, value)
			const suffix = attribute.suffix ? attribute.suffix : ''
			let selectValue  = [];
			if(attribute.enumProvider){
				attribute.enumProvider(this.state.editingFormData).map(val => {
					if(value.split(';').includes(val.key)) {
						selectValue.push(val.value)
					}
				})
			}

			if(attribute.type === 'yesno'){
				return (
					<React.Fragment>
						<table width="100%" className={lastRow ? 'dt-form-last-row': ''}>
							<tr className="td-left">
								<td width="40%" className="dt-form td-left"><Label className="control-label-view">{attribute.name}</Label></td>
								<td width="60%" className="dt-form td-left" style={{'word-wrap':'break-word'}}>
									<input type={'checkbox'} disabled checked={value}/>
								</td>
							</tr>
						</table>
					</React.Fragment>
				)
			}

			return (
				<React.Fragment>
					<table width="100%" className={lastRow ? 'dt-form-last-row': ''}>
						<tr className="td-left">
							<td width="40%" className="dt-form td-left"><Label className="control-label-view">{attribute.name}</Label></td>
							<td width="60%" className="dt-form td-left" style={{'word-wrap':'break-word'}}>{selectValue.length > 0 ? selectValue.join(', ') : display} {suffix}</td>
						</tr>
					</table>
				</React.Fragment>
			)
		}
	}


	actionableHRow(attribute) {
		const data = this.state.editingFormData;
		let val = commons.getPropByString(data, attribute.dataField);
		let rowActions = attribute.rowActions ? attribute.rowActions() : "";
		let rowGroupActions = attribute.rowGroupActions ? attribute.rowGroupActions() : "";
		let editor = commons.getInputType(attribute);
		return(
			<React.Fragment>
				<tr>
					<td><Label className="control-label-view">{attribute.name}</Label></td>
					<td>
						<table width="100%">
							<tbody>
							<tr>
								<td><Input type={editor} defaultValue={val} onChange={(e) => this.handleFormChange(e)} name={attribute.dataField} pattern={attribute.pattern}/></td>
								<td>{rowActions}</td>
							</tr>
							<tr>
								<td>{attribute.empty}</td>
								<td>{rowGroupActions}</td>
							</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</React.Fragment>
		)
	}

	processFooter(){
		let action;
		if(this.props.attributesListConfig.footerActions){
			action = this.props.attributesListConfig.footerActions();
		}
		else if(this.props.standardFooterActions) {
			action = this.standardFooterActions(this.props.attributesListConfig.formId,
				this.props.attributesListConfig)
		}
		return action;
	}

	isEditing(){
		let formId = this.props.attributesListConfig.formId;
		return this.state.formsState[formId + '_view'] === 'edit' || this.props.formMode === 'create_object'
	}

	componentWillReceiveProps(props) {
		this.setState({
			editingFormData: props.data.attributes,
			initialData: props.data
		})
	}

	render() {
		const attributes = this.props.attributesListConfig.attributes;
		let attrs = this.processGroup(attributes);

		// TOP LEVEL COMMONE HEADER OF THE GROUP
		// IF THERE IS ONE
		let finalheader;
		if(this.props.displayHeader === true){
			let header = this.processHeader();
			finalheader = (
				<table width="100%" id="dt-form">
					<tbody>
					{header}
					</tbody>
				</table>
			)
		}

		// COMMONS FOOTER
		let finalFooter;
		let footer = this.processFooter();
		if(footer){
			finalFooter = (
				<div className="btn-toolbar-right">{footer}</div>
			)
		}

		// body classname
		let bodyClassName = "no-border";
		if(this.props.attributesListConfig.addHeaderMargin || this.props.addHeaderMargin){
			bodyClassName = "no-border noBorder katappult-top-margin-20";
		}

		// IF TOP LEVEL CONFIGURATION HAS DEFINED A FORMID ATTRIBUTE,
		// MEANS THAT ALL BLOCS BELONGS TO SAME FORM
		let body
		if(this.props.attributesListConfig.formId){
			if(this.isEditing()){
				body = <div className={this.props.cardClassName}>
					<Form ref={form => this.formEl = form} validated={this.state.formValidated} id={this.props.attributesListConfig.formId}>
						{attrs}
					</Form>
				</div>
			}
			else {
				body = <div className={this.props.cardClassName}>
					<Table id="dt-form" borderless={this.props.attributesListConfig.borderLess}
						   size="sm" className={bodyClassName}>
						<tbody>{attrs}</tbody>
					</Table>
				</div>
			}

		}
		else {
			body = <div className={this.props.cardClassName}>
				<Table id="dt-form" borderless={this.props.attributesListConfig.borderLess || this.isEditing()}
					   size="sm" className={bodyClassName}>
					<tbody>{attrs}</tbody>
				</Table>
			</div>
		}

		return (
			<div className="attributes-list">
				{finalheader}
				{body}
				{finalFooter}
			</div>
		)
	}
}

AttributeListGroup.propTypes = propTypes;
AttributeListGroup.defaultProps = defaultProps;


export default AttributeListGroup;
