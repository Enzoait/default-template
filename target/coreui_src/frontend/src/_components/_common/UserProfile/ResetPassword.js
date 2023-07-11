import React from 'react';
import PropTypes from 'prop-types';
import { accountService } from '_services/account.services';
import { toast } from 'react-toastify';
import { WizardConfirm, ProcessingModal } from '_components/_common';
import Form from 'react-bootstrap/Form'

const propTypes = {
	accountId: PropTypes.string.isRequired,
}

const defaultProps = {
}

/**
 * Reset password modal
 */
class ResetPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
	  modal: false,
	  accountId: props.accountId,
	  form:{
	  	notify: true,
	  	password:''
	  }
    };

	this.toggle = this.toggle.bind(this);
	this.doResetPassword = this.doResetPassword.bind(this);
	this.dialogContent = this.dialogContent.bind(this);
	this.handleChange = this.handleChange.bind(this);
  }
  /**
   * Toogle the modal
   */
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  /**
   * Do reset password
   */
  doResetPassword(){
  	this.toggle();

	accountService
	.resetPassword(this.state.accountId, this.props.containerId)
	.then(response => {
		this.resetSuccess()
	})
	.catch(error => {
		this.toggle();
		toast.error('Error when reseting user password!')
		console.error(error)
	});
  }

  handleChange(e){
  	let form = {...this.state.form}
  	if(e.target.name === 'password'){
  		form.password = e.target.value
  	}

  	if(e.target.name === 'notify'){
  		form.notify = e.target.checked
  	}

  	this.setState({form: form})
  }

  dialogContent(){
  	return <>
  	</>
  }

  dialogContent2(){
  	return <>
		<Form>
		  <Form.Group controlId="formBasicEmail">
		    <Form.Control
		    	name="password"
		    	type="text"
		    	value={this.state.password}
		    	onChange={this.handleChange}
		    	placeholder="Nouveau mot de passe" />
		  </Form.Group>

		  <Form.Group controlId="formBasicCheckbox">
		    <Form.Check
		    	name="notify"
		    	type="checkbox"
		    	checked="true"
		    	value={this.state.notify}
		    	onChange={this.handleChange}
		    	label="Notifier utilisateur" />
		  </Form.Group>
		</Form>
  	</>
  }

  resetSuccess(){
	  try {
		  this.toggle();
		  toast.success('Password reset success');

		  if(this.props.afterUpdate){
		  	this.props.afterUpdate(true);
		  }
	  }
	  catch(error) {
		  console.error(error);
	  }
  }
  /**
   * React render
   */
  render() {
    return (<>
    	<ProcessingModal show={this.state.modal}/>
    	<WizardConfirm
    		buttonTitle={"Réinitialiser mot de passe".toUpperCase()}
			onConfirm={() => this.doResetPassword()}
			dialogContent={() => this.dialogContent()}
			dialogMessage="Réinitialiser mot de passe?"
			dialogTitle={"Réinitialiser mot de passe".toUpperCase()}/>
		<div className="mr-3"></div>
    </>);
  }
}

ResetPassword.propTypes = propTypes;
ResetPassword.defaultProps = defaultProps;

export default ResetPassword;
