import React, { Component } from 'react';
import { AttributeListGroup} from '_components/_common';
import { accountService } from '_services/account.services';
import { loginService } from '_services/login.services';
import { commons } from '_helpers/commons';
import {toast} from "react-toastify";
import {coreUri} from "_helpers/CoreUri";

/**
 * Register new org.
 */
class AddOrg extends Component {

	constructor(props) {
		super(props)
		this.state = {
			formData: {
				container: this.getRegisteringContainer(),
				withAccount: true,
				simpleUserForm: true,
				name: '',
			},
			loading: false,
			errors:[]
		}

		this.registerAttributesList = this.registerAttributesList.bind(this)
		this.registerUser = this.registerUser.bind(this);
		this.handleResponse = this.handleResponse.bind(this)
		this.onFormChange = this.onFormChange.bind(this)
		this.formValidity = this.formValidity.bind(this)
	}

	onFormChange(form){
		this.setState({formData: form})
	}

	getRegisteringContainer(){
		if(this.props.registeringContainer){
			return this.props.registeringContainer;
		}
		return this.props.containerId;
	}

	_handleRegister(formData){
		formData.container = this.getRegisteringContainer();
		formData.orgType = "com.katappult.people.Party/Organization";
		formData.withAccount = 'true'

		if(this.props.handleRegister){
			this.props.handleRegister(formData)
		}
		else {
			this.registerUser(formData)
		}
	}

	registerUser(formData) {
		this.setState({
			loading:true,
			formData: formData
		})

		this.setPropsProcessing(true)
		if(this.props.fromConnectedUser){
			accountService.registerOrgWithAccount(formData).then(response => {
				this.handleResponse(response, formData);
				toast(commons.toastSuccess("Le compte utilisateur a été créé"));
			}).catch(error => {
				console.error(error);
				this.setState({loading: false})
				this.setPropsProcessing(false)
			});
		}
		else {
			accountService.registerOrgWithAccountAnon(formData).then(response => {
				this.handleResponse(response, formData)
			}).catch(error => {
				this.setState({loading: false})
				this.setPropsProcessing(false)
			});

		}
	}

	setPropsProcessing(value){
		if(this.props.onProcessing){
			this.props.onProcessing(true)
		}
	}

	/**
	 * Handle save response.
	 */
	async handleResponse(response, formData){
		this.setPropsProcessing(false);

		if(commons.isRequestError(response)){
			this.props.onError(response.message)
			this.setState({
				loading: false,
				formData: formData,
				errors: [response.message],
			})
		}
		else {
			if(!this.props.fromConnectedUser){
				let loginForm = {};
				loginForm.login = formData.accountEmail;
				loginForm.password = formData.accountPassword;

				let response = await loginService.login(loginForm).then(response => {
					return response;
				});

				let authorization = await response.text();
				commons.setSessionId(authorization)
				if(authorization) this.handleLoginSuccess(authorization);
			}
			else {
				this.setPropsProcessing(false)
				if(this.props.onCreatePeopleSuccess){
					this.props.onCreatePeopleSuccess()
				}
			}
		}
	}

	async handleLoginSuccess(authorization){
		loginService.postLogin(authorization).then(json => {
			commons.katappult_core_loginSuccess(json);

			let account = JSON.parse(json.data.links.account)
			let active = account.active;
			if(active) {
				window.location.href = coreUri.clientSideRenderedURL('/');
			}
			else {
				window.location.href = coreUri.clientSideRenderedURL('/activateAccount');
			}
		});
	}

	formValidity(form) {
		const {name, accountEmail, accountPassword} = form;
		const newErrors = {}

		if (!name || name === '') newErrors.name = 'Champs invalide';
		if (!accountEmail || accountEmail === '') newErrors.accountEmail = 'Champs invalide';
		if (!accountPassword || accountPassword === '') newErrors.accountPassword = 'Champs invalide';

		if (!commons.validateEmail(accountEmail)){
			newErrors.accountEmail = 'Champs invalide';
		}
		return newErrors;
	}

	registerAttributesList() {
		const buttonTitle = this.props.createButtonTitle ?  this.props.createButtonTitle : 'Créer un compte'
		const profileAttributesList = {
			saveButtonTitle: buttonTitle,
			saveButtonClassName: this.props.createButtonClassName,
			formValidity: (formData) => this.formValidity(formData)	,
			onSubmit: (formData) => this._handleRegister(formData),
			attributes: [
				{name: 'Name', dataField: 'name',required:true,  placeHolder: 'Organization name'},
				{name: 'Email', dataField: 'accountEmail', type:'email', required: true, placeHolder: 'Email'},
				{name: 'Password', dataField: 'accountPassword', type:'password', required: true, placeHolder: 'Password'},
			]
		}

		return profileAttributesList;
	}

	render() {
		let form = {...this.state.formData}
		if(this.props.initialData){
			form = {
				attributes : {
					name: this.props.initialData.name,
					accountEmail: this.props.initialData.accountEmail
				}
			}
		}

		return <div className={'add-people'}>
			{this.state.loading !== true && <AttributeListGroup
				attributesListConfig={this.registerAttributesList()}
				additionalWizardLeftActions={this.props.additionalWizardLeftActions}
				data={form}
				standardFooterActions="true"
				formMode='create_object'/>
			}
		</div>
	}
}

export default AddOrg;
