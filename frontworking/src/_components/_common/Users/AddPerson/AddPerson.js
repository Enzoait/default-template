import React, { Component } from 'react';
import { AttributeListGroup} from '_components/_common';
import { accountService } from '_services/account.services'
import { loginService } from '_services/login.services';
import { commons } from '_helpers/commons';
import {toast} from "react-toastify";
import {coreUri} from "_helpers/CoreUri";

class AddPerson extends Component {

	constructor(props) {
		super(props)
		this.state = {
			formData: {
				container: this.getRegisteringContainer(),
				gender: this.props.gender,
				lastName: '',
				firstName: '',
				simpleUserForm: true,
				accountEmail:'',
				accountPassword: '',
			},

			loading:false,
			errors:[]
		}

		this.registerAttributesList = this.registerAttributesList.bind(this)
		this.registerUser = this.registerUser.bind(this);
		this.handleResponse = this.handleResponse.bind(this)
		this.setPropsProcessing = this.setPropsProcessing.bind(this)
		this.onFormChange = this.onFormChange.bind(this)
		this.findFormErrors = this.findFormErrors.bind(this)
	}

	onFormChange(form){
		this.setState({formData: form})
	}

	getRegisteringContainer(){
		return this.props.containerId;
	}

	_handleRegister(formData){

		formData.container = this.getRegisteringContainer();
		formData.gender = this.props.gender;
		formData.peopleType = 'com.katappult.people.Party/Person';
		formData.withAccount = true

		if(this.props.handleRegister){
			this.props.handleRegister(formData)
		}
		else {
			this.registerUser(formData)
		}
	}

	registerUser(formData) {
		this.setState({
			loading: true,
			formData: formData
		})

		this.setPropsProcessing(true)

		if(this.props.fromConnectedUser){
			accountService.registerPersonWithAccount(formData).then(response => {
				this.handleResponse(response, formData);
				toast(commons.toastSuccess("Le compte utilisateur a été créé"));
			}).catch(error => {
				this.setState({
					loading: false,
					errors: ['Erreur interne']
				})

				this.setPropsProcessing(false)
			});
		}
		else {
			accountService.registerPersonWithAccountAnon(formData).then(response => {
				this.handleResponse(response, formData)
			}).catch(error => {
				this.setState({loading: false})
				this.setPropsProcessing(false)
			});

		}
	}

	setPropsProcessing(value){
		if(this.props.onProcessing){
			this.props.onProcessing(value)
		}
	}

	/**
	 * Handle save response.
	 */
	async handleResponse(response, formData){
		let errorStates = []
		if(commons.isRequestError(response)) {
			this.props.onError(response.message)
			this.setState({
				loading: false,
				formData: formData,
				errors: [response.message],
			})
		}
		else {
			if(!this.props.fromConnectedUser) {
				const loginForm = {};
				loginForm.login = formData.accountEmail;
				loginForm.password = formData.accountPassword;

				const response = await loginService.login(loginForm).then(response => {
					return response;
				})

				const authorization = await response.text();
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

	handleLoginSuccess(authorization){
		loginService.postLogin(authorization).then(json => {
			commons.katappult_core_loginSuccess(json);

			const account = JSON.parse(json.data.links.account)
			const active = account.active;
			if(active) {
				window.location.href = coreUri.clientSideRenderedURL('/');
			}
			else {
				window.location.href = coreUri.clientSideRenderedURL('/activateAccount');
			}
		});
	}

	registerAttributesList() {
		const buttonTitle = this.props.createButtonTitle ?  this.props.createButtonTitle : 'Créer un compte'
		const profileAttributesList = {
			saveButtonTitle: buttonTitle,
			saveButtonClassName: this.props.createButtonClassName,
			formValidity: (formData) => this.findFormErrors(formData)	,
			onSubmit: (formData) => this._handleRegister(formData),
			attributes: [
				{name: 'Lastname', dataField: 'lastName', required: true, placeHolder: 'Last name'},
				{name: 'Firstname', dataField: 'firstName', required: true, placeHolder: 'First name'},
				{name: 'Email', dataField: 'accountEmail', type:'email', required: true, placeHolder: 'Email'},
				{name: 'Password', dataField: 'accountPassword', type:'password', required: true, placeHolder: 'Password'},
			]
		}

		return profileAttributesList;
	}

	findFormErrors(form) {
		const {lastName, firstName, accountEmail, accountPassword} = form;
		const newErrors = {}

		if (!lastName || lastName === '') newErrors.lastName = 'Champs invalide';
		if (!firstName || firstName === '') newErrors.firstName = 'Champs invalide';
		if (!accountEmail || accountEmail === '') newErrors.accountEmail = 'Champs invalide';
		if (!accountPassword || accountPassword === '') newErrors.accountPassword = 'Champs invalide';

		if (!commons.validateEmail(accountEmail)){
			newErrors.accountEmail = 'Champs invalide';
		}

		return newErrors;
	}

	render() {
		let form = {...this.state.formData}
		if(this.props.initialData){
			form = {
				attributes :{
					lastName: this.props.initialData.lastName,
					firstName: this.props.initialData.firstName,
					accountEmail: this.props.initialData.accountEmail,
				}
			}
		}

		return <>
			{this.state.loading !== true &&  <AttributeListGroup
				attributesListConfig={this.registerAttributesList()}
				additionalWizardLeftActions={this.props.additionalWizardLeftActions}
				data={form}
				standardFooterActions="true"
				formMode='create_object'/>
			}
		</>
	}
}

export default AddPerson;


const emptyString = (str) => {
	return !str || str.trim().length === 0
}
