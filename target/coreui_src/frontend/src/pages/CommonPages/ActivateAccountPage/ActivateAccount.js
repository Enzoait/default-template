import React from 'react';
import { Button, 
	Card, CardBody, CardFooter, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row
} 
from 'reactstrap';
import { accountService } from '_services/account.services.js';
import logo from '../../../assets/img/brand/logo.svg'
import {coreUri} from "_helpers/CoreUri";

/**
 * Login page will redirect the user in this page
 * if the user account is not activated.
 */
class ActivateAccount extends React.Component {

	 constructor(props) {
	    super(props);
	    this.state = {
		  modal: false,
		  accountId: props.accountId,
		  formData: {
			  password: '',
			  passwordValidation: '',
		  },
		  formError: ''
	    };

		this.doActivateAccount = this.doActivateAccount.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this)
		this.updateSuccess = this.updateSuccess.bind(this)
		this.updateFail = this.updateFail.bind(this)
	 }
	 
	 handleFormChange(event) {
			let formadata = JSON.parse(JSON.stringify(this.state.formData))
			formadata[event.target.name] = event.target.value
			let emptypass = this.state.formData.password === '' 
				|| this.state.formData.passwordValidation === '' 
				|| this.state.formData.password.trim() === ''
				|| this.state.formData.passwordValidation.trim() === ''
					
			let samePass = this.state.formData.password !== '' && (
					this.state.formData.password === this.state.formData.passwordValidation)
					
			let formError = ''
			if(emptypass) {
				formError = 'Passwords can not be empty!'
			}
			if(!samePass) {
				formError = 'Passwords are not same!'
			}
			else {
				formError = ''
			}
			
			this.setState({
				formData: formadata,
				formError: formError
			})
	 }

	 doActivateAccount(e) {
		 let login = this.props.userContext.userAccount.login
		 
		 e.preventDefault()
		 accountService.activateAccount(login, this.state.formData, this.props.containerId).then(response => {
			 if(response.status === 200){
				this.updateSuccess()
			 }
			 else {
			 }
			 
		 })
		 .catch(error => {
			console.error(error)
		 });
	 }

	 updateFail(){
		 this.setState({
			 formError: 'Error occurs'
		 })
	 }

	 updateSuccess(){
		 window.location.href = coreUri.clientSideRenderedURL('/');
	 }

    /**
     * Render the view
     */
    render () {
        return (

			<Card>
				<CardBody>
						<Form>
							<img src={logo} className="img-avatar-xl" alt="logo"/>
						  <h3>Change your password to activate your account</h3>
						  <hr/>
						  <div>{this.state.formError}</div>
						  <InputGroup className="mb-3">
							<InputGroupAddon addonType="prepend">
							  <InputGroupText>
								<i className="icon-lock"></i>
							  </InputGroupText>
							</InputGroupAddon>
							<Input type="password" name="password" placeholder="Your password" autoComplete="new-password" onChange={(e) => this.handleFormChange(e)}/>
						  </InputGroup>
						  <InputGroup className="mb-4">
							<InputGroupAddon addonType="prepend">
							  <InputGroupText>
								<i className="icon-lock"></i>
							  </InputGroupText>
							</InputGroupAddon>
							<Input type="password" name="passwordValidation" placeholder="Repeat password" autoComplete="new-password" onChange={(e) => this.handleFormChange(e)}/>
						  </InputGroup>
						</Form>
				</CardBody>

				<CardFooter>
					<Button onClick={(e) => this.doActivateAccount(e)} disabled={this.state.formError === ''}>Update password</Button>{' '}
				</CardFooter>
			</Card>
        );
    }
}

export default ActivateAccount;
